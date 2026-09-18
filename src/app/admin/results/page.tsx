'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Globe,
  Upload,
  Eye,
  CheckCircle2,
  Calendar,
  Sparkles,
  ExternalLink,
  Plus,
  FileText,
  FileUp,
  Trash2,
  Download,
  X,
  AlertCircle,
  Sliders,
  Mail,
  Send,
  SlidersHorizontal,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { dbService } from '@/lib/services/db';
import { SelectionBatchRecord, Ambassador, Applicant } from '@/types';

export default function AdminResultsPublisherPage() {
  const [batches, setBatches] = useState<SelectionBatchRecord[]>([]);
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [pdfPreviewModal, setPdfPreviewModal] = useState<{ url: string; title: string } | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [emailLogs, setEmailLogs] = useState<Array<{ name: string; email: string; ambId: string; date: string }>>([]);
  const [showEmailModal, setShowEmailModal] = useState(false);

  // Celebration Config State
  const [celebrationSettings, setCelebrationSettings] = useState({
    enabled: true,
    durationSeconds: 5,
    particleDensity: 'HIGH' as 'LOW' | 'MEDIUM' | 'HIGH',
    celebrationMessage: '🎉 Congratulations! You have been selected as a Wonderlight Campus Ambassador!',
    batch: '2026–27',
  });
  const [savedSettingsSuccess, setSavedSettingsSuccess] = useState(false);

  const [newBatch, setNewBatch] = useState<{
    title: string;
    batch: string;
    resultDate: string;
    description: string;
    bannerUrl: string;
    isPublished: boolean;
    pdfUrl?: string;
    pdfFileName?: string;
  }>({
    title: 'National Campus Ambassador Cohort 2026–27 (Round 1)',
    batch: '2026–27',
    resultDate: new Date().toISOString().split('T')[0],
    description: 'Official selection list containing verified collegiate student representatives.',
    bannerUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80',
    isPublished: true,
  });

  useEffect(() => {
    const refresh = () => {
      setBatches(dbService.getSelectionBatches());
      setAmbassadors(dbService.getAmbassadors());
      setApplicants(dbService.getApplicants());

      const cms = dbService.getCMSConfig();
      if (cms.celebrationConfig) {
        setCelebrationSettings(cms.celebrationConfig);
      }
    };
    refresh();
    return dbService.subscribe(refresh);
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    dbService.updateCMSConfig({
      celebrationConfig: celebrationSettings,
    });
    setSavedSettingsSuccess(true);
    setTimeout(() => setSavedSettingsSuccess(false), 2500);
  };

  const handleTogglePublish = (batchId: string, current: boolean) => {
    dbService.publishBatch(batchId, !current);
  };

  const handleDeleteBatch = (batchId: string) => {
    if (confirm('Are you sure you want to delete this result release batch?')) {
      dbService.deleteSelectionBatch(batchId);
    }
  };

  const handlePublishResults = () => {
    setPublishing(true);
    setTimeout(() => {
      const allApps = dbService.getApplicants();
      const selectedApps = allApps.filter((a) => a.status === 'SELECTED');

      const logs: Array<{ name: string; email: string; ambId: string; date: string }> = [];

      selectedApps.forEach((app) => {
        // Ensure Ambassador is provisioned with unique ID
        dbService.updateApplicantStatus(
          app.applicationId,
          'SELECTED',
          'Official Batch Publish: Selection confirmed & notification dispatched.',
          'Administrator'
        );

        const updatedAmb = dbService.getAmbassadors().find((a) => a.applicationId === app.applicationId);
        logs.push({
          name: app.fullName,
          email: app.email,
          ambId: updatedAmb?.ambassadorId || app.ambassadorId || 'WLA-001',
          date: new Date().toLocaleTimeString(),
        });
      });

      // Ensure primary batch is live
      const firstBatch = batches[0];
      if (firstBatch) {
        dbService.publishBatch(firstBatch.id, true);
      } else {
        dbService.createSelectionBatch({
          title: `National Campus Ambassador Cohort ${celebrationSettings.batch} Official Release`,
          batch: celebrationSettings.batch,
          resultDate: new Date().toISOString().split('T')[0],
          description: 'Verified list of selected Campus Ambassadors eligible for official onboarding.',
          selectedCount: selectedApps.length,
          isPublished: true,
          selectedAmbassadorIds: selectedApps.map((a) => a.ambassadorId || a.id),
        });
      }

      setEmailLogs(logs);
      setPublishing(false);
      setShowEmailModal(true);
    }, 1200);
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>, batchId?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a valid PDF document (.pdf file format).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (batchId) {
        dbService.updateBatchPDF(batchId, dataUrl, file.name);
      } else {
        setNewBatch((prev) => ({
          ...prev,
          pdfUrl: dataUrl,
          pdfFileName: file.name,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePdf = (batchId?: string) => {
    if (batchId) {
      dbService.updateBatchPDF(batchId, undefined, undefined);
    } else {
      setNewBatch((prev) => ({
        ...prev,
        pdfUrl: undefined,
        pdfFileName: undefined,
      }));
    }
  };

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    dbService.createSelectionBatch({
      title: newBatch.title,
      batch: newBatch.batch,
      resultDate: newBatch.resultDate,
      description: newBatch.description,
      selectedCount: ambassadors.length,
      isPublished: newBatch.isPublished,
      bannerUrl: newBatch.bannerUrl,
      pdfUrl: newBatch.pdfUrl,
      pdfFileName: newBatch.pdfFileName,
      selectedAmbassadorIds: ambassadors.map((a) => a.ambassadorId),
    });
    setShowCreateModal(false);
    setNewBatch({
      title: 'National Campus Ambassador Cohort 2026–27 (Round 2)',
      batch: '2026–27',
      resultDate: new Date().toISOString().split('T')[0],
      description: 'Supplementary round results appointing regional collegiate leaders.',
      bannerUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80',
      isPublished: true,
    });
  };

  const selectedCount = applicants.filter((a) => a.status === 'SELECTED').length;
  const waitlistedCount = applicants.filter((a) => a.status === 'WAITLISTED').length;
  const notSelectedCount = applicants.filter((a) => a.status === 'NOT_SELECTED').length;

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            <Trophy className="w-3.5 h-3.5" />
            <span>Official Result Release & PDF Publisher</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-black text-white uppercase mt-1">
            PUBLIC RESULTS PUBLISHER
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Publish official cohort appointment releases, configure celebration animations, and upload result PDFs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/campus-ambassador/results"
            className="px-4 py-2.5 rounded-xl glass-input text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
          >
            <span>Preview Public View</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-glow-emerald hover:brightness-110 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>CREATE RELEASE BATCH</span>
          </button>
        </div>
      </div>

      {/* Admin Result Publishing Dashboard Action Box */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-6 bg-gradient-to-r from-emerald-950/40 via-wonder-dark-900 to-wonder-dark-950">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                RESULT MANAGEMENT
              </span>
              <span className="text-slate-400">
                Batch: <strong>{celebrationSettings.batch}</strong>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-display font-black text-white">
              COHORT SELECTION RESULT PUBLICATION ENGINE
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Publishing will update student statuses, generate unique Ambassador IDs, dispatch selection emails from <strong>wonderlightadventure@gmail.com</strong>, and enable full-screen celebration for selected candidates.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold pt-1">
              <div className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Selected: <strong>{selectedCount}</strong>
              </div>
              <div className="px-3 py-1 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Waitlisted: <strong>{waitlistedCount}</strong>
              </div>
              <div className="px-3 py-1 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Not Selected: <strong>{notSelectedCount}</strong>
              </div>
            </div>
          </div>

          <button
            onClick={handlePublishResults}
            disabled={publishing}
            className="px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-glow-emerald hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
          >
            <Send className="w-5 h-5" />
            <span>{publishing ? 'DISPATCHING & PUBLISHING...' : 'PUBLISH SELECTION RESULTS LIVE'}</span>
          </button>
        </div>
      </div>

      {/* RESULT CELEBRATION ADMIN CONTROL CARD */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-2xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-display font-bold text-white uppercase tracking-wide">
              RESULT CELEBRATION SETTINGS
            </h2>
          </div>
          {savedSettingsSuccess && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <Check className="w-4 h-4" /> Settings Saved!
            </span>
          )}
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Toggle ON/OFF */}
            <div className="p-4 rounded-2xl glass-card border-slate-800 space-y-3">
              <label className="block font-bold text-slate-200 uppercase tracking-wider">
                Full-Screen Celebration
              </label>
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400">Enable Confetti & Poppers</span>
                <button
                  type="button"
                  onClick={() =>
                    setCelebrationSettings({ ...celebrationSettings, enabled: !celebrationSettings.enabled })
                  }
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${
                    celebrationSettings.enabled ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                      celebrationSettings.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Particle Density */}
            <div className="p-4 rounded-2xl glass-card border-slate-800 space-y-3">
              <label className="block font-bold text-slate-200 uppercase tracking-wider">
                Particle Density & Intensity
              </label>
              <select
                value={celebrationSettings.particleDensity}
                onChange={(e) =>
                  setCelebrationSettings({
                    ...celebrationSettings,
                    particleDensity: e.target.value as 'LOW' | 'MEDIUM' | 'HIGH',
                  })
                }
                className="w-full px-3 py-2 rounded-xl glass-input bg-wonder-dark-900 text-slate-200"
              >
                <option value="LOW">Low (Subtle Sparkles)</option>
                <option value="MEDIUM">Medium (Balanced Bursts)</option>
                <option value="HIGH">High (Full Multi-Burst Explosions)</option>
              </select>
            </div>

            {/* Duration */}
            <div className="p-4 rounded-2xl glass-card border-slate-800 space-y-3">
              <label className="block font-bold text-slate-200 uppercase tracking-wider">
                Animation Duration
              </label>
              <select
                value={celebrationSettings.durationSeconds}
                onChange={(e) =>
                  setCelebrationSettings({
                    ...celebrationSettings,
                    durationSeconds: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 rounded-xl glass-input bg-wonder-dark-900 text-slate-200"
              >
                <option value={4}>4 Seconds</option>
                <option value={5}>5 Seconds (Recommended)</option>
                <option value={8}>8 Seconds (Extended)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1">
              Custom Celebration Headline Message
            </label>
            <input
              type="text"
              value={celebrationSettings.celebrationMessage}
              onChange={(e) =>
                setCelebrationSettings({ ...celebrationSettings, celebrationMessage: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl glass-input"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-glow-gold hover:brightness-110 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Save Celebration Settings</span>
            </button>
          </div>
        </form>
      </div>

      {/* Batches Table / List */}
      <div className="space-y-4">
        {batches.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl text-center space-y-4 border border-slate-800">
            <FileText className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Selection Releases Published Yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Create a new release batch and upload your official PDF result document to display selected Campus Ambassadors publicly.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Release Batch</span>
            </button>
          </div>
        ) : (
          batches.map((batch) => (
            <div
              key={batch.id}
              className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl flex flex-col gap-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        batch.isPublished
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {batch.isPublished ? 'PUBLISHED LIVE' : 'DRAFT / HIDDEN'}
                    </span>
                    <span className="text-slate-400">
                      Batch: <strong>{batch.batch}</strong>
                    </span>
                    <span className="text-slate-400">
                      • Release Date: <strong>{batch.resultDate}</strong>
                    </span>
                  </div>

                  <h3 className="text-xl font-display font-bold text-white">{batch.title}</h3>
                  <p className="text-xs text-slate-300 max-w-xl">{batch.description}</p>
                  <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{batch.selectedCount || ambassadors.length} Selected Ambassadors in Batch</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleTogglePublish(batch.id, batch.isPublished)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      batch.isPublished
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                        : 'bg-emerald-500 text-slate-950 shadow-glow-emerald hover:brightness-110'
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    <span>{batch.isPublished ? 'Unpublish' : 'Publish Live'}</span>
                  </button>

                  <button
                    onClick={() => handleDeleteBatch(batch.id)}
                    className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition-colors"
                    title="Delete Release Batch"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* PDF Document Upload & Status Box */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-200">
                      Official Selection PDF Document:
                    </div>
                    {batch.pdfUrl ? (
                      <div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="truncate max-w-xs">{batch.pdfFileName || 'Selection_List.pdf'}</span>
                      </div>
                    ) : (
                      <div className="text-xs text-amber-400/90 font-medium flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>No PDF attached to this batch. Upload PDF for students to download.</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {batch.pdfUrl && (
                    <>
                      <button
                        onClick={() => setPdfPreviewModal({ url: batch.pdfUrl!, title: batch.title })}
                        className="px-3 py-1.5 rounded-lg glass-input text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-sky-400" />
                        <span>View PDF</span>
                      </button>

                      <a
                        href={batch.pdfUrl}
                        download={batch.pdfFileName || `${batch.title.replace(/\s+/g, '_')}.pdf`}
                        className="px-3 py-1.5 rounded-lg glass-input text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Download</span>
                      </a>

                      <button
                        onClick={() => handleRemovePdf(batch.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-semibold flex items-center gap-1 border border-red-500/20"
                        title="Remove attached PDF"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Remove PDF</span>
                      </button>
                    </>
                  )}

                  <label className="px-3.5 py-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600/40 border border-indigo-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors">
                    <FileUp className="w-3.5 h-3.5" />
                    <span>{batch.pdfUrl ? 'Replace PDF' : 'Upload Official PDF'}</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => handlePdfUpload(e, batch.id)}
                    />
                  </label>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Release Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-xl rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>Create New Result Release</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1">
                  Batch Release Title
                </label>
                <input
                  type="text"
                  required
                  value={newBatch.title}
                  onChange={(e) => setNewBatch({ ...newBatch, title: e.target.value })}
                  placeholder="e.g. National Campus Ambassador Cohort 2026–27"
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1">
                    Cohort Session
                  </label>
                  <input
                    type="text"
                    required
                    value={newBatch.batch}
                    onChange={(e) => setNewBatch({ ...newBatch, batch: e.target.value })}
                    placeholder="2026–27"
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1">
                    Release Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newBatch.resultDate}
                    onChange={(e) => setNewBatch({ ...newBatch, resultDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1">
                  Description / Announcement Note
                </label>
                <textarea
                  rows={2}
                  value={newBatch.description}
                  onChange={(e) => setNewBatch({ ...newBatch, description: e.target.value })}
                  placeholder="Summary note for selected campus ambassadors..."
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input"
                />
              </div>

              {/* Upload PDF Section */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="block text-slate-300 font-semibold uppercase tracking-wider">
                  Upload Official Selection PDF (Selected Ambassadors List)
                </label>
                <div className="p-4 rounded-2xl border-2 border-dashed border-slate-700 hover:border-emerald-500/50 bg-slate-900/50 text-center space-y-3 transition-colors">
                  {newBatch.pdfUrl ? (
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        <span>{newBatch.pdfFileName || 'Official_Selected_Ambassadors.pdf'}</span>
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => handleRemovePdf()}
                          className="text-red-400 hover:text-red-300 text-xs font-semibold inline-flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Remove attached PDF</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <FileUp className="w-8 h-8 text-emerald-400 mx-auto" />
                      <div>
                        <span className="text-slate-300 font-medium">Click to select PDF document</span>
                        <p className="text-[11px] text-slate-500">Official result document (.pdf)</p>
                      </div>
                      <label className="inline-block px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-bold cursor-pointer transition-colors">
                        Browse PDF File
                        <input
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={(e) => handlePdfUpload(e)}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl glass-input text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold shadow-glow-emerald hover:brightness-110"
                >
                  Publish Release & PDF
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DISPATCHED SELECTION EMAIL SIMULATION LOG MODAL */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-emerald-500/40 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Selection Email Dispatch Log</h3>
              </div>
              <button
                onClick={() => setShowEmailModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-white glass-input"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-sm text-white">Selection Emails Successfully Sent!</div>
                  <div>From: <strong>wonderlightadventure@gmail.com</strong></div>
                  <div>Subject: 🎉 Congratulations! You Have Been Selected as a Wonderlight Campus Ambassador</div>
                </div>
              </div>

              <div className="text-slate-400 font-semibold pt-2">Dispatched Student Notifications ({emailLogs.length}):</div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {emailLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl glass-card border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white">{log.name}</div>
                      <div className="text-slate-400 text-[11px]">{log.email}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-emerald-400 text-[11px]">{log.ambId}</div>
                      <div className="text-[10px] text-slate-500">{log.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-glow-emerald"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {pdfPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel w-full max-w-4xl h-[85vh] rounded-3xl p-6 border border-slate-700 flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">{pdfPreviewModal.title} - Official PDF</h3>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={pdfPreviewModal.url}
                  download="Selected_Campus_Ambassadors.pdf"
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </a>
                <button
                  onClick={() => setPdfPreviewModal(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white glass-input"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
              <iframe
                src={pdfPreviewModal.url}
                className="w-full h-full"
                title="PDF Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
