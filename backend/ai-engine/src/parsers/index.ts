import { z } from 'zod';
import type {
  ExtractedRequirements,
  OpportunityScore,
  PlatformMeta,
  BrandMatchScore,
} from '@vyro/shared-types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const score = () => z.number().int().min(0).max(100);
const nullableString = () => z.string().nullable();

// ─── Platform Content Parsers ─────────────────────────────────────────────────

export const InstagramMetaSchema = z.object({
  platform: z.literal('INSTAGRAM'),
  caption: z.string().min(10).max(2200),
  hook: z.string().min(5),
  cta: z.string().min(5),
  hashtags: z.array(z.string()).min(5).max(30),
  keywords: z.array(z.string()).min(1),
  suggestedTime: z.string().datetime().optional(),
  carouselCount: z.number().int().nullable().optional(),
});

export const YouTubeMetaSchema = z.object({
  platform: z.literal('YOUTUBE'),
  title: z.string().min(10).max(100),
  description: z.string().min(100).max(5000),
  tags: z.array(z.string()).min(5).max(15),
  chapters: z.array(z.object({ time: z.string(), title: z.string() })).min(2),
  hook: z.string().min(10),
  cta: z.string().min(5),
  thumbnailConcept: z.string().min(10),
  keywords: z.array(z.string()).min(5),
});

export const TikTokMetaSchema = z.object({
  platform: z.literal('TIKTOK'),
  caption: z.string().min(1).max(150),
  hook: z.string().min(5),
  cta: z.string().min(5),
  hashtags: z.array(z.string()).min(3).max(10),
  searchKeywords: z.array(z.string()).min(3),
  suggestedSounds: z.array(z.string()).optional(),
});

export const LinkedInMetaSchema = z.object({
  platform: z.literal('LINKEDIN'),
  post: z.string().min(100).max(3000),
  hook: z.string().min(10),
  cta: z.string().min(5),
  industryHashtags: z.array(z.string()).min(2).max(5),
  keywords: z.array(z.string()).min(3),
});

export const FacebookMetaSchema = z.object({
  platform: z.literal('FACEBOOK'),
  post: z.string().min(20).max(63206),
  cta: z.string().min(5),
  hashtags: z.array(z.string()).max(5),
  keywords: z.array(z.string()).min(3),
});

export const XTwitterMetaSchema = z.object({
  platform: z.literal('X_TWITTER'),
  tweet: z.string().min(1).max(280),
  thread: z.array(z.string()).nullable().optional(),
  hashtags: z.array(z.string()).max(2),
  keywords: z.array(z.string()).min(2),
});

export const PinterestMetaSchema = z.object({
  platform: z.literal('PINTEREST'),
  title: z.string().min(5).max(100),
  description: z.string().min(50).max(500),
  hashtags: z.array(z.string()).max(10),
  keywords: z.array(z.string()).min(5),
  boardSuggestion: z.string().optional(),
});

export const ThreadsMetaSchema = z.object({
  platform: z.literal('THREADS'),
  post: z.string().min(1).max(500),
  hashtags: z.array(z.string()).max(5),
  keywords: z.array(z.string()).min(2),
});

export const PlatformMetaSchema = z.discriminatedUnion('platform', [
  InstagramMetaSchema,
  YouTubeMetaSchema,
  TikTokMetaSchema,
  LinkedInMetaSchema,
  FacebookMetaSchema,
  XTwitterMetaSchema,
  PinterestMetaSchema,
  ThreadsMetaSchema,
]);

// ─── SEO / Opportunity Score Parser ───────────────────────────────────────────

export const SEOAnalysisSchema = z.object({
  primaryKeywords: z.array(z.string()).min(1).max(3),
  secondaryKeywords: z.array(z.string()).min(2).max(6),
  hashtagsHighRelevance: z.array(z.string()).min(1).max(5),
  hashtagsMediumCompetition: z.array(z.string()).min(1).max(6),
  hashtagsNiche: z.array(z.string()).min(1).max(5),
  trendingTopics: z.array(z.string()).max(5),
  audienceInterests: z.array(z.string()).min(1).max(8),
  scores: z.object({
    searchRelevance: score(),
    trendScore: score(),
    competition: score(),
    audienceMatch: score(),
    contentFit: score(),
    overall: score(),
  }),
});

// ─── Requirement Extraction Parser ────────────────────────────────────────────

export const ExtractedRequirementsSchema = z.object({
  campaign: nullableString(),
  platforms: z.array(z.string()),
  deliverables: z.array(
    z.object({
      type: z.string(),
      quantity: z.number().int().min(1),
      notes: nullableString(),
    }),
  ),
  posting_window: z
    .object({
      start: nullableString(),
      end: nullableString(),
    })
    .nullable(),
  payment_amount: z.number().nullable(),
  payment_currency: nullableString(),
  payment_schedule: nullableString(),
  product_requirements: nullableString(),
  usage_rights: nullableString(),
  exclusivity: nullableString(),
  approval_process: nullableString(),
  talking_points: z.array(z.string()).nullable(),
  brand_guidelines: nullableString(),
  product_visibility_seconds: z.number().nullable(),
});

// ─── Sponsor Match Parser ──────────────────────────────────────────────────────

export const BrandMatchSchema = z.object({
  overall: score(),
  breakdown: z.object({
    nicheCompatibility: score(),
    audienceCompatibility: score(),
    geoCompatibility: score(),
    platformCompatibility: score(),
    engagementCompatibility: score(),
    historicalPerformance: score(),
  }),
  reasoning: z.string(),
});

// ─── Parse Helpers ─────────────────────────────────────────────────────────────

/**
 * Safely parse LLM JSON output. Strips any markdown code fences the model
 * might accidentally include despite instructions.
 */
export function parseLLMJson<T>(
  raw: string,
  schema: z.ZodSchema<T>,
): { success: true; data: T } | { success: false; error: string } {
  try {
    // Strip markdown code fences if present
    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```\s*$/i, '')
      .trim();

    const parsed = JSON.parse(cleaned);
    const result = schema.safeParse(parsed);

    if (result.success) {
      return { success: true, data: result.data };
    }

    return {
      success: false,
      error: result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
    };
  } catch (e) {
    return { success: false, error: `JSON parse failed: ${String(e)}` };
  }
}

// ─── Missing Fields Detection ─────────────────────────────────────────────────

export interface MissingField {
  field: keyof ExtractedRequirements;
  label: string;
}

const REQUIRED_FIELDS: Array<{ field: keyof ExtractedRequirements; label: string }> = [
  { field: 'payment_amount', label: 'Payment Amount' },
  { field: 'usage_rights', label: 'Usage Rights' },
  { field: 'exclusivity', label: 'Exclusivity Terms' },
  { field: 'approval_process', label: 'Content Approval Process' },
  { field: 'posting_window', label: 'Posting Window / Deadline' },
];

export function detectMissingRequirements(reqs: ExtractedRequirements): MissingField[] {
  return REQUIRED_FIELDS.filter(({ field }) => {
    const val = reqs[field];
    if (val === null || val === undefined) return true;
    if (typeof val === 'object' && val !== null) {
      // posting_window: both start and end must be non-null
      return Object.values(val).every((v) => v === null);
    }
    return false;
  });
}
