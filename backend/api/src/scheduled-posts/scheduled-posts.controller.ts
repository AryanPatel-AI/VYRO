import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ScheduledPostsService } from './scheduled-posts.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Scheduled Posts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('scheduled-posts')
export class ScheduledPostsController {
  constructor(private svc: ScheduledPostsService) {}

  @Post() create(@Body() body: any) { return this.svc.create(body); }
  @Get('calendar')
  calendar(@CurrentUser() user: any, @Query('from') from: string, @Query('to') to: string) {
    return this.svc.getCalendar(user.id, new Date(from), new Date(to));
  }
}
