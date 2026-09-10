import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  getForAccount(accountId: string, days = 30) {
    const from = new Date();
    from.setDate(from.getDate() - days);
    return this.prisma.accountAnalytics.findMany({
      where: { socialAccountId: accountId, date: { gte: from } },
      orderBy: { date: 'asc' },
    });
  }
}
