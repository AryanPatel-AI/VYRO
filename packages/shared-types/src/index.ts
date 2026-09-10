// ─── Platform ─────────────────────────────────────────────────────────────────

export type Platform =
  | 'INSTAGRAM'
  | 'YOUTUBE'
  | 'TIKTOK'
  | 'FACEBOOK'
  | 'X_TWITTER'
  | 'LINKEDIN'
  | 'PINTEREST'
  | 'THREADS';

export type ContentType = 'VIDEO' | 'PHOTO' | 'CAROUSEL' | 'TEXT' | 'STORY' | 'SHORT';
export type GeneratedStatus = 'DRAFT' | 'APPROVED' | 'REJECTED';
export type PostStatus = 'DRAFT' | 'SCHEDULED' | 'NEEDS_APPROVAL' | 'PUBLISHING' | 'PUBLISHED' | 'FAILED';
export type KeywordType =
  | 'PRIMARY'
  | 'SECONDARY'
  | 'HASHTAG_HIGH'
  | 'HASHTAG_MEDIUM'
  | 'HASHTAG_NICHE'
  | 'TRENDING_TOPIC'
  | 'AUDIENCE_INTEREST'
  | 'COMPETITOR_KEYWORD';

// ─── Deal State Machine ───────────────────────────────────────────────────────

export type DealStatus =
  | 'LEAD'
  | 'CONTACTED'
  | 'RESPONSE_RECEIVED'
  | 'REQUIREMENTS_RECEIVED'
  | 'REQUIREMENTS_COMPLETE'
  | 'PROPOSAL_SENT'
  | 'AWAITING_RESPONSE'
  | 'CREATOR_APPROVAL'
  | 'CONTRACT_PENDING'
  | 'CONTRACT_SIGNED'
  | 'DEAL_CONFIRMED'
  | 'CAMPAIGN_ACTIVE'
  | 'DELIVERABLES_COMPLETED'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_RECEIVED'
  | 'DEAL_COMPLETED'
  | 'REJECTED'
  | 'CLOSED';

export enum AiProvider {
  CLAUDE = 'CLAUDE',
  GEMINI = 'GEMINI',
}

export const DEAL_STATUS_TRANSITIONS: Record<DealStatus, DealStatus[]> = {
  LEAD:                   ['CONTACTED', 'REJECTED'],
  CONTACTED:              ['RESPONSE_RECEIVED', 'REJECTED'],
  RESPONSE_RECEIVED:      ['REQUIREMENTS_RECEIVED', 'REJECTED'],
  REQUIREMENTS_RECEIVED:  ['REQUIREMENTS_COMPLETE', 'REJECTED'],
  REQUIREMENTS_COMPLETE:  ['PROPOSAL_SENT', 'CREATOR_APPROVAL', 'REJECTED'],
  PROPOSAL_SENT:          ['AWAITING_RESPONSE', 'REJECTED'],
  AWAITING_RESPONSE:      ['CREATOR_APPROVAL', 'REJECTED'],
  CREATOR_APPROVAL:       ['CONTRACT_PENDING', 'REJECTED'],
  CONTRACT_PENDING:       ['CONTRACT_SIGNED', 'REJECTED'],
  CONTRACT_SIGNED:        ['DEAL_CONFIRMED'],
  DEAL_CONFIRMED:         ['CAMPAIGN_ACTIVE'],
  CAMPAIGN_ACTIVE:        ['DELIVERABLES_COMPLETED'],
  DELIVERABLES_COMPLETED: ['PAYMENT_PENDING'],
  PAYMENT_PENDING:        ['PAYMENT_RECEIVED'],
  PAYMENT_RECEIVED:       ['DEAL_COMPLETED'],
  DEAL_COMPLETED:         [],
  REJECTED:               ['LEAD'],
  CLOSED:                 [],
};

export const DEAL_STATUS_LABELS: Record<DealStatus, string> = {
  LEAD:                   'New Lead',
  CONTACTED:              'Contacted',
  RESPONSE_RECEIVED:      'Response Received',
  REQUIREMENTS_RECEIVED:  'Requirements Received',
  REQUIREMENTS_COMPLETE:  'Requirements Complete',
  PROPOSAL_SENT:          'Proposal Sent',
  AWAITING_RESPONSE:      'Awaiting Response',
  CREATOR_APPROVAL:       'Creator Approval',
  CONTRACT_PENDING:       'Contract Pending',
  CONTRACT_SIGNED:        'Contract Signed',
  DEAL_CONFIRMED:         'Deal Confirmed',
  CAMPAIGN_ACTIVE:        'Campaign Active',
  DELIVERABLES_COMPLETED: 'Deliverables Completed',
  PAYMENT_PENDING:        'Payment Pending',
  PAYMENT_RECEIVED:       'Payment Received',
  DEAL_COMPLETED:         'Deal Completed',
  REJECTED:               'Rejected',
  CLOSED:                 'Closed',
};

