import { Controller, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SocialAccountsService } from './social-accounts.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Social Accounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('social-accounts')
export class SocialAccountsController {
  constructor(private svc: SocialAccountsService) {}

  @Get() findAll(@CurrentUser() user: any) { return this.svc.findAll(user.id); }
  @Delete(':id') disconnect(@CurrentUser() user: any, @Param('id') id: string) { return this.svc.disconnect(user.id, id); }
}
