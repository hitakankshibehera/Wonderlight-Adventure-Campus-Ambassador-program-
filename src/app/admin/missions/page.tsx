'use client';

import React, { useState, useEffect } from 'react';
import {
  Target,
  Plus,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Clock,
  Sparkles,
  Calendar,
  X,
  Send,
} from 'lucide-react';
import { dbService } from '@/lib/services/db';
import { Mission, MissionSubmission, AmbassadorLevel } from '@/types';
import { useAuth } from '@/lib/services/authContext';

export default function AdminMissionsPage() {
  const { user } = useAuth();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [submissions, setSubmissions] = useState<MissionSubmission[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Review modal
  const [reviewingSub, setReviewingSub] = useState<MissionSubmission | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const [form, setForm] = useState({
    title: '',
    description: '',
    xp: 300,
    category: 'CONTENT' as const,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2026-11-30',
    eligibilityLevel: 'ALL' as 'ALL' | AmbassadorLevel,
    status: 'ACTIVE' as const,
    requirements: ['Original student travel content'],
    submissionType: 'LINK' as const,
  });

  useEffect(() => {
    const refresh = () => {
      setMissions(dbService.getMissions());
      setSubmissions(dbService.getMissionSubmissions());
    };
    refresh();
    return dbService.subscribe(refresh);
  }, []);

  const handleCreateMission = (e: React.FormEvent) => {
    e.preventDefault();
    dbService.createMission(form);
    setShowCreateModal(false);
  };

  const handleReview = (status: 'APPROVED' | 'REJECTED') => {
    if (!reviewingSub) return;
    dbService.reviewMissionSubmission(
      reviewingSub.id,
      status,
      reviewNotes || `${status} by Reviewer`,
      user?.displayName || 'Program Lead'
    );
    setReviewingSub(null);
    setReviewNotes('');
  };

  const pendingSubmissions = submissions.filter((s) => s.status === 'PENDING');

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            <Target className="w-3.5 h-3.5" />
            <span>Gamification &amp; XP Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-black text-white uppercase mt-1">
            CAMPUS MISSIONS &amp; PROOF REVIEW
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Create actionable ambassador challenges and evaluate submitted proofs to credit XP toward level unlocks.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-glow-emerald hover:brightness-110 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>CREATE NEW MISSION</span>
        </button>
      </div>

      {/* Pending Proofs Approval Queue */}
      <div className="glass-panel rounded-3xl p-6 border border-amber-500/40 shadow-glow-gold space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <h3 className="font-display font-bold text-white text-base">
              Pending Submissions Queue ({pendingSubmissions.length})
            </h3>
          </div>
          <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
            Reviewing credits XP automatically
          </span>
        </div>

        <div className="space-y-3">
          {pendingSubmissions.map((sub) => (
            <div
              key={sub.id}
              className="p-4 rounded-2xl glass-card border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{sub.ambassadorName}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {sub.ambassadorId}
                  </span>
                  <span className="text-slate-500">• {sub.college}</span>
                </div>

                <div className="text-amber-300 font-semibold">{sub.missionTitle}</div>
                <p className="text-slate-300">&quot;{sub.proofNotes}&quot;</p>
                {sub.proofUrl && (
                  <a
                    href={sub.proofUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 text-[11px] hover:underline flex items-center gap-1"
                  >
                    <span>Inspect Link: {sub.proofUrl}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setReviewingSub(sub)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-glow-emerald hover:brightness-110"
                >
                  Review Proof
                </button>
              </div>
            </div>
          ))}

          {pendingSubmissions.length === 0 && (
            <div className="py-6 text-center text-xs text-slate-500">
              No pending mission submissions waiting in the queue.
            </div>
          )}
        </div>
      </div>

      {/* Active Missions Catalog */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Published Missions ({missions.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {missions.map((mis) => (
            <div key={mis.id} className="glass-card rounded-2xl p-6 border-slate-800 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold uppercase">
                    {mis.category}
                  </span>
                  <span className="font-display font-black text-emerald-400">+{mis.xp} XP</span>
                </div>
                <h4 className="font-display font-bold text-white text-base leading-snug">{mis.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-3">{mis.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Ends {mis.endDate}</span>
                <span className="text-emerald-400 font-semibold">{mis.eligibilityLevel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Modal */}
      {reviewingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-display font-bold text-white">Evaluate Proof Submission</h3>
              <button onClick={() => setReviewingSub(null)} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-bold text-white text-sm">{reviewingSub.missionTitle}</div>
              <div className="text-slate-400">Submitted by: <strong>{reviewingSub.ambassadorName}</strong> ({reviewingSub.ambassadorId})</div>
              <p className="text-slate-300 p-3 rounded-xl bg-slate-900 border border-slate-800">&quot;{reviewingSub.proofNotes}&quot;</p>
              {reviewingSub.proofUrl && (
                <a
                  href={reviewingSub.proofUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Open Attached URL in New Tab</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <div className="space-y-1 text-xs">
              <label className="block text-slate-300 font-semibold uppercase tracking-wider">
                Evaluator Feedback Notes
              </label>
              <input
                type="text"
                placeholder="e.g. Verified 4.2k views on Instagram Reel. Great pacing!"
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl glass-input text-xs"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => handleReview('REJECTED')}
                className="px-4 py-2 rounded-xl bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-bold hover:bg-red-500/30"
              >
                Reject Proof
              </button>
              <button
                type="button"
                onClick={() => handleReview('APPROVED')}
                className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold shadow-glow-emerald hover:brightness-110"
              >
                Approve &amp; Credit XP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Mission Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl space-y-4">
            <h3 className="text-lg font-display font-bold text-white">Publish New Mission</h3>

            <form onSubmit={handleCreateMission} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Mission Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl glass-input"
                  placeholder="e.g. Host an Offline Travel Quiz Desk"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">XP Value</label>
                  <input
                    type="number"
                    required
                    value={form.xp}
                    onChange={(e) => setForm({ ...form, xp: parseInt(e.target.value) || 100 })}
                    className="w-full px-3.5 py-2 rounded-xl glass-input text-emerald-400 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Deadline Date</label>
                  <input
                    type="date"
                    required
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl glass-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl glass-input"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl glass-input text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold shadow-glow-emerald"
                >
                  Publish Mission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
