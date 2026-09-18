'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Compass,
  LayoutDashboard,
  Users,
  FileCheck,
  Trophy,
  UserCheck,
  Calendar,
  CalendarDays,
  QrCode,
  Target,
  Gift,
  Award,
  Share2,
  Bell,
  Sliders,
  Image as ImageIcon,
  BarChart3,
  ShieldAlert,
  Settings,
  History,
  ExternalLink,
  ChevronDown,
  LogOut,
  Search,
  Shield,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/lib/services/authContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, logout } = useAuth();
  const [searchFilter, setSearchFilter] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const sidebarLinks = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Applications', href: '/admin/applications', icon: FileCheck, badge: 'Review' },
    { label: 'Selection Pipeline', href: '/admin/selection', icon: Users },
    { label: 'Publish Results', href: '/admin/results', icon: Trophy },
    { label: 'Ambassadors', href: '/admin/ambassadors', icon: UserCheck },
    { label: 'Events Manager', href: '/admin/events', icon: Calendar },
    { label: 'Event Calendar', href: '/admin/calendar', icon: CalendarDays },
    { label: 'QR Attendance', href: '/admin/attendance', icon: QrCode, highlight: true },
    { label: 'Missions & Proofs', href: '/admin/missions', icon: Target },
    { label: 'Rewards & Claims', href: '/admin/rewards', icon: Gift },
    { label: 'Certificates Studio', href: '/admin/certificates', icon: Award },
    { label: 'Referrals & Revenue', href: '/admin/referrals', icon: Share2 },
    { label: 'Announcements', href: '/admin/announcements', icon: Bell },
    { label: 'CMS & Section Toggles', href: '/admin/cms', icon: Sliders, highlight: true },
    { label: 'Gallery Albums', href: '/admin/gallery', icon: ImageIcon },
    { label: 'Analytics & Reports', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Roles & Access', href: '/admin/roles', icon: ShieldAlert },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
    { label: 'Audit Logs', href: '/admin/audit', icon: History },
  ];

  const filteredLinks = sidebarLinks.filter((l) =>
    l.label.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-wonder-dark-950 font-sans">
      {/* Admin Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 glass-panel border-r border-slate-800/80 p-5 flex-col justify-between flex-shrink-0 h-screen sticky top-0">
        <div className="space-y-4 flex flex-col min-h-0 flex-1">
          {/* Header Brand */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <Link href="/campus-ambassador" className="flex items-center gap-2.5 group">
              <div className="relative w-9 h-9 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-emerald-400 to-teal-400 shadow-glow-gold group-hover:scale-105 transition-transform flex-shrink-0 overflow-hidden">
                <img
                  src="/wla-logo.png"
                  alt="WLA - Wonderlight Adventure Company Logo"
                  className="w-full h-full object-cover rounded-full bg-black"
                />
              </div>
              <div>
                <span className="font-display font-black text-sm text-white tracking-wider">WONDERLIGHT</span>
                <span className="text-[10px] text-amber-400 font-bold block uppercase tracking-widest">Admin Portal</span>
              </div>
            </Link>

            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              v1.0
            </span>
          </div>

          {/* Quick User Identity Badge */}
          <div className="p-3 rounded-2xl glass-card border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-400">Authenticated Role</span>
              <span className="font-bold text-amber-400 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>{role.replace('_', ' ')}</span>
              </span>
            </div>
            <div className="text-xs font-semibold text-white truncate">{user?.displayName || 'Administrator'}</div>
            <div className="text-[10px] text-slate-500 truncate">{user?.email || 'admin@wonderlight.adventure'}</div>
          </div>

          {/* Quick Menu Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search sidebar modules..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl glass-input text-xs"
            />
          </div>

          {/* Navigation Links (scrollable) */}
          <nav className="space-y-1 overflow-y-auto pr-1 flex-1 no-scrollbar">
            {filteredLinks.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-glow-gold'
                      : item.highlight
                      ? 'text-emerald-400 hover:bg-emerald-950/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : item.highlight ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Switch to Public */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <Link
            href="/campus-ambassador"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            <span>Public Site</span>
          </Link>
          <Link
            href="/ambassador/dashboard"
            className="text-[11px] text-emerald-400 hover:underline"
          >
            Ambassador View →
          </Link>
        </div>
      </aside>

      {/* Main Admin Body */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between glass-panel sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-xl glass-input text-slate-300 hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2 text-xs truncate">
              <span className="hidden sm:inline text-slate-400">Wonderlight Admin</span>
              <span className="hidden sm:inline text-slate-700">/</span>
              <span className="text-white font-bold uppercase tracking-wider truncate">
                {pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden md:inline-block text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              Live DB
            </span>
            <Link
              href="/campus-ambassador"
              className="p-2 rounded-xl glass-input text-slate-400 hover:text-white text-xs flex items-center gap-1"
              title="Open Public Platform"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Site</span>
            </Link>
          </div>
        </header>

        {/* Mobile Admin Navigation Drawer */}
        {mobileSidebarOpen && (
          <div className="lg:hidden glass-panel border-b border-slate-800 p-4 space-y-3 z-40 max-h-[80vh] overflow-y-auto animate-in slide-in-from-top-2">
            <div className="p-3 rounded-xl glass-card border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Logged in as:</span>
              <span className="font-bold text-amber-400 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>{role.replace('_', ' ')}</span>
              </span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl glass-input text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
              {filteredLinks.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-glow-gold'
                        : item.highlight
                        ? 'text-emerald-400 bg-emerald-950/20'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <Link
                href="/campus-ambassador"
                onClick={() => setMobileSidebarOpen(false)}
                className="text-slate-300 hover:text-white flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                <span>Public Website</span>
              </Link>
              <Link
                href="/ambassador/dashboard"
                onClick={() => setMobileSidebarOpen(false)}
                className="text-emerald-400 hover:underline text-xs"
              >
                Ambassador View →
              </Link>
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
