'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Award,
  ShieldCheck,
  Download,
  ExternalLink,
  Printer,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { dbService } from '@/lib/services/db';
import { useAuth } from '@/lib/services/authContext';
import { CertificateRecord } from '@/types';

export default function AmbassadorCertificatesPage() {
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

  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);

  useEffect(() => {
    const refresh = () => {
      setCertificates(dbService.getCertificates(profile.ambassadorId));
    };
    refresh();
    return dbService.subscribe(refresh);
  }, [profile.ambassadorId]);

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
          <Award className="w-3.5 h-3.5" />
          <span>Verifiable Credentials</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-display font-black text-white uppercase">
          MY CREDENTIALS &amp; CERTIFICATES
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Officially signed certificates of appointment and achievement with tamper-proof cryptographic verification.
        </p>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="glass-panel rounded-3xl p-6 sm:p-8 border border-amber-500/30 space-y-6 shadow-2xl relative overflow-hidden bg-gradient-to-b from-amber-950/20 via-wonder-dark-900 to-wonder-dark-950"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 uppercase tracking-wider">
                {cert.certificateType.replace('_', ' ')}
              </span>
              <span className="text-xs font-mono text-slate-400">{cert.certificateId}</span>
            </div>

            <div className="space-y-2">
              <h3 className="font-display font-black text-white text-xl">
                {cert.programName}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Awarded to <strong>{cert.recipientName}</strong> representing {cert.college} for outstanding leadership in Cohort {cert.batch}.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl glass-card text-xs text-slate-400 space-y-1 border-slate-800">
              <div className="flex justify-between">
                <span>Issue Date:</span>
                <span className="text-white font-medium">{cert.issueDate}</span>
              </div>
              <div className="flex justify-between">
                <span>Signatory:</span>
                <span className="text-white font-medium">{cert.signatureName}</span>
              </div>
              <div className="flex justify-between">
                <span>Verification:</span>
                <span className="text-emerald-400 font-mono text-[10px]">Tamper-Proof SHA-256</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <Link
                href={`/campus-ambassador/certificate/${cert.certificateId}`}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold shadow-glow-emerald hover:brightness-110 flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>VIEW &amp; VERIFY</span>
              </Link>

              <Link
                href={`/campus-ambassador/certificate/${cert.certificateId}`}
                className="px-4 py-2.5 rounded-xl glass-input text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </Link>
            </div>
          </div>
        ))}

        {certificates.length === 0 && (
          <div className="glass-panel p-8 rounded-3xl text-center text-xs text-slate-400 border-slate-800 col-span-2">
            No certificates issued yet. Certificates are automatically issued upon appointment or completing cohort milestones.
          </div>
        )}
      </div>
    </div>
  );
}
