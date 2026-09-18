'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Compass,
  LayoutDashboard,
  Share2,
  Target,
  Calendar,
  Gift,
  Award,
  Bell,
  LogOut,
  ExternalLink,
  ChevronRight,
  Shield,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/lib/services/authContext';
import { LEVEL_CONFIGS } from '@/lib/services/seedData';

export default function AmbassadorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, ambassadorProfile, logout, loginAs, hasRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', href: '/ambassador/dashboard', icon: LayoutDashboard },
    { label: 'Share & Referrals', href: '/ambassador/referrals', icon: Share2 },
    { label: 'Missions & XP', href: '/ambassador/missions', icon: Target },
    { label: 'My Events & QR', href: '/ambassador/events', icon: Calendar },
    { label: 'Rewards Catalog', href: '/ambassador/rewards', icon: Gift },
    { label: 'Certificates', href: '/ambassador/certificates', icon: Award },
  ];

  const levelCfg = LEVEL_CONFIGS[ambassadorProfile?.level || 'EXPLORER'];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-wonder-dark-950 font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 glass-panel border-r border-slate-800/80 p-5 flex-col justify-between flex-shrink-0 h-screen sticky top-0">
        <div className="space-y-6">
          {/* Brand header */}
          <Link href="/campus-ambassador" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 shadow-glow-emerald group-hover:scale-105 transition-transform flex-shrink-0 overflow-hidden">
              <img
                src="/wla-logo.png"
                alt="WLA - Wonderlight Adventure Company Logo"
                className="w-full h-full object-cover rounded-full bg-black"
              />
            </div>
            <div>
              <div className="font-display font-black text-sm text-white">WONDERLIGHT</div>
              <div className="text-[10px] text-emerald-400 tracking-wider font-semibold uppercase">Ambassador Portal</div>
            </div>
          </Link>

          {/* Ambassador Quick Profile Card */}
          <div className="p-3.5 rounded-2xl glass-card border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {ambassadorProfile?.ambassadorId || 'WLA-KIIT-024'}
              </span>
              <span className="text-xs font-black text-amber-400">
                Rank #{ambassadorProfile?.rank || 1}
              </span>
            </div>

            <div>
              <div className="font-display font-bold text-white text-sm truncate">
                {ambassadorProfile?.name || 'Aarav Sharma'}
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                {ambassadorProfile?.college || 'KIIT University'}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[10px] uppercase">Tier</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1 text-[11px]">
                <span>{levelCfg.badge}</span>
                <span>{levelCfg.name}</span>
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-glow-emerald'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-slate-800/80 space-y-2 mt-4">
          <Link
            href="/campus-ambassador"
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <span>Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {hasRole(['SUPER_ADMIN', 'PROGRAM_MANAGER', 'EVENT_MANAGER', 'MARKETING_MANAGER', 'FINANCE_MANAGER', 'MODERATOR']) && (
            <Link
              href="/admin/dashboard"
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-amber-400 hover:bg-amber-950/30 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Portal</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between glass-panel sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl glass-input text-slate-300 hover:text-white"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2 text-xs truncate">
              <span className="hidden sm:inline text-slate-400">Ambassador Portal</span>
              <span className="hidden sm:inline text-slate-700">/</span>
              <span className="text-xs font-bold text-white capitalize truncate">{pathname.split('/').pop() || 'Dashboard'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] sm:text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span><strong className="text-emerald-400 font-bold">{ambassadorProfile?.xp.toLocaleString() || 0} XP</strong></span>
            </div>

            <Link
              href="/campus-ambassador"
              className="p-2 rounded-xl glass-input text-slate-400 hover:text-white"
              title="View Public Site"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden glass-panel border-b border-slate-800 p-4 space-y-3 z-40 animate-in slide-in-from-top-2">
            <div className="p-3 rounded-xl glass-card border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">{ambassadorProfile?.name || 'Aarav Sharma'}</div>
                <div className="text-[10px] text-slate-400">{ambassadorProfile?.college || 'KIIT University'}</div>
              </div>
              <span className="text-xs font-bold text-amber-400">Rank #{ambassadorProfile?.rank || 1}</span>
            </div>

            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-glow-emerald'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <Link
                href="/campus-ambassador"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                <span>Public Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              {hasRole(['SUPER_ADMIN', 'PROGRAM_MANAGER', 'EVENT_MANAGER', 'MARKETING_MANAGER', 'FINANCE_MANAGER', 'MODERATOR']) && (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-amber-400"
                >
                  <span className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin Portal</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
