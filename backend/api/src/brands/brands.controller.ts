import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BrandsService } from './brands.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Brands')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('brands')
export class BrandsController {
  constructor(private svc: BrandsService) {}

  @Get() findAll(@CurrentUser() user: any) { return this.svc.findAll(user.id); }
  @Post() create(@CurrentUser() user: any, @Body() body: any) { return this.svc.create(user.id, body); }
  @Patch(':id') update(@CurrentUser() user: any, @Param('id') id: string, @Body() body: any) { return this.svc.update(user.id, id, body); }
}
