'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Award,
  Download,
  Printer,
  Compass,
  CheckCircle2,
  Calendar,
  Building,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { dbService } from '@/lib/services/db';
import { Applicant, Ambassador } from '@/types';
import { useAuth } from '@/lib/services/authContext';
import { ResultCelebration } from '@/components/celebration/ResultCelebration';

export default function IndividualResultPage() {
  const params = useParams();
  const router = useRouter();
  const { loginAs } = useAuth();
  const id = params?.id as string;

  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [ambassador, setAmbassador] = useState<Ambassador | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (!id) return;
    const app = dbService.getApplicantById(id);
    if (app) {
      setApplicant(app);
      const amb = dbService.getAmbassadorById(app.applicationId) || dbService.getAmbassadors().find((a) => a.applicationId === app.applicationId);
      if (amb) setAmbassador(amb);

      if (app.status === 'SELECTED') {
        setShowCelebration(true);
      }
    } else {
      // Also try ambassador ID directly
      const amb = dbService.getAmbassadorById(id);
      if (amb) {
        setAmbassador(amb);
        const appFromAmb = dbService.getApplicantById(amb.applicationId);
        if (appFromAmb) {
          setApplicant(appFromAmb);
          if (appFromAmb.status === 'SELECTED') setShowCelebration(true);
        }
      }
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleOpenDashboard = () => {
    if (ambassador) {
      loginAs('AMBASSADOR', ambassador.ambassadorId);
      router.push('/ambassador/dashboard');
    }
  };

  if (!applicant && !ambassador) {
    return (
      <div className="min-h-screen py-24 px-4 text-center space-y-4 font-sans">
        <h2 className="text-xl font-display font-bold text-white">Result Record Not Found</h2>
        <p className="text-xs text-slate-400">Could not find a selected applicant matching &quot;{id}&quot;.</p>
        <Link href="/campus-ambassador/results" className="text-emerald-400 text-xs font-semibold hover:underline">
          ← Back to Selection Results
        </Link>
      </div>
    );
  }

  const candidateName = applicant?.fullName || ambassador?.name || 'Selected Candidate';
  const college = applicant?.college || ambassador?.college || 'University Campus';
  const city = applicant?.city || ambassador?.city || 'India';
  const appId = applicant?.applicationId || ambassador?.applicationId || id;
  const ambId = ambassador?.ambassadorId || `WLA-${city.substring(0, 3).toUpperCase()}-001`;

  const celebApplicant: Applicant = applicant || {
    id: `app-${id}`,
    applicationId: appId,
    ambassadorId: ambId,
    fullName: candidateName,
    email: ambassador?.email || 'ambassador@wonderlight.adventure',
    phone: ambassador?.phone || '',
    college,
    university: college,
    city,
    state: ambassador?.state || 'India',
    course: 'Campus Representative',
    department: 'Youth Expedition',
    year: '2026',
    graduationYear: '2027',
    instagram: '',
    linkedin: '',
    previousAmbassadorExp: 'Yes',
    eventExp: 'Yes',
    marketingExp: 'Yes',
    leadershipExp: 'Yes',
    motivation: 'Selected ambassador',
    promotionStrategy: 'Campus outreach',
    networkSize: '1000+',
    termsAccepted: true,
    status: 'SELECTED',
    timeline: [],
    internalNotes: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto font-sans space-y-8">
      {/* Celebration overlay if triggered */}
      {showCelebration && (
        <ResultCelebration
          applicant={celebApplicant}
          onClose={() => setShowCelebration(false)}
        />
      )}

      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-4 print:hidden">
        <Link
          href="/campus-ambassador/results"
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <span>← All Results</span>
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowCelebration(true)}
            className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay Celebration 🎉</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl glass-input text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-400" />
            <span>Print / Save PDF</span>
          </button>

          <button
            onClick={handleOpenDashboard}
            className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold shadow-glow-emerald hover:brightness-110 flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>OPEN AMBASSADOR DASHBOARD</span>
          </button>
        </div>
      </div>

      {/* Official Selection Letter Document */}
      <div className="glass-panel rounded-3xl p-8 sm:p-14 border border-slate-700/80 shadow-2xl relative overflow-hidden bg-gradient-to-b from-wonder-dark-900 to-wonder-dark-950 print:bg-white print:text-black print:border-none print:shadow-none">
        {/* Subtle Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <Compass className="w-[450px] h-[450px] text-white" />
        </div>

        {/* Letterhead */}
        <div className="border-b border-slate-800 print:border-slate-300 pb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-glow-emerald flex-shrink-0 overflow-hidden">
              <img
                src="/wla-logo.png"
                alt="WLA Logo"
                className="w-full h-full object-cover rounded-full bg-black"
              />
            </div>
            <div>
              <div className="font-display font-black text-xl tracking-wider text-white print:text-black">
                WONDERLIGHT ADVENTURE
              </div>
              <div className="text-[10px] tracking-widest text-emerald-400 font-semibold uppercase">
                Youth Expeditions & Campus Leadership Directorate
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-400 print:text-slate-600">
            <div>Ref: <strong>{appId}/SEL-2026</strong></div>
            <div>Date of Issue: <strong>{new Date().toLocaleDateString()}</strong></div>
            <div className="text-emerald-400 font-semibold">Cohort 2026–27</div>
          </div>
        </div>

        {/* Main Body */}
        <div className="py-8 space-y-6 text-sm text-slate-200 print:text-slate-800 leading-relaxed relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>OFFICIAL LETTER OF APPOINTMENT</span>
          </div>

          <div>
            <p className="font-bold text-white print:text-black text-base">Dear {candidateName},</p>
            <p className="text-xs text-slate-400 print:text-slate-600 mt-0.5">{college} ({city})</p>
          </div>

          <p>
            On behalf of Wonderlight Adventure, we are pleased to inform you that your application has been formally approved. You have been selected as the official <strong>Campus Ambassador</strong> representing Wonderlight Adventure for the academic session 2026–27.
          </p>

          <p>
            Your selection reflects your proactive leadership qualities, passion for outdoor exploration, and ability to build collegiate communities. As a Campus Ambassador, you will spearhead student travel engagement, organize adventure webinars, facilitate certified expeditions, and earn professional commissions and sponsorships.
          </p>

          {/* Credentials Summary Box */}
          <div className="p-6 rounded-2xl glass-card border border-emerald-500/30 grid grid-cols-1 sm:grid-cols-2 gap-4 my-4 print:border-slate-300">
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-widest">Candidate Name</div>
              <div className="text-base font-display font-bold text-white print:text-black">{candidateName}</div>
            </div>

            <div>
              <div className="text-xs text-slate-400 uppercase tracking-widest">Application ID</div>
              <div className="text-base font-display font-bold text-white print:text-black">{appId}</div>
            </div>

            <div>
              <div className="text-xs text-slate-400 uppercase tracking-widest">Appointed Ambassador ID</div>
              <div className="text-lg font-display font-black text-emerald-400 print:text-emerald-700">{ambId}</div>
            </div>

            <div>
              <div className="text-xs text-slate-400 uppercase tracking-widest">Designated Campus</div>
              <div className="text-sm font-medium text-white print:text-black">{college}</div>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-normal">
            Your appointment is subject to the terms of the Wonderlight Ambassador Agreement and adherence to ethical student leadership standards. We welcome you to our nationwide network of collegiate trail blazers!
          </p>
        </div>

        {/* Signature & Seal Footer */}
        <div className="border-t border-slate-800 print:border-slate-300 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1">
            <div className="font-display font-bold text-white print:text-black text-sm">
              Vikramaditya Sengupta
            </div>
            <div className="text-xs text-slate-400">Director of Youth Programs & Expeditions</div>
            <div className="text-[10px] text-emerald-400">Wonderlight Adventure Technologies Pvt. Ltd.</div>
          </div>

          <div className="p-3 rounded-xl border border-dashed border-emerald-500/40 text-center text-[10px] text-slate-400 space-y-0.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto" />
            <div className="font-bold text-white print:text-black">Digitally Verified Document</div>
            <div>Auth Hash: 9a7e12f3b58c49d8</div>
          </div>
        </div>
      </div>
    </div>
  );
}
