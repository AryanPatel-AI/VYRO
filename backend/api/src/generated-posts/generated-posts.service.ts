import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GeneratedPostsService {
  constructor(private prisma: PrismaService) {}

  approve(id: string) { return this.prisma.generatedPost.update({ where: { id }, data: { status: 'APPROVED' } }); }
  reject(id: string) { return this.prisma.generatedPost.update({ where: { id }, data: { status: 'REJECTED' } }); }
}
