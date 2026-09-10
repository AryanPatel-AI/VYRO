'use client';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useState } from 'react';
import { cn, POST_STATUS_CONFIG, PLATFORM_COLORS, PLATFORM_LABELS } from '@/lib/utils';

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const MOCK_POSTS_MAP: Record<number, Array<{platform:string;caption:string;status:string}>> = {
  9:  [{ platform:'INSTAGRAM', caption:'iPhone 16 Pro camera test', status:'PUBLISHED' }],
  11: [{ platform:'INSTAGRAM', caption:'Night mode comparison', status:'SCHEDULED' }, { platform:'TIKTOK', caption:'POV: Best phone camera 📷', status:'NEEDS_APPROVAL' }],
  12: [{ platform:'YOUTUBE', caption:'Full iPhone vs Galaxy review', status:'DRAFT' }],
  15: [{ platform:'INSTAGRAM', caption:'Camera settings guide', status:'SCHEDULED' }],
  18: [{ platform:'TIKTOK', caption:'5 iPhone tips', status:'SCHEDULED' }],
  20: [{ platform:'LINKEDIN', caption:'Tech industry post', status:'DRAFT' }],
};

export default function CalendarPage() {
  const [month] = useState({ year: 2026, month: 8 }); // Sep 2026
  const firstDay = new Date(2026, 8, 1).getDay();
  const daysInMonth = 30;
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const cells = Array.from({ length: offset + daysInMonth }, (_, i) => i < offset ? null : i - offset + 1);

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">Content Calendar</h1><p className="text-[hsl(var(--text-secondary))] text-sm mt-1">September 2026</p></div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2 text-xs">
            {Object.entries(POST_STATUS_CONFIG).map(([k,v]) => <span key={k} className={`badge ${v.badge}`}><span className={`w-1.5 h-1.5 rounded-full ${v.dot}`}/>{v.label}</span>)}
          </div>
          <button className="btn-primary text-sm"><Plus className="w-4 h-4"/>Schedule Post</button>
        </div>
      </div>
      <div className="card">
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map(d=><div key={d} className="text-center text-xs font-semibold text-[hsl(var(--text-muted))] py-2">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            const posts = day ? MOCK_POSTS_MAP[day] ?? [] : [];
            const isToday = day === 10;
            return (
              <div key={i} className={cn(
                'min-h-[100px] p-2 rounded-xl border transition-colors',
                !day ? 'opacity-0 pointer-events-none' : 'border-[hsl(var(--bg-border))] hover:border-[hsl(var(--vyro-purple)/0.3)]',
                isToday && 'border-[hsl(var(--vyro-purple)/0.5)] bg-[hsl(var(--vyro-purple)/0.05)]'
              )}>
                {day && (
                  <>
                    <p className={cn('text-sm font-semibold mb-1.5', isToday && 'gradient-text')}>{day}</p>
                    <div className="space-y-1">
                      {posts.map((post, pi) => {
                        const cfg = POST_STATUS_CONFIG[post.status];
                        return (
                          <div key={pi} className={`badge ${cfg.badge} text-[10px] w-full block truncate cursor-pointer`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shrink-0`}/>
                            {PLATFORM_LABELS[post.platform]}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
