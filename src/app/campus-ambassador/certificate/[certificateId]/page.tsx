'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import QRCode from 'qrcode';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Award,
  Compass,
  Download,
  Printer,
  Calendar,
  Building,
  User,
  ExternalLink,
} from 'lucide-react';
import { dbService } from '@/lib/services/db';
import { CertificateRecord } from '@/types';

export default function CertificateVerificationPage() {
  const params = useParams();
  const certId = params?.certificateId as string;

  const [certificate, setCertificate] = useState<CertificateRecord | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    if (!certId) return;
    const cert = dbService.getCertificateById(certId);
    if (cert) {
      setCertificate(cert);
      QRCode.toDataURL(cert.qrVerificationUrl, {
        width: 180,
        margin: 1,
        color: { dark: '#030712', light: '#ffffff' },
      }).then(setQrCodeUrl);
    }
  }, [certId]);

  const handlePrint = () => {
    window.print();
  };

  if (!certificate) {
    return (
      <div className="min-h-screen py-24 px-4 text-center space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
          <XCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-display font-bold text-white uppercase">Certificate Not Found</h2>
        <p className="text-xs text-slate-400">
          We could not verify any certificate matching identifier <code>{certId}</code> in our public credentials ledger.
        </p>
        <Link href="/campus-ambassador" className="text-emerald-400 text-xs font-semibold hover:underline block pt-2">
          ← Return to Wonderlight Platform
        </Link>
      </div>
    );
  }

  const isValid = !certificate.isRevoked;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto font-sans space-y-8">
      {/* Top Banner Verification Status */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-700/80 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            isValid ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'
          }`}>
            {isValid ? <ShieldCheck className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-slate-400">Public Verification Status</div>
            <div className={`text-lg font-display font-black ${isValid ? 'text-emerald-400' : 'text-red-400'}`}>
              {isValid ? 'OFFICIALLY VERIFIED CERTIFICATE' : 'REVOKED CERTIFICATE'}
            </div>
            <div className="text-[11px] text-slate-400">
              Certificate Ref: <strong>{certificate.certificateId}</strong>
            </div>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold shadow-glow-emerald hover:brightness-110 flex items-center gap-2"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Export PDF</span>
        </button>
      </div>

      {/* Official Certificate Visual Canvas */}
      <div className="glass-panel rounded-3xl p-8 sm:p-14 border-2 border-amber-500/40 shadow-2xl relative overflow-hidden bg-gradient-to-b from-wonder-dark-900 via-wonder-dark-950 to-wonder-dark-900 text-center space-y-8 print:bg-white print:text-black print:border-2 print:border-black">
        {/* Subtle Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <Compass className="w-[500px] h-[500px] text-white" />
        </div>

        {/* Certificate Header */}
        <div className="space-y-3 relative z-10 border-b border-slate-800 print:border-slate-300 pb-6">
          <div className="w-16 h-16 mx-auto rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-emerald-400 shadow-glow-gold overflow-hidden">
            <img
              src="/wla-logo.png"
              alt="WLA Logo"
              className="w-full h-full object-cover rounded-full bg-black"
            />
          </div>

          <div className="text-xs font-extrabold tracking-[0.3em] uppercase text-amber-400 print:text-amber-700">
            WONDERLIGHT ADVENTURE
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-black text-white print:text-black tracking-wider uppercase">
            CERTIFICATE OF {certificate.certificateType.replace('_', ' ')}
          </h2>
          <p className="text-xs text-slate-400 print:text-slate-600 tracking-widest uppercase">
            CAMPUS AMBASSADOR PROGRAM • BATCH {certificate.batch}
          </p>
        </div>

        {/* Recipient Details */}
        <div className="space-y-4 py-4 relative z-10">
          <p className="text-xs text-slate-400 print:text-slate-600 uppercase tracking-widest">
            This credential is officially conferred upon
          </p>
          <div className="text-3xl sm:text-5xl font-display font-black text-emerald-400 print:text-black tracking-tight">
            {certificate.recipientName}
          </div>
          <p className="text-sm text-slate-300 print:text-slate-700 max-w-xl mx-auto leading-relaxed">
            Representing <strong>{certificate.college}</strong> (Ambassador ID: <code className="text-amber-400 print:text-amber-800">{certificate.ambassadorId}</code>) in recognition of demonstrated leadership, exceptional community stewardship, and advancement of youth travel exploration.
          </p>
        </div>

        {/* Footer info & Signatures */}
        <div className="pt-8 border-t border-slate-800 print:border-slate-300 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center relative z-10 text-left sm:text-center text-xs text-slate-400 print:text-slate-600">
          {/* Issue Date */}
          <div className="space-y-1">
            <div className="font-semibold text-white print:text-black">{certificate.issueDate}</div>
            <div className="text-[10px] uppercase tracking-wider">Date of Conformance</div>
          </div>

          {/* QR Verification */}
          <div className="flex flex-col items-center justify-center space-y-1">
            {qrCodeUrl && (
              <div className="p-2 bg-white rounded-xl shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrCodeUrl} alt="Verification QR" className="w-20 h-20" />
              </div>
            )}
            <span className="text-[9px] uppercase tracking-widest font-mono text-slate-400">
              HASH: {certificate.verificationHash.substring(0, 16)}...
            </span>
          </div>

          {/* Authorized Signature */}
          <div className="space-y-1 sm:text-right">
            <div className="font-display font-bold text-white print:text-black text-sm">
              {certificate.signatureName}
            </div>
            <div className="text-[10px] uppercase tracking-wider">{certificate.signatureRole}</div>
            <div className="text-[9px] text-emerald-400">Wonderlight Adventure Directorate</div>
          </div>
        </div>
      </div>
    </div>
  );
}
