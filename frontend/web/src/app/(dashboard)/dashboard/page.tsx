'use client';

import { useQuery } from '@tanstack/react-query';
import {
  TrendingUp, Eye, MousePointerClick, FileText,
  Briefcase, ArrowUpRight, Clock, CheckCircle2, AlertCircle,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { formatNumber, formatCurrency, POST_STATUS_CONFIG, PLATFORM_LABELS, PLATFORM_COLORS } from '@/lib/utils';

// ─── Mock data for Phase 1 UI ─────────────────────────────────────────────────

const MOCK_STATS = [
  { label: 'Total Reach',    value: '2.4M',   delta: '+12.3%', icon: Eye,             color: 'from-[hsl(265_85%_60%)] to-[hsl(258_90%_55%)]' },
  { label: 'Avg. Engagement',value: '8.7%',   delta: '+1.2%',  icon: MousePointerClick,color: 'from-[hsl(195_85%_55%)] to-[hsl(265_85%_60%)]' },
  { label: 'Posts This Month',value: '24',    delta: '+4',     icon: FileText,         color: 'from-[hsl(320_75%_60%)] to-[hsl(265_85%_60%)]' },
  { label: 'Active Deals',   value: '3',      delta: '+1',     icon: Briefcase,        color: 'from-[hsl(38_92%_55%)] to-[hsl(320_75%_60%)]'  },
];

const MOCK_CHART = Array.from({ length: 14 }, (_, i) => ({
  day: `Sep ${i + 1}`,
  instagram: Math.floor(40000 + Math.random() * 30000),
  youtube:   Math.floor(20000 + Math.random() * 15000),
  tiktok:    Math.floor(60000 + Math.random() * 40000),
}));

const MOCK_POSTS = [
  { id: '1', platform: 'INSTAGRAM', caption: 'Tested the new iPhone 16 Pro camera for a week...', scheduledAt: '2026-09-11T10:00:00', status: 'SCHEDULED' },
  { id: '2', platform: 'YOUTUBE',   caption: 'iPhone 16 Pro vs Galaxy S25 Ultra — Full Review', scheduledAt: '2026-09-12T14:00:00', status: 'DRAFT' },
  { id: '3', platform: 'TIKTOK',    caption: 'POV: Using the world\'s best phone camera 📷',     scheduledAt: '2026-09-11T18:00:00', status: 'NEEDS_APPROVAL' },
];

const MOCK_DEALS = [
  { id: '1', brand: 'TechGear Pro',    campaign: 'Q4 Smartphone Launch',  status: 'CAMPAIGN_ACTIVE',  budget: 85000,  match: 94 },
  { id: '2', brand: 'CamShield',       campaign: 'Camera Accessories',    status: 'CONTRACT_PENDING', budget: 45000,  match: 89 },
  { id: '3', brand: 'AudioSphere',     campaign: 'Earbuds Promotion',     status: 'REQUIREMENTS_RECEIVED', budget: 60000, match: 82 },
];

const MOCK_OPPORTUNITIES = [
  { id: '1', name: 'XYZ Mobile',   industry: 'Smartphones', match: 94 },
  { id: '2', name: 'ABC Accessories', industry: 'Tech Accessories', match: 91 },
  { id: '3', name: 'TechGear',     industry: 'Consumer Tech', match: 87 },
];

const DEAL_STATUS_COLORS: Record<string, string> = {
  CAMPAIGN_ACTIVE:          'text-green-400',
  CONTRACT_PENDING:         'text-blue-400',
  REQUIREMENTS_RECEIVED:    'text-yellow-400',
  DEAL_CONFIRMED:           'text-emerald-400',
};

export default function DashboardPage() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          {greeting} 👋
        </h1>
        <p className="text-[hsl(var(--text-secondary))] text-sm mt-1">
          Here&apos;s what&apos;s happening with your creator business today.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        {MOCK_STATS.map((stat, i) => (
          <div key={stat.label} className="stat-card" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-semibold text-green-400 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                {stat.delta}
              </span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-[hsl(var(--text-secondary))] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Content Performance Chart — 2/3 width */}
        <div className="col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold">Content Performance</h2>
              <p className="text-xs text-[hsl(var(--text-muted))] mt-0.5">Reach by platform — last 14 days</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-[hsl(var(--text-secondary))]">
              {['INSTAGRAM', 'YOUTUBE', 'TIKTOK'].map((p) => (
                <span key={p} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: PLATFORM_COLORS[p] }} />
                  {PLATFORM_LABELS[p]}
                </span>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={MOCK_CHART} margin={{ left: -10, right: 10, top: 5, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--bg-border))" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: 'hsl(var(--text-muted))', fontSize: 11 }} axisLine={false} tickLine={false} interval={2} />
              <YAxis tick={{ fill: 'hsl(var(--text-muted))', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => formatNumber(v)} />
              <Tooltip
                contentStyle={{ background: 'hsl(var(--bg-elevated))', border: '1px solid hsl(var(--bg-border))', borderRadius: 12, fontSize: 12 }}
                labelStyle={{ color: 'hsl(var(--text-secondary))' }}
                formatter={(v: number) => [formatNumber(v), '']}
              />
              <Line type="monotone" dataKey="instagram" stroke={PLATFORM_COLORS.INSTAGRAM} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="youtube"   stroke={PLATFORM_COLORS.YOUTUBE}   strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="tiktok"    stroke={PLATFORM_COLORS.TIKTOK}    strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Upcoming Posts — 1/3 width */}
        <div className="card flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Upcoming Posts</h2>
            <Clock className="w-4 h-4 text-[hsl(var(--text-muted))]" />
          </div>
          <div className="space-y-3 flex-1">
            {MOCK_POSTS.map((post) => {
              const cfg = POST_STATUS_CONFIG[post.status];
              return (
                <div key={post.id} className="flex items-start gap-3 p-3 rounded-xl bg-[hsl(var(--bg-elevated))] border border-[hsl(var(--bg-border))]">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold"
                    style={{ background: PLATFORM_COLORS[post.platform] + '22', color: PLATFORM_COLORS[post.platform] }}>
                    {PLATFORM_LABELS[post.platform][0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium truncate">{post.caption}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`badge ${cfg.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Deals + Opportunities */}
      <div className="grid grid-cols-2 gap-6">
        {/* Active Deals */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold">Active Deals</h2>
            <a href="/sponsors" className="text-xs text-[hsl(var(--vyro-purple))] hover:opacity-80">View all →</a>
          </div>
          <div className="space-y-3">
            {MOCK_DEALS.map((deal) => (
              <a key={deal.id} href={`/sponsors/${deal.id}`}
                className="flex items-center justify-between p-4 rounded-xl bg-[hsl(var(--bg-elevated))] border border-[hsl(var(--bg-border))] hover:border-[hsl(var(--vyro-purple)/0.3)] transition-colors group">
                <div>
                  <p className="text-sm font-semibold group-hover:gradient-text transition-all">{deal.brand}</p>
                  <p className="text-xs text-[hsl(var(--text-muted))] mt-0.5">{deal.campaign}</p>
                  <p className={`text-xs font-medium mt-1.5 ${DEAL_STATUS_COLORS[deal.status] ?? 'text-gray-400'}`}>
                    {deal.status.replace(/_/g, ' ')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{formatCurrency(deal.budget)}</p>
                  <div className="flex items-center gap-1 mt-1 justify-end">
                    <span className="text-xs text-[hsl(var(--text-muted))]">Match</span>
                    <span className="text-xs font-bold text-green-400">{deal.match}%</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Sponsor Opportunities */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold">Sponsor Opportunities</h2>
            <a href="/sponsors/discovery" className="text-xs text-[hsl(var(--vyro-purple))] hover:opacity-80">Discover more →</a>
          </div>
          <div className="space-y-3">
            {MOCK_OPPORTUNITIES.map((brand, i) => (
              <div key={brand.id}
                className="flex items-center justify-between p-4 rounded-xl bg-[hsl(var(--bg-elevated))] border border-[hsl(var(--bg-border))] hover:border-[hsl(var(--vyro-purple)/0.3)] transition-colors cursor-pointer"
                style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(var(--bg-border))] to-[hsl(var(--bg-elevated))] flex items-center justify-center font-bold text-sm">
                    {brand.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{brand.name}</p>
                    <p className="text-xs text-[hsl(var(--text-muted))]">{brand.industry}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black gradient-text">{brand.match}%</p>
                  <p className="text-[10px] text-[hsl(var(--text-muted))]">match</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
