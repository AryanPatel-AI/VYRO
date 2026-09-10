import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Content')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('content')
export class ContentController {
  constructor(private svc: ContentService) {}

  @Get() findAll(@CurrentUser() user: any) { return this.svc.findAll(user.id); }
  @Get(':id') findOne(@CurrentUser() user: any, @Param('id') id: string) { return this.svc.findOne(user.id, id); }
  @Post() create(@CurrentUser() user: any, @Body() body: any) { return this.svc.create(user.id, body); }
}