// ─── Opportunity Score ─────────────────────────────────────────────────────────

export interface OpportunityScore {
  searchRelevance: number;  // 0-100
  trendScore: number;       // 0-100
  competition: number;      // 0-100
  audienceMatch: number;    // 0-100
  contentFit: number;       // 0-100
  overall: number;          // 0-100 (weighted average)
}

// ─── Platform-Specific Content Meta ───────────────────────────────────────────

export interface InstagramMeta {
  platform: 'INSTAGRAM';
  caption: string;
  hook: string;
  cta: string;
  hashtags: string[];
  keywords: string[];
  suggestedTime?: string;
  carouselCount?: number;
}

export interface YouTubeMeta {
  platform: 'YOUTUBE';
  title: string;
  description: string;
  tags: string[];
  chapters: Array<{ time: string; title: string }>;
  hook: string;
  cta: string;
  thumbnailConcept: string;
  keywords: string[];
}

export interface TikTokMeta {
  platform: 'TIKTOK';
  caption: string;
  hook: string;
  cta: string;
  hashtags: string[];
  searchKeywords: string[];
  suggestedSounds?: string[];
}

export interface LinkedInMeta {
  platform: 'LINKEDIN';
  post: string;
  hook: string;
  cta: string;
  industryHashtags: string[];
  keywords: string[];
}

export interface FacebookMeta {
  platform: 'FACEBOOK';
  post: string;
  cta: string;
  hashtags: string[];
  keywords: string[];
}

export interface XTwitterMeta {
  platform: 'X_TWITTER';
  tweet: string;
  thread?: string[];
  hashtags: string[];
  keywords: string[];
}

export interface PinterestMeta {
  platform: 'PINTEREST';
  title: string;
  description: string;
  hashtags: string[];
  keywords: string[];
  boardSuggestion?: string;
}

export interface ThreadsMeta {
  platform: 'THREADS';
  post: string;
  hashtags: string[];
  keywords: string[];
}

export type PlatformMeta =
  | InstagramMeta
  | YouTubeMeta
  | TikTokMeta
  | LinkedInMeta
  | FacebookMeta
  | XTwitterMeta
  | PinterestMeta
  | ThreadsMeta;

// ─── AI: Requirement Extraction ───────────────────────────────────────────────

export interface ExtractedRequirements {
  campaign: string | null;
  platforms: string[];
  deliverables: Array<{
    type: string;
    quantity: number;
    notes: string | null;
  }>;
  posting_window: {
    start: string | null;
    end: string | null;
  } | null;
  payment_amount: number | null;
  payment_currency: string | null;
  payment_schedule: string | null;
  product_requirements: string | null;
  usage_rights: string | null;
  exclusivity: string | null;
  approval_process: string | null;
  talking_points: string[] | null;
  brand_guidelines: string | null;
  product_visibility_seconds: number | null;
}

export const REQUIRED_DEAL_FIELDS: Array<keyof ExtractedRequirements> = [
  'payment_amount',
  'usage_rights',
  'exclusivity',
  'approval_process',
  'posting_window',
];

// ─── Deal Verification ─────────────────────────────────────────────────────────

export interface VerificationCheckResult {
  checkName: string;
  label: string;
  isPassed: boolean;
  notes?: string;
}

export interface DealVerificationReport {
  sponsorshipId: string;
  isConfirmed: boolean;
  status: 'CONFIRMED' | 'NOT_CONFIRMED' | 'INCOMPLETE';
  checks: VerificationCheckResult[];
  missingItems: string[];
}

// ─── Brand Match Score ─────────────────────────────────────────────────────────

export interface BrandMatchScore {
  brandId: string;
  brandName: string;
  industry: string;
  overall: number;          // 0-100
  breakdown: {
    nicheCompatibility: number;
    audienceCompatibility: number;
    geoCompatibility: number;
    platformCompatibility: number;
    engagementCompatibility: number;
    historicalPerformance: number;
  };
}

// ─── API Response Shapes ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
}
