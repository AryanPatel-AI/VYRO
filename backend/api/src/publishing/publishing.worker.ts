import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { TwitterAdapter } from './adapters/twitter.adapter';

@Processor('publishing')
export class PublishingWorker extends WorkerHost {
  private readonly logger = new Logger(PublishingWorker.name);

  constructor(
    private prisma: PrismaService,
    private twitterAdapter: TwitterAdapter,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { scheduledPostId, platform, content, account } = job.data;
    this.logger.log(`Processing publish job for post ${scheduledPostId} on platform ${platform}`);

    try {
      let platformPostId = null;

      // Dispatch to specific platform adapter
      switch (platform) {
        case 'X_TWITTER':
          platformPostId = await this.twitterAdapter.publish(account, content);
          break;
        default:
          this.logger.warn(`Platform adapter for ${platform} is not implemented yet. Simulating success.`);
          // Simulate some API delay
          await new Promise((resolve) => setTimeout(resolve, 1000));
          platformPostId = `simulated-${platform}-${Date.now()}`;
          break;
      }

      // Mark as PUBLISHED
      await this.prisma.scheduledPost.update({
        where: { id: scheduledPostId },
        data: {
          status: 'PUBLISHED',
          publishedAt: new Date(),
          platformPostId,
        },
      });

      this.logger.log(`Successfully published post ${scheduledPostId}`);
      return { success: true, platformPostId };
    } catch (error: any) {
      this.logger.error(`Failed to publish post ${scheduledPostId}: ${error.message}`);
      
      // Update status to FAILED
      await this.prisma.scheduledPost.update({
        where: { id: scheduledPostId },
        data: {
          status: 'FAILED',
          failureReason: error.message || 'Unknown error during publishing',
          retryCount: { increment: 1 }, // Simplistic retry count tracking
        },
      });

      throw error;
    }
  }
}
