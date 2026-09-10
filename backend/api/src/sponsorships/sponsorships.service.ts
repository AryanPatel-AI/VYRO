import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DealStatus, DEAL_STATUS_TRANSITIONS, DEAL_STATUS_LABELS } from '@vyro/shared-types';
import type { DealVerificationReport } from '@vyro/shared-types';
import { CreateSponsorshipDto } from './dto/create-sponsorship.dto';
import { UpdateSponsorshipStatusDto } from './dto/update-sponsorship-status.dto';

// Verification checks required before DEAL_CONFIRMED is valid
const VERIFICATION_CHECKS = [
  { checkName: 'brand_agreement', label: 'Brand Agreement Received' },
  { checkName: 'creator_approval', label: 'Creator Has Approved Terms' },
  { checkName: 'deliverables_defined', label: 'All Deliverables Defined' },
  { checkName: 'payment_terms_defined', label: 'Payment Terms Confirmed' },
  { checkName: 'contract_received', label: 'Contract Received' },
  { checkName: 'contract_signed', label: 'Contract Signed' },
  { checkName: 'campaign_dates_set', label: 'Campaign Dates Set' },
];

@Injectable()
export class SponsorshipsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, status?: DealStatus) {
    return this.prisma.sponsorship.findMany({
      where: { userId, ...(status ? { status } : {}) },
      include: {
        brand: { select: { id: true, name: true, industry: true, logoUrl: true } },
        deliverables: true,
        _count: { select: { communications: true, requirements: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const sponsorship = await this.prisma.sponsorship.findFirst({
      where: { id, userId },
      include: {
        brand: true,
        deliverables: true,
        requirements: true,
        verificationChecks: true,
        contract: true,
        statusHistory: { orderBy: { changedAt: 'desc' }, take: 10 },
      },
    });

    if (!sponsorship) {
      throw new NotFoundException('Sponsorship not found');
    }

    return sponsorship;
  }

  async create(userId: string, dto: CreateSponsorshipDto) {
    // Verify brand belongs to this user
    const brand = await this.prisma.brand.findFirst({ where: { id: dto.brandId, userId } });
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    const sponsorship = await this.prisma.sponsorship.create({
      data: {
        userId,
        brandId: dto.brandId,
        campaignName: dto.campaignName,
        platforms: dto.platforms as any,
        budget: dto.budget,
        currency: dto.currency ?? 'INR',
        deadline: dto.deadline ? new Date(dto.deadline) : undefined,
        productName: dto.productName,
        notes: dto.notes,
        status: 'LEAD',
      },
      include: { brand: true },
    });

    // Seed default verification checks
    await this.prisma.verificationCheck.createMany({
      data: VERIFICATION_CHECKS.map((check) => ({
        sponsorshipId: sponsorship.id,
        ...check,
      })),
    });

    // Seed required deal requirement fields
    const requiredFields = [
      { field: 'payment_amount', label: 'Payment Amount' },
      { field: 'usage_rights', label: 'Usage Rights' },
      { field: 'exclusivity', label: 'Exclusivity Terms' },
      { field: 'approval_process', label: 'Content Approval Process' },
      { field: 'posting_window', label: 'Posting Window / Deadline' },
      { field: 'payment_schedule', label: 'Payment Schedule' },
      { field: 'talking_points', label: 'Required Talking Points' },
    ];

    await this.prisma.dealRequirement.createMany({
      data: requiredFields.map((f) => ({
        sponsorshipId: sponsorship.id,
        ...f,
        isRequired: true,
      })),
    });

    // Log initial status history
    await this.prisma.dealStatusHistory.create({
      data: { sponsorshipId: sponsorship.id, toStatus: 'LEAD' },
    });

    return sponsorship;
  }

  async updateStatus(userId: string, id: string, dto: UpdateSponsorshipStatusDto) {
    const sponsorship = await this.prisma.sponsorship.findFirst({ where: { id, userId } });
    if (!sponsorship) throw new NotFoundException('Sponsorship not found');

    const currentStatus = sponsorship.status as DealStatus;
    const newStatus = dto.status as DealStatus;

    // ── State machine enforcement ──────────────────────────────────────────
    const validNext = DEAL_STATUS_TRANSITIONS[currentStatus];
    if (!validNext.includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition from ${DEAL_STATUS_LABELS[currentStatus]} to ${DEAL_STATUS_LABELS[newStatus]}. ` +
          `Valid next states: ${validNext.map((s) => DEAL_STATUS_LABELS[s]).join(', ')}`,
      );
    }

    // ── Guard: DEAL_CONFIRMED requires all checks passed ───────────────────
    if (newStatus === 'DEAL_CONFIRMED') {
      const checks = await this.prisma.verificationCheck.findMany({
        where: { sponsorshipId: id },
      });
      const failedChecks = checks.filter((c) => !c.isPassed);
      if (failedChecks.length > 0) {
        throw new BadRequestException(
          `Deal cannot be confirmed. The following checks are not yet passed: ` +
            failedChecks.map((c) => c.label).join(', '),
        );
      }
    }

    const [updated] = await this.prisma.$transaction([
      this.prisma.sponsorship.update({
        where: { id },
        data: { status: newStatus as any },
        include: { brand: true },
      }),
      this.prisma.dealStatusHistory.create({
        data: {
          sponsorshipId: id,
          fromStatus: currentStatus as any,
          toStatus: newStatus as any,
          note: dto.note,
        },
      }),
    ]);

    return updated;
  }

  async getVerificationReport(userId: string, id: string): Promise<DealVerificationReport> {
    const sponsorship = await this.prisma.sponsorship.findFirst({
      where: { id, userId },
      include: {
        verificationChecks: true,
        requirements: true,
        contract: true,
        deliverables: true,
      },
    });

    if (!sponsorship) throw new NotFoundException('Sponsorship not found');

    const checks = sponsorship.verificationChecks.map((c) => ({
      checkName: c.checkName,
      label: c.label,
      isPassed: c.isPassed,
      notes: c.notes ?? undefined,
    }));

    const missingItems: string[] = [];

    // Missing requirements
    const missingReqs = sponsorship.requirements.filter((r) => r.isRequired && !r.value);
    missingReqs.forEach((r) => missingItems.push(r.label));

    // Failed verification checks
    checks.filter((c) => !c.isPassed).forEach((c) => missingItems.push(c.label));

    const isConfirmed = checks.every((c) => c.isPassed) && missingItems.length === 0;
    const status = isConfirmed
      ? 'CONFIRMED'
      : missingReqs.length > 0
        ? 'INCOMPLETE'
        : 'NOT_CONFIRMED';

    return {
      sponsorshipId: id,
      isConfirmed,
      status,
      checks,
      missingItems,
    };
  }

  async updateVerificationCheck(
    userId: string,
    sponsorshipId: string,
    checkName: string,
    isPassed: boolean,
    notes?: string,
  ) {
    const sponsorship = await this.prisma.sponsorship.findFirst({
      where: { id: sponsorshipId, userId },
    });
    if (!sponsorship) throw new NotFoundException('Sponsorship not found');

    return this.prisma.verificationCheck.updateMany({
      where: { sponsorshipId, checkName },
      data: {
        isPassed,
        passedAt: isPassed ? new Date() : null,
        notes,
      },
    });
  }
}
