import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PublishingService {
  private readonly logger = new Logger(PublishingService.name);

  constructor(
    private prisma: PrismaService,
    @InjectQueue('publishing') private publishingQueue: Queue,
  ) {}

  // Run every minute to check for posts that need publishing
  @Cron(CronExpression.EVERY_MINUTE)
  async handleScheduledPosts() {
    this.logger.log('Checking for scheduled posts...');

    const now = new Date();

    const postsToPublish = await this.prisma.scheduledPost.findMany({
      where: {
        status: 'SCHEDULED',
        scheduledAt: {
          lte: now,
        },
      },
      include: {
        generatedPost: true,
        socialAccount: true,
      },
    });

    if (postsToPublish.length === 0) {
      return;
    }

    this.logger.log(`Found ${postsToPublish.length} posts to publish.`);

    for (const post of postsToPublish) {
      // 1. Mark as PUBLISHING to prevent duplicate processing
      await this.prisma.scheduledPost.update({
        where: { id: post.id },
        data: { status: 'PUBLISHING' },
      });

      // 2. Add to BullMQ queue
      await this.publishingQueue.add(
        'publish-post',
        {
          scheduledPostId: post.id,
          platform: post.socialAccount.platform,
          content: post.generatedPost,
          account: post.socialAccount,
        },
        {
          jobId: `publish-${post.id}`, // Idempotency key
          removeOnComplete: true,
        },
      );

      this.logger.log(`Added post ${post.id} to publishing queue.`);
    }
  }
}
