import {
  Controller, Get, Post, Patch, Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SponsorshipsService } from './sponsorships.service';
import { CreateSponsorshipDto } from './dto/create-sponsorship.dto';
import { UpdateSponsorshipStatusDto } from './dto/update-sponsorship-status.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Sponsorships')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('sponsorships')
export class SponsorshipsController {
  constructor(private sponsorshipsService: SponsorshipsService) {}

  @Get()
  @ApiOperation({ summary: 'List all deals (optionally filtered by status)' })
  @ApiQuery({ name: 'status', required: false })
  findAll(@CurrentUser() user: any, @Query('status') status?: string) {
    return this.sponsorshipsService.findAll(user.id, status as any);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single deal with all related data' })
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.sponsorshipsService.findOne(user.id, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new deal at LEAD status' })
  create(@CurrentUser() user: any, @Body() dto: CreateSponsorshipDto) {
    return this.sponsorshipsService.create(user.id, dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Advance deal through state machine (server-enforced transitions)' })
  updateStatus(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateSponsorshipStatusDto,
  ) {
    return this.sponsorshipsService.updateStatus(user.id, id, dto);
  }

  @Get(':id/verification')
  @ApiOperation({ summary: 'Get deal verification report (CONFIRMED / INCOMPLETE / NOT_CONFIRMED)' })
  getVerification(@CurrentUser() user: any, @Param('id') id: string) {
    return this.sponsorshipsService.getVerificationReport(user.id, id);
  }

  @Patch(':id/checks/:checkName')
  @ApiOperation({ summary: 'Mark a verification check as passed or failed' })
  updateCheck(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Param('checkName') checkName: string,
    @Body() body: { isPassed: boolean; notes?: string },
  ) {
    return this.sponsorshipsService.updateVerificationCheck(
      user.id, id, checkName, body.isPassed, body.notes,
    );
  }
}
