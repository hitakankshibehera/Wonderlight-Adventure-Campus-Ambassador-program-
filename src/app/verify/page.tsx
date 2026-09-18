'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, ShieldCheck, CheckCircle2, AlertCircle, Award, GraduationCap, Calendar, Sparkles } from 'lucide-react';
import { dbService } from '@/lib/services/db';

function VerifyContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get('id') || searchParams?.get('cert') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [result, setResult] = useState<any | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = searchQuery.trim();
    if (!clean) return;

    setSearched(true);
    const cert = dbService.getCertificateById(clean) || dbService.getCertificates().find((c) => c.certificateId === clean);
    if (cert) {
      setResult({
        type: 'CERTIFICATE',
        title: cert.title,
        id: cert.certificateId,
        name: cert.recipientName,
        college: cert.college,
        issueDate: cert.issueDate,
        program: 'Campus Ambassador Program 2026–27',
      });
      return;
    }

    const amb = dbService.getAmbassadorById(clean) || dbService.getAmbassadors().find((a) => a.ambassadorId === clean);
    if (amb) {
      setResult({
        type: 'AMBASSADOR_ID',
        title: 'Official Campus Ambassador Appointment',
        id: amb.ambassadorId,
        name: amb.name,
        college: amb.college,
        issueDate: amb.joinedAt,
        program: 'Campus Ambassador Program 2026–27',
      });
      return;
    }

    setResult(null);
  };

  useEffect(() => {
    if (initialQuery) {
      handleSearch();
    }
  }, [initialQuery]);

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto font-sans">
      <div className="w-full space-y-8 text-center">
        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Public Credential Verification Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight uppercase">
            VERIFY CERTIFICATE OR ID
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto">
            Verify official Wonderlight Adventure Certificates and Digital Ambassador Credentials.
          </p>
        </div>

        {/* Search Box */}
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              required
              placeholder="Enter Certificate ID (e.g. CERT-WLA-001) or Ambassador ID (WLA-KIIT-024)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl glass-input text-xs font-mono text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-glow-emerald hover:brightness-110 cursor-pointer"
          >
            VERIFY CREDENTIAL →
          </button>
        </form>

        {/* Verification Display */}
        {searched && (
          <div className="animate-in fade-in">
            {result ? (
              <div className="glass-panel p-8 rounded-3xl border border-emerald-500/40 text-left space-y-5 shadow-2xl shadow-emerald-500/10 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>VERIFIED AUTHENTIC</span>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                    Official Record
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-500 uppercase tracking-wider text-[10px] block">Recipient Name</span>
                    <strong className="text-white text-base font-bold">{result.name}</strong>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-500 uppercase tracking-wider text-[10px] block">Credential ID</span>
                      <strong className="text-emerald-400 font-mono font-bold text-sm">{result.id}</strong>
                    </div>

                    <div>
                      <span className="text-slate-500 uppercase tracking-wider text-[10px] block">Issue Date</span>
                      <strong className="text-slate-200 font-semibold">{new Date(result.issueDate).toLocaleDateString()}</strong>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 uppercase tracking-wider text-[10px] block">College Campus</span>
                    <strong className="text-slate-200">{result.college}</strong>
                  </div>

                  <div>
                    <span className="text-slate-500 uppercase tracking-wider text-[10px] block">Program Cohort</span>
                    <strong className="text-slate-300">{result.program}</strong>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 text-center text-[10px] text-slate-500">
                  Verified by Wonderlight Adventure Digital Registry System • Pan India
                </div>
              </div>
            ) : (
              <div className="glass-panel p-8 rounded-3xl border border-rose-500/30 text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
                <h3 className="text-lg font-display font-bold text-white uppercase">CREDENTIAL NOT FOUND</h3>
                <p className="text-xs text-slate-400">
                  No verified certificate or ambassador record matches &quot;<strong>{searchQuery}</strong>&quot;.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="text-center text-slate-400 text-xs py-12">Loading verification portal...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
