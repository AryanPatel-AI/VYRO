import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import {
  INSTAGRAM_CONTENT_PROMPT,
  YOUTUBE_CONTENT_PROMPT,
  TIKTOK_CONTENT_PROMPT,
  LINKEDIN_CONTENT_PROMPT,
  FACEBOOK_CONTENT_PROMPT,
  X_TWITTER_CONTENT_PROMPT,
  PINTEREST_CONTENT_PROMPT,
  THREADS_CONTENT_PROMPT,
  SEO_ANALYSIS_PROMPT,
  REQUIREMENT_EXTRACTOR_PROMPT,
  SPONSOR_MATCH_PROMPT,
  CreatorContext,
} from '@vyro/ai-engine';
import {
  PlatformMetaSchema,
  SEOAnalysisSchema,
  ExtractedRequirementsSchema,
  BrandMatchSchema,
  parseLLMJson,
  detectMissingRequirements,
} from '@vyro/ai-engine';
import type { Platform } from '@vyro/shared-types';

@Injectable()
export class AiService {
  private readonly fallbackGeminiKey: string;

  constructor(private config: ConfigService, private prisma: PrismaService) {
    this.fallbackGeminiKey = config.get<string>('GEMINI_API_KEY', '');
  }

  // ─── Core LLM caller ──────────────────────────────────────────────────────

  private async callLLM(prompt: string, userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { defaultAiProvider: true, anthropicApiKey: true, geminiApiKey: true },
    });

    if (!user) throw new BadRequestException('User not found');

    const provider = user.defaultAiProvider || 'GEMINI';

    if (provider === 'CLAUDE') {
      const apiKey = user.anthropicApiKey;
      if (!apiKey) throw new BadRequestException('Claude API key not configured for this user.');

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20240620',
          max_tokens: 4096,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!res.ok) throw new InternalServerErrorException(`Claude API error: ${res.status}`);
      const data = (await res.json()) as any;
      return data.content[0].text;
    }

    if (provider === 'GEMINI') {
      const apiKey = user.geminiApiKey || this.fallbackGeminiKey;
      if (!apiKey) throw new BadRequestException('Gemini API key not configured.');

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.4, topK: 40, topP: 0.95, maxOutputTokens: 4096 },
        }),
      });

      if (!res.ok) throw new InternalServerErrorException(`Gemini API error: ${res.status}`);
      const data = (await res.json()) as any;
      return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    }

    throw new InternalServerErrorException(`Unsupported AI provider: ${provider}`);
  }

  // ─── Platform-specific prompt selector ────────────────────────────────────

  private getPlatformPrompt(platform: Platform, ctx: CreatorContext): (input: string) => string {
    const map: Record<Platform, (ctx: CreatorContext) => string> = {
      INSTAGRAM: INSTAGRAM_CONTENT_PROMPT,
      YOUTUBE: YOUTUBE_CONTENT_PROMPT,
      TIKTOK: TIKTOK_CONTENT_PROMPT,
      LINKEDIN: LINKEDIN_CONTENT_PROMPT,
      FACEBOOK: FACEBOOK_CONTENT_PROMPT,
      X_TWITTER: X_TWITTER_CONTENT_PROMPT,
      PINTEREST: PINTEREST_CONTENT_PROMPT,
      THREADS: THREADS_CONTENT_PROMPT,
    };

    const basePrompt = map[platform](ctx);
    return (input: string) => basePrompt.replace('{input}', input);
  }

  // ─── Generate platform-specific content ───────────────────────────────────

  async generateContent(userId: string, input: string, platforms: Platform[], ctx: CreatorContext) {
    const results = await Promise.allSettled(
      platforms.map(async (platform) => {
        const prompt = this.getPlatformPrompt(platform, ctx)(input);
        const raw = await this.callLLM(prompt, userId);
        const parsed = parseLLMJson(raw, PlatformMetaSchema);

        if (!parsed.success) {
          return {
            platform,
            success: false,
            error: `Content generation failed for ${platform}: ${parsed.error}`,
          };
        }

        return { platform, success: true, data: parsed.data };
      }),
    );

    return results.map((r) => (r.status === 'fulfilled' ? r.value : { success: false, error: String(r.reason) }));
  }

  // ─── SEO Analysis ─────────────────────────────────────────────────────────

  async analyzeSEO(userId: string, input: string, platform: Platform, ctx: CreatorContext) {
    const prompt = SEO_ANALYSIS_PROMPT(platform, ctx).replace('{input}', input);
    const raw = await this.callLLM(prompt, userId);
    const parsed = parseLLMJson(raw, SEOAnalysisSchema);

    if (!parsed.success) {
      throw new BadRequestException(`SEO analysis failed: ${parsed.error}`);
    }

    return parsed.data;
  }

  // ─── Requirement Extraction ────────────────────────────────────────────────

  async extractRequirements(userId: string, message: string) {
    const prompt = REQUIREMENT_EXTRACTOR_PROMPT.replace('{message}', message);
    const raw = await this.callLLM(prompt, userId);
    const parsed = parseLLMJson(raw, ExtractedRequirementsSchema);

    if (!parsed.success) {
      throw new BadRequestException(`Requirement extraction failed: ${parsed.error}`);
    }

    // Business rules: identify missing required fields
    const missingFields = detectMissingRequirements(parsed.data);

    return {
      extracted: parsed.data,
      missingFields,
      isComplete: missingFields.length === 0,
    };
  }

  // ─── Brand Match Scoring ───────────────────────────────────────────────────

  async scoreBrandMatch(userId: string, creatorProfile: object, brandProfile: object) {
    const prompt = SPONSOR_MATCH_PROMPT
      .replace('{creatorProfile}', JSON.stringify(creatorProfile, null, 2))
      .replace('{brandProfile}', JSON.stringify(brandProfile, null, 2));

    const raw = await this.callLLM(prompt, userId);
    const parsed = parseLLMJson(raw, BrandMatchSchema);

    if (!parsed.success) {
      throw new BadRequestException(`Brand match scoring failed: ${parsed.error}`);
    }

    return parsed.data;
  }
}
