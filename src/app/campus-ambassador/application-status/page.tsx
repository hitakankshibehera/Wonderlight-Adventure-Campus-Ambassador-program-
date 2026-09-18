'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Sparkles,
  Award,
  Lock,
  RotateCcw,
  Building,
  MapPin,
  Compass,
} from 'lucide-react';
import { Applicant, ApplicationStatus } from '@/types';
import { useAuth } from '@/lib/services/authContext';
import { EmailOtpVerification } from '@/components/auth/EmailOtpVerification';
import { ResultCelebration } from '@/components/celebration/ResultCelebration';
import { firestoreService } from '@/lib/services/firestoreService';
import { dbService } from '@/lib/services/db';

function ApplicationStatusContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams?.get('id') || '';

  const { loginAs, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState(initialId);
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [requiresOtpVerification, setRequiresOtpVerification] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);

  // Celebration state
  const [showCelebration, setShowCelebration] = useState(false);

  const performSearch = async (queryInput?: string, skipOtpCheck = false) => {
    let trimmed = (queryInput !== undefined ? queryInput : searchQuery).trim();

    // If query is empty, fallback to logged in user's email/appId or first selected candidate in DB
    if (!trimmed) {
      if (user?.email) {
        trimmed = user.email;
      } else {
        const firstSelected = dbService.getApplicants().find((a) => a.status === 'SELECTED');
        trimmed = firstSelected?.applicationId || 'WLA-2026-00001';
      }
      setSearchQuery(trimmed);
    }

    // If searching by Email: Require OTP Verification first
    if (!trimmed.toUpperCase().startsWith('WLA-') && !skipOtpCheck && !verifiedEmail) {
      setRequiresOtpVerification(true);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);
    setNotFound(false);

    try {
      const targetQuery = verifiedEmail || trimmed;
      const result = await firestoreService.getApplicant(targetQuery);

      if (result) {
        console.log('[RESULT] Firestore result received', result);
        console.log('[RESULT] Selection status:', result.status);

        setApplicant(result);
        setNotFound(false);
        setRequiresOtpVerification(false);

        // Auto trigger celebration if status === 'SELECTED'
        if (result.status === 'SELECTED') {
          console.log('[RESULT] Celebration should start! Triggering celebration sprinkles!');
          setShowCelebration(true);
        } else {
          setShowCelebration(false);
        }
      } else {
        console.log('[RESULT] Applicant not found for:', targetQuery);
        setApplicant(null);
        setNotFound(true);
        setShowCelebration(false);
      }
    } catch (err) {
      console.error('[RESULT] Error fetching application status:', err);
      setApplicant(null);
      setNotFound(true);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      setSearchQuery(initialId);
      performSearch(initialId);
    }
  }, [initialId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const handleOtpVerified = (email: string) => {
    setVerifiedEmail(email);
    setRequiresOtpVerification(false);
    performSearch(email, true);
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'SUBMITTED':
        return { label: 'SUBMITTED', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40', icon: Clock };
      case 'UNDER_REVIEW':
        return { label: 'UNDER REVIEW', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40', icon: Clock };
      case 'SHORTLISTED':
        return { label: 'SHORTLISTED', color: 'bg-teal-500/20 text-teal-300 border-teal-500/40', icon: Sparkles };
      case 'INTERVIEW':
        return { label: 'INTERVIEW SCHEDULED', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40', icon: Calendar };
      case 'SELECTED':
        return { label: 'OFFICIALLY SELECTED 🎉', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold shadow-glow-emerald', icon: CheckCircle2 };
      case 'WAITLISTED':
        return { label: 'ON WAITLIST', color: 'bg-amber-600/20 text-amber-300 border-amber-600/40', icon: AlertCircle };
      case 'NOT_SELECTED':
        return { label: 'NOT SELECTED THIS COHORT', color: 'bg-red-500/20 text-red-300 border-red-500/40', icon: XCircle };
      case 'WITHDRAWN':
        return { label: 'WITHDRAWN', color: 'bg-slate-700/40 text-slate-300 border-slate-600/40', icon: XCircle };
      default:
        return { label: status, color: 'bg-slate-800 text-slate-300', icon: Clock };
    }
  };

  const allStages: ApplicationStatus[] = ['SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'SELECTED'];

  const getStageIndex = (status: ApplicationStatus) => {
    if (status === 'SELECTED') return 4;
    if (status === 'INTERVIEW') return 3;
    if (status === 'SHORTLISTED') return 2;
    if (status === 'UNDER_REVIEW') return 1;
    if (status === 'SUBMITTED') return 0;
    return 1;
  };

  return (
    <div className="space-y-10 font-sans">
      {/* Full Screen Multi-Burst Celebration Overlay for Selected Students */}
      {showCelebration && applicant && applicant.status === 'SELECTED' && (
        <ResultCelebration
          applicant={applicant}
          onClose={() => setShowCelebration(false)}
        />
      )}

      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verified Candidate Result Portal</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight uppercase">
          CHECK APPLICATION RESULT
        </h1>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Enter your Application ID (e.g., WLA-2026-00001) or registered email address to check your official selection status and start the celebration!
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 absolute left-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Enter Application ID or email address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-48 py-4 rounded-2xl glass-input text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="absolute right-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-glow-emerald transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isSearching ? (
              <>
                <img src="/wla-logo.png" alt="WLA Logo" className="w-4 h-4 rounded-full object-cover animate-spin" />
                <span>Checking...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>CHECK MY RESULT</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* SEARCHING LOADER */}
      {isSearching && (
        <div className="max-w-md mx-auto text-center space-y-4 py-8 animate-in fade-in">
          <div className="w-14 h-14 mx-auto rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-emerald-400 shadow-glow-gold overflow-hidden animate-pulse">
            <img src="/wla-logo.png" alt="WLA Logo" className="w-full h-full object-cover rounded-full bg-black animate-spin" style={{ animationDuration: '3s' }} />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-display font-bold text-white uppercase tracking-wider">
              Checking your result...
            </h3>
            <p className="text-xs text-slate-400">Querying Firestore database record...</p>
          </div>
        </div>
      )}

      {/* OTP VERIFICATION MODAL WHEN SEARCHING BY EMAIL */}
      {requiresOtpVerification && !isSearching && (
        <div className="max-w-md mx-auto animate-in fade-in zoom-in-95 duration-200">
          <div className="mb-4 text-center text-xs text-amber-400 bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl flex items-center justify-center gap-2">
            <Lock className="w-4 h-4 shrink-0 text-amber-400" />
            <span>Identity Protection: Verify your email via 4-digit OTP to access candidate file details.</span>
          </div>
          <EmailOtpVerification
            initialEmail={searchQuery.includes('@') ? searchQuery : ''}
            onSuccess={handleOtpVerified}
            titleOverride="VERIFY EMAIL TO TRACK STATUS"
            subtitleOverride="Enter your email to receive a 4-digit verification code before viewing application status."
          />
        </div>
      )}

      {/* RESULTS DISPLAY */}
      {hasSearched && !requiresOtpVerification && !isSearching && (
        <div className="max-w-3xl mx-auto">
          {notFound ? (
            <div className="glass-panel rounded-3xl p-8 text-center space-y-4 border border-rose-500/30 animate-in fade-in">
              <div className="w-14 h-14 mx-auto rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/30">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-display font-bold text-white uppercase">APPLICATION NOT FOUND</h3>
              <p className="text-slate-400 text-xs max-w-sm mx-auto">
                We couldn&apos;t find an application matching &quot;<strong>{searchQuery}</strong>&quot;. Please check your ID spelling or verify with your email address.
              </p>
              <div className="pt-2">
                <Link
                  href="/campus-ambassador/apply"
                  className="px-5 py-2.5 bg-emerald-500 text-slate-950 text-xs font-bold rounded-xl inline-flex items-center gap-1.5"
                >
                  <span>Submit New Application</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            applicant && (
              <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800 space-y-8 animate-in fade-in shadow-2xl">
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                      Candidate Details
                    </div>
                    <h2 className="text-2xl font-display font-black text-white">{applicant.fullName}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {applicant.college} • {applicant.course} ({applicant.year})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {(() => {
                      const badge = getStatusBadge(applicant.status);
                      const BadgeIcon = badge.icon;
                      return (
                        <div
                          className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 ${badge.color}`}
                        >
                          <BadgeIcon className="w-4 h-4" />
                          <span>{badge.label}</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* STATUS SPECIFIC RENDERING */}
                {/* 1. SELECTED STUDENT EXPERIENCE */}
                {applicant.status === 'SELECTED' && (
                  <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/90 via-teal-950/80 to-slate-900 border border-emerald-500/40 text-center space-y-4 relative overflow-hidden shadow-2xl">
                      <div className="text-4xl">🎉</div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-wide">
                          CONGRATULATIONS, {applicant.fullName.split(' ')[0].toUpperCase()}!
                        </h3>
                        <p className="text-xs sm:text-sm font-bold text-emerald-400 mt-1 uppercase tracking-widest">
                          YOU HAVE BEEN SELECTED AS A WONDERLIGHT CAMPUS AMBASSADOR
                        </p>
                        <p className="text-xs text-slate-300 max-w-md mx-auto mt-2">
                          Representing <strong>{applicant.college}</strong> ({applicant.city}). Official appointment letter and ambassador credentials have been generated.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl glass-card border-emerald-500/30 max-w-md mx-auto grid grid-cols-2 gap-3 text-left text-xs bg-slate-950/60">
                        <div>
                          <div className="text-slate-500 uppercase tracking-wider text-[9px]">Ambassador ID</div>
                          <div className="text-amber-400 font-mono font-black text-sm">{applicant.ambassadorId || 'WLA-CAP-001'}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 uppercase tracking-wider text-[9px]">Application ID</div>
                          <div className="text-emerald-400 font-mono font-bold text-sm">{applicant.applicationId}</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        <button
                          onClick={() => {
                            const ambId = applicant.ambassadorId || applicant.applicationId;
                            loginAs('AMBASSADOR', ambId);
                            window.location.href = '/ambassador/dashboard';
                          }}
                          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs rounded-xl uppercase tracking-wider shadow-glow-emerald hover:brightness-110 cursor-pointer"
                        >
                          START YOUR JOURNEY →
                        </button>

                        <button
                          onClick={() => setShowCelebration(true)}
                          className="px-4 py-3 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Replay Celebration 🎉</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. WAITLISTED CANDIDATE EXPERIENCE */}
                {applicant.status === 'WAITLISTED' && (
                  <div className="p-8 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-center space-y-4">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                      <AlertCircle className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-2xl font-display font-black text-white uppercase">
                        YOU&apos;RE ON THE WAITLIST
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                        Your application for <strong>{applicant.college}</strong> is currently placed on the Wonderlight Campus Ambassador official waitlist.
                      </p>
                    </div>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Should a campus slot open in your region or during supplementary cohort expansions, our program management team will contact you directly at <strong>{applicant.email}</strong>.
                    </p>
                  </div>
                )}

                {/* 3. NOT SELECTED CANDIDATE EXPERIENCE */}
                {applicant.status === 'NOT_SELECTED' && (
                  <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 text-center space-y-4">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center border border-slate-700">
                      <XCircle className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-2xl font-display font-black text-white uppercase">
                        THANK YOU FOR APPLYING
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                        We sincerely appreciate your interest in joining the Wonderlight Campus Ambassador Program.
                      </p>
                    </div>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Due to high application volume for Cohort 2026–27, we were unable to offer you a position at this time. We encourage you to participate in upcoming open expeditions and reapply next session.
                    </p>
                  </div>
                )}

                {/* Progress bar timeline for Active lifecycle */}
                {applicant.status !== 'NOT_SELECTED' && applicant.status !== 'WITHDRAWN' && applicant.status !== 'WAITLISTED' && (
                  <div className="space-y-4">
                    <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Selection Lifecycle Stage
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {allStages.map((stageName, idx) => {
                        const currentIdx = getStageIndex(applicant.status);
                        const isDone = idx <= currentIdx;

                        return (
                          <div key={stageName} className="space-y-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                isDone
                                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                                  : 'bg-slate-800'
                              }`}
                            />
                            <div className="text-[10px] text-center font-bold text-slate-400 capitalize truncate">
                              {stageName.replace('_', ' ')}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Candidate Overview Card */}
                <div className="p-5 rounded-2xl glass-card grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <div className="text-slate-500 uppercase tracking-widest">Application ID</div>
                    <div className="text-emerald-400 font-mono font-bold mt-1">{applicant.applicationId}</div>
                  </div>

                  <div>
                    <div className="text-slate-500 uppercase tracking-widest">Submission Date</div>
                    <div className="text-slate-200 font-semibold mt-1">
                      {new Date(applicant.createdAt || applicant.timeline[0]?.timestamp || Date.now()).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-500 uppercase tracking-widest">City / State</div>
                    <div className="text-slate-200 font-semibold mt-1">
                      {applicant.city}, {applicant.state}
                    </div>
                  </div>

                  <div>
                    <div className="text-slate-500 uppercase tracking-widest">Verification Status</div>
                    <div className="text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified ✓</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default function ApplicationStatusPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto font-sans">
      <Suspense fallback={<div className="text-center text-slate-400 text-sm py-12">Loading status tracker...</div>}>
        <ApplicationStatusContent />
      </Suspense>
    </div>
  );
}
