'use client';

import { useState } from 'react';
import {
  CheckCircle2, XCircle, AlertCircle, ChevronRight,
  MessageSquare, Clipboard, Send, ArrowRight, Clock,
} from 'lucide-react';
import { cn, formatCurrency, PLATFORM_LABELS, PLATFORM_COLORS } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { communicationsApi } from '@/lib/api';
import { DEAL_STATUS_LABELS, DEAL_STATUS_TRANSITIONS } from '@vyro/shared-types';

// ─── Mock deal data ───────────────────────────────────────────────────────────

const MOCK_DEAL = {
  id: '2',
  brand: { name: 'CamShield', industry: 'Tech Accessories', contactEmail: 'partnerships@camshield.com', contactName: 'Priya Sharma' },
  campaignName: 'Camera Lens Promotion',
  platforms: ['INSTAGRAM'],
  status: 'CONTRACT_PENDING',
  budget: 45000,
  currency: 'INR',
  deadline: '2026-10-01',
  productName: 'CamShield Lens Kit Pro',
  matchScore: 89,
  deliverables: [
    { id: '1', platform: 'INSTAGRAM', type: 'reel', quantity: 1, isComplete: false },
    { id: '2', platform: 'INSTAGRAM', type: 'story', quantity: 3, isComplete: false },
  ],
  requirements: [
    { field: 'payment_amount',  label: 'Payment Amount',          value: '45000', isVerified: true  },
    { field: 'usage_rights',    label: 'Usage Rights',            value: '30 days commercial use',  isVerified: true  },
    { field: 'exclusivity',     label: 'Exclusivity Terms',       value: null,    isVerified: false },
    { field: 'approval_process',label: 'Content Approval Process',value: '48 hours review window',  isVerified: true  },
    { field: 'posting_window',  label: 'Posting Window',          value: 'Sep 20–25 2026',          isVerified: true  },
    { field: 'payment_schedule',label: 'Payment Schedule',        value: '50% upfront, 50% on completion', isVerified: true },
    { field: 'talking_points',  label: 'Talking Points',          value: '4K video capability, magnetic mount, universal fit', isVerified: true },
  ],
  verificationChecks: [
    { checkName: 'brand_agreement',      label: 'Brand Agreement Received', isPassed: true  },
    { checkName: 'creator_approval',     label: 'Creator Has Approved Terms', isPassed: true  },
    { checkName: 'deliverables_defined', label: 'All Deliverables Defined', isPassed: true  },
    { checkName: 'payment_terms_defined',label: 'Payment Terms Confirmed',  isPassed: true  },
    { checkName: 'contract_received',    label: 'Contract Received',        isPassed: false },
    { checkName: 'contract_signed',      label: 'Contract Signed',          isPassed: false },
    { checkName: 'campaign_dates_set',   label: 'Campaign Dates Set',       isPassed: true  },
  ],
  communications: [
    {
      id: '1', direction: 'INBOUND', channel: 'email',
      subject: 'Collaboration Inquiry — CamShield Lens Kit Pro',
      body: 'Hi! We\'d love to collaborate on our new lens kit. We need 1 Instagram Reel and 3 Stories posted between Sep 20–25. Budget is ₹45,000 with 50% upfront. The content should highlight 4K video, the magnetic mount, and universal fit. We need 48 hours to review before you post.',
      timestamp: new Date(Date.now() - 5 * 86400000).toISOString(),
      extractedData: { deliverables: [{ type: 'reel', quantity: 1 }, { type: 'story', quantity: 3 }] },
    },
    {
      id: '2', direction: 'OUTBOUND', channel: 'email',
      subject: 'Re: Collaboration Inquiry — CamShield Lens Kit Pro',
      body: 'Thanks for reaching out! I\'d love to collaborate. I\'ll review the contract details and get back to you shortly.',
      timestamp: new Date(Date.now() - 4 * 86400000).toISOString(),
      extractedData: null,
    },
  ],
};

type TabId = 'overview' | 'requirements' | 'communications' | 'verification';

