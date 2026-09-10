import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CommunicationsService } from './communications.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Communications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sponsorships/:sponsorshipId/communications')
export class CommunicationsController {
  constructor(private svc: CommunicationsService) {}

  @Get() findAll(@Param('sponsorshipId') sid: string) { return this.svc.findAll(sid); }
  @Post() create(@Param('sponsorshipId') sid: string, @Body() body: any) { return this.svc.create(sid, body); }
}
