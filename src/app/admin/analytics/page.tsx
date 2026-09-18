'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  MapPin,
  Building,
  Sparkles,
} from 'lucide-react';
import { dbService } from '@/lib/services/db';
import { Applicant, Ambassador, EventItem, ReferralRecord } from '@/types';

export default function AdminAnalyticsPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'APPLICATIONS' | 'AMBASSADORS' | 'EVENTS' | 'BUSINESS'>('APPLICATIONS');

  useEffect(() => {
    const refresh = () => {
      setApplicants(dbService.getApplicants());
      setAmbassadors(dbService.getAmbassadors());
      setEvents(dbService.getEvents());
      setReferrals(dbService.getReferrals());
    };
    refresh();
    return dbService.subscribe(refresh);
  }, []);

  // Compute breakdown by state
  const stateBreakdown: Record<string, number> = {};
  applicants.forEach((a) => {
    stateBreakdown[a.state] = (stateBreakdown[a.state] || 0) + 1;
  });

  // Compute breakdown by course
  const courseBreakdown: Record<string, number> = {};
  applicants.forEach((a) => {
    const key = a.course.includes('B.Tech') ? 'B.Tech / Engg' :
                a.course.includes('BBA') ? 'BBA / Mgmt' :
                a.course.includes('Media') ? 'Media / Arts' : 'Commerce & Science';
    courseBreakdown[key] = (courseBreakdown[key] || 0) + 1;
  });

  const totalRevenue = ambassadors.reduce((acc, a) => acc + a.stats.revenue, 0);

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Operational Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-display font-black text-white uppercase mt-1">
          ANALYTICS &amp; BUSINESS REPORTING
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          In-depth breakdowns across admissions pipelines, regional ambassador activity, attendance yield, and commercial ROI.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        {[
          { key: 'APPLICATIONS', label: 'Applications Analytics', icon: Users },
          { key: 'AMBASSADORS', label: 'Ambassador Velocity', icon: Sparkles },
          { key: 'EVENTS', label: 'Event Attendance', icon: Calendar },
          { key: 'BUSINESS', label: 'Commercial Revenue', icon: DollarSign },
        ].map((t) => {
          const isActive = activeTab === t.key;
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 shadow-glow-emerald'
                  : 'glass-input text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: APPLICATIONS */}
      {activeTab === 'APPLICATIONS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in">
          {/* Applications by State */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Applications by State / Territory</span>
            </h3>

            <div className="space-y-3 pt-2">
              {Object.entries(stateBreakdown).map(([st, count]) => {
                const pct = Math.round((count / applicants.length) * 100);
                return (
                  <div key={st} className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>{st}</span>
                      <span className="font-bold text-white">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Applications by Discipline */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Building className="w-4 h-4 text-cyan-400" />
              <span>Candidate Study Disciplines</span>
            </h3>

            <div className="space-y-3 pt-2">
              {Object.entries(courseBreakdown).map(([course, count]) => {
                const pct = Math.round((count / applicants.length) * 100);
                return (
                  <div key={course} className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>{course}</span>
                      <span className="font-bold text-white">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AMBASSADORS */}
      {activeTab === 'AMBASSADORS' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 animate-in fade-in">
          <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">
            Ambassador Performance Ranking &amp; Points Velocity
          </h3>

          <div className="space-y-3">
            {ambassadors.map((amb, idx) => (
              <div key={amb.id} className="p-4 rounded-2xl glass-card flex items-center justify-between border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{amb.name}</div>
                    <div className="text-xs text-slate-400">{amb.college} ({amb.city})</div>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-right">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase">Bookings</div>
                    <div className="font-bold text-amber-400 text-sm">{amb.stats.bookings}</div>
                  </div>
                  <div className="min-w-24">
                    <div className="text-[10px] text-slate-400 uppercase">Total XP</div>
                    <div className="font-display font-black text-emerald-400 text-base">{amb.xp.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EVENTS */}
      {activeTab === 'EVENTS' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 animate-in fade-in">
          <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">
            Event Turnout &amp; Capacity Utilization
          </h3>

          <div className="space-y-4">
            {events.map((ev) => {
              const regPct = Math.round((ev.registeredCount / ev.capacity) * 100);
              return (
                <div key={ev.id} className="p-4 rounded-2xl glass-card border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-white text-sm">{ev.title}</span>
                    <span className="text-emerald-400 font-bold">{ev.registeredCount} / {ev.capacity} booked ({regPct}%)</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: `${regPct}%` }} />
                  </div>
                  <div className="text-[10px] text-slate-400 flex justify-between">
                    <span>{ev.city} • {ev.category}</span>
                    <span>{ev.date}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: COMMERCIAL BUSINESS */}
      {activeTab === 'BUSINESS' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider">
                Gross Attributed Sales Volume
              </h3>
              <p className="text-xs text-slate-400">Total verified sales facilitated through campus ambassadors</p>
            </div>
            <div className="text-right">
              <div className="text-2xl sm:text-3xl font-display font-black text-emerald-400">
                ₹{totalRevenue.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400">Paid departures attributed</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl glass-card border-slate-800">
              <div className="text-slate-400">Top Revenue City</div>
              <div className="text-lg font-bold text-white mt-1">Bhubaneswar (KIIT)</div>
              <div className="text-[10px] text-emerald-400 font-semibold">₹2,38,000 attributed</div>
            </div>

            <div className="p-4 rounded-2xl glass-card border-slate-800">
              <div className="text-slate-400">Second Revenue City</div>
              <div className="text-lg font-bold text-white mt-1">Mumbai (IIT Bombay)</div>
              <div className="text-[10px] text-emerald-400 font-semibold">₹1,57,500 attributed</div>
            </div>

            <div className="p-4 rounded-2xl glass-card border-slate-800">
              <div className="text-slate-400">Third Revenue City</div>
              <div className="text-lg font-bold text-white mt-1">Chennai (SRMIST)</div>
              <div className="text-[10px] text-emerald-400 font-semibold">₹1,19,000 attributed</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
