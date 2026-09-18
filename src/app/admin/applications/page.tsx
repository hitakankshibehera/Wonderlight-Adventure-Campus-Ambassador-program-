'use client';

import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  Search,
  Filter,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Sparkles,
  User,
  GraduationCap,
  Share2,
  Calendar,
  X,
  Plus,
  Send,
} from 'lucide-react';
import { dbService } from '@/lib/services/db';
import { Applicant, ApplicationStatus } from '@/types';
import { useAuth } from '@/lib/services/authContext';

export default function AdminApplicationsPage() {
  const { user } = useAuth();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);

  // Evaluation form state
  const [evalForm, setEvalForm] = useState({
    leadershipScore: 8,
    communicationScore: 8,
    networkScore: 8,
    recommendation: 'HIRE' as 'STRONG_HIRE' | 'HIRE' | 'NEUTRAL' | 'DO_NOT_HIRE',
    notes: '',
  });

  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    const refresh = () => {
      setApplicants(dbService.getApplicants());
    };
    refresh();
    return dbService.subscribe(refresh);
  }, []);

  const filteredApplicants = applicants.filter((a) => {
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    const matchesSearch =
      a.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.applicationId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleUpdateStatus = async (appId: string, newStatus: ApplicationStatus) => {
    const note = window.prompt(`Enter review note for setting status to ${newStatus}:`, `Applicant moved to ${newStatus}`);
    if (note !== null) {
      dbService.updateApplicantStatus(appId, newStatus, note, user?.displayName || 'Administrator');
      const updatedApp = dbService.getApplicantById(appId);
      if (selectedApplicant && selectedApplicant.applicationId === appId) {
        setSelectedApplicant(updatedApp || null);
      }

      // If Selected: Dispatch Official Selection Email
      if (newStatus === 'SELECTED' && updatedApp) {
        try {
          await fetch('/api/admin/send-selection-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: updatedApp.fullName,
              email: updatedApp.email,
              college: updatedApp.college,
              ambassadorId: updatedApp.ambassadorId || updatedApp.applicationId,
              batch: '2026 Batch',
            }),
          });
        } catch (e) {
          console.error('Error dispatching selection email:', e);
        }
      }
    }
  };

  const handleSaveEvaluation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApplicant) return;

    const overall = parseFloat(
      ((evalForm.leadershipScore + evalForm.communicationScore + evalForm.networkScore) / 3).toFixed(1)
    );

    dbService.evaluateApplicant(selectedApplicant.applicationId, {
      ...evalForm,
      overallScore: overall,
      evaluatorName: user?.displayName || 'Senior Reviewer',
      evaluatorRole: 'Admissions Lead',
      evaluatedAt: new Date().toISOString(),
    });

    setSelectedApplicant(dbService.getApplicantById(selectedApplicant.applicationId) || null);
    alert('Candidate evaluation submitted!');
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApplicant || !newNote.trim()) return;

    dbService.addApplicantInternalNote(selectedApplicant.applicationId, `${newNote.trim()} — (${user?.displayName || 'Staff'})`);
    setNewNote('');
    setSelectedApplicant(dbService.getApplicantById(selectedApplicant.applicationId) || null);
  };

  const exportCSV = () => {
    const headers = ['Application ID', 'Full Name', 'Email', 'Phone', 'College', 'City', 'Status', 'Instagram', 'Submission Date'];
    const rows = filteredApplicants.map((a) => [
      a.applicationId,
      `"${a.fullName}"`,
      a.email,
      a.phone,
      `"${a.college}"`,
      a.city,
      a.status,
      a.instagram,
      a.createdAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `WLA-Applications-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 font-sans max-w-7xl mx-auto">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Admissions Management</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-black text-white uppercase mt-1">
            APPLICANT SELECTION &amp; SCREENING
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Review candidate motivations, scores, college networks, and advance students across selection stages.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="px-4 py-2.5 rounded-xl glass-input text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-2"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>EXPORT CSV</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search candidate name, ID, college, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl glass-input text-xs bg-wonder-dark-900 text-slate-200 w-full sm:w-auto"
          >
            <option value="ALL">All Statuses ({applicants.length})</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="INTERVIEW">Interview</option>
            <option value="SELECTED">Selected</option>
            <option value="WAITLISTED">Waitlisted</option>
            <option value="NOT_SELECTED">Not Selected</option>
          </select>
        </div>
      </div>

      {/* Applicants Data Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Showing {filteredApplicants.length} applicants</span>
          <span>Click any row to open candidate profile &amp; evaluate</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Applicant ID</th>
                <th className="p-4">Full Name</th>
                <th className="p-4">College &amp; City</th>
                <th className="p-4">Year &amp; Course</th>
                <th className="p-4">Status</th>
                <th className="p-4">Score</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredApplicants.map((app) => (
                <tr
                  key={app.id}
                  onClick={() => setSelectedApplicant(app)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="p-4 font-mono text-emerald-400 font-bold">{app.applicationId}</td>
                  <td className="p-4 font-semibold text-white">
                    <div>{app.fullName}</div>
                    <div className="text-[10px] text-slate-400 font-normal">@{app.instagram}</div>
                  </td>
                  <td className="p-4 text-slate-300">
                    <div className="font-medium text-white">{app.college}</div>
                    <div className="text-[10px] text-slate-400">{app.city}, {app.state}</div>
                  </td>
                  <td className="p-4 text-slate-400">
                    <div>{app.course}</div>
                    <div className="text-[10px]">{app.year}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      app.status === 'SELECTED' ? 'bg-emerald-500/20 text-emerald-300' :
                      app.status === 'INTERVIEW' ? 'bg-amber-500/20 text-amber-300' :
                      app.status === 'SHORTLISTED' ? 'bg-teal-500/20 text-teal-300' :
                      app.status === 'WAITLISTED' ? 'bg-amber-700/20 text-amber-400' :
                      app.status === 'NOT_SELECTED' ? 'bg-red-500/20 text-red-300' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-white">
                    {app.evaluation?.overallScore ? `${app.evaluation.overallScore}/10` : '—'}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedApplicant(app);
                      }}
                      className="px-3 py-1.5 rounded-lg glass-input text-slate-300 hover:text-white font-semibold text-[11px]"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Candidate Profile & Evaluation Drawer */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-3xl rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">{selectedApplicant.applicationId}</span>
                <h3 className="text-xl font-display font-bold text-white">{selectedApplicant.fullName}</h3>
                <p className="text-xs text-slate-400">{selectedApplicant.college} • {selectedApplicant.city}, {selectedApplicant.state}</p>
              </div>
              <button
                onClick={() => setSelectedApplicant(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Action Bar */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Advance Candidate Status (Current: <strong className="text-emerald-400">{selectedApplicant.status}</strong>)
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => handleUpdateStatus(selectedApplicant.applicationId, 'SHORTLISTED')}
                  className="px-3 py-1.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-bold hover:bg-teal-500/30"
                >
                  ✓ Shortlist
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedApplicant.applicationId, 'INTERVIEW')}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold hover:bg-amber-500/30"
                >
                  Schedule Interview
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedApplicant.applicationId, 'SELECTED')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold shadow-glow-emerald hover:brightness-110"
                >
                  ★ SELECT AS AMBASSADOR
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedApplicant.applicationId, 'WAITLISTED')}
                  className="px-3 py-1.5 rounded-lg bg-amber-700/20 text-amber-400 border border-amber-700/40 text-xs font-bold"
                >
                  Waitlist
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedApplicant.applicationId, 'NOT_SELECTED')}
                  className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-bold"
                >
                  Reject
                </button>
              </div>
            </div>

            {/* Candidate Answers & Vision */}
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl glass-card space-y-2 border-slate-800">
                <div className="font-bold text-amber-400 uppercase tracking-wider text-[10px]">
                  Campus Vision &amp; Motivation
                </div>
                <p className="text-slate-200 leading-relaxed">&quot;{selectedApplicant.motivation}&quot;</p>
              </div>

              <div className="p-4 rounded-2xl glass-card space-y-2 border-slate-800">
                <div className="font-bold text-cyan-400 uppercase tracking-wider text-[10px]">
                  Promotion &amp; Marketing Strategy
                </div>
                <p className="text-slate-200 leading-relaxed">&quot;{selectedApplicant.promotionStrategy}&quot;</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3 rounded-xl glass-card border-slate-800">
                  <div className="text-slate-500 text-[10px]">Network Size</div>
                  <div className="font-semibold text-white">{selectedApplicant.networkSize}</div>
                </div>
                <div className="p-3 rounded-xl glass-card border-slate-800">
                  <div className="text-slate-500 text-[10px]">Instagram Handle</div>
                  <div className="font-semibold text-white">@{selectedApplicant.instagram}</div>
                </div>
              </div>
            </div>

            {/* Evaluation Scoring Form */}
            <form onSubmit={handleSaveEvaluation} className="p-4 rounded-2xl glass-card border border-slate-700 space-y-3 text-xs">
              <div className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center justify-between">
                <span>Internal Candidate Evaluation Scorecard</span>
                {selectedApplicant.evaluation && (
                  <span className="text-emerald-400">Score: {selectedApplicant.evaluation.overallScore}/10</span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 text-[10px] mb-1">Leadership (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={evalForm.leadershipScore}
                    onChange={(e) => setEvalForm({ ...evalForm, leadershipScore: parseInt(e.target.value) || 5 })}
                    className="w-full px-3 py-1.5 rounded-lg glass-input"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px] mb-1">Communication (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={evalForm.communicationScore}
                    onChange={(e) => setEvalForm({ ...evalForm, communicationScore: parseInt(e.target.value) || 5 })}
                    className="w-full px-3 py-1.5 rounded-lg glass-input"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px] mb-1">Network Reach (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={evalForm.networkScore}
                    onChange={(e) => setEvalForm({ ...evalForm, networkScore: parseInt(e.target.value) || 5 })}
                    className="w-full px-3 py-1.5 rounded-lg glass-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] mb-1">Evaluator Notes &amp; Recommendation</label>
                <textarea
                  rows={2}
                  placeholder="Notes on communication clarity, society influence..."
                  value={evalForm.notes}
                  onChange={(e) => setEvalForm({ ...evalForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg glass-input text-xs"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-glow-gold hover:brightness-110"
              >
                Save Evaluation Scorecard
              </button>
            </form>

            {/* Internal Notes Thread */}
            <div className="space-y-2 text-xs">
              <div className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">
                Internal Staff Notes ({selectedApplicant.internalNotes?.length || 0})
              </div>
              <div className="space-y-1">
                {selectedApplicant.internalNotes?.map((note, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                    • {note}
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Add an internal observation..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl glass-input text-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl glass-input text-emerald-400 hover:text-white font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Note</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
