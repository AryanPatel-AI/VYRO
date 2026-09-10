'use client';

import { useState } from 'react';
import {
  CheckCircle2, XCircle, Clock, AlertCircle,
  ChevronRight, ArrowRight, Plus, Clipboard,
} from 'lucide-react';
import { cn, formatCurrency, PLATFORM_LABELS, PLATFORM_COLORS } from '@/lib/utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import { sponsorshipsApi, communicationsApi } from '@/lib/api';
import { DEAL_STATUS_LABELS } from '@vyro/shared-types';

// ─── Mock data for Phase 1 ────────────────────────────────────────────────────

const MOCK_DEALS = [
  {
    id: '1', brand: { name: 'TechGear Pro', industry: 'Consumer Tech' },
    campaignName: 'Q4 Smartphone Launch', status: 'CAMPAIGN_ACTIVE',
    budget: 85000, platforms: ['INSTAGRAM', 'YOUTUBE'], matchScore: 94,
    deadline: '2026-09-25', updatedAt: new Date().toISOString(),
  },
  {
    id: '2', brand: { name: 'CamShield', industry: 'Accessories' },
    campaignName: 'Camera Lens Promotion', status: 'CONTRACT_PENDING',
    budget: 45000, platforms: ['INSTAGRAM'], matchScore: 89,
    deadline: '2026-10-01', updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3', brand: { name: 'AudioSphere', industry: 'Audio' },
    campaignName: 'Earbuds Q4', status: 'REQUIREMENTS_RECEIVED',
    budget: 60000, platforms: ['YOUTUBE', 'TIKTOK'], matchScore: 82,
    deadline: '2026-10-15', updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '4', brand: { name: 'CloudDrive', industry: 'Software' },
    campaignName: 'Storage Solution', status: 'LEAD',
    budget: undefined, platforms: ['LINKEDIN'], matchScore: 76,
    deadline: undefined, updatedAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

const PIPELINE_COLUMNS = [
  { key: 'LEAD',                  label: 'New Leads'       },
  { key: 'CONTACTED',             label: 'Contacted'       },
  { key: 'REQUIREMENTS_RECEIVED', label: 'Requirements'    },
  { key: 'REQUIREMENTS_COMPLETE', label: 'Proposal Stage'  },
  { key: 'CONTRACT_PENDING',      label: 'Contracting'     },
  { key: 'CAMPAIGN_ACTIVE',       label: 'Active'          },
  { key: 'DEAL_COMPLETED',        label: 'Completed'       },
];

const STATUS_COLORS: Record<string, string> = {
  LEAD:                   'from-gray-600 to-gray-500',
  CONTACTED:              'from-blue-700 to-blue-600',
  REQUIREMENTS_RECEIVED:  'from-yellow-700 to-yellow-600',
  REQUIREMENTS_COMPLETE:  'from-purple-700 to-purple-600',
  CONTRACT_PENDING:       'from-indigo-700 to-indigo-600',
  CAMPAIGN_ACTIVE:        'from-green-700 to-green-600',
  DEAL_COMPLETED:         'from-emerald-700 to-emerald-600',
};

function DealCard({ deal }: { deal: typeof MOCK_DEALS[0] }) {
  return (
    <a href={`/sponsors/${deal.id}`}
      className="block p-4 rounded-xl bg-[hsl(var(--bg-elevated))] border border-[hsl(var(--bg-border))] hover:border-[hsl(var(--vyro-purple)/0.4)] transition-all group cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(var(--bg-border))] to-[hsl(var(--bg-elevated))] flex items-center justify-center font-bold text-xs">
          {deal.brand.name[0]}
        </div>
        {deal.matchScore && (
          <span className="text-xs font-bold text-green-400">{deal.matchScore}%</span>
        )}
      </div>
      <p className="text-sm font-semibold leading-tight group-hover:gradient-text transition-all">{deal.brand.name}</p>
      <p className="text-xs text-[hsl(var(--text-muted))] mt-0.5">{deal.campaignName}</p>

      <div className="flex flex-wrap gap-1 mt-2">
        {deal.platforms.map((p) => (
          <span key={p} className="text-[10px] px-1.5 py-0.5 rounded-md font-medium"
            style={{ background: PLATFORM_COLORS[p] + '22', color: PLATFORM_COLORS[p] }}>
            {PLATFORM_LABELS[p]}
          </span>
        ))}
      </div>

      {deal.budget && (
        <p className="text-sm font-bold mt-3">{formatCurrency(deal.budget)}</p>
      )}
      {deal.deadline && (
        <p className="text-xs text-[hsl(var(--text-muted))] mt-1 flex items-center gap-1">
          <Clock className="w-3 h-3" /> {new Date(deal.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </p>
      )}
    </a>
  );
}

export default function SponsorsPage() {
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Deal Pipeline</h1>
          <p className="text-[hsl(var(--text-secondary))] text-sm mt-1">
            {MOCK_DEALS.length} deals · Track every brand relationship from lead to completion.
          </p>
        </div>
        <div className="flex gap-3">
          <a href="/sponsors/discovery" className="btn-secondary text-sm">
            Find Sponsors
          </a>
          <button className="btn-primary text-sm">
            <Plus className="w-4 h-4" /> Add Deal
          </button>
        </div>
      </div>

      {/* Kanban board */}
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
          {PIPELINE_COLUMNS.map((col) => {
            const colDeals = MOCK_DEALS.filter((d) => {
              // Group some statuses into the same column for display
              if (col.key === 'REQUIREMENTS_RECEIVED') return d.status === 'REQUIREMENTS_RECEIVED' || d.status === 'RESPONSE_RECEIVED';
              return d.status === col.key;
            });

            return (
              <div key={col.key} className="kanban-col">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${STATUS_COLORS[col.key] ?? 'from-gray-600 to-gray-500'}`} />
                    <span className="text-xs font-semibold text-[hsl(var(--text-secondary))]">{col.label}</span>
                  </div>
                  <span className="text-xs text-[hsl(var(--text-muted))] bg-[hsl(var(--bg-elevated))] px-2 py-0.5 rounded-full">
                    {colDeals.length}
                  </span>
                </div>

                {colDeals.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-[10px] text-[hsl(var(--text-muted))] text-center py-8">
                    No deals here
                  </div>
                ) : (
                  <div className="space-y-2">
                    {colDeals.map((deal) => (
                      <DealCard key={deal.id} deal={deal} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
