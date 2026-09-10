'use client';

import { useState } from 'react';
import {
  Sparkles, Upload, ChevronRight, ChevronLeft,
  Instagram, Youtube, Zap, CheckCircle2, Clock,
  ArrowRight, BarChart3, Hash, Eye,
} from 'lucide-react';
import { cn, PLATFORM_LABELS, PLATFORM_COLORS, scoreLabel, scoreColor } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { aiApi } from '@/lib/api';

const PLATFORMS = ['INSTAGRAM', 'YOUTUBE', 'TIKTOK', 'FACEBOOK', 'X_TWITTER', 'LINKEDIN', 'PINTEREST', 'THREADS'] as const;

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  INSTAGRAM: <span className="text-sm">📷</span>,
  YOUTUBE:   <span className="text-sm">▶️</span>,
  TIKTOK:    <span className="text-sm">🎵</span>,
  FACEBOOK:  <span className="text-sm">👥</span>,
  X_TWITTER: <span className="text-sm">✕</span>,
  LINKEDIN:  <span className="text-sm">💼</span>,
  PINTEREST: <span className="text-sm">📌</span>,
  THREADS:   <span className="text-sm">🧵</span>,
};

// ─── Score widget ──────────────────────────────────────────────────────────────

function ScoreWidget({ scores }: { scores: Record<string, number> }) {
  const dims = [
    { key: 'searchRelevance', label: 'Search Relevance' },
    { key: 'trendScore',      label: 'Trend Score'      },
    { key: 'competition',     label: 'Competition Fit'  },
    { key: 'audienceMatch',   label: 'Audience Match'   },
    { key: 'contentFit',      label: 'Content Fit'      },
  ];

  return (
    <div className="space-y-3">
      <div className="text-center mb-4">
        <p className="text-5xl font-black gradient-text">{scores.overall ?? '—'}</p>
        <p className="text-xs text-[hsl(var(--text-muted))] mt-1">Overall Opportunity Score</p>
      </div>
      {dims.map(({ key, label }) => (
        <div key={key}>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[hsl(var(--text-secondary))]">{label}</span>
            <span className="font-semibold" style={{ color: scoreColor(scores[key] ?? 0) }}>
              {scores[key] ?? '—'}/100
            </span>
          </div>
          <div className="score-bar">
            <div className="score-bar-fill" style={{ width: `${scores[key] ?? 0}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Platform tab content ──────────────────────────────────────────────────────

function PlatformResult({ platform, result }: { platform: string; result: any }) {
  if (!result?.success) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mb-3">
          <span className="text-red-400 text-xl">!</span>
        </div>
        <p className="text-sm text-[hsl(var(--text-secondary))]">Generation failed for {PLATFORM_LABELS[platform]}</p>
        <p className="text-xs text-[hsl(var(--text-muted))] mt-1">{result?.error}</p>
      </div>
    );
  }

  const data = result.data;

  return (
    <div className="space-y-4">
      {/* Caption / post / tweet / title */}
      {data.caption && (
        <div>
          <label className="text-xs font-semibold text-[hsl(var(--text-secondary))] uppercase tracking-wider mb-2 block">Caption</label>
          <div className="input h-auto min-h-[100px] resize-none whitespace-pre-wrap text-sm leading-relaxed p-4 rounded-xl bg-[hsl(var(--bg-elevated))]">
            {data.caption}
          </div>
        </div>
      )}
      {data.title && (
        <div>
          <label className="text-xs font-semibold text-[hsl(var(--text-secondary))] uppercase tracking-wider mb-2 block">Title</label>
          <div className="input h-auto text-sm p-4">{data.title}</div>
        </div>
      )}
      {data.post && (
        <div>
          <label className="text-xs font-semibold text-[hsl(var(--text-secondary))] uppercase tracking-wider mb-2 block">Post</label>
          <div className="input h-auto min-h-[100px] whitespace-pre-wrap text-sm leading-relaxed p-4">{data.post}</div>
        </div>
      )}
      {data.tweet && (
        <div>
          <label className="text-xs font-semibold text-[hsl(var(--text-secondary))] uppercase tracking-wider mb-2 block">Tweet</label>
          <div className="input h-auto text-sm p-4">{data.tweet}</div>
        </div>
      )}

      {/* Hook + CTA */}
      {(data.hook || data.cta) && (
        <div className="grid grid-cols-2 gap-3">
          {data.hook && (
            <div>
              <label className="text-xs font-semibold text-[hsl(var(--text-secondary))] uppercase tracking-wider mb-2 block">Hook</label>
              <div className="input h-auto text-sm p-3">{data.hook}</div>
            </div>
          )}
          {data.cta && (
            <div>
              <label className="text-xs font-semibold text-[hsl(var(--text-secondary))] uppercase tracking-wider mb-2 block">Call to Action</label>
              <div className="input h-auto text-sm p-3">{data.cta}</div>
            </div>
          )}
        </div>
      )}

      {/* Hashtags */}
      {data.hashtags?.length > 0 && (
        <div>
          <label className="text-xs font-semibold text-[hsl(var(--text-secondary))] uppercase tracking-wider mb-2 block flex items-center gap-1">
            <Hash className="w-3 h-3" /> Hashtags
          </label>
          <div className="flex flex-wrap gap-2">
            {data.hashtags.map((tag: string) => (
              <span key={tag} className="platform-pill text-[hsl(var(--vyro-purple))]">#{tag}</span>
            ))}
          </div>
        </div>
      )}

      {/* YouTube specific */}
      {data.thumbnailConcept && (
        <div>
          <label className="text-xs font-semibold text-[hsl(var(--text-secondary))] uppercase tracking-wider mb-2 block">Thumbnail Concept</label>
          <div className="input h-auto text-sm p-4 border-dashed">{data.thumbnailConcept}</div>
        </div>
      )}
      {data.chapters?.length > 0 && (
        <div>
          <label className="text-xs font-semibold text-[hsl(var(--text-secondary))] uppercase tracking-wider mb-2 block">Chapters</label>
          <div className="space-y-1">
            {data.chapters.map((ch: any, i: number) => (
              <div key={i} className="flex gap-3 text-sm text-[hsl(var(--text-secondary))]">
                <span className="font-mono text-[hsl(var(--vyro-cyan))]">{ch.time}</span>
                <span>{ch.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function AIStudioPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [idea, setIdea] = useState('');
  const [contentType, setContentType] = useState('VIDEO');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['INSTAGRAM', 'YOUTUBE', 'TIKTOK']);
  const [activePlatform, setActivePlatform] = useState('INSTAGRAM');
  const [results, setResults] = useState<any[]>([]);
  const [seoData, setSeoData] = useState<any>(null);

  const generateMutation = useMutation({
    mutationFn: () =>
      aiApi.generate(idea, selectedPlatforms, {
        niche: 'Tech + Smartphones',
        followerCounts: {},
        topCategories: ['Technology', 'Reviews'],
        location: 'India',
      }),
    onSuccess: (res) => {
      setResults(res.data);
      setStep(2);
    },
  });

  const seoMutation = useMutation({
    mutationFn: () =>
      aiApi.analyzeSEO(idea, activePlatform, {
        niche: 'Tech + Smartphones',
        followerCounts: {},
        topCategories: [],
        location: 'India',
      }),
    onSuccess: (res) => setSeoData(res.data),
  });

  const activeResult = results.find((r: any) => r.platform === activePlatform);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold gradient-text">AI Content Studio</h1>
        <p className="text-[hsl(var(--text-secondary))] text-sm mt-1">
          One idea → Platform-specific content for every channel.
        </p>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-3">
        {[
          { n: 1, label: 'Content Idea'       },
          { n: 2, label: 'Platform Variants'  },
          { n: 3, label: 'Schedule'           },
        ].map(({ n, label }, i) => (
          <div key={n} className="flex items-center gap-3">
            <div className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
              step === n ? 'bg-gradient-to-r from-[hsl(var(--vyro-purple))] to-[hsl(var(--vyro-pink))] text-white' :
              step > n  ? 'text-green-400' :
              'text-[hsl(var(--text-muted))]'
            )}>
              {step > n ? <CheckCircle2 className="w-4 h-4" /> : <span className="w-5 h-5 flex items-center justify-center rounded-full border border-current text-xs">{n}</span>}
              {label}
            </div>
            {i < 2 && <ChevronRight className="w-4 h-4 text-[hsl(var(--text-muted))]" />}
          </div>
        ))}
      </div>

      {/* ── Step 1: Content Idea ───────────────────────────────────────────── */}
      {step === 1 && (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 card space-y-6">
            <div>
              <label className="text-xs font-semibold text-[hsl(var(--text-secondary))] uppercase tracking-wider mb-2 block">
                Describe your content idea
              </label>
              <textarea
                id="content-idea-input"
                className="input min-h-[160px] resize-none text-sm leading-relaxed"
                placeholder="e.g. I made a video testing the new iPhone 16 Pro camera — comparing it to the Galaxy S25 and Pixel 9. Covered night mode, zoom, and video quality..."
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[hsl(var(--text-secondary))] uppercase tracking-wider mb-3 block">
                Content Type
              </label>
              <div className="flex flex-wrap gap-2">
                {['VIDEO', 'PHOTO', 'CAROUSEL', 'TEXT', 'STORY', 'SHORT'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setContentType(t)}
                    className={cn(
                      'btn text-xs px-4 py-2',
                      contentType === t ? 'btn-primary' : 'btn-secondary',
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[hsl(var(--text-secondary))] uppercase tracking-wider mb-3 block">
                Generate for
              </label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <button
                    key={p}
                    onClick={() =>
                      setSelectedPlatforms((prev) =>
                        prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
                      )
                    }
                    className={cn(
                      'platform-pill cursor-pointer transition-all',
                      selectedPlatforms.includes(p)
                        ? 'border-[hsl(var(--vyro-purple)/0.6)] bg-[hsl(var(--vyro-purple)/0.1)]'
                        : 'opacity-50',
                    )}
                    style={{ color: selectedPlatforms.includes(p) ? PLATFORM_COLORS[p] : undefined }}
                  >
                    {PLATFORM_ICONS[p]} {PLATFORM_LABELS[p]}
                  </button>
                ))}
              </div>
            </div>

            <button
              id="generate-content-btn"
              onClick={() => generateMutation.mutate()}
              disabled={!idea.trim() || selectedPlatforms.length === 0 || generateMutation.isPending}
              className="btn-primary w-full"
            >
              {generateMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating platform-specific content...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate for {selectedPlatforms.length} platforms
                </>
              )}
            </button>

            {generateMutation.isError && (
              <p className="text-sm text-red-400 text-center">
                Generation failed — make sure your AI API key is configured.
              </p>
            )}
          </div>

          {/* Tip panel */}
          <div className="card space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-[hsl(var(--vyro-purple))]" />
              <span className="text-sm font-semibold">What happens next</span>
            </div>
            <div className="space-y-3 text-xs text-[hsl(var(--text-secondary))]">
              {[
                'Each platform gets its own prompt — not a copy-paste',
                'Instagram: hook + caption + 15 strategic hashtags',
                'YouTube: SEO title + description + chapters + thumbnail concept',
                'TikTok: punchy caption + search keywords + sound ideas',
                'LinkedIn: professional post with industry hashtags',
              ].map((tip, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-[hsl(var(--vyro-purple))]">→</span>
                  {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Step 2: Platform Variants ──────────────────────────────────────── */}
      {step === 2 && (
        <div className="grid grid-cols-4 gap-6">
          {/* Platform tabs */}
          <div className="col-span-1 space-y-2">
            <p className="text-xs font-semibold text-[hsl(var(--text-secondary))] uppercase tracking-wider mb-3">Platforms</p>
            {selectedPlatforms.map((p) => {
              const r = results.find((x: any) => x.platform === p);
              return (
                <button
                  key={p}
                  onClick={() => {
                    setActivePlatform(p);
                    setSeoData(null);
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all border',
                    activePlatform === p
                      ? 'border-[hsl(var(--vyro-purple)/0.5)] bg-[hsl(var(--vyro-purple)/0.1)]'
                      : 'border-transparent bg-[hsl(var(--bg-elevated))] hover:border-[hsl(var(--bg-border))]',
                  )}
                >
                  <span>{PLATFORM_ICONS[p]}</span>
                  <span className="flex-1 text-left">{PLATFORM_LABELS[p]}</span>
                  {r?.success ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                  ) : (
                    <span className="w-3.5 h-3.5 text-red-400 text-xs">!</span>
                  )}
                </button>
              );
            })}

            <button onClick={() => setStep(1)} className="btn-ghost w-full mt-4 text-xs">
              <ChevronLeft className="w-3.5 h-3.5" /> Edit idea
            </button>
          </div>

          {/* Content output */}
          <div className="col-span-2 card overflow-y-auto max-h-[70vh]">
            <div className="flex items-center gap-2 mb-6">
              {PLATFORM_ICONS[activePlatform]}
              <h2 className="font-semibold">{PLATFORM_LABELS[activePlatform]}</h2>
            </div>
            <PlatformResult platform={activePlatform} result={activeResult} />
          </div>

          {/* SEO / Opportunity Score panel */}
          <div className="col-span-1 space-y-4">
            <div className="card">
              {seoData ? (
                <ScoreWidget scores={seoData.scores} />
              ) : (
                <div className="text-center py-4">
                  <BarChart3 className="w-8 h-8 text-[hsl(var(--text-muted))] mx-auto mb-3" />
                  <p className="text-xs text-[hsl(var(--text-secondary))] mb-4">
                    Analyze keyword opportunity and hashtag strategy for {PLATFORM_LABELS[activePlatform]}
                  </p>
                  <button
                    id="analyze-seo-btn"
                    onClick={() => seoMutation.mutate()}
                    disabled={seoMutation.isPending}
                    className="btn-secondary w-full text-xs"
                  >
                    {seoMutation.isPending ? (
                      <div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                    Analyze SEO
                  </button>
                </div>
              )}

              {seoData && (
                <div className="mt-6 space-y-4 border-t border-[hsl(var(--bg-border))] pt-4">
                  <div>
                    <p className="text-xs font-semibold text-[hsl(var(--text-secondary))] uppercase tracking-wider mb-2">Primary Keywords</p>
                    <div className="flex flex-wrap gap-1.5">
                      {seoData.primaryKeywords?.map((k: string) => (
                        <span key={k} className="platform-pill text-xs text-[hsl(var(--vyro-cyan))]">{k}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[hsl(var(--text-secondary))] uppercase tracking-wider mb-2">High-Relevance Hashtags</p>
                    <div className="flex flex-wrap gap-1.5">
                      {seoData.hashtagsHighRelevance?.map((t: string) => (
                        <span key={t} className="platform-pill text-xs text-[hsl(var(--vyro-purple))]">#{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              id="proceed-to-schedule-btn"
              onClick={() => setStep(3)}
              className="btn-primary w-full"
            >
              Schedule Posts <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Schedule ───────────────────────────────────────────────── */}
      {step === 3 && (
        <div className="card max-w-2xl mx-auto text-center py-12 space-y-4">
          <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto" />
          <h2 className="text-xl font-bold">Content Approved</h2>
          <p className="text-[hsl(var(--text-secondary))] text-sm">
            Your content is ready to schedule. Head to the Calendar to set publishing times.
          </p>
          <a href="/calendar" className="btn-primary inline-flex mx-auto">
            <Calendar className="w-4 h-4" /> Open Calendar
          </a>
        </div>
      )}
    </div>
  );
}

// Need to import Calendar for step 3
function Calendar(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
}
