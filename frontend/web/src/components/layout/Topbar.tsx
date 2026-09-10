'use client';

import { Bell, Search, Plus } from 'lucide-react';
import Link from 'next/link';

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 border-b border-[hsl(var(--bg-border))] bg-[hsl(var(--bg-base)/0.85)] backdrop-blur-xl">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--text-muted))]" />
        <input
          className="input pl-10 py-2 text-sm max-w-sm"
          placeholder="Search content, deals, brands..."
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        <Link href="/content/new" className="btn-primary text-xs px-4 py-2">
          <Plus className="w-3.5 h-3.5" />
          New Content
        </Link>

        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-[hsl(var(--bg-elevated))] border border-[hsl(var(--bg-border))] hover:border-[hsl(var(--vyro-purple)/0.4)] transition-colors">
          <Bell className="w-4 h-4 text-[hsl(var(--text-secondary))]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[hsl(var(--vyro-pink))]" />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[hsl(var(--vyro-purple))] to-[hsl(var(--vyro-pink))] flex items-center justify-center text-sm font-bold text-white cursor-pointer">
          A
        </div>
      </div>
    </header>
  );
}
