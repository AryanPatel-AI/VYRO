import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  findAll(userId: string) { return this.prisma.brand.findMany({ where: { userId }, include: { _count: { select: { sponsorships: true } } }, orderBy: { name: 'asc' } }); }
  create(userId: string, data: any) { return this.prisma.brand.create({ data: { userId, ...data } }); }
  update(userId: string, id: string, data: any) { return this.prisma.brand.updateMany({ where: { id, userId }, data }); }
}
