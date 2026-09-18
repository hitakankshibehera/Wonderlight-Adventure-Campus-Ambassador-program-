'use client';

import React, { useState, useEffect } from 'react';
import {
  Share2,
  DollarSign,
  TrendingUp,
  Search,
  Filter,
  ShieldCheck,
  AlertTriangle,
  Users,
} from 'lucide-react';
import { dbService } from '@/lib/services/db';
import { ReferralRecord, Ambassador } from '@/types';

export default function AdminReferralsPage() {
  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const refresh = () => {
      setReferrals(dbService.getReferrals());
      setAmbassadors(dbService.getAmbassadors());
    };
    refresh();
    return dbService.subscribe(refresh);
  }, []);

  const totalRevenue = referrals
    .filter((r) => r.status === 'BOOKED')
    .reduce((sum, r) => sum + (r.bookingAmount || 0), 0);

  const totalCommissions = referrals
    .filter((r) => r.status === 'BOOKED')
    .reduce((sum, r) => sum + (r.commissionAmount || 0), 0);

  const filteredReferrals = referrals.filter((r) => {
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchesSearch =
      r.referralCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.leadName && r.leadName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.tripInterest && r.tripInterest.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8 font-sans max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
          <Share2 className="w-3.5 h-3.5" />
          <span>Attribution &amp; Commercial Operations</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-display font-black text-white uppercase mt-1">
          REFERRALS &amp; REVENUE AUDIT
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Complete ledger of referral link clicks, verified leads, confirmed expedition bookings, and ambassador commissions.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-card border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Clicks Tracked</div>
          <div className="text-2xl sm:text-3xl font-display font-black text-cyan-400 mt-1">
            {referrals.length}
          </div>
          <div className="text-[10px] text-slate-500">Unique cookie logs</div>
        </div>

        <div className="p-5 rounded-2xl glass-card border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Inquiries / Leads</div>
          <div className="text-2xl sm:text-3xl font-display font-black text-teal-400 mt-1">
            {referrals.filter((r) => r.status === 'LEAD' || r.status === 'BOOKED').length}
          </div>
          <div className="text-[10px] text-slate-500">Verified student prospects</div>
        </div>

        <div className="p-5 rounded-2xl glass-card border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Attributed Sales</div>
          <div className="text-2xl sm:text-3xl font-display font-black text-emerald-400 mt-1">
            ₹{totalRevenue.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500">Across verified bookings</div>
        </div>

        <div className="p-5 rounded-2xl glass-card border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Commissions Payable</div>
          <div className="text-2xl sm:text-3xl font-display font-black text-amber-400 mt-1">
            ₹{totalCommissions.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500">8% to 15% tier rates</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search code, student name, trip..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl glass-input text-xs bg-wonder-dark-900 text-slate-200"
          >
            <option value="ALL">All Event Types</option>
            <option value="BOOKED">Booked</option>
            <option value="LEAD">Leads</option>
            <option value="CLICK">Clicks</option>
          </select>
        </div>
      </div>

      {/* Referrals Ledger Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Ambassador Code</th>
                <th className="p-4">Prospect / Visitor</th>
                <th className="p-4">Trip Interest</th>
                <th className="p-4">Status</th>
                <th className="p-4">Booking Amount</th>
                <th className="p-4">Commission</th>
                <th className="p-4">Timestamp &amp; Fraud Check</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredReferrals.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-emerald-400">{r.referralCode}</td>
                  <td className="p-4">
                    <div className="font-semibold text-white">{r.leadName || 'Organic Visitor'}</div>
                    <div className="text-[10px] text-slate-400">{r.leadEmail || r.visitorDevice || 'Desktop'}</div>
                  </td>
                  <td className="p-4 text-slate-300">{r.tripInterest || 'General Expedition Portal'}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      r.status === 'BOOKED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      r.status === 'LEAD' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-white">
                    {r.bookingAmount ? `₹${r.bookingAmount.toLocaleString()}` : '—'}
                  </td>
                  <td className="p-4 font-bold text-amber-400">
                    {r.commissionAmount ? `+₹${r.commissionAmount.toLocaleString()}` : '—'}
                  </td>
                  <td className="p-4 text-[11px] text-slate-400">
                    <div>{new Date(r.timestamp).toLocaleDateString()}</div>
                    <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Valid IP: {r.visitorIp || '103.xx'}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
