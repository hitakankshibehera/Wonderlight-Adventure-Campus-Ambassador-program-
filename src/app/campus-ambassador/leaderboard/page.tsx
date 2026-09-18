'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Trophy,
  Medal,
  Award,
  Filter,
  Search,
  Sparkles,
  Flame,
  ShieldCheck,
  Building,
  MapPin,
  Users,
} from 'lucide-react';
import { dbService } from '@/lib/services/db';
import { Ambassador } from '@/types';

export default function PublicLeaderboardPage() {
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [filterRegion, setFilterRegion] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const refresh = () => {
      setAmbassadors(dbService.getAmbassadors());
    };
    refresh();
    return dbService.subscribe(refresh);
  }, []);

  const regions = Array.from(new Set(ambassadors.map((a) => a.state)));

  const filteredAmbassadors = ambassadors.filter((a) => {
    const matchesRegion = filterRegion === 'ALL' || a.state === filterRegion;
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.ambassadorId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto font-sans space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Trophy className="w-3.5 h-3.5" />
          <span>National Rankings & Recognition</span>
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-white tracking-tight uppercase">
          WONDERLIGHT LEADERBOARD
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Celebrating the highest achieving student leaders driving youth adventures, verified community growth, and expeditions across India.
        </p>
      </div>

      {/* Top 3 Podium Cards */}
      {ambassadors.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4">
          {/* Rank 2 (Silver) */}
          <div className="order-2 md:order-1 glass-panel p-6 rounded-3xl border border-slate-700/80 text-center space-y-4 shadow-xl">
            <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-slate-300 shadow-md">
              <Image src={ambassadors[1].avatarUrl || ''} alt={ambassadors[1].name} fill className="object-cover" />
            </div>
            <div className="space-y-1">
              <div className="inline-block px-3 py-0.5 rounded-full bg-slate-300 text-slate-950 font-display font-black text-xs">
                #2 SILVER
              </div>
              <h3 className="font-display font-bold text-white text-lg">{ambassadors[1].name}</h3>
              <p className="text-xs text-slate-400">{ambassadors[1].college}</p>
            </div>
            <div className="p-3 rounded-2xl glass-card text-center">
              <div className="text-xl font-display font-black text-slate-200">{ambassadors[1].xp.toLocaleString()} XP</div>
              <div className="text-[10px] text-slate-400">{ambassadors[1].stats.bookings} Bookings • {ambassadors[1].stats.eventsAttended} Events</div>
            </div>
          </div>

          {/* Rank 1 (Gold) */}
          <div className="order-1 md:order-2 glass-panel p-8 rounded-3xl border-2 border-amber-500/60 text-center space-y-4 shadow-glow-gold relative bg-gradient-to-b from-amber-950/20 via-wonder-dark-900 to-wonder-dark-950">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="px-4 py-1 rounded-full bg-amber-400 text-slate-950 font-display font-black text-xs tracking-wider uppercase shadow-md flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 fill-slate-950" />
                <span>NATIONAL #1</span>
              </span>
            </div>

            <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-amber-400 shadow-glow-gold">
              <Image src={ambassadors[0].avatarUrl || ''} alt={ambassadors[0].name} fill className="object-cover" />
            </div>

            <div className="space-y-1">
              <div className="inline-block px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 font-display font-black text-xs">
                #1 CHAMPION
              </div>
              <h3 className="font-display font-black text-white text-xl">{ambassadors[0].name}</h3>
              <p className="text-xs text-slate-300">{ambassadors[0].college}</p>
              <div className="text-[11px] text-amber-400 font-semibold">{ambassadors[0].ambassadorId}</div>
            </div>

            <div className="p-4 rounded-2xl glass-card border border-amber-500/30 text-center">
              <div className="text-2xl font-display font-black text-amber-400">{ambassadors[0].xp.toLocaleString()} XP</div>
              <div className="text-xs text-slate-300">{ambassadors[0].stats.bookings} Confirmed Bookings</div>
            </div>
          </div>

          {/* Rank 3 (Bronze) */}
          <div className="order-3 md:order-3 glass-panel p-6 rounded-3xl border border-slate-700/80 text-center space-y-4 shadow-xl">
            <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-amber-700 shadow-md">
              <Image src={ambassadors[2].avatarUrl || ''} alt={ambassadors[2].name} fill className="object-cover" />
            </div>
            <div className="space-y-1">
              <div className="inline-block px-3 py-0.5 rounded-full bg-amber-700 text-white font-display font-black text-xs">
                #3 BRONZE
              </div>
              <h3 className="font-display font-bold text-white text-lg">{ambassadors[2].name}</h3>
              <p className="text-xs text-slate-400">{ambassadors[2].college}</p>
            </div>
            <div className="p-3 rounded-2xl glass-card text-center">
              <div className="text-xl font-display font-black text-amber-600">{ambassadors[2].xp.toLocaleString()} XP</div>
              <div className="text-[10px] text-slate-400">{ambassadors[2].stats.bookings} Bookings • {ambassadors[2].stats.eventsAttended} Events</div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search ambassador or college..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl glass-input text-xs bg-wonder-dark-900 text-slate-200"
          >
            <option value="ALL">All India ({ambassadors.length})</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Complete Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-700/60 shadow-2xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">
            Complete Ambassador Roster ({filteredAmbassadors.length})
          </h3>
          <span className="text-[10px] text-slate-500">Updated Hourly</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {filteredAmbassadors.map((amb, index) => (
            <div
              key={amb.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-900/40 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-black text-xs ${
                  index === 0 ? 'bg-amber-400 text-slate-950 font-bold' :
                  index === 1 ? 'bg-slate-300 text-slate-950 font-bold' :
                  index === 2 ? 'bg-amber-700 text-white font-bold' :
                  'bg-slate-800 text-slate-400'
                }`}>
                  #{amb.rank}
                </div>

                <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-slate-700 flex-shrink-0">
                  <Image src={amb.avatarUrl || ''} alt={amb.name} fill className="object-cover" />
                </div>

                <div>
                  <div className="font-display font-bold text-white text-base flex items-center gap-2">
                    <span>{amb.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                      {amb.ambassadorId}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {amb.college} • {amb.city}, {amb.state}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 self-end sm:self-auto text-right">
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-widest">Level</div>
                  <div className="text-xs font-bold text-amber-400">{amb.level.replace('_', ' ')}</div>
                </div>

                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-widest">Bookings</div>
                  <div className="text-sm font-bold text-slate-200">{amb.stats.bookings}</div>
                </div>

                <div className="min-w-24">
                  <div className="text-xs text-slate-400 uppercase tracking-widest">Total XP</div>
                  <div className="text-lg font-display font-black text-emerald-400">
                    {amb.xp.toLocaleString()} XP
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredAmbassadors.length === 0 && (
        <div className="glass-panel p-12 sm:p-16 rounded-3xl text-center space-y-4 border border-slate-800">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Trophy className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-wide">
            LEADERBOARD
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto">
            No ambassador rankings available yet. Once active campus ambassadors earn XP from missions and event outreach, rankings will appear here automatically.
          </p>
        </div>
      )}
    </div>
  );
}
