'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Search,
  Filter,
  ArrowUpRight,
  Download,
  Building,
  MapPin,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  FileText,
  Eye,
  X,
  FileUp,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { dbService } from '@/lib/services/db';
import { Ambassador, SelectionBatchRecord, Applicant } from '@/types';
import { ResultCelebration } from '@/components/celebration/ResultCelebration';
import { firestoreService } from '@/lib/services/firestoreService';

export default function PublicSelectionResultsPage() {
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [batches, setBatches] = useState<SelectionBatchRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');

  // PDF Preview modal state
  const [activePdfModal, setActivePdfModal] = useState<{ url: string; title: string; filename: string } | null>(null);

  // Direct candidate result check state
  const [checkIdInput, setCheckIdInput] = useState('');
  const [checkingResult, setCheckingResult] = useState(false);
  const [searchedApplicant, setSearchedApplicant] = useState<Applicant | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const refreshData = () => {
      setAmbassadors(dbService.getAmbassadors());
      setBatches(dbService.getSelectionBatches());
    };
    refreshData();
    return dbService.subscribe(refreshData);
  }, []);

  const handleCheckResultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const queryStr = checkIdInput.trim();
    if (!queryStr) return;

    setCheckingResult(true);
    setSearchedApplicant(null);

    try {
      const app = await firestoreService.getApplicant(queryStr);
      if (app) {
        setSearchedApplicant(app);
        if (app.status === 'SELECTED') {
          console.log('[RESULT] Selected candidate found, triggering celebration sprinkles!');
          setShowCelebration(true);
        } else {
          setShowCelebration(false);
        }
      } else {
        alert(`No application record found for "${queryStr}". Please check your Application ID or Email.`);
      }
    } catch (err) {
      console.error('[RESULT] Check result error:', err);
    } finally {
      setCheckingResult(false);
    }
  };

  // Filter ambassadors
  const publishedBatches = batches.filter((b) => b.isPublished);

  const filteredAmbassadors = ambassadors.filter((amb) => {
    const matchesSearch =
      amb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      amb.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
      amb.ambassadorId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      amb.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesState = selectedState === 'ALL' || amb.state === selectedState;
    return matchesSearch && matchesState;
  });

  const availableStates = Array.from(new Set(ambassadors.map((a) => a.state)));

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans space-y-12">
      {/* Celebration Sprinkles Overlay if Candidate Selected */}
      {showCelebration && searchedApplicant && searchedApplicant.status === 'SELECTED' && (
        <ResultCelebration
          applicant={searchedApplicant}
          onClose={() => setShowCelebration(false)}
        />
      )}

      {/* Page Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Official Appointment & PDF Result Release Portal</span>
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-white tracking-tight uppercase">
          WONDERLIGHT CAMPUS AMBASSADOR <br />
          <span className="gradient-text-gold">SELECTION RESULTS 2026–27</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Official selection list and appointment documents of collegiate student representatives appointed across premier Indian universities.
        </p>
      </div>

      {/* QUICK INDIVIDUAL RESULT CHECKER CARD */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-4 bg-gradient-to-r from-emerald-950/40 via-wonder-dark-900 to-wonder-dark-950">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-widest">
              Instant Candidate Check
            </span>
            <h2 className="text-xl sm:text-2xl font-display font-black text-white">
              CHECK YOUR SELECTION RESULT & CELEBRATION
            </h2>
            <p className="text-xs text-slate-300">
              Enter your Application ID (e.g., WLA-2026-00001) or registered email address to reveal your selection outcome.
            </p>
          </div>

          <form onSubmit={handleCheckResultSubmit} className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              required
              placeholder="Application ID or Email..."
              value={checkIdInput}
              onChange={(e) => setCheckIdInput(e.target.value)}
              className="px-4 py-3 rounded-xl glass-input text-xs w-full sm:w-64 text-white placeholder-slate-400"
            />
            <button
              type="submit"
              disabled={checkingResult}
              className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-glow-emerald flex items-center gap-1.5 shrink-0 transition-all cursor-pointer disabled:opacity-50"
            >
              {checkingResult ? (
                <>
                  <img src="/wla-logo.png" alt="WLA Logo" className="w-4 h-4 rounded-full object-cover animate-spin" />
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>CHECK MY RESULT</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* PUBLISHED RELEASE BATCHES & OFFICIAL PDF DOWNLOAD BANNERS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-display font-bold text-white uppercase tracking-wide flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span>Official Selection PDF Documents</span>
          </h2>
          <span className="text-xs text-slate-400">
            Published Batches: <strong>{publishedBatches.length}</strong>
          </span>
        </div>

        {publishedBatches.length === 0 ? (
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center space-y-2">
            <FileText className="w-10 h-10 text-slate-500 mx-auto" />
            <p className="text-xs text-slate-400">No official result releases published by Admin yet.</p>
          </div>
        ) : (
          publishedBatches.map((batch) => (
            <div
              key={batch.id}
              className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl relative overflow-hidden bg-gradient-to-r from-slate-900/90 via-wonder-dark-900 to-slate-900/90 space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 uppercase tracking-widest border border-emerald-500/30">
                      OFFICIAL PUBLISHED RELEASE
                    </span>
                    <span className="text-slate-400">Batch: <strong>{batch.batch}</strong></span>
                    <span className="text-slate-400">• Release Date: <strong>{batch.resultDate}</strong></span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
                    {batch.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                    {batch.description}
                  </p>
                  <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{batch.selectedCount || ambassadors.length} Verified Selected Ambassadors in Release</span>
                  </div>
                </div>

                {/* PDF Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  {batch.pdfUrl ? (
                    <>
                      <button
                        onClick={() =>
                          setActivePdfModal({
                            url: batch.pdfUrl!,
                            title: batch.title,
                            filename: batch.pdfFileName || 'Selected_Ambassadors.pdf',
                          })
                        }
                        className="px-4 py-3 rounded-xl glass-input text-slate-200 hover:text-white text-xs font-bold flex items-center gap-2 border-emerald-500/40 transition-colors"
                      >
                        <Eye className="w-4 h-4 text-sky-400" />
                        <span>PREVIEW OFFICIAL PDF</span>
                      </button>

                      <a
                        href={batch.pdfUrl}
                        download={batch.pdfFileName || `${batch.title.replace(/\s+/g, '_')}.pdf`}
                        className="px-5 py-3 rounded-xl bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-glow-emerald hover:brightness-110 flex items-center gap-2 transition-all"
                      >
                        <Download className="w-4 h-4" />
                        <span>DOWNLOAD OFFICIAL PDF</span>
                      </a>
                    </>
                  ) : (
                    <div className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-400 text-xs italic">
                      PDF list document pending attachment
                    </div>
                  )}

                  <button
                    onClick={() => window.print()}
                    className="px-4 py-3 rounded-xl glass-input text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>Print Result List</span>
                  </button>
                </div>
              </div>

              {/* Embedded PDF Document Preview Box if PDF exists */}
              {batch.pdfUrl && (
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <div className="flex items-center gap-2 font-bold text-emerald-400">
                      <FileText className="w-4 h-4" />
                      <span>Attached PDF: {batch.pdfFileName || 'Selected_Ambassadors_List.pdf'}</span>
                    </div>
                    <button
                      onClick={() =>
                        setActivePdfModal({
                          url: batch.pdfUrl!,
                          title: batch.title,
                          filename: batch.pdfFileName || 'Selected_Ambassadors.pdf',
                        })
                      }
                      className="text-xs text-emerald-400 hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>Open Full Screen PDF</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="w-full h-80 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                    <iframe
                      src={batch.pdfUrl}
                      className="w-full h-full"
                      title="Published Official Selection PDF"
                    />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <div>
          <h3 className="text-lg font-display font-bold text-white uppercase">Appointed Ambassadors Directory</h3>
          <p className="text-xs text-slate-400">Browse selected campus leads representing collegiate chapters.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by Name, College, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-white"
            />
          </div>

          {/* State Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl glass-input text-xs bg-wonder-dark-900 text-slate-200"
            >
              <option value="ALL">All States ({ambassadors.length})</option>
              {availableStates.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Ambassadors Results Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAmbassadors.map((amb) => (
          <div
            key={amb.id}
            className="glass-card rounded-2xl p-6 space-y-4 border-slate-800 flex flex-col justify-between group hover:border-amber-500/40"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {amb.ambassadorId}
                </span>
                <span className="text-[11px] font-bold text-amber-400">
                  Rank #{amb.rank}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-display font-bold text-white group-hover:text-amber-400 transition-colors">
                  {amb.name}
                </h3>
                <div className="flex items-start gap-1.5 text-xs text-slate-400 mt-1">
                  <Building className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
                  <span>{amb.college}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  <span>{amb.campus}, {amb.city}, {amb.state}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Selected: <strong className="text-slate-300">{new Date(amb.joinedAt).toLocaleDateString()}</strong>
              </span>

              <Link
                href={`/campus-ambassador/results/${amb.applicationId || amb.ambassadorId}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span>View Letter</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredAmbassadors.length === 0 && (
        <div className="glass-panel p-12 sm:p-16 rounded-3xl text-center space-y-4 border border-slate-800">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Trophy className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-wide">
            SELECTION RESULTS
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto">
            Selection results will appear here once Wonderlight Adventure publishes them.
          </p>
        </div>
      )}

      {/* FULL SCREEN PDF PREVIEW MODAL */}
      {activePdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel w-full max-w-5xl h-[88vh] rounded-3xl p-6 border border-slate-700 flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">{activePdfModal.title} - Official PDF</h3>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={activePdfModal.url}
                  download={activePdfModal.filename}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-glow-emerald"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </a>
                <button
                  onClick={() => setActivePdfModal(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white glass-input"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
              <iframe
                src={activePdfModal.url}
                className="w-full h-full"
                title="PDF Preview Modal"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
