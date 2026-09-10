import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class CommunicationsService {
  constructor(private prisma: PrismaService, private aiService: AiService) {}

  findAll(sponsorshipId: string) {
    return this.prisma.communication.findMany({ where: { sponsorshipId }, orderBy: { timestamp: 'asc' } });
  }

  async create(sponsorshipId: string, data: { direction: any; channel: string; subject?: string; body: string }) {
    let extractedData = null;
    let missingFields: any[] = [];

    if (data.direction === 'INBOUND') {
      const sponsorship = await this.prisma.sponsorship.findUnique({ where: { id: sponsorshipId }, select: { userId: true } });
      const result = await this.aiService.extractRequirements(sponsorship?.userId || 'system', data.body);
      extractedData = result.extracted;
      missingFields = result.missingFields;

      // Upsert extracted requirements into the deal
      if (extractedData) {
        const reqMap: Record<string, any> = {
          payment_amount: extractedData.payment_amount,
          usage_rights: extractedData.usage_rights,
          exclusivity: extractedData.exclusivity,
          approval_process: extractedData.approval_process,
          payment_schedule: extractedData.payment_schedule,
        };

        for (const [field, value] of Object.entries(reqMap)) {
          if (value !== null && value !== undefined) {
            await this.prisma.dealRequirement.updateMany({
              where: { sponsorshipId, field },
              data: { value: String(value), source: 'ai_extraction', isVerified: false },
            });
          }
        }
      }
    }

    const comm = await this.prisma.communication.create({
      data: { sponsorshipId, ...data, extractedData: extractedData ? (extractedData as any) : undefined, isProcessed: true },
    });

    return { communication: comm, extractedData, missingFields };
  }
}
