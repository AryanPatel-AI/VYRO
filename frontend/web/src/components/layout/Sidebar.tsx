'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Sparkles, Calendar, BarChart3,
  Users, Briefcase, MessageSquare, Settings,
  Zap, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard',          icon: LayoutDashboard, label: 'Dashboard'    },
  { href: '/accounts',           icon: Users,            label: 'Accounts'     },
  { href: '/content/new',        icon: Sparkles,         label: 'AI Studio'    },
  { href: '/calendar',           icon: Calendar,         label: 'Calendar'     },
  { href: '/analytics',          icon: BarChart3,        label: 'Analytics'    },
  { href: '/sponsors',           icon: Briefcase,        label: 'Sponsors'     },
  { href: '/brands',             icon: Users,            label: 'Brands'       },
  { href: '/settings',           icon: Settings,         label: 'Settings'     },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-64 h-screen sticky top-0 shrink-0 border-r border-[hsl(var(--bg-border))] bg-[hsl(var(--bg-surface))]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-[hsl(var(--bg-border))]">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[hsl(var(--vyro-purple))] to-[hsl(var(--vyro-pink))] flex items-center justify-center glow-purple">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-lg tracking-tight gradient-text">VYRO</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link key={href} href={href} className={cn('nav-item', isActive && 'active')}>
              <Icon className="w-4 h-4 shrink-0" />
              {label}
              {isActive && <ChevronRight className="w-3 h-3 ml-auto opacity-50" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom — plan badge */}
      <div className="p-4 border-t border-[hsl(var(--bg-border))]">
        <div className="glass rounded-xl p-3 text-center">
          <p className="text-xs text-[hsl(var(--text-muted))]">Free Plan</p>
          <Link
            href="/settings"
            className="text-xs font-semibold gradient-text hover:opacity-80 transition-opacity"
          >
            Upgrade to Pro →
          </Link>
        </div>
      </div>
    </aside>
  );
}
