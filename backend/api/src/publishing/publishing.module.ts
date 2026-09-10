import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from '../prisma/prisma.module';
import { PublishingService } from './publishing.service';
import { PublishingWorker } from './publishing.worker';
import { TwitterAdapter } from './adapters/twitter.adapter';

@Module({
  imports: [
    PrismaModule,
    ScheduleModule.forRoot(),
    BullModule.registerQueue({
      name: 'publishing',
    }),
  ],
  providers: [PublishingService, PublishingWorker, TwitterAdapter],
})
export class PublishingModule {}
