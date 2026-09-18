'use client';

import React, { useState, useEffect } from 'react';
import { Mail, RefreshCw, AlertCircle, CheckCircle2, Search, Filter, ShieldCheck, ArrowRight, RotateCw, Send } from 'lucide-react';
import { EmailLogEntry } from '@/lib/services/emailLogsStore';

export default function AdminEmailLogsPage() {
  const [logs, setLogs] = useState<EmailLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/email-logs');
      const data = await res.json();
      if (data.success && data.logs) {
        setLogs(data.logs);
      }
    } catch (err) {
      console.warn('Failed to fetch email logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleRetry = async (logId: string) => {
    setRetryingId(logId);
    setNotice(null);
    try {
      const res = await fetch('/api/admin/email-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'retry', logId }),
      });
      const data = await res.json();
      if (data.success) {
        setNotice({ type: 'success', message: data.message || 'Email retry dispatched successfully.' });
      } else {
        setNotice({ type: 'error', message: data.error || 'Email retry failed.' });
      }
      fetchLogs();
    } catch (err: any) {
      setNotice({ type: 'error', message: 'Failed to reach server for retry.' });
    } finally {
      setRetryingId(null);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || log.emailType.toLowerCase().includes(typeFilter.toLowerCase());
    const matchesSearch =
      log.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.applicationId && log.applicationId.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesType && matchesSearch;
  });

  const totalCount = logs.length;
  const sentCount = logs.filter((l) => l.status === 'SENT').length;
  const failedCount = logs.filter((l) => l.status === 'FAILED').length;
  const simulatedCount = logs.filter((l) => l.status === 'SIMULATED').length;

  return (
    <div className="space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-display font-black text-white uppercase tracking-tight flex items-center gap-2.5">
            <Mail className="w-7 h-7 text-emerald-400" />
            <span>TRANSACTIONAL EMAIL LOGS</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Real-time audit log of all system emails dispatched via <code className="text-amber-300 font-mono">wonderlightadventure@gmail.com</code>
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          <span>REFRESH LOGS</span>
        </button>
      </div>

      {notice && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center justify-between animate-in fade-in ${
            notice.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {notice.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
            <span>{notice.message}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-xs opacity-70 hover:opacity-100">
            ✕
          </button>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Dispatched</span>
          <div className="text-2xl font-black text-white">{totalCount}</div>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/30 space-y-1 bg-emerald-500/5">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Delivered (SMTP)</span>
          <div className="text-2xl font-black text-emerald-400">{sentCount}</div>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-rose-500/30 space-y-1 bg-rose-500/5">
          <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">Failed (Requires Retry)</span>
          <div className="text-2xl font-black text-rose-400">{failedCount}</div>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-amber-500/30 space-y-1 bg-amber-500/5">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">Simulated / Fallback</span>
          <div className="text-2xl font-black text-amber-400">{simulatedCount}</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search recipient, subject, App ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="SENT">SENT (Real Nodemailer)</option>
            <option value="FAILED">FAILED (Error)</option>
            <option value="SIMULATED">SIMULATED</option>
            <option value="RETRYING">RETRYING</option>
          </select>
        </div>

        <div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Email Types</option>
            <option value="Application Received">Application Received</option>
            <option value="Selection Notification">Selection Notification</option>
            <option value="Shortlisted Notification">Shortlisted</option>
            <option value="Interview Notification">Interview</option>
            <option value="Waitlisted Notification">Waitlisted</option>
            <option value="Not Selected Notification">Not Selected</option>
            <option value="Event Registration">Event Registration</option>
            <option value="Event Reminder">Event Reminder</option>
            <option value="Mission Notification">Mission</option>
            <option value="Reward Unlocked">Reward</option>
            <option value="Certificate Issued">Certificate</option>
            <option value="OTP Verification">OTP Verification</option>
            <option value="Test Email">Test Email</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3.5">Recipient</th>
                <th className="p-3.5">Email Type</th>
                <th className="p-3.5">Subject</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No email logs found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isOTP = log.emailType === 'OTP Verification';
                  return (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5">
                        <div className="font-semibold text-white">{log.recipient}</div>
                        {log.applicationId && (
                          <div className="text-[10px] font-mono text-emerald-400">{log.applicationId}</div>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium text-[11px] border border-slate-700">
                          {log.emailType}
                        </span>
                      </td>
                      <td className="p-3.5 max-w-xs truncate text-slate-200" title={log.subject}>
                        {log.subject}
                        {log.errorDetails && (
                          <div className="text-[10px] text-rose-400 truncate mt-0.5" title={log.errorDetails}>
                            Error: {log.errorDetails}
                          </div>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full font-bold text-[10px] tracking-wide inline-flex items-center gap-1 border ${
                            log.status === 'SENT'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : log.status === 'FAILED'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                              : log.status === 'RETRYING'
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                              : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              log.status === 'SENT'
                                ? 'bg-emerald-400'
                                : log.status === 'FAILED'
                                ? 'bg-rose-400 animate-pulse'
                                : 'bg-amber-400'
                            }`}
                          />
                          <span>{log.status}</span>
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-400 text-[11px]">
                        {new Date(log.sentTime).toLocaleString()}
                      </td>
                      <td className="p-3.5 text-right">
                        {log.status === 'FAILED' && !isOTP ? (
                          <button
                            onClick={() => handleRetry(log.id)}
                            disabled={retryingId === log.id}
                            className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1.5 ml-auto cursor-pointer"
                          >
                            <RotateCw className={`w-3.5 h-3.5 ${retryingId === log.id ? 'animate-spin' : ''}`} />
                            <span>RETRY</span>
                          </button>
                        ) : (
                          <span className="text-slate-600 text-[11px]">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
