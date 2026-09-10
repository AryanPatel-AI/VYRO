'use client';
import { Link2, Link2Off, RefreshCw, Users } from 'lucide-react';
import { cn, PLATFORM_LABELS, PLATFORM_COLORS, formatNumber } from '@/lib/utils';

const MOCK_ACCOUNTS = [
  { id: '1', platform: 'INSTAGRAM', username: '@aryancreates', displayName: 'Aryan Patel', followers: 84200, followingCount: 620, engagementRate: 7.2, lastSyncedAt: new Date().toISOString(), isActive: true },
  { id: '2', platform: 'YOUTUBE',   username: 'APC Tech', displayName: 'APC Tech', followers: 128000, followingCount: 0, engagementRate: 5.4, lastSyncedAt: new Date().toISOString(), isActive: true },
  { id: '3', platform: 'TIKTOK',    username: '@aryanpctok', displayName: 'Aryan PC', followers: 212000, followingCount: 890, engagementRate: 12.1, lastSyncedAt: new Date().toISOString(), isActive: true },
];

const DISCONNECTED = ['FACEBOOK','X_TWITTER','LINKEDIN','PINTEREST','THREADS'];

export default function AccountsPage() {
  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold">Connected Accounts</h1>
        <p className="text-[hsl(var(--text-secondary))] text-sm mt-1">Manage your social media connections.</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {MOCK_ACCOUNTS.map((acc) => (
          <div key={acc.id} className="card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base"
                  style={{ background: PLATFORM_COLORS[acc.platform] + '22', color: PLATFORM_COLORS[acc.platform] }}>
                  {acc.platform[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold">{PLATFORM_LABELS[acc.platform]}</p>
                  <p className="text-xs text-[hsl(var(--text-muted))]">{acc.username}</p>
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-green-400" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[hsl(var(--bg-elevated))]">
                <p className="text-xs text-[hsl(var(--text-muted))]">Followers</p>
                <p className="text-lg font-bold">{formatNumber(acc.followers)}</p>
              </div>
              <div className="p-3 rounded-xl bg-[hsl(var(--bg-elevated))]">
                <p className="text-xs text-[hsl(var(--text-muted))]">Engagement</p>
                <p className="text-lg font-bold">{acc.engagementRate}%</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn-ghost text-xs flex-1 border border-[hsl(var(--bg-border))] rounded-xl"><RefreshCw className="w-3.5 h-3.5" /> Sync</button>
              <button className="btn-ghost text-xs text-red-400 flex-1 border border-red-500/20 rounded-xl"><Link2Off className="w-3.5 h-3.5" /> Disconnect</button>
            </div>
          </div>
        ))}
        {DISCONNECTED.map((p) => (
          <div key={p} className="card opacity-40 hover:opacity-70 transition-opacity cursor-pointer border-dashed">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base bg-[hsl(var(--bg-elevated))]">
                {p[0]}
              </div>
              <div>
                <p className="text-sm font-semibold">{PLATFORM_LABELS[p]}</p>
                <p className="text-xs text-[hsl(var(--text-muted))]">Not connected</p>
              </div>
            </div>
            <button className="btn-secondary w-full text-xs"><Link2 className="w-3.5 h-3.5" /> Connect {PLATFORM_LABELS[p]}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
