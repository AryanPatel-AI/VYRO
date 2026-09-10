-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('INSTAGRAM', 'YOUTUBE', 'TIKTOK', 'FACEBOOK', 'X_TWITTER', 'LINKEDIN', 'PINTEREST', 'THREADS');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('VIDEO', 'PHOTO', 'CAROUSEL', 'TEXT', 'STORY', 'SHORT');

-- CreateEnum
CREATE TYPE "GeneratedStatus" AS ENUM ('DRAFT', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'NEEDS_APPROVAL', 'PUBLISHING', 'PUBLISHED', 'FAILED');

-- CreateEnum
CREATE TYPE "KeywordType" AS ENUM ('PRIMARY', 'SECONDARY', 'HASHTAG_HIGH', 'HASHTAG_MEDIUM', 'HASHTAG_NICHE', 'TRENDING_TOPIC', 'AUDIENCE_INTEREST', 'COMPETITOR_KEYWORD');

-- CreateEnum
CREATE TYPE "DealStatus" AS ENUM ('LEAD', 'CONTACTED', 'RESPONSE_RECEIVED', 'REQUIREMENTS_RECEIVED', 'REQUIREMENTS_COMPLETE', 'PROPOSAL_SENT', 'AWAITING_RESPONSE', 'CREATOR_APPROVAL', 'CONTRACT_PENDING', 'CONTRACT_SIGNED', 'DEAL_CONFIRMED', 'CAMPAIGN_ACTIVE', 'DELIVERABLES_COMPLETED', 'PAYMENT_PENDING', 'PAYMENT_RECEIVED', 'DEAL_COMPLETED', 'REJECTED', 'CLOSED');

