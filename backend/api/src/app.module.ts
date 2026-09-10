import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SocialAccountsModule } from './social-accounts/social-accounts.module';
import { ContentModule } from './content/content.module';
import { GeneratedPostsModule } from './generated-posts/generated-posts.module';
import { ScheduledPostsModule } from './scheduled-posts/scheduled-posts.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AiModule } from './ai/ai.module';
import { BrandsModule } from './brands/brands.module';
import { SponsorshipsModule } from './sponsorships/sponsorships.module';
import { CommunicationsModule } from './communications/communications.module';
import { DiscoveryModule } from './discovery/discovery.module';
import { PrismaModule } from './prisma/prisma.module';
import { BullModule } from '@nestjs/bullmq';
import { PublishingModule } from './publishing/publishing.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    SocialAccountsModule,
    ContentModule,
    GeneratedPostsModule,
    ScheduledPostsModule,
    AnalyticsModule,
    AiModule,
    BrandsModule,
    SponsorshipsModule,
    CommunicationsModule,
    DiscoveryModule,
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    PublishingModule,
  ],
})
export class AppModule {}
