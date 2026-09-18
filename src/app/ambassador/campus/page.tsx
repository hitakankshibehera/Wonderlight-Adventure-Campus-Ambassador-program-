'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  Users,
  Calendar,
  Target,
  Trophy,
  Sparkles,
  ArrowRight,
  MapPin,
  Flame,
  MessageSquare,
  Compass,
} from 'lucide-react';
import { useAuth } from '@/lib/services/authContext';
import { dbService } from '@/lib/services/db';
import { Ambassador, EventItem, Mission, AnnouncementRecord } from '@/types';

export default function MyCampusPage() {
  const { ambassadorProfile, user } = useAuth();
  const [campusAmbassadors, setCampusAmbassadors] = useState<Ambassador[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementRecord[]>([]);

  const collegeName = ambassadorProfile?.college || 'KIIT University';
  const campusCity = ambassadorProfile?.city || 'Bhubaneswar';

  useEffect(() => {
    const refresh = () => {
      const allAmb = dbService.getAmbassadors();
      const filtered = allAmb.filter(
        (a) => a.college.toLowerCase() === collegeName.toLowerCase() || a.city.toLowerCase() === campusCity.toLowerCase()
      );
      setCampusAmbassadors(filtered.length > 0 ? filtered : allAmb.slice(0, 3));
      setEvents(dbService.getEvents().slice(0, 3));
      setMissions(dbService.getMissions().slice(0, 3));
      setAnnouncements(dbService.getAnnouncements().slice(0, 2));
    };
    refresh();
    return dbService.subscribe(refresh);
  }, [collegeName, campusCity]);

  return (
    <div className="space-y-8 font-sans">
      {/* Campus Hero Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl relative overflow-hidden bg-gradient-to-r from-emerald-950/40 via-wonder-dark-900 to-wonder-dark-950">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              <Building2 className="w-3.5 h-3.5" />
              <span>Campus Chapter • {campusCity}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-display font-black text-white uppercase">
              {collegeName.toUpperCase()}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300">
              Official Wonderlight Ambassador Chapter • <code className="text-emerald-400 font-bold">{campusAmbassadors.length} Active Representatives</code>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/ambassador/events"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs shadow-glow-emerald hover:brightness-110 flex items-center gap-1.5"
            >
              <span>+ View Campus Events</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Campus Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-card border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Campus Ambassadors</div>
          <div className="text-2xl font-display font-black text-emerald-400 mt-1">
            {campusAmbassadors.length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Verified Chapter Leads</div>
        </div>

        <div className="p-4 rounded-2xl glass-card border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Campus Events</div>
          <div className="text-2xl font-display font-black text-cyan-400 mt-1">
            {events.length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Upcoming Gatherings</div>
        </div>

        <div className="p-4 rounded-2xl glass-card border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Active Missions</div>
          <div className="text-2xl font-display font-black text-amber-400 mt-1">
            {missions.length}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Campus Challenges</div>
        </div>

        <div className="p-4 rounded-2xl glass-card border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Chapter XP</div>
          <div className="text-2xl font-display font-black text-purple-400 mt-1">
            {campusAmbassadors.reduce((sum, a) => sum + (a.xp || 0), 0).toLocaleString()} XP
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Total Chapter Points</div>
        </div>
      </div>

      {/* Campus Ambassadors & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chapter Ambassadors */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Chapter Representatives</span>
          </h3>

          <div className="space-y-3">
            {campusAmbassadors.map((amb) => (
              <div key={amb.id} className="p-4 rounded-2xl glass-card flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden relative border border-slate-700 flex-shrink-0">
                    <img
                      src={amb.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                      alt={amb.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-display font-bold text-white text-xs sm:text-sm flex items-center gap-2">
                      <span>{amb.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                        {amb.ambassadorId}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">{amb.college}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-black text-emerald-400">{amb.xp.toLocaleString()} XP</div>
                  <div className="text-[10px] text-amber-400 font-semibold">{amb.level}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Campus Announcements & Insights */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Campus Announcements &amp; Insights</span>
          </h3>

          <div className="space-y-3">
            {announcements.map((ann) => (
              <div key={ann.id} className="p-4 rounded-2xl glass-card space-y-2 border-slate-800">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {ann.category}
                  </span>
                  <span className="text-slate-500">{new Date(ann.createdAt).toLocaleDateString()}</span>
                </div>
                <h4 className="font-display font-bold text-white text-xs sm:text-sm">{ann.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{ann.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
