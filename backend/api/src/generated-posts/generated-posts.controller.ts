import { Controller, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { GeneratedPostsService } from './generated-posts.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Generated Posts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('generated-posts')
export class GeneratedPostsController {
  constructor(private svc: GeneratedPostsService) {}

  @Patch(':id/approve') approve(@Param('id') id: string) { return this.svc.approve(id); }
  @Patch(':id/reject') reject(@Param('id') id: string) { return this.svc.reject(id); }
}
