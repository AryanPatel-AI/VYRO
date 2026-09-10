import { Module } from '@nestjs/common';
import { GeneratedPostsController } from './generated-posts.controller';
import { GeneratedPostsService } from './generated-posts.service';

@Module({ controllers: [GeneratedPostsController], providers: [GeneratedPostsService] })
export class GeneratedPostsModule {}
