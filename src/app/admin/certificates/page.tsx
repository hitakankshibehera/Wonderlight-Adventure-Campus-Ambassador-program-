'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Award,
  Plus,
  ShieldCheck,
  XCircle,
  ExternalLink,
  Printer,
  Calendar,
  Users,
  Search,
} from 'lucide-react';
import { dbService } from '@/lib/services/db';
import { CertificateRecord, Ambassador } from '@/types';

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [form, setForm] = useState({
    recipientName: '',
    ambassadorId: '',
    college: '',
    programName: 'Wonderlight Campus Ambassador Program',
    batch: '2026–27',
    certificateType: 'EXCELLENCE' as CertificateRecord['certificateType'],
    signatureName: 'Vikramaditya Sengupta',
    signatureRole: 'Director of Youth Programs & Expeditions',
  });

  useEffect(() => {
    const refresh = () => {
      setCertificates(dbService.getCertificates());
      setAmbassadors(dbService.getAmbassadors());
    };
    refresh();
    return dbService.subscribe(refresh);
  }, []);

  const handleIssueCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    dbService.generateCertificate(form);
    setShowIssueModal(false);
  };

  const handleRevoke = (certId: string) => {
    if (window.confirm(`Revoke certificate ${certId}? This invalidates public verification.`)) {
      dbService.revokeCertificate(certId);
    }
  };

  const handleSelectAmbassador = (ambId: string) => {
    const amb = ambassadors.find((a) => a.ambassadorId === ambId);
    if (amb) {
      setForm({
        ...form,
        recipientName: amb.name,
        ambassadorId: amb.ambassadorId,
        college: amb.college,
      });
    }
  };

  const filteredCertificates = certificates.filter((c) =>
    c.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.certificateId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.college.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            <Award className="w-3.5 h-3.5" />
            <span>Digital Credential Authority</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-black text-white uppercase mt-1">
            CERTIFICATE ISSUANCE &amp; VERIFICATION
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Issue cryptographically hashed certificates of appointment, cohort excellence, and revoke invalid credentials.
          </p>
        </div>

        <button
          onClick={() => setShowIssueModal(true)}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-glow-emerald hover:brightness-110 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>ISSUE CERTIFICATE</span>
        </button>
      </div>

      {/* Certificates Roster Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search recipient or certificate ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs"
            />
          </div>

          <span className="text-xs text-slate-400">{filteredCertificates.length} credentials issued</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Certificate ID</th>
                <th className="p-4">Recipient &amp; Campus</th>
                <th className="p-4">Type</th>
                <th className="p-4">Issue Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCertificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-emerald-400">{cert.certificateId}</td>
                  <td className="p-4">
                    <div className="font-bold text-white text-sm">{cert.recipientName}</div>
                    <div className="text-[11px] text-slate-400">{cert.college} ({cert.ambassadorId})</div>
                  </td>
                  <td className="p-4 font-semibold text-amber-300">
                    {cert.certificateType.replace('_', ' ')}
                  </td>
                  <td className="p-4 text-slate-400">{cert.issueDate}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      !cert.isRevoked ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                      {!cert.isRevoked ? 'VALID' : 'REVOKED'}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Link
                      href={`/campus-ambassador/certificate/${cert.certificateId}`}
                      target="_blank"
                      className="px-3 py-1.5 rounded-lg glass-input text-slate-200 hover:text-white font-semibold text-[11px]"
                    >
                      Verify Page
                    </Link>

                    {!cert.isRevoked && (
                      <button
                        onClick={() => handleRevoke(cert.certificateId)}
                        className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 text-[11px] font-semibold"
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Certificate Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl space-y-4">
            <h3 className="text-base font-display font-bold text-white">Issue Official Certificate</h3>

            <form onSubmit={handleIssueCertificate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Ambassador</label>
                <select
                  onChange={(e) => handleSelectAmbassador(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl glass-input bg-wonder-dark-900 text-slate-200"
                >
                  <option value="">Select from active ambassadors...</option>
                  {ambassadors.map((a) => (
                    <option key={a.ambassadorId} value={a.ambassadorId}>
                      {a.name} ({a.ambassadorId} - {a.college})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Recipient Name *</label>
                  <input
                    type="text"
                    required
                    value={form.recipientName}
                    onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl glass-input"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Ambassador ID *</label>
                  <input
                    type="text"
                    required
                    value={form.ambassadorId}
                    onChange={(e) => setForm({ ...form, ambassadorId: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl glass-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Designated College / University</label>
                <input
                  type="text"
                  required
                  value={form.college}
                  onChange={(e) => setForm({ ...form, college: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl glass-input"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Certificate Type</label>
                <select
                  value={form.certificateType}
                  onChange={(e) => setForm({ ...form, certificateType: e.target.value as any })}
                  className="w-full px-3.5 py-2 rounded-xl glass-input bg-wonder-dark-900 text-slate-200"
                >
                  <option value="APPOINTMENT">Certificate of Appointment</option>
                  <option value="EXCELLENCE">Certificate of Excellence</option>
                  <option value="COMPLETION">Certificate of Completion</option>
                  <option value="STAR_PERFORMER">Star Performer Honors</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 rounded-xl glass-input text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold shadow-glow-emerald"
                >
                  Generate &amp; Hash Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