export default function DealDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [pastedMessage, setPastedMessage] = useState('');
  const [extractionResult, setExtractionResult] = useState<any>(null);

  const extractMutation = useMutation({
    mutationFn: () =>
      communicationsApi.create(MOCK_DEAL.id, {
        direction: 'INBOUND',
        channel: 'email',
        body: pastedMessage,
      }),
    onSuccess: (res) => setExtractionResult(res.data),
  });

  const passedChecks = MOCK_DEAL.verificationChecks.filter((c) => c.isPassed).length;
  const totalChecks = MOCK_DEAL.verificationChecks.length;
  const isConfirmed = passedChecks === totalChecks;

  const missingReqs = MOCK_DEAL.requirements.filter((r) => !r.value);

  const TABS: Array<{ id: TabId; label: string }> = [
    { id: 'overview',       label: 'Overview'       },
    { id: 'requirements',   label: 'Requirements'   },
    { id: 'communications', label: 'Communications' },
    { id: 'verification',   label: 'Verification'   },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-up">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[hsl(var(--text-muted))]">
        <a href="/sponsors" className="hover:text-white transition-colors">Sponsors</a>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-white">{MOCK_DEAL.brand.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[hsl(var(--bg-border))] to-[hsl(var(--bg-elevated))] flex items-center justify-center font-bold text-xl">
              {MOCK_DEAL.brand.name[0]}
            </div>
            <div>
              <h1 className="text-xl font-bold">{MOCK_DEAL.brand.name}</h1>
              <p className="text-sm text-[hsl(var(--text-muted))]">{MOCK_DEAL.campaignName}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="badge badge-scheduled px-3 py-1.5 text-sm">
            {DEAL_STATUS_LABELS[MOCK_DEAL.status as keyof typeof DEAL_STATUS_LABELS]}
          </span>
          {MOCK_DEAL.matchScore && (
            <span className="text-2xl font-black gradient-text">{MOCK_DEAL.matchScore}%</span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[hsl(var(--bg-elevated))] rounded-xl border border-[hsl(var(--bg-border))] w-fit">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              'px-5 py-2 rounded-lg text-sm font-medium transition-all',
              activeTab === id
                ? 'bg-gradient-to-r from-[hsl(var(--vyro-purple))] to-[hsl(var(--vyro-pink))] text-white'
                : 'text-[hsl(var(--text-secondary))] hover:text-white',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab: Overview ─────────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            {/* Deal info */}
            <div className="card">
              <h2 className="font-semibold mb-4">Campaign Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  { label: 'Brand',       value: MOCK_DEAL.brand.name },
                  { label: 'Industry',    value: MOCK_DEAL.brand.industry },
                  { label: 'Contact',     value: MOCK_DEAL.brand.contactName },
                  { label: 'Email',       value: MOCK_DEAL.brand.contactEmail },
                  { label: 'Budget',      value: formatCurrency(MOCK_DEAL.budget, MOCK_DEAL.currency) },
                  { label: 'Deadline',    value: new Date(MOCK_DEAL.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
                  { label: 'Product',     value: MOCK_DEAL.productName },
                  { label: 'Platforms',   value: MOCK_DEAL.platforms.map((p) => PLATFORM_LABELS[p]).join(', ') },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs text-[hsl(var(--text-muted))] mb-1">{label}</p>
                    <p className="font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverables */}
            <div className="card">
              <h2 className="font-semibold mb-4">Deliverables</h2>
              <div className="space-y-2">
                {MOCK_DEAL.deliverables.map((d) => (
                  <div key={d.id} className={cn('check-row', d.isComplete ? 'passed' : '')}>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold"
                        style={{ background: PLATFORM_COLORS[d.platform] + '22', color: PLATFORM_COLORS[d.platform] }}>
                        {PLATFORM_LABELS[d.platform]}
                      </span>
                      <span className="text-sm font-medium capitalize">{d.quantity}× {d.type}</span>
                    </div>
                    {d.isComplete ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-[hsl(var(--bg-border))]" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Status sidebar */}
          <div className="space-y-4">
            <div className="card">
              <h2 className="font-semibold mb-4">Advance Status</h2>
              <p className="text-xs text-[hsl(var(--text-muted))] mb-4">
                Valid next states (server-enforced):
              </p>
              <div className="space-y-2">
                {(DEAL_STATUS_TRANSITIONS[MOCK_DEAL.status as keyof typeof DEAL_STATUS_TRANSITIONS] ?? []).map((s) => (
                  <button key={s} className="btn-secondary w-full text-xs justify-between">
                    {DEAL_STATUS_LABELS[s as keyof typeof DEAL_STATUS_LABELS]}
                    <ArrowRight className="w-3 h-3" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Requirements ─────────────────────────────────────────────── */}
      {activeTab === 'requirements' && (
        <div className="card">
          <h2 className="font-semibold mb-2">Deal Requirements</h2>
          {missingReqs.length > 0 && (
            <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-sm text-yellow-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {missingReqs.length} required field{missingReqs.length > 1 ? 's' : ''} missing before deal can be confirmed.
            </div>
          )}
          <div className="space-y-2">
            {MOCK_DEAL.requirements.map((req) => (
              <div key={req.field} className={cn('check-row', req.value ? (req.isVerified ? 'passed' : '') : 'failed')}>
                <div>
                  <p className="text-sm font-medium">{req.label}</p>
                  {req.value ? (
                    <p className="text-xs text-[hsl(var(--text-secondary))] mt-0.5">{req.value}</p>
                  ) : (
                    <p className="text-xs text-red-400 mt-0.5">Not provided</p>
                  )}
                </div>
                {req.value ? (
                  req.isVerified ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-yellow-400 shrink-0" />
                  )
                ) : (
                  <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab: Communications ───────────────────────────────────────────── */}
      {activeTab === 'communications' && (
        <div className="space-y-4">
          {/* Thread */}
          <div className="card space-y-4">
            <h2 className="font-semibold">Communication Thread</h2>
            {MOCK_DEAL.communications.map((comm) => (
              <div key={comm.id}
                className={cn('p-4 rounded-xl border', comm.direction === 'INBOUND'
                  ? 'border-[hsl(var(--bg-border))] bg-[hsl(var(--bg-elevated))]'
                  : 'border-[hsl(var(--vyro-purple)/0.3)] bg-[hsl(var(--vyro-purple)/0.05)]')}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[hsl(var(--text-secondary))]">
                    {comm.direction === 'INBOUND' ? `← ${MOCK_DEAL.brand.name}` : '→ You'}
                  </span>
                  <span className="text-xs text-[hsl(var(--text-muted))]">
                    {new Date(comm.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                {comm.subject && <p className="text-sm font-medium mb-1">{comm.subject}</p>}
                <p className="text-sm text-[hsl(var(--text-secondary))] leading-relaxed">{comm.body}</p>
                {comm.extractedData && (
                  <div className="mt-3 p-2 rounded-lg bg-[hsl(var(--bg-base))] border border-[hsl(var(--bg-border))] text-xs text-[hsl(var(--text-muted))]">
                    ✦ AI extracted {Object.keys(comm.extractedData).length} requirement fields from this message
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Paste new message */}
          <div className="card">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Clipboard className="w-4 h-4 text-[hsl(var(--vyro-purple))]" />
              Paste Brand Message
            </h2>
            <p className="text-xs text-[hsl(var(--text-muted))] mb-3">
              Paste an email or message from the brand — AI will extract all deal requirements automatically.
            </p>
            <textarea
              id="paste-message-input"
              className="input min-h-[120px] resize-none text-sm mb-3"
              placeholder="Paste email or message content here..."
              value={pastedMessage}
              onChange={(e) => setPastedMessage(e.target.value)}
            />
            <button
              id="extract-requirements-btn"
              onClick={() => extractMutation.mutate()}
              disabled={!pastedMessage.trim() || extractMutation.isPending}
              className="btn-primary text-sm"
            >
              {extractMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Clipboard className="w-4 h-4" />
              )}
              Extract Requirements
            </button>

            {/* Extraction result */}
            {extractionResult && (
              <div className="mt-4 p-4 rounded-xl border border-[hsl(var(--status-success)/0.3)] bg-[hsl(var(--status-success)/0.05)]">
                <p className="text-sm font-semibold text-green-400 mb-3">
                  ✓ Requirements extracted
                </p>
                {extractionResult.missingFields?.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-yellow-400 mb-1.5">⚠ Missing information:</p>
                    <ul className="space-y-1">
                      {extractionResult.missingFields.map((f: any) => (
                        <li key={f.field} className="text-xs text-[hsl(var(--text-secondary))] flex items-center gap-2">
                          <XCircle className="w-3 h-3 text-red-400" /> {f.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <pre className="text-xs text-[hsl(var(--text-muted))] overflow-x-auto">
                  {JSON.stringify(extractionResult.extracted, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Tab: Verification ─────────────────────────────────────────────── */}
      {activeTab === 'verification' && (
        <div className="max-w-xl">
          <div className="card">
            <h2 className="font-semibold mb-1">Deal Verification</h2>
            <p className="text-xs text-[hsl(var(--text-muted))] mb-6">
              All checks must pass before deal can be confirmed.
            </p>

            <div className="space-y-2 mb-6">
              {MOCK_DEAL.verificationChecks.map((check) => (
                <div key={check.checkName} className={cn('check-row', check.isPassed ? 'passed' : 'failed')}>
                  <span className="text-sm font-medium">{check.label}</span>
                  {check.isPassed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                </div>
              ))}
            </div>

            <div className={cn(
              'p-4 rounded-xl border-2 text-center font-bold',
              isConfirmed
                ? 'border-green-500/50 bg-green-500/10 text-green-400'
                : 'border-red-500/30 bg-red-500/05 text-red-400',
            )}>
              DEAL STATUS: {isConfirmed ? '✓ CONFIRMED' : 'NOT CONFIRMED'}
              {!isConfirmed && (
                <p className="text-xs font-normal text-[hsl(var(--text-muted))] mt-1">
                  {totalChecks - passedChecks} check{totalChecks - passedChecks > 1 ? 's' : ''} remaining
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
