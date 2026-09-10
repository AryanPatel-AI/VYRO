import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('AI')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('generate')
  generate(@CurrentUser() user: any, @Body() body: { input: string; platforms: any[]; ctx: any }) {
    return this.aiService.generateContent(user.id, body.input, body.platforms, body.ctx);
  }

  @Post('analyze-seo')
  analyzeSEO(@CurrentUser() user: any, @Body() body: { input: string; platform: any; ctx: any }) {
    return this.aiService.analyzeSEO(user.id, body.input, body.platform, body.ctx);
  }

  @Post('extract-requirements')
  extractRequirements(@CurrentUser() user: any, @Body() body: { message: string }) {
    return this.aiService.extractRequirements(user.id, body.message);
  }
}
