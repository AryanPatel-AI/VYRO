import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function formatCurrency(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

export function scoreColor(score: number): string {
  if (score >= 80) return 'hsl(145 65% 48%)';
  if (score >= 60) return 'hsl(38 92% 55%)';
  return 'hsl(0 72% 58%)';
}

export function scoreLabel(score: number): string {
  if (score >= 80) return 'score-high';
  if (score >= 60) return 'score-mid';
  return 'score-low';
}

export const PLATFORM_COLORS: Record<string, string> = {
  INSTAGRAM: '#E1306C',
  YOUTUBE:   '#FF0000',
  TIKTOK:    '#69C9D0',
  FACEBOOK:  '#1877F2',
  X_TWITTER: '#FFFFFF',
  LINKEDIN:  '#0A66C2',
  PINTEREST: '#E60023',
  THREADS:   '#FFFFFF',
};

export const PLATFORM_LABELS: Record<string, string> = {
  INSTAGRAM: 'Instagram',
  YOUTUBE:   'YouTube',
  TIKTOK:    'TikTok',
  FACEBOOK:  'Facebook',
  X_TWITTER: 'X',
  LINKEDIN:  'LinkedIn',
  PINTEREST: 'Pinterest',
  THREADS:   'Threads',
};

export const POST_STATUS_CONFIG: Record<string, { label: string; badge: string; dot: string }> = {
  DRAFT:          { label: 'Draft',          badge: 'badge-draft',     dot: 'bg-yellow-500' },
  SCHEDULED:      { label: 'Scheduled',      badge: 'badge-scheduled', dot: 'bg-blue-500'   },
  NEEDS_APPROVAL: { label: 'Needs Approval', badge: 'badge-approval',  dot: 'bg-gray-400'   },
  PUBLISHING:     { label: 'Publishing',     badge: 'badge-scheduled', dot: 'bg-blue-400'   },
  PUBLISHED:      { label: 'Published',      badge: 'badge-published', dot: 'bg-green-500'  },
  FAILED:         { label: 'Failed',         badge: 'badge-failed',    dot: 'bg-red-500'    },
};
