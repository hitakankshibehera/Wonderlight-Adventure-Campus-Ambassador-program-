'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { CheckCircle2, ArrowRight, Home, FileText, Sparkles, ShieldCheck, Mail, GraduationCap } from 'lucide-react';
import { dbService } from '@/lib/services/db';
import { Applicant } from '@/types';

function ApplicationSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams?.get('id') || '';

  const [applicant, setApplicant] = useState<Applicant | null>(null);

  useEffect(() => {
    if (id) {
      const app = dbService.getApplicantById(id);
      if (app) {
        setApplicant(app);
      }
    } else {
      const all = dbService.getApplicants();
      if (all.length > 0) {
        setApplicant(all[0]);
      }
    }

    // Trigger celebration confetti from top left & top right corners for 3-5 seconds
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      try {
        const duration = 4 * 1000;
        const animationEnd = Date.now() + duration;

        const frame = () => {
          confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.1 },
            colors: ['#10b981', '#f59e0b', '#06b6d4', '#ffffff'],
          });
          confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.1 },
            colors: ['#10b981', '#f59e0b', '#06b6d4', '#ffffff'],
          });

          if (Date.now() < animationEnd) {
            requestAnimationFrame(frame);
          }
        };
        frame();
      } catch (err) {
        console.warn('Confetti error:', err);
      }
    }
  }, [id]);

  const firstName = applicant?.fullName ? applicant.fullName.split(' ')[0] : 'Student';

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto font-sans">
      <div className="w-full space-y-8 text-center">
        {/* Main Card */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-6 relative overflow-hidden shadow-emerald-500/10">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Celebration Icon */}
          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto mb-4 bg-emerald-500/20 border-2 border-emerald-400 rounded-full flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/30 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>REGISTRATION SUCCESSFUL 🎉</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight uppercase">
              CONGRATULATIONS, {firstName}!
            </h1>
            
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-md mx-auto">
              Your Campus Ambassador application has been successfully submitted to the Wonderlight Portal.
            </p>
          </div>

          {/* Details Card */}
          <div className="bg-slate-950/80 rounded-2xl p-6 border border-slate-800 space-y-4 text-left relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-800/80 text-xs">
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-bold tracking-wider block mb-1">
                  Full Name
                </span>
                <strong className="text-white text-sm font-semibold">{applicant?.fullName || 'Registered Student'}</strong>
              </div>

              <div>
                <span className="text-slate-400 uppercase text-[10px] font-bold tracking-wider block mb-1">
                  Application ID
                </span>
                <strong className="text-emerald-400 font-mono text-sm font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30 inline-block">
                  {applicant?.applicationId || id || 'WLA-2026-00001'}
                </strong>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300 truncate">{applicant?.email || 'Student Email'}</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-slate-300 truncate">{applicant?.college || 'College Campus'}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Application Status:</span>
              <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-500/40 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span>SUBMITTED</span>
              </span>
            </div>
          </div>

          {/* Next Steps Box */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-left space-y-2 relative z-10">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Next Steps in Selection Process:</span>
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Our evaluation committee is reviewing your leadership profile. Confirmation details have been sent from <strong className="text-amber-300">wonderlightadventure@gmail.com</strong>.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 relative z-10">
            <Link
              href={`/campus-ambassador/application-status?id=${applicant?.applicationId || id}`}
              className="py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-xs shadow-glow-emerald transition-all flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>VIEW APPLICATION STATUS</span>
            </Link>

            <Link
              href="/campus-ambassador"
              className="py-3.5 px-4 glass-input hover:bg-slate-800 text-white font-bold rounded-xl text-xs border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4 text-emerald-400" />
              <span>GO TO HOME</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ApplicationSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-emerald-400 font-bold animate-pulse text-sm">Loading registration details...</div>
      </div>
    }>
      <ApplicationSuccessContent />
    </Suspense>
  );
}
