'use client';

import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Users,
  Lock,
  UserCheck,
} from 'lucide-react';
import { Role } from '@/types';
import { useAuth } from '@/lib/services/authContext';

export default function AdminRolesPage() {
  const { role, loginAs } = useAuth();

  const permissionsMatrix: {
    role: Role;
    name: string;
    applications: boolean;
    events: boolean;
    missions: boolean;
    rewards: boolean;
    cms: boolean;
    analytics: boolean;
    auditLogs: boolean;
  }[] = [
    { role: 'SUPER_ADMIN', name: 'Super Admin (Root)', applications: true, events: true, missions: true, rewards: true, cms: true, analytics: true, auditLogs: true },
    { role: 'PROGRAM_MANAGER', name: 'Program Manager', applications: true, events: true, missions: true, rewards: true, cms: true, analytics: true, auditLogs: true },
    { role: 'EVENT_MANAGER', name: 'Event Operations Lead', applications: false, events: true, missions: false, rewards: false, cms: false, analytics: true, auditLogs: false },
    { role: 'MARKETING_MANAGER', name: 'Marketing Lead', applications: false, events: false, missions: true, rewards: false, cms: true, analytics: true, auditLogs: false },
    { role: 'FINANCE_MANAGER', name: 'Finance & Payouts Lead', applications: false, events: false, missions: false, rewards: true, cms: false, analytics: true, auditLogs: false },
    { role: 'MODERATOR', name: 'Community Moderator', applications: true, events: false, missions: true, rewards: false, cms: false, analytics: false, auditLogs: false },
    { role: 'AMBASSADOR', name: 'Campus Ambassador', applications: false, events: false, missions: false, rewards: false, cms: false, analytics: false, auditLogs: false },
    { role: 'APPLICANT', name: 'Student Applicant', applications: false, events: false, missions: false, rewards: false, cms: false, analytics: false, auditLogs: false },
  ];

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-red-500/20 text-red-300 text-xs font-bold border border-red-500/30">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Security &amp; Authorization Matrix</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-display font-black text-white uppercase mt-1">
          ROLE-BASED ACCESS CONTROL (RBAC)
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Permissions enforced server-side and client-side across all modules to ensure segregation of administrative duties.
        </p>
      </div>

      {/* Permissions Matrix Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">
            Authorization Matrix Across 8 System Roles
          </h3>
          <span className="text-[10px] text-slate-500">Enforced by AuthContext &amp; Firestore Security Rules</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Role Title</th>
                <th className="p-4 text-center">Applications</th>
                <th className="p-4 text-center">Events &amp; QR</th>
                <th className="p-4 text-center">Missions</th>
                <th className="p-4 text-center">Rewards</th>
                <th className="p-4 text-center">CMS Copy</th>
                <th className="p-4 text-center">Analytics</th>
                <th className="p-4 text-center">Audit Logs</th>
                <th className="p-4 text-right">Switch Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {permissionsMatrix.map((item) => {
                const isCurrent = role === item.role;
                return (
                  <tr key={item.role} className={`transition-colors ${isCurrent ? 'bg-emerald-950/20' : 'hover:bg-slate-800/40'}`}>
                    <td className="p-4">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{item.name}</span>
                        {isCurrent && (
                          <span className="text-[9px] font-black px-2 py-0.2 rounded-full bg-emerald-500 text-slate-950">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.role}</div>
                    </td>

                    <td className="p-4 text-center">
                      {item.applications ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-700 mx-auto" />}
                    </td>

                    <td className="p-4 text-center">
                      {item.events ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-700 mx-auto" />}
                    </td>

                    <td className="p-4 text-center">
                      {item.missions ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-700 mx-auto" />}
                    </td>

                    <td className="p-4 text-center">
                      {item.rewards ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-700 mx-auto" />}
                    </td>

                    <td className="p-4 text-center">
                      {item.cms ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-700 mx-auto" />}
                    </td>

                    <td className="p-4 text-center">
                      {item.analytics ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-700 mx-auto" />}
                    </td>

                    <td className="p-4 text-center">
                      {item.auditLogs ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-700 mx-auto" />}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => loginAs(item.role)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                          isCurrent
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : 'glass-input text-slate-300 hover:text-white'
                        }`}
                      >
                        {isCurrent ? 'Active' : 'Test Role'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
