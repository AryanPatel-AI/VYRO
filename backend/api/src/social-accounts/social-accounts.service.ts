import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SocialAccountsService {
  constructor(private prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.socialAccount.findMany({ where: { userId, isActive: true }, orderBy: { createdAt: 'asc' } });
  }

  disconnect(userId: string, id: string) {
    return this.prisma.socialAccount.updateMany({ where: { id, userId }, data: { isActive: false } });
  }
}
