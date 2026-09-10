import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, avatarUrl: true, niche: true, bio: true, location: true, currency: true, anthropicApiKey: true, geminiApiKey: true, defaultAiProvider: true, createdAt: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, data: { name?: string; niche?: string; bio?: string; location?: string; currency?: string; anthropicApiKey?: string; geminiApiKey?: string; defaultAiProvider?: string }) {
    return this.prisma.user.update({ where: { id }, data, select: { id: true, name: true, email: true, niche: true, bio: true, location: true, currency: true, anthropicApiKey: true, geminiApiKey: true, defaultAiProvider: true } });
  }
}
