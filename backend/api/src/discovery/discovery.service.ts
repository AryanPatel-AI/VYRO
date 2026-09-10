import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class DiscoveryService {
  constructor(private prisma: PrismaService, private aiService: AiService) {}

  async getMatchedBrands(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { socialAccounts: { where: { isActive: true } } },
    });

    const brands = await this.prisma.brand.findMany({ where: { userId } });
    
    const results = await Promise.allSettled(
      brands.map(async (brand) => {
        const score = await this.aiService.scoreBrandMatch(
          userId,
          { niche: user?.niche ?? 'General', location: user?.location ?? 'Global', platforms: user?.socialAccounts.map((a) => a.platform) ?? [] },
          { name: brand.name, industry: brand.industry ?? 'Unknown', website: brand.website ?? '' },
        );
        return { brand, ...score };
      }),
    );

    return results
      .filter((r) => r.status === 'fulfilled')
      .map((r) => (r as PromiseFulfilledResult<any>).value)
      .sort((a, b) => b.overall - a.overall);
  }
}
