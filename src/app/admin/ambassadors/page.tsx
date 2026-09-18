'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  UserCheck,
  Search,
  Filter,
  Plus,
  Minus,
  Sparkles,
  Shield,
  Award,
  DollarSign,
  TrendingUp,
  X,
} from 'lucide-react';
import { dbService } from '@/lib/services/db';
import { Ambassador, AmbassadorLevel } from '@/types';
import { useAuth } from '@/lib/services/authContext';

export default function AdminAmbassadorsPage() {
  const { user } = useAuth();
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAmb, setSelectedAmb] = useState<Ambassador | null>(null);

  // XP Adjust Modal
  const [xpAdjustModal, setXpAdjustModal] = useState<Ambassador | null>(null);
  const [xpDelta, setXpDelta] = useState(250);
  const [xpReason, setXpReason] = useState('Outstanding campus desk engagement');

  useEffect(() => {
    const refresh = () => {
      setAmbassadors(dbService.getAmbassadors());
    };
    refresh();
    return dbService.subscribe(refresh);
  }, []);

  const filteredAmbassadors = ambassadors.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.ambassadorId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdjustXP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!xpAdjustModal) return;

    dbService.adjustAmbassadorXP(xpAdjustModal.ambassadorId, xpDelta, xpReason);
    setXpAdjustModal(null);
  };

  const handleToggleStatus = (amb: Ambassador) => {
    const newStatus = amb.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    if (window.confirm(`Set status of ${amb.name} (${amb.ambassadorId}) to ${newStatus}?`)) {
      dbService.updateAmbassadorStatus(amb.ambassadorId, newStatus);
    }
  };

  const handleChangeLevel = (amb: Ambassador, newLevel: AmbassadorLevel) => {
    dbService.updateAmbassadorLevel(amb.ambassadorId, newLevel);
  };

  return (
    <div className="space-y-8 font-sans max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Collegiate Network Roster</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-black text-white uppercase mt-1">
            AMBASSADOR DIRECTORY &amp; XP CREDITS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Manage appointed campus representatives, adjust gamified points, update performance tiers, and inspect activity logs.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search ambassador or campus..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs"
          />
        </div>
      </div>

      {/* Ambassadors Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        <div className="p-4 border-b border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Active Ambassador Network ({filteredAmbassadors.length})</span>
          <span>Ranked by cumulative XP</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Ambassador ID</th>
                <th className="p-4">Name &amp; College</th>
                <th className="p-4">Level &amp; XP</th>
                <th className="p-4">Referral Code</th>
                <th className="p-4">Bookings &amp; Revenue</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAmbassadors.map((amb) => (
                <tr key={amb.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <span className="font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      {amb.ambassadorId}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="font-bold text-white text-sm">{amb.name}</div>
                    <div className="text-[11px] text-slate-400">{amb.college}</div>
                    <div className="text-[10px] text-slate-500">{amb.city}, {amb.state}</div>
                  </td>

                  <td className="p-4">
                    <div className="font-display font-black text-white text-sm">
                      {amb.xp.toLocaleString()} XP
                    </div>
                    <select
                      value={amb.level}
                      onChange={(e) => handleChangeLevel(amb, e.target.value as AmbassadorLevel)}
                      className="mt-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] text-amber-300 font-bold"
                    >
                      <option value="EXPLORER">Explorer</option>
                      <option value="VOYAGER">Voyager</option>
                      <option value="TRAILBLAZER">Trailblazer</option>
                      <option value="WONDERLIGHT_CAMPUS_STAR">Campus Star</option>
                    </select>
                  </td>

                  <td className="p-4 font-mono text-slate-300">
                    <div>{amb.referralCode}</div>
                    <div className="text-[10px] text-slate-500">{amb.stats.clicks} clicks</div>
                  </td>

                  <td className="p-4">
                    <div className="text-emerald-400 font-bold">{amb.stats.bookings} Bookings</div>
                    <div className="text-purple-400 text-[11px] font-semibold">₹{amb.stats.revenue.toLocaleString()}</div>
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => handleToggleStatus(amb)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        amb.status === 'ACTIVE'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30'
                      }`}
                    >
                      {amb.status}
                    </button>
                  </td>

                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => setXpAdjustModal(amb)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/40 font-bold text-[11px]"
                    >
                      ± Adjust XP
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* XP Adjustment Modal */}
      {xpAdjustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Adjust Ambassador Points</span>
                <h3 className="text-base font-display font-bold text-white">{xpAdjustModal.name}</h3>
                <span className="text-xs text-emerald-400 font-mono">{xpAdjustModal.ambassadorId}</span>
              </div>
              <button onClick={() => setXpAdjustModal(null)} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdjustXP} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1">
                  Point Adjustment Delta (+ or - XP)
                </label>
                <input
                  type="number"
                  required
                  value={xpDelta}
                  onChange={(e) => setXpDelta(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-sm font-bold text-emerald-400"
                />
                <span className="text-[10px] text-slate-500">Positive adds XP; negative deducts XP.</span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1">
                  Audit Reason / Justification *
                </label>
                <input
                  type="text"
                  required
                  value={xpReason}
                  onChange={(e) => setXpReason(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setXpAdjustModal(null)}
                  className="px-4 py-2 rounded-xl glass-input text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold shadow-glow-emerald"
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
