'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Menu, X, ArrowUpRight, ShieldCheck, User, Calendar, Trophy, Gift, FileText, Search, LogIn } from 'lucide-react';
import { useAuth } from '@/lib/services/authContext';
import { AuthModal } from '@/components/auth/AuthModal';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { role, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Overview', href: '/campus-ambassador' },
    { label: 'Events', href: '/campus-ambassador/events', icon: Calendar },
    { label: 'Results 2026', href: '/campus-ambassador/results', icon: Trophy, badge: 'New' },
    { label: 'Leaderboard', href: '/campus-ambassador/leaderboard' },
    { label: 'Rewards', href: '/campus-ambassador/rewards', icon: Gift },
    { label: 'FAQ', href: '/campus-ambassador/faq' },
    { label: 'Status', href: '/campus-ambassador/application-status', icon: Search },
  ];

  const fullName = user?.displayName || user?.email || '';
  const firstName = fullName.split(' ')[0] || 'Student';

  const isAdminRoute = pathname?.startsWith('/admin');
  const isAmbassadorRoute = pathname?.startsWith('/ambassador');

  if (isAdminRoute || isAmbassadorRoute) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-wonder-dark-950/80 border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/campus-ambassador" className="flex items-center gap-2.5 sm:gap-3 group">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full p-0.5 bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 shadow-glow-emerald group-hover:scale-105 transition-transform flex-shrink-0 overflow-hidden">
              <img
                src="/wla-logo.png"
                alt="WLA - Wonderlight Adventure Company Logo"
                className="w-full h-full object-cover rounded-full bg-black"
              />
            </div>
            <div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="font-display font-extrabold text-base sm:text-lg tracking-wider text-white">WONDERLIGHT</span>
                <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">CAP</span>
              </div>
              <div className="text-[9px] sm:text-[10px] tracking-widest text-slate-400 uppercase font-medium">Campus Ambassador Program</div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-emerald-400 bg-emerald-500/10 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {link.label}
                    {link.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {link.badge}
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Action Buttons / Dynamic User Profile (Requirement 5) */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-emerald-500/50 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Welcome, {firstName} 👋</span>
                  <span className="text-[10px] text-slate-400">▼</span>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 space-y-1">
                    <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                      <div className="font-bold text-white text-xs truncate">{fullName}</div>
                      <div className="text-[10px] text-emerald-400 capitalize">{role.toLowerCase().replace('_', ' ')}</div>
                    </div>

                    <Link
                      href="/campus-ambassador/application-status"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      View Profile / Status
                    </Link>

                    <Link
                      href="/campus-ambassador/apply"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      My Application
                    </Link>

                    <Link
                      href="/ambassador/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      My Ambassador Dashboard
                    </Link>

                    <Link
                      href="/ambassador/events"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      My Events
                    </Link>

                    <Link
                      href="/ambassador/rewards"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      My Rewards
                    </Link>

                    <Link
                      href="/ambassador/certificates"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="block px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      Certificates
                    </Link>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors border-t border-slate-800/80 mt-1"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>LOGIN</span>
                </button>

                <Link
                  href="/campus-ambassador/apply"
                  className="relative group overflow-hidden px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-glow-emerald hover:brightness-110 transition-all flex items-center gap-1.5"
                >
                  <span>APPLY NOW</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </>
            )}

            <Link
              href="/admin/dashboard"
              className="p-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/60 transition-colors"
              title="Admin Console"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl glass-input text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden glass-panel border-b border-slate-800 p-4 space-y-2 animate-in slide-in-from-top-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/70"
              >
                <div className="flex items-center justify-between">
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                      {link.badge}
                    </span>
                  )}
                </div>
              </Link>
            ))}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAuthModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400"
              >
                <LogIn className="w-4 h-4" />
                <span>Firebase Login / Sign Up</span>
              </button>

              <Link
                href="/ambassador/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl glass-input text-xs font-semibold text-slate-200"
              >
                <User className="w-4 h-4 text-emerald-400" />
                <span>Ambassador Portal</span>
              </Link>

              <Link
                href="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl glass-input text-xs font-semibold text-slate-200"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Admin Portal</span>
              </Link>

              <Link
                href="/campus-ambassador/apply"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold shadow-glow-emerald"
              >
                <span>APPLY NOW FOR 2026-27</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Render Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
};