-- CreateEnum
CREATE TYPE "CommunicationDir" AS ENUM ('INBOUND', 'OUTBOUND', 'INTERNAL_NOTE');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('PENDING', 'SENT', 'RECEIVED', 'UNDER_REVIEW', 'SIGNED', 'REJECTED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "passwordHash" TEXT,
    "niche" TEXT,
    "bio" TEXT,
    "location" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "anthropicApiKey" TEXT,
    "geminiApiKey" TEXT,
    "defaultAiProvider" TEXT NOT NULL DEFAULT 'GEMINI',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "accountId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "displayName" TEXT,
    "avatarUrl" TEXT,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "tokenExpiresAt" TIMESTAMP(3),
    "followerCount" INTEGER,
    "followingCount" INTEGER,
    "postCount" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "content" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rawInput" TEXT NOT NULL,
    "contentType" "ContentType" NOT NULL,
    "mediaUrls" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generated_posts" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "caption" TEXT NOT NULL,
    "hook" TEXT,
    "cta" TEXT,
    "hashtags" TEXT[],
    "keywords" TEXT[],
    "suggestedTime" TIMESTAMP(3),
    "opportunityScore" INTEGER,
    "scoreBreakdown" JSONB,
    "platformMeta" JSONB NOT NULL,
    "status" "GeneratedStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "generated_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scheduled_posts" (
    "id" TEXT NOT NULL,
    "generatedPostId" TEXT NOT NULL,
    "socialAccountId" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "status" "PostStatus" NOT NULL DEFAULT 'SCHEDULED',
    "failureReason" TEXT,
    "platformPostId" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scheduled_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_analytics" (
    "id" TEXT NOT NULL,
    "socialAccountId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "followers" INTEGER,
    "impressions" INTEGER,
    "reach" INTEGER,
    "engagementRate" DOUBLE PRECISION,
    "profileViews" INTEGER,
    "likes" INTEGER,
    "comments" INTEGER,
    "shares" INTEGER,
    "saves" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "account_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "keyword_analyses" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "keyword" TEXT NOT NULL,
    "keywordType" "KeywordType" NOT NULL,
    "searchRelevance" INTEGER NOT NULL,
    "trendScore" INTEGER NOT NULL,
    "competition" INTEGER NOT NULL,
    "audienceMatch" INTEGER NOT NULL,
    "overallScore" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "keyword_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brands" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT,
    "industry" TEXT,
    "logoUrl" TEXT,
    "contactEmail" TEXT,
    "contactName" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sponsorships" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "campaignName" TEXT NOT NULL,
    "platforms" "Platform"[],
    "status" "DealStatus" NOT NULL DEFAULT 'LEAD',
    "budget" DECIMAL(12,2),
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "deadline" TIMESTAMP(3),
    "productName" TEXT,
    "productReceived" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "matchScore" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sponsorships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deal_status_history" (
    "id" TEXT NOT NULL,
    "sponsorshipId" TEXT NOT NULL,
    "fromStatus" "DealStatus",
    "toStatus" "DealStatus" NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,

    CONSTRAINT "deal_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deliverables" (
    "id" TEXT NOT NULL,
    "sponsorshipId" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "isComplete" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,

    CONSTRAINT "deliverables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deal_requirements" (
    "id" TEXT NOT NULL,
    "sponsorshipId" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "source" TEXT,
    "extractedFrom" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deal_requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_checks" (
    "id" TEXT NOT NULL,
    "sponsorshipId" TEXT NOT NULL,
    "checkName" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "isPassed" BOOLEAN NOT NULL DEFAULT false,
    "passedAt" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "verification_checks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communications" (
    "id" TEXT NOT NULL,
    "sponsorshipId" TEXT NOT NULL,
    "direction" "CommunicationDir" NOT NULL,
    "channel" TEXT NOT NULL,
    "subject" TEXT,
    "body" TEXT NOT NULL,
    "extractedData" JSONB,
    "isProcessed" BOOLEAN NOT NULL DEFAULT false,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "communications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contracts" (
    "id" TEXT NOT NULL,
    "sponsorshipId" TEXT NOT NULL,
    "fileUrl" TEXT,
    "status" "ContractStatus" NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3),
    "receivedAt" TIMESTAMP(3),
    "signedByCreator" BOOLEAN NOT NULL DEFAULT false,
    "signedByBrand" BOOLEAN NOT NULL DEFAULT false,
    "signedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "social_accounts_userId_platform_accountId_key" ON "social_accounts"("userId", "platform", "accountId");

-- CreateIndex
CREATE UNIQUE INDEX "scheduled_posts_generatedPostId_key" ON "scheduled_posts"("generatedPostId");

-- CreateIndex
CREATE UNIQUE INDEX "account_analytics_socialAccountId_date_key" ON "account_analytics"("socialAccountId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "contracts_sponsorshipId_key" ON "contracts"("sponsorshipId");

-- AddForeignKey
ALTER TABLE "social_accounts" ADD CONSTRAINT "social_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content" ADD CONSTRAINT "content_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_posts" ADD CONSTRAINT "generated_posts_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduled_posts" ADD CONSTRAINT "scheduled_posts_generatedPostId_fkey" FOREIGN KEY ("generatedPostId") REFERENCES "generated_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scheduled_posts" ADD CONSTRAINT "scheduled_posts_socialAccountId_fkey" FOREIGN KEY ("socialAccountId") REFERENCES "social_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_analytics" ADD CONSTRAINT "account_analytics_socialAccountId_fkey" FOREIGN KEY ("socialAccountId") REFERENCES "social_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "keyword_analyses" ADD CONSTRAINT "keyword_analyses_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brands" ADD CONSTRAINT "brands_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsorships" ADD CONSTRAINT "sponsorships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsorships" ADD CONSTRAINT "sponsorships_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deal_status_history" ADD CONSTRAINT "deal_status_history_sponsorshipId_fkey" FOREIGN KEY ("sponsorshipId") REFERENCES "sponsorships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliverables" ADD CONSTRAINT "deliverables_sponsorshipId_fkey" FOREIGN KEY ("sponsorshipId") REFERENCES "sponsorships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deal_requirements" ADD CONSTRAINT "deal_requirements_sponsorshipId_fkey" FOREIGN KEY ("sponsorshipId") REFERENCES "sponsorships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_checks" ADD CONSTRAINT "verification_checks_sponsorshipId_fkey" FOREIGN KEY ("sponsorshipId") REFERENCES "sponsorships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communications" ADD CONSTRAINT "communications_sponsorshipId_fkey" FOREIGN KEY ("sponsorshipId") REFERENCES "sponsorships"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_sponsorshipId_fkey" FOREIGN KEY ("sponsorshipId") REFERENCES "sponsorships"("id") ON DELETE CASCADE ON UPDATE CASCADE;
