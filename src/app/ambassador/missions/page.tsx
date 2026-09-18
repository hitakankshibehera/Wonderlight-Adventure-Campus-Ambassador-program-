'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Target,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Upload,
  Send,
  X,
  ChevronRight,
} from 'lucide-react';
import { dbService } from '@/lib/services/db';
import { useAuth } from '@/lib/services/authContext';
import { Mission, MissionSubmission } from '@/types';

export default function AmbassadorMissionsPage() {
  const { ambassadorProfile } = useAuth();
  const defaultProfile = {
    id: 'amb-default',
    userId: 'user-default',
    ambassadorId: 'WLA-CAP-001',
    applicationId: 'WLA-2026-000',
    name: 'Campus Ambassador',
    email: 'ambassador@wonderlight.adventure',
    phone: '',
    college: 'Campus Representative',
    campus: 'Main Campus',
    city: 'India',
    state: 'India',
    level: 'EXPLORER' as const,
    xp: 0,
    rank: 1,
    referralCode: 'WLA-CAP-001',
    referralLink: 'https://wonderlight.adventure/r/WLA-CAP-001',
    stats: { clicks: 0, leads: 0, bookings: 0, revenue: 0, eventsAttended: 0, missionsCompleted: 0 },
    status: 'ACTIVE' as const,
    joinedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const profile = ambassadorProfile || dbService.getAmbassadorById('WLA-KIIT-024') || defaultProfile;

  const [missions, setMissions] = useState<Mission[]>([]);
  const [submissions, setSubmissions] = useState<MissionSubmission[]>([]);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  const [proofForm, setProofForm] = useState({
    proofUrl: '',
    proofNotes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setMissions(dbService.getMissions());
      setSubmissions(dbService.getMissionSubmissions(profile.ambassadorId));
    };
    refresh();
    return dbService.subscribe(refresh);
  }, [profile.ambassadorId]);

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMission) return;

    setIsSubmitting(true);
    setTimeout(() => {
      dbService.submitMissionProof({
        missionId: selectedMission.id,
        ambassadorId: profile.ambassadorId,
        proofUrl: proofForm.proofUrl,
        proofNotes: proofForm.proofNotes,
      });

      setIsSubmitting(false);
      setSelectedMission(null);
      setProofForm({ proofUrl: '', proofNotes: '' });

      try {
        confetti({
          particleCount: 60,
          spread: 50,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    }, 400);
  };

  const completedMissionIds = new Set(
    submissions.filter((s) => s.status === 'APPROVED').map((s) => s.missionId)
  );

  const pendingMissionIds = new Set(
    submissions.filter((s) => s.status === 'PENDING').map((s) => s.missionId)
  );

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
          <Target className="w-3.5 h-3.5" />
          <span>Gamified Challenges</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-display font-black text-white uppercase">
          CAMPUS MISSIONS &amp; XP VAULT
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Complete promotional, community, and booking missions to earn XP, level up your rank, and claim sponsored gear.
        </p>
      </div>

      {/* Active Missions Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Available Campus Missions ({missions.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((mis) => {
            const isApproved = completedMissionIds.has(mis.id);
            const isPending = pendingMissionIds.has(mis.id);

            return (
              <div
                key={mis.id}
                className="glass-card rounded-2xl p-6 border-slate-800 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 uppercase">
                      {mis.category}
                    </span>
                    <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      +{mis.xp} XP
                    </span>
                  </div>

                  <h4 className="font-display font-bold text-white text-base leading-snug">
                    {mis.title}
                  </h4>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {mis.description}
                  </p>

                  <div className="pt-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Requirements:
                    </div>
                    <ul className="space-y-1">
                      {mis.requirements.slice(0, 2).map((r, i) => (
                        <li key={i} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    Deadline: {mis.endDate}
                  </span>

                  {isApproved ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>COMPLETED</span>
                    </span>
                  ) : isPending ? (
                    <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>UNDER REVIEW</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => setSelectedMission(mis)}
                      className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold shadow-glow-emerald hover:brightness-110 flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>SUBMIT PROOF</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submission History Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-700/60 shadow-2xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">
            Proof Submissions &amp; Review History ({submissions.length})
          </h3>
          <span className="text-[10px] text-slate-500">Evaluated by Program Managers</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {submissions.map((sub) => (
            <div key={sub.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    sub.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    sub.status === 'PENDING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                    {sub.status}
                  </span>
                  <span className="font-bold text-white text-sm">{sub.missionTitle}</span>
                </div>
                <p className="text-slate-300 text-xs">&quot;{sub.proofNotes}&quot;</p>
                {sub.proofUrl && (
                  <a
                    href={sub.proofUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 text-[11px] hover:underline flex items-center gap-1 pt-0.5"
                  >
                    <span>View Submitted Link: {sub.proofUrl}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {sub.reviewNotes && (
                  <div className="text-[11px] text-amber-300 pt-1 font-medium">
                    Reviewer Note: {sub.reviewNotes} ({sub.reviewedBy})
                  </div>
                )}
              </div>

              <div className="text-right">
                {sub.status === 'APPROVED' ? (
                  <span className="text-emerald-400 font-display font-black text-base">
                    +{sub.xpAwarded} XP AWARDED
                  </span>
                ) : (
                  <span className="text-slate-500 text-[11px]">Submitted {new Date(sub.submittedAt).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          ))}

          {submissions.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-500">
              No mission proofs submitted yet. Choose a mission above and submit your proof!
            </div>
          )}
        </div>
      </div>

      {/* Proof Submission Modal */}
      {selectedMission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                  +{selectedMission.xp} XP Challenge
                </span>
                <h3 className="text-lg font-display font-bold text-white mt-1">{selectedMission.title}</h3>
              </div>
              <button onClick={() => setSelectedMission(null)} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitProof} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1">
                  Proof Link (Instagram Reel / Drive / Social Post / WhatsApp Invite)
                </label>
                <input
                  type="url"
                  placeholder="https://instagram.com/reel/... or https://drive.google.com/..."
                  value={proofForm.proofUrl}
                  onChange={(e) => setProofForm({ ...proofForm, proofUrl: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl glass-input"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1">
                  Submission Notes &amp; Verification Details *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your execution, views achieved, group member counts, or offline desk engagement..."
                  value={proofForm.proofNotes}
                  onChange={(e) => setProofForm({ ...proofForm, proofNotes: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl glass-input"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedMission(null)}
                  className="px-4 py-2.5 rounded-xl glass-input text-slate-300 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold shadow-glow-emerald hover:brightness-110 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Uploading Proof...' : 'Submit For Review'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
