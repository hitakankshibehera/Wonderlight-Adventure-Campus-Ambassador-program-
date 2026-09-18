'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Trophy,
  Sparkles,
  Award,
  CheckCircle2,
  Building,
  MapPin,
  Calendar,
  ArrowRight,
  RotateCcw,
  Compass,
  X,
  RefreshCw,
} from 'lucide-react';
import { Applicant } from '@/types';
import { useAuth } from '@/lib/services/authContext';
import { firestoreService } from '@/lib/services/firestoreService';
import { PartyPopperSprinkles } from './PartyPopperSprinkles';

interface ResultCelebrationProps {
  applicant: Applicant;
  onClose?: () => void;
  autoPlay?: boolean;
}

export function ResultCelebration({ applicant, onClose, autoPlay = true }: ResultCelebrationProps) {
  const router = useRouter();
  const { loginAs } = useAuth();

  // Stage 1: SUSPENSE (0s-1.2s) | Stage 2: REVEAL (1.2s-2.4s) | Stage 3: CELEBRATION (2.4s+)
  const [stage, setStage] = useState<'SUSPENSE' | 'REVEAL' | 'CELEBRATION'>(
    autoPlay ? 'SUSPENSE' : 'CELEBRATION'
  );

  const [reducedMotion, setReducedMotion] = useState(false);
  const [sprinkleKey, setSprinkleKey] = useState(1);

  // Extract real student name & ambassador ID
  const studentFullName = applicant.fullName || 'Selected Candidate';
  const firstName = studentFullName.trim().split(' ')[0] || studentFullName;
  const ambassadorId =
    applicant.ambassadorId ||
    `WLA-${(applicant.college || 'IND').split(' ').map((w) => w[0]).join('').substring(0, 4).toUpperCase()}-001`;

  // Debug log on mount
  useEffect(() => {
    console.log('[RESULT] Celebration animation mounted for:', studentFullName);
    console.log('[RESULT] Selection status:', applicant.status);

    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);
    }
  }, [studentFullName, applicant.status]);

  // Stage Transitions
  useEffect(() => {
    if (!autoPlay) {
      setStage('CELEBRATION');
      return;
    }

    // Stage 2: REVEAL at 1.2s
    const t1 = setTimeout(() => {
      setStage('REVEAL');
    }, 1200);

    // Stage 3: CELEBRATION at 2.4s
    const t2 = setTimeout(() => {
      setStage('CELEBRATION');
      console.log('[RESULT] Celebration stage reached - firing major burst!');
      firestoreService.markCelebrationShown(applicant.id || applicant.applicationId);
    }, 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [autoPlay, applicant.id, applicant.applicationId]);

  const handleStartJourney = () => {
    loginAs('AMBASSADOR', ambassadorId);
    router.push('/ambassador/dashboard');
  };

  const handleReplay = () => {
    console.log('[RESULT] Replaying celebration sequence');
    setSprinkleKey((prev) => prev + 1);
    setStage('SUSPENSE');
    setTimeout(() => {
      setStage('REVEAL');
    }, 1000);
    setTimeout(() => {
      setStage('CELEBRATION');
    }, 2200);
  };

  const handleAdminReset = async () => {
    await firestoreService.resetCelebrationShown(applicant.id || applicant.applicationId);
    alert('Celebration flag reset! You can test the initial reveal again.');
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl overflow-hidden font-sans"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999,
      }}
    >
      {/* 60 FPS HTML5 Canvas Animated Party Popper Sprinkles Engine */}
      {!reducedMotion && <PartyPopperSprinkles key={sprinkleKey} />}

      {/* Close button if provided */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2.5 rounded-full bg-slate-900/90 text-slate-400 hover:text-white border border-slate-700/80 transition-colors pointer-events-auto"
          style={{ zIndex: 999999999 }}
          title="Close Celebration"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* STAGE 1: SUSPENSE */}
      {stage === 'SUSPENSE' && (
        <div
          className="text-center space-y-6 animate-in zoom-in-95 duration-500 pointer-events-auto relative"
          style={{ zIndex: 99999999 }}
        >
          <div className="w-20 h-20 mx-auto rounded-full p-1 bg-gradient-to-tr from-amber-400 via-emerald-400 to-teal-400 shadow-glow-gold animate-pulse overflow-hidden">
            <img src="/wla-logo.png" alt="WLA Logo" className="w-full h-full object-cover rounded-full bg-black animate-spin" style={{ animationDuration: '4s' }} />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-wider">
              Checking your result...
            </h2>
            <div className="flex items-center justify-center gap-1.5 text-amber-400 font-bold text-lg">
              <span className="animate-bounce" style={{ animationDelay: '0ms' }}>•</span>
              <span className="animate-bounce" style={{ animationDelay: '200ms' }}>•</span>
              <span className="animate-bounce" style={{ animationDelay: '400ms' }}>•</span>
            </div>
            <p className="text-sm text-slate-400 italic">Your journey is about to begin...</p>
          </div>
        </div>
      )}

      {/* STAGE 2: REVEAL */}
      {stage === 'REVEAL' && (
        <div
          className="text-center space-y-4 animate-in zoom-in-90 duration-500 pointer-events-auto relative"
          style={{ zIndex: 99999999 }}
        >
          <div className="text-5xl sm:text-7xl">🎉</div>
          <h1 className="text-4xl sm:text-6xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-200 tracking-tight uppercase">
            CONGRATULATIONS, {firstName.toUpperCase()}!
          </h1>
          <p className="text-lg sm:text-xl font-bold text-emerald-400 tracking-widest uppercase">
            YOU HAVE BEEN SELECTED AS A WONDERLIGHT CAMPUS AMBASSADOR
          </p>
        </div>
      )}

      {/* STAGE 3: CELEBRATION MODAL CARD */}
      {stage === 'CELEBRATION' && (
        <div
          className="relative w-full max-w-xl animate-in zoom-in-95 duration-500 pointer-events-auto"
          style={{ zIndex: 99999999 }}
        >
          {/* Ambient Glow */}
          <div className="absolute -inset-1 rounded-[36px] bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-400 opacity-40 blur-2xl animate-pulse pointer-events-none" />

          {/* Central Glassmorphic Card */}
          <div className="relative glass-panel rounded-3xl p-6 sm:p-10 border border-amber-500/40 shadow-2xl space-y-6 text-center bg-gradient-to-b from-slate-900/95 via-slate-950/98 to-slate-900/95">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-glow-gold">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>OFFICIAL APPOINTMENT NOTICE 2026–27</span>
            </div>

            {/* Main Header */}
            <div className="space-y-2">
              <div className="text-4xl sm:text-5xl">🎉</div>
              <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight">
                CONGRATULATIONS!
              </h1>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-amber-300 uppercase">
                {studentFullName}
              </h2>
              <p className="text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-widest mt-1">
                YOU HAVE BEEN SELECTED AS A WONDERLIGHT CAMPUS AMBASSADOR
              </p>
            </div>

            {/* Credentials Box */}
            <div className="p-5 rounded-2xl glass-card border-slate-800 grid grid-cols-2 gap-4 text-left text-xs bg-slate-900/60">
              <div>
                <div className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">
                  Candidate Name
                </div>
                <div className="text-white font-bold text-sm mt-0.5 truncate">{studentFullName}</div>
              </div>

              <div>
                <div className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">
                  Ambassador ID
                </div>
                <div className="text-amber-400 font-mono font-black text-base mt-0.5">
                  {ambassadorId}
                </div>
              </div>

              <div>
                <div className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">
                  Designated Campus
                </div>
                <div className="text-slate-200 font-semibold mt-0.5 truncate">{applicant.college}</div>
              </div>

              <div>
                <div className="text-slate-400 font-medium uppercase tracking-wider text-[10px]">
                  City / State
                </div>
                <div className="text-slate-200 font-semibold mt-0.5">
                  {applicant.city}, {applicant.state}
                </div>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleStartJourney}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-glow-emerald hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>START YOUR JOURNEY →</span>
              </button>

              <div className="flex items-center justify-between gap-3 text-xs">
                <Link
                  href={`/campus-ambassador/results/${applicant.applicationId || applicant.id}`}
                  className="flex-1 py-2.5 rounded-xl glass-input text-slate-300 hover:text-white font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>Appointment Letter</span>
                </Link>

                <button
                  onClick={handleReplay}
                  className="px-3.5 py-2.5 rounded-xl glass-input text-slate-400 hover:text-white font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  title="Replay Celebration Animation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Replay 🎉</span>
                </button>

                <button
                  onClick={handleAdminReset}
                  className="p-2.5 rounded-xl glass-input text-slate-500 hover:text-amber-400 text-[10px] font-medium"
                  title="Admin Reset Celebration Flag"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
