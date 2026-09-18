'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  TrendingUp,
  Users,
  Target,
  Calendar,
  Gift,
  Award,
  Share2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  Copy,
  Check,
  ChevronRight,
  Flame,
  Clock,
} from 'lucide-react';
import { dbService } from '@/lib/services/db';
import { useAuth } from '@/lib/services/authContext';
import { LEVEL_CONFIGS } from '@/lib/services/seedData';
import { LevelBadgeIcon } from '@/components/ui/LevelBadgeIcon';
import { AnnouncementRecord, Mission, EventItem } from '@/types';

export default function AmbassadorDashboardPage() {
  const { ambassadorProfile } = useAuth();
  const [copied, setCopied] = useState(false);
  const [announcements, setAnnouncements] = useState<AnnouncementRecord[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);

  const [showDashboardCelebration, setShowDashboardCelebration] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setAnnouncements(dbService.getAnnouncements().slice(0, 2));
      setMissions(dbService.getMissions().slice(0, 3));
      setEvents(dbService.getEvents().slice(0, 2));
    };
    refresh();
    return dbService.subscribe(refresh);
  }, []);

  const defaultProfile = {
    id: 'amb-default',
    userId: 'user-default',
    ambassadorId: 'WLA-CAP-001',
    applicationId: 'WLA-2026-000',
    name: 'Ambassador Portal',
    email: 'ambassador@wonderlight.adventure',
    phone: '',
    college: 'Campus Representative',
    campus: 'Main Campus',
    city: 'India',
    state: 'India',
    level: 'EXPLORER' as const,
    xp: 0,
    rank: 1,
    referralCode: 'WLA-CAP-001',
    referralLink: 'https://wonderlight.adventure/r/WLA-CAP-001',
    stats: { clicks: 0, leads: 0, bookings: 0, revenue: 0, eventsAttended: 0, missionsCompleted: 0 },
    status: 'ACTIVE' as const,
    joinedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const profile = ambassadorProfile || dbService.getAmbassadorById('WLA-KIIT-024') || defaultProfile;
  const levelCfg = LEVEL_CONFIGS[profile?.level || 'EXPLORER'] || LEVEL_CONFIGS['EXPLORER'];

  // Next level calculation
  let nextLevelName = 'VOYAGER';
  let targetXP = 1000;
  if (profile?.level === 'VOYAGER') {
    nextLevelName = 'TRAILBLAZER';
    targetXP = 2500;
  } else if (profile?.level === 'TRAILBLAZER') {
    nextLevelName = 'WONDERLIGHT CAMPUS STAR';
    targetXP = 5000;
  } else if (profile?.level === 'WONDERLIGHT_CAMPUS_STAR') {
    nextLevelName = 'MAX LEVEL';
    targetXP = profile?.xp || 0;
  }

  const progressPct = Math.min(100, Math.round((profile.xp / targetXP) * 100));

  const copyReferralUrl = () => {
    navigator.clipboard.writeText(profile.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Welcome Hero Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl relative overflow-hidden bg-gradient-to-r from-emerald-950/30 via-wonder-dark-900 to-wonder-dark-950">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Campus Lead • Cohort 2026–27</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-display font-black text-white">
              WELCOME BACK, {profile.name.toUpperCase()}!
            </h1>

            <p className="text-xs sm:text-sm text-slate-300">
              Campus Ambassador at <strong>{profile.college}</strong> ({profile.campus}) • Ambassador ID: <code className="text-emerald-400 font-bold">{profile.ambassadorId}</code>
            </p>
          </div>

          {/* Share Referral Link Quick Box */}
          <div className="p-4 rounded-2xl glass-card border-emerald-500/30 max-w-sm w-full space-y-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Your Unique Referral Link</span>
              <span className="text-emerald-400 font-semibold">{profile.referralCode}</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={profile.referralLink}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs font-mono text-slate-300"
              />
              <button
                onClick={copyReferralUrl}
                className="p-2.5 rounded-xl bg-emerald-500 text-slate-950 hover:brightness-110 shadow-glow-emerald flex-shrink-0"
                title="Copy Link"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="text-[10px] text-slate-400">
              Share with students to earn 8-15% commission + 250 XP per booking.
            </div>
          </div>
        </div>

        {/* Level Progression Progress Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <LevelBadgeIcon level={profile.level} size="sm" />
              <span className="font-bold text-white uppercase">{levelCfg.name}</span>
              <span className="text-slate-400">({profile.xp.toLocaleString()} XP)</span>
            </div>

            <div className="text-slate-300 text-[11px]">
              Next Rank: <strong className="text-amber-400">{nextLevelName}</strong> ({targetXP.toLocaleString()} XP)
            </div>
          </div>

          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl glass-card border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total XP</div>
          <div className="text-xl sm:text-2xl font-display font-black text-emerald-400 mt-1">
            {profile.xp.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">National Rank #{profile.rank}</div>
        </div>

        <div className="p-4 rounded-2xl glass-card border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Link Clicks</div>
          <div className="text-xl sm:text-2xl font-display font-black text-cyan-400 mt-1">
            {profile.stats.clicks}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Unique Visitors</div>
        </div>

        <div className="p-4 rounded-2xl glass-card border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Verified Leads</div>
          <div className="text-xl sm:text-2xl font-display font-black text-teal-400 mt-1">
            {profile.stats.leads}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Trip Inquiries</div>
        </div>

        <div className="p-4 rounded-2xl glass-card border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Bookings</div>
          <div className="text-xl sm:text-2xl font-display font-black text-amber-400 mt-1">
            {profile.stats.bookings}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Confirmed Treks</div>
        </div>

        <div className="p-4 rounded-2xl glass-card border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Revenue Attributed</div>
          <div className="text-xl sm:text-2xl font-display font-black text-purple-400 mt-1">
            ₹{(profile.stats.revenue / 1000).toFixed(0)}k
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Total booking sales</div>
        </div>

        <div className="p-4 rounded-2xl glass-card border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Missions Done</div>
          <div className="text-xl sm:text-2xl font-display font-black text-pink-400 mt-1">
            {profile.stats.missionsCompleted}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">{profile.stats.eventsAttended} events attended</div>
        </div>
      </div>

      {/* Announcements Broadcast Drawer */}
      {announcements.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Latest Program Announcements</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.map((ann) => (
              <div key={ann.id} className="p-4 rounded-2xl glass-card border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {ann.category}
                  </span>
                  <span className="text-slate-500">{new Date(ann.createdAt).toLocaleDateString()}</span>
                </div>
                <h4 className="font-display font-bold text-white text-sm">{ann.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{ann.content}</p>
                <div className="text-[10px] text-slate-500 pt-1">From: {ann.authorName}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Missions & Registered Events Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Missions */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>Active Campus Missions</span>
            </h3>
            <Link href="/ambassador/missions" className="text-xs text-emerald-400 hover:underline">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {missions.map((m) => (
              <div key={m.id} className="p-4 rounded-2xl glass-card flex items-center justify-between gap-4 border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 uppercase">
                      {m.category}
                    </span>
                    <span className="text-[10px] text-slate-400">Ends {m.endDate}</span>
                  </div>
                  <h4 className="font-display font-bold text-white text-xs sm:text-sm">{m.title}</h4>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-xs font-black text-emerald-400">+{m.xp} XP</div>
                  <Link
                    href="/ambassador/missions"
                    className="inline-block mt-1 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-bold hover:bg-emerald-500/30"
                  >
                    Submit Proof
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events & Passes */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Expeditions &amp; Gatherings</span>
            </h3>
            <Link href="/ambassador/events" className="text-xs text-cyan-400 hover:underline">
              Browse All →
            </Link>
          </div>

          <div className="space-y-3">
            {events.map((e) => (
              <div key={e.id} className="p-4 rounded-2xl glass-card flex items-center justify-between gap-4 border-slate-800">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                    {e.category}
                  </span>
                  <h4 className="font-display font-bold text-white text-xs sm:text-sm">{e.title}</h4>
                  <div className="text-[10px] text-slate-400">{e.date} • {e.city}</div>
                </div>

                <Link
                  href={`/campus-ambassador/events/${e.id}`}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold shadow-glow-emerald flex-shrink-0"
                >
                  Pass / Register
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DASHBOARD FIRST-TIME WELCOME CELEBRATION MODAL */}
      {showDashboardCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel w-full max-w-md rounded-3xl p-8 border border-emerald-500/40 shadow-2xl text-center space-y-5 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
            <div className="text-5xl">🎊</div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-widest">
                OFFICIAL ONBOARDING
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-black text-white uppercase mt-2">
                WELCOME TO THE WONDERLIGHT FAMILY!
              </h2>
              <p className="text-base font-bold text-amber-400">{profile.name}</p>
              <p className="text-xs text-slate-400 font-semibold">
                Campus Ambassador • {profile.college}
              </p>
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              Your journey starts here. Access your exclusive missions, share your custom referral code, earn commissions, and represent Wonderlight Adventure!
            </p>
            <button
              onClick={() => {
                setShowDashboardCelebration(false);
                dbService.markDashboardWelcomeCelebrationShown(profile.ambassadorId);
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-glow-emerald hover:brightness-110 cursor-pointer"
            >
              START ONBOARDING →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
