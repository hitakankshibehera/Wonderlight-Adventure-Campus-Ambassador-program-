'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  Award,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { dbService } from '@/lib/services/db';
import { Applicant, ApplicationStatus } from '@/types';
import { useAuth } from '@/lib/services/authContext';

export default function SelectionPipelinePage() {
  const { user } = useAuth();
  const [applicants, setApplicants] = useState<Applicant[]>([]);

  useEffect(() => {
    const refresh = () => {
      setApplicants(dbService.getApplicants());
    };
    refresh();
    return dbService.subscribe(refresh);
  }, []);

  const moveStage = (appId: string, nextStatus: ApplicationStatus) => {
    dbService.updateApplicantStatus(
      appId,
      nextStatus,
      `Moved along Kanban selection pipeline to ${nextStatus}`,
      user?.displayName || 'Administrator'
    );
  };

  const columns: { title: string; status: ApplicationStatus; nextStatus?: ApplicationStatus; color: string }[] = [
    { title: '1. New Submissions', status: 'SUBMITTED', nextStatus: 'UNDER_REVIEW', color: 'border-blue-500/40 text-blue-400' },
    { title: '2. Screening', status: 'UNDER_REVIEW', nextStatus: 'SHORTLISTED', color: 'border-purple-500/40 text-purple-400' },
    { title: '3. Shortlisted', status: 'SHORTLISTED', nextStatus: 'INTERVIEW', color: 'border-teal-500/40 text-teal-400' },
    { title: '4. Interview Stage', status: 'INTERVIEW', nextStatus: 'SELECTED', color: 'border-amber-500/40 text-amber-400' },
    { title: '5. Appointed Ambassadors', status: 'SELECTED', color: 'border-emerald-500/40 text-emerald-400' },
  ];

  return (
    <div className="space-y-8 font-sans max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
          <Users className="w-3.5 h-3.5" />
          <span>Cohort 2026–27 Workflow</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-display font-black text-white uppercase mt-1">
          SELECTION PIPELINE &amp; KANBAN
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Move candidates across stages from screening to final appointment. Moving to &quot;Appointed&quot; automatically provisions an ambassador ID.
        </p>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
        {columns.map((col) => {
          const colApplicants = applicants.filter((a) => a.status === col.status);

          return (
            <div
              key={col.status}
              className="glass-panel rounded-2xl p-4 border border-slate-800 space-y-3 min-h-[500px] flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className={`text-xs font-display font-bold uppercase tracking-wider ${col.color}`}>
                  {col.title}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {colApplicants.length}
                </span>
              </div>

              <div className="space-y-2.5 flex-1">
                {colApplicants.map((app) => (
                  <div
                    key={app.id}
                    className="p-3.5 rounded-xl glass-card border-slate-800 space-y-2 text-xs hover:border-slate-700"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{app.fullName}</span>
                      {app.evaluation?.overallScore && (
                        <span className="text-[10px] font-bold text-amber-400">
                          ★ {app.evaluation.overallScore}
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-400 truncate">{app.college}</div>
                    <div className="text-[10px] text-slate-500">{app.city} • @{app.instagram}</div>

                    {col.nextStatus && (
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-end">
                        <button
                          onClick={() => moveStage(app.applicationId, col.nextStatus!)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-bold hover:bg-emerald-500/30 flex items-center gap-1"
                        >
                          <span>Advance</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {colApplicants.length === 0 && (
                  <div className="py-12 text-center text-slate-600 text-[11px]">
                    No candidates
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
