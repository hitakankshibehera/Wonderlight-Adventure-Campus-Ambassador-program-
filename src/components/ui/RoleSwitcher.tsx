'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/services/authContext';
import { Role } from '@/types';
import { dbService } from '@/lib/services/db';
import { Shield, UserCheck, RefreshCw, X, ChevronUp } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { user, role, loginAs } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  const roles: { role: Role; label: string; desc: string; color: string }[] = [
    { role: 'SUPER_ADMIN', label: 'Super Admin', desc: 'Full root access to all portals & controls', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    { role: 'PROGRAM_MANAGER', label: 'Program Manager', desc: 'Applications, selection rounds & review', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    { role: 'EVENT_MANAGER', label: 'Event Manager', desc: 'Events, QR attendance & check-ins', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
    { role: 'MARKETING_MANAGER', label: 'Marketing Lead', desc: 'Referral tracking, campaigns & CMS', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
    { role: 'FINANCE_MANAGER', label: 'Finance Lead', desc: 'Reward approvals, commissions & payouts', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
    { role: 'MODERATOR', label: 'Moderator', desc: 'Mission proofs & community moderation', color: 'text-pink-400 bg-pink-500/10 border-pink-500/30' },
    { role: 'AMBASSADOR', label: 'Ambassador (Aarav - KIIT)', desc: 'Dashboard, referrals, missions, QR pass', color: 'text-emerald-300 bg-emerald-950/40 border-emerald-400/40' },
    { role: 'APPLICANT', label: 'Applicant (Meera - COEP)', desc: 'Application tracking & status view', color: 'text-slate-300 bg-slate-800/60 border-slate-600/40' },
  ];

  const handleResetData = () => {
    if (window.confirm('Reset all demo data (applicants, ambassadors, events, missions, rewards) to default seed?')) {
      setResetting(true);
      dbService.resetToDefaultSeed();
      setTimeout(() => {
        setResetting(false);
        window.location.reload();
      }, 500);
    }
  };

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-50 font-sans">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full glass-panel border border-emerald-500/40 text-emerald-400 shadow-glow-emerald hover:bg-emerald-950/50 transition-all text-xs font-semibold"
          title="Switch role for testing"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <img src="/wla-logo.png" alt="WLA Logo" className="w-5 h-5 rounded-full object-cover border border-emerald-400/60 animate-pulse" />
          <span className="hidden xs:inline sm:inline">Role: </span>
          <strong className="text-white capitalize">{role.toLowerCase().replace(/_/g, ' ')}</strong>
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
      ) : (
        <div className="w-[calc(100vw-1.5rem)] max-w-[340px] sm:w-80 rounded-2xl glass-panel border border-slate-700/70 p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Role Switcher & Demo Mode</h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="my-2.5 text-xs text-slate-400">
            Currently logged in as: <br />
            <span className="text-white font-medium">{user?.displayName || 'Guest'}</span>
          </div>

          <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
            {roles.map((item) => {
              const active = role === item.role;
              return (
                <button
                  key={item.role}
                  onClick={() => {
                    loginAs(item.role);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-xl text-xs transition-all border flex items-start gap-2.5 ${
                    active
                      ? `${item.color} ring-1 ring-emerald-400/50 font-semibold shadow-sm`
                      : 'border-slate-800/80 bg-slate-900/40 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <UserCheck className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${active ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <div>
                    <div className="font-medium text-white">{item.label}</div>
                    <div className="text-[10px] text-slate-400 leading-tight">{item.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <button
              onClick={handleResetData}
              disabled={resetting}
              className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-amber-400 transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${resetting ? 'animate-spin' : ''}`} />
              <span>Reset Demo Seed</span>
            </button>
            <span className="text-[10px] text-slate-500">v1.0 • Wonderlight</span>
          </div>
        </div>
      )}
    </div>
  );
};
