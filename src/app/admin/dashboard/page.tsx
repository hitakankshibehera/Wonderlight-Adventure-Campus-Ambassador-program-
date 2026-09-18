'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  FileCheck,
  Trophy,
  Calendar,
  DollarSign,
  TrendingUp,
  Award,
  Gift,
  QrCode,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { dbService } from '@/lib/services/db';
import { Applicant, Ambassador, EventItem, RewardClaim, MissionSubmission } from '@/types';

export default function AdminDashboardPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [claims, setClaims] = useState<RewardClaim[]>([]);
  const [submissions, setSubmissions] = useState<MissionSubmission[]>([]);

  useEffect(() => {
    const refresh = () => {
      setApplicants(dbService.getApplicants());
      setAmbassadors(dbService.getAmbassadors());
      setEvents(dbService.getEvents());
      setClaims(dbService.getRewardClaims());
      setSubmissions(dbService.getMissionSubmissions());
    };
    refresh();
    return dbService.subscribe(refresh);
  }, []);

  const totalApplications = applicants.length;
  const underReviewCount = applicants.filter((a) => a.status === 'UNDER_REVIEW').length;
  const shortlistedCount = applicants.filter((a) => a.status === 'SHORTLISTED' || a.status === 'INTERVIEW').length;
  const selectedCount = applicants.filter((a) => a.status === 'SELECTED').length;

  const totalRevenue = ambassadors.reduce((acc, a) => acc + a.stats.revenue, 0);
  const totalBookings = ambassadors.reduce((acc, a) => acc + a.stats.bookings, 0);
  const totalReferrals = ambassadors.reduce((acc, a) => acc + a.stats.clicks, 0);

  const pendingSubmissions = submissions.filter((s) => s.status === 'PENDING').length;
  const pendingClaims = claims.filter((c) => c.status === 'PENDING').length;

  return (
    <div className="space-y-8 font-sans max-w-7xl mx-auto">
      {/* Page Title & Operational Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Executive Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-black text-white uppercase tracking-tight mt-1">
            EXECUTIVE OPERATIONS DASHBOARD
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time telemetry across nationwide campus applications, ambassadors, events, and attributed revenue.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/attendance"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-xs shadow-glow-cyan flex items-center gap-1.5"
          >
            <QrCode className="w-4 h-4" />
            <span>SCAN QR CODE</span>
          </Link>

          <Link
            href="/admin/applications"
            className="px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-glow-emerald hover:brightness-110 flex items-center gap-1.5"
          >
            <FileCheck className="w-4 h-4" />
            <span>REVIEW APPLICANTS</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="p-5 rounded-2xl glass-card border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total Applicants</div>
          <div className="text-2xl sm:text-3xl font-display font-black text-white">{totalApplications}</div>
          <div className="text-[10px] text-slate-500">{underReviewCount} under review</div>
        </div>

        <div className="p-5 rounded-2xl glass-card border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Shortlisted</div>
          <div className="text-2xl sm:text-3xl font-display font-black text-cyan-400">{shortlistedCount}</div>
          <div className="text-[10px] text-slate-500">Screening stage</div>
        </div>

        <div className="p-5 rounded-2xl glass-card border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Active Ambassadors</div>
          <div className="text-2xl sm:text-3xl font-display font-black text-emerald-400">{ambassadors.length}</div>
          <div className="text-[10px] text-slate-500">In 50+ campuses</div>
        </div>

        <div className="p-5 rounded-2xl glass-card border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Attributed Bookings</div>
          <div className="text-2xl sm:text-3xl font-display font-black text-amber-400">{totalBookings}</div>
          <div className="text-[10px] text-slate-500">{totalReferrals} referral clicks</div>
        </div>

        <div className="p-5 rounded-2xl glass-card border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Attributed Revenue</div>
          <div className="text-2xl sm:text-3xl font-display font-black text-purple-400">
            ₹{(totalRevenue / 1000).toFixed(0)}k
          </div>
          <div className="text-[10px] text-slate-500">Gross sales volume</div>
        </div>

        <div className="p-5 rounded-2xl glass-card border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Pending Tasks</div>
          <div className="text-2xl sm:text-3xl font-display font-black text-pink-400">
            {pendingSubmissions + pendingClaims}
          </div>
          <div className="text-[10px] text-slate-500">{pendingSubmissions} proofs, {pendingClaims} claims</div>
        </div>
      </div>

      {/* Visual Funnel & Application Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Funnel Progression */}
        <div className="lg:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-display font-bold text-white uppercase tracking-wider">
                Candidate Conversion Funnel
              </h3>
              <p className="text-xs text-slate-400">Cohort 2026-27 progression from submission to appointment</p>
            </div>
            <Link href="/admin/selection" className="text-xs text-emerald-400 hover:underline">
              Open Kanban →
            </Link>
          </div>

          <div className="space-y-4">
            {/* Step 1: Submissions */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>1. Applications Submitted</span>
                <span className="font-bold text-white">{totalApplications} (100%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full w-full" />
              </div>
            </div>

            {/* Step 2: Under Review */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>2. Under Review</span>
                <span className="font-bold text-white">{totalApplications - 1} (90%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full w-[90%]" />
              </div>
            </div>

            {/* Step 3: Shortlisted */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>3. Shortlisted &amp; Interviews</span>
                <span className="font-bold text-white">{shortlistedCount + selectedCount} ({Math.round(((shortlistedCount + selectedCount) / totalApplications) * 100)}%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-teal-400 rounded-full"
                  style={{ width: `${Math.round(((shortlistedCount + selectedCount) / totalApplications) * 100)}%` }}
                />
              </div>
            </div>

            {/* Step 4: Appointed */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>4. Selected Campus Ambassadors</span>
                <span className="font-bold text-emerald-400">{selectedCount} ({Math.round((selectedCount / totalApplications) * 100)}%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${Math.round((selectedCount / totalApplications) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Operational Links */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-display font-bold text-white uppercase tracking-wider">
            Operational Shortcuts
          </h3>

          <div className="space-y-2.5">
            <Link
              href="/admin/applications"
              className="p-3.5 rounded-2xl glass-card flex items-center justify-between hover:border-emerald-500/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-white">Review Pending Applications</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>

            <Link
              href="/admin/attendance"
              className="p-3.5 rounded-2xl glass-card flex items-center justify-between hover:border-cyan-500/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <QrCode className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold text-white">QR Code Event Check-in</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>

            <Link
              href="/admin/results"
              className="p-3.5 rounded-2xl glass-card flex items-center justify-between hover:border-amber-500/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-white">Publish Results Batch</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>

            <Link
              href="/admin/cms"
              className="p-3.5 rounded-2xl glass-card flex items-center justify-between hover:border-purple-500/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-semibold text-white">Toggle Homepage Sections</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>

            <Link
              href="/admin/rewards"
              className="p-3.5 rounded-2xl glass-card flex items-center justify-between hover:border-pink-500/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Gift className="w-4 h-4 text-pink-400" />
                <span className="text-xs font-semibold text-white">Fulfill Reward Claims ({pendingClaims})</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Applications Preview */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">
              Latest Applications Received
            </h3>
            <p className="text-[11px] text-slate-500">Sorted by submission timestamp</p>
          </div>
          <Link href="/admin/applications" className="text-xs text-emerald-400 font-semibold hover:underline">
            View All Applications →
          </Link>
        </div>

        <div className="divide-y divide-slate-800/80">
          {applicants.slice(0, 5).map((app) => (
            <div key={app.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{app.fullName}</span>
                  <code className="text-slate-400 text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                    {app.applicationId}
                  </code>
                </div>
                <div className="text-slate-400 text-[11px]">{app.college} • {app.city}, {app.state}</div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  app.status === 'SELECTED' ? 'bg-emerald-500/20 text-emerald-300' :
                  app.status === 'INTERVIEW' ? 'bg-amber-500/20 text-amber-300' :
                  app.status === 'SHORTLISTED' ? 'bg-teal-500/20 text-teal-300' :
                  app.status === 'WAITLISTED' ? 'bg-amber-700/20 text-amber-400' :
                  'bg-slate-800 text-slate-400'
                }`}>
                  {app.status}
                </span>

                <Link
                  href="/admin/applications"
                  className="p-1.5 rounded-lg glass-input text-slate-400 hover:text-white"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
