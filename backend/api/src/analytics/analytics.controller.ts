import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private svc: AnalyticsService) {}

  @Get(':accountId')
  get(@Param('accountId') accountId: string, @Query('days') days: string) {
    return this.svc.getForAccount(accountId, days ? parseInt(days) : 30);
  }
}
