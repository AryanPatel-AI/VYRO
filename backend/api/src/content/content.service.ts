import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  create(userId: string, data: { rawInput: string; contentType: any; mediaUrls?: string[] }) {
    return this.prisma.content.create({ data: { userId, ...data, mediaUrls: data.mediaUrls ?? [] } });
  }

  findAll(userId: string) {
    return this.prisma.content.findMany({ where: { userId }, include: { _count: { select: { generatedPosts: true } } }, orderBy: { createdAt: 'desc' } });
  }

  findOne(userId: string, id: string) {
    return this.prisma.content.findFirst({ where: { id, userId }, include: { generatedPosts: true, keywordAnalyses: true } });
  }
}
