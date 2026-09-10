import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ScheduledPostsService {
  constructor(private prisma: PrismaService) {}

  create(data: { generatedPostId: string; socialAccountId: string; scheduledAt: Date }) {
    return this.prisma.scheduledPost.create({ data });
  }

  getCalendar(userId: string, from: Date, to: Date) {
    return this.prisma.scheduledPost.findMany({
      where: { scheduledAt: { gte: from, lte: to }, socialAccount: { userId } },
      include: { generatedPost: true, socialAccount: { select: { platform: true, username: true } } },
      orderBy: { scheduledAt: 'asc' },
    });
  }
}
