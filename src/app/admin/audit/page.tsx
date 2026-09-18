'use client';

import React, { useState, useEffect } from 'react';
import {
  History,
  ShieldCheck,
  Search,
  Clock,
  User,
  Filter,
} from 'lucide-react';
import { dbService } from '@/lib/services/db';
import { AuditLogRecord } from '@/types';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const refresh = () => {
      setLogs(dbService.getAuditLogs());
    };
    refresh();
    return dbService.subscribe(refresh);
  }, []);

  const filteredLogs = logs.filter((l) =>
    l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.entityType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.entityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.actorEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700">
            <History className="w-3.5 h-3.5 text-emerald-400" />
            <span>Compliance &amp; Governance Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-black text-white uppercase mt-1">
            SECURITY &amp; ADMINISTRATIVE AUDIT LOG
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Immutable trace of all administrative status changes, result publications, XP modifications, and credentials issued.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search action, actor, entity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Audit Event Ledger ({filteredLogs.length} events logged)</span>
          <span className="text-emerald-400 flex items-center gap-1 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Tamper-evident system log</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Action Event</th>
                <th className="p-4">Target Entity</th>
                <th className="p-4">Prior State</th>
                <th className="p-4">Updated State</th>
                <th className="p-4 text-right">Actor &amp; IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 text-slate-400 whitespace-nowrap">
                    <div>{new Date(log.timestamp).toLocaleDateString()}</div>
                    <div className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</div>
                  </td>

                  <td className="p-4">
                    <span className="font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      {log.action}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="font-semibold text-white">{log.entityType}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{log.entityId}</div>
                  </td>

                  <td className="p-4 text-slate-400 max-w-xs truncate">
                    {log.oldValue || '—'}
                  </td>

                  <td className="p-4 text-white font-medium max-w-xs truncate">
                    {log.newValue || '—'}
                  </td>

                  <td className="p-4 text-right text-slate-400">
                    <div className="text-white font-semibold">{log.actorEmail}</div>
                    <div className="text-[10px] text-slate-500">{log.ip || '103.xx'}</div>
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
