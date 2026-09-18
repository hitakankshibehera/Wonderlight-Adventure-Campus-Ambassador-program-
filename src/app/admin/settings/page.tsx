'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  CheckCircle2,
  ShieldCheck,
  Percent,
  Coins,
  Calendar,
  Mail,
  Send,
  FileText,
  ListFilter,
  Check,
  AlertCircle,
  RefreshCw,
  Lock,
} from 'lucide-react';
import { EmailLogEntry } from '@/lib/services/emailLogsStore';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'EMAIL_SETTINGS' | 'LOGS' | 'TEMPLATES'>('GENERAL');
  const [saved, setSaved] = useState(false);

  // General Settings State
  const [settings, setSettings] = useState({
    programBatch: '2026–27',
    baseCommissionPct: 8,
    voyagerCommissionPct: 10,
    trailblazerCommissionPct: 12,
    starCommissionPct: 15,
    xpPerRupeeSpent: 1,
    attendanceXP: 150,
    autoApproveRegistrations: true,
    applicationDeadline: '2026-10-31',
  });

  // Email Settings State
  const [emailConfig, setEmailConfig] = useState({
    senderName: 'Wonderlight Adventure',
    senderEmail: 'wonderlightadventure@gmail.com',
    provider: 'Gmail / Authenticated SMTP',
    status: 'CONNECTED',
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
  });

  // Test email state
  const [testEmailRecipient, setTestEmailRecipient] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Email Logs state
  const [emailLogs, setEmailLogs] = useState<EmailLogEntry[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Email Templates state (14 templates as specified in Section 20)
  const [templates, setTemplates] = useState([
    { id: '1', name: 'OTP Verification', subject: 'Your Wonderlight Adventure Verification Code' },
    { id: '2', name: 'Application Received', subject: 'Application Received — Wonderlight CAP 2026' },
    { id: '3', name: 'Application Shortlisted', subject: 'Great News! Your Application Has Been Shortlisted' },
    { id: '4', name: 'Interview Invitation', subject: 'Interview Invitation — Wonderlight Ambassador Program' },
    { id: '5', name: 'Selected', subject: '🎉 Congratulations! You Have Been Selected as a Wonderlight Campus Ambassador' },
    { id: '6', name: 'Waitlisted', subject: 'Application Update: Wonderlight Campus Ambassador Cohort' },
    { id: '7', name: 'Not Selected', subject: 'Wonderlight CAP Application Status Update' },
    { id: '8', name: 'Event Registration', subject: 'Event Registration Confirmed — Pass Details Inside' },
    { id: '9', name: 'Event Reminder', subject: 'Reminder: Upcoming Wonderlight Event Tomorrow' },
    { id: '10', name: 'Mission Assigned', subject: 'New Campus Mission Assigned to You' },
    { id: '11', name: 'Mission Approved', subject: 'Mission Submission Approved — XP Credited!' },
    { id: '12', name: 'Reward Unlocked', subject: 'Reward Unlocked — Claim Your Perk' },
    { id: '13', name: 'Certificate Issued', subject: 'Official Certificate of Achievement Issued' },
    { id: '14', name: 'Important Announcement', subject: 'Important Update for Wonderlight Campus Ambassadors' },
  ]);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [editingSubject, setEditingSubject] = useState('');

  // Fetch email config & logs
  const fetchEmailInfo = async () => {
    try {
      const res = await fetch('/api/admin/email-settings');
      const data = await res.json();
      if (data.success) {
        setEmailConfig({
          senderName: data.senderName,
          senderEmail: data.senderEmail,
          provider: data.provider,
          status: data.status,
          smtpHost: data.smtpHost,
          smtpPort: data.smtpPort,
        });
      }
    } catch (e) {
      console.warn('Could not fetch email config', e);
    }
  };

  const fetchLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await fetch('/api/admin/email-logs');
      const data = await res.json();
      if (data.success && data.logs) {
        setEmailLogs(data.logs);
      }
    } catch (e) {
      console.warn('Could not fetch email logs', e);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchEmailInfo();
    fetchLogs();
  }, []);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailRecipient || !testEmailRecipient.includes('@')) return;

    setSendingTest(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/admin/email-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testEmail: testEmailRecipient }),
      });
      const data = await res.json();
      setTestResult({
        success: data.success,
        message: data.message || data.error || 'Test email dispatched.',
      });
      fetchLogs();
    } catch (err: any) {
      setTestResult({
        success: false,
        message: 'Failed to connect to test email service.',
      });
    } finally {
      setSendingTest(false);
    }
  };

  const handleSaveTemplateSubject = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, subject: editingSubject } : t))
    );
    setEditingTemplateId(null);
  };

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700">
            <Settings className="w-3.5 h-3.5" />
            <span>Enterprise Settings</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-black text-white uppercase mt-1">
            GLOBAL SYSTEM SETTINGS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Configure platform parameters, email SMTP dispatch (`wonderlightadventure@gmail.com`), audit logs, and templates.
          </p>
        </div>

        {saved && (
          <span className="text-emerald-400 text-xs font-bold flex items-center gap-1 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved!</span>
          </span>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('GENERAL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'GENERAL'
              ? 'bg-emerald-500 text-slate-950 shadow-glow-emerald'
              : 'glass-input text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Platform Parameters</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('EMAIL_SETTINGS');
            fetchEmailInfo();
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'EMAIL_SETTINGS'
              ? 'bg-emerald-500 text-slate-950 shadow-glow-emerald'
              : 'glass-input text-slate-400 hover:text-white'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Email Infrastructure</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('LOGS');
            fetchLogs();
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'LOGS'
              ? 'bg-emerald-500 text-slate-950 shadow-glow-emerald'
              : 'glass-input text-slate-400 hover:text-white'
          }`}
        >
          <ListFilter className="w-3.5 h-3.5" />
          <span>Email Audit Logs</span>
        </button>

        <button
          onClick={() => setActiveTab('TEMPLATES')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'TEMPLATES'
              ? 'bg-emerald-500 text-slate-950 shadow-glow-emerald'
              : 'glass-input text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Email Templates</span>
        </button>
      </div>

      {/* TAB 1: GENERAL PLATFORM PARAMETERS */}
      {activeTab === 'GENERAL' && (
        <form onSubmit={handleSaveGeneral} className="space-y-6 animate-in fade-in">
          {/* Commission Tiers */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Percent className="w-4 h-4 text-emerald-400" />
              <span>Tier Commission Percentages</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Explorer Tier</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={settings.baseCommissionPct}
                    onChange={(e) => setSettings({ ...settings, baseCommissionPct: parseInt(e.target.value) || 8 })}
                    className="w-full px-3 py-2 rounded-l-xl glass-input font-bold text-emerald-400"
                  />
                  <span className="px-3 py-2 rounded-r-xl bg-slate-800 text-slate-400 border border-l-0 border-slate-700">%</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Voyager Tier</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={settings.voyagerCommissionPct}
                    onChange={(e) => setSettings({ ...settings, voyagerCommissionPct: parseInt(e.target.value) || 10 })}
                    className="w-full px-3 py-2 rounded-l-xl glass-input font-bold text-cyan-400"
                  />
                  <span className="px-3 py-2 rounded-r-xl bg-slate-800 text-slate-400 border border-l-0 border-slate-700">%</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Trailblazer Tier</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={settings.trailblazerCommissionPct}
                    onChange={(e) => setSettings({ ...settings, trailblazerCommissionPct: parseInt(e.target.value) || 12 })}
                    className="w-full px-3 py-2 rounded-l-xl glass-input font-bold text-amber-400"
                  />
                  <span className="px-3 py-2 rounded-r-xl bg-slate-800 text-slate-400 border border-l-0 border-slate-700">%</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Campus Star Tier</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={settings.starCommissionPct}
                    onChange={(e) => setSettings({ ...settings, starCommissionPct: parseInt(e.target.value) || 15 })}
                    className="w-full px-3 py-2 rounded-l-xl glass-input font-bold text-yellow-400"
                  />
                  <span className="px-3 py-2 rounded-r-xl bg-slate-800 text-slate-400 border border-l-0 border-slate-700">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Gamification Rules */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-400" />
              <span>Gamification &amp; Event Rules</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">XP Credited for Verified Event Attendance</label>
                <input
                  type="number"
                  value={settings.attendanceXP}
                  onChange={(e) => setSettings({ ...settings, attendanceXP: parseInt(e.target.value) || 150 })}
                  className="w-full px-3 py-2 rounded-xl glass-input font-bold text-emerald-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Application Cohort Deadline</label>
                <input
                  type="date"
                  value={settings.applicationDeadline}
                  onChange={(e) => setSettings({ ...settings, applicationDeadline: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl glass-input"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoApproveRegistrations}
                  onChange={(e) => setSettings({ ...settings, autoApproveRegistrations: e.target.checked })}
                  className="w-4 h-4 text-emerald-500 rounded bg-slate-800 border-slate-700 focus:ring-emerald-500"
                />
                <span className="text-xs text-slate-300">
                  Auto-approve event registrations and immediately generate QR attendance passes
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-glow-emerald hover:brightness-110 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>SAVE PLATFORM CONFIGURATION</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: EMAIL INFRASTRUCTURE SETTINGS */}
      {activeTab === 'EMAIL_SETTINGS' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-display font-bold text-white uppercase flex items-center gap-2">
                  <Mail className="w-5 h-5 text-emerald-400" />
                  <span>Email Server Configuration</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Official company sender configuration & connection health.</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{emailConfig.status}</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div className="p-4 rounded-2xl glass-card space-y-1">
                <div className="text-slate-400 uppercase tracking-widest">Sender Name</div>
                <div className="text-white font-bold text-sm">{emailConfig.senderName}</div>
              </div>

              <div className="p-4 rounded-2xl glass-card space-y-1">
                <div className="text-slate-400 uppercase tracking-widest">Sender Email</div>
                <div className="text-emerald-400 font-mono font-bold text-sm">{emailConfig.senderEmail}</div>
              </div>

              <div className="p-4 rounded-2xl glass-card space-y-1">
                <div className="text-slate-400 uppercase tracking-widest">Email Provider</div>
                <div className="text-slate-200 font-semibold text-sm">{emailConfig.provider}</div>
              </div>

              <div className="p-4 rounded-2xl glass-card space-y-1">
                <div className="text-slate-400 uppercase tracking-widest">SMTP Host &amp; Port</div>
                <div className="text-slate-200 font-mono text-sm">{emailConfig.smtpHost}:{emailConfig.smtpPort}</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>For security compliance, passwords and secret API tokens are masked and stored securely in server environment variables.</span>
            </div>
          </div>

          {/* Test Email Dispatch Card */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4">
            <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-400" />
              <span>SMTP Connection Test</span>
            </h3>
            <p className="text-xs text-slate-400">
              Send an instant test email from <strong>wonderlightadventure@gmail.com</strong> to verify server connectivity.
            </p>

            <form onSubmit={handleSendTestEmail} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter recipient email address..."
                value={testEmailRecipient}
                onChange={(e) => setTestEmailRecipient(e.target.value)}
                required
                className="flex-1 px-4 py-3 rounded-xl glass-input text-xs text-white placeholder-slate-500"
              />
              <button
                type="submit"
                disabled={sendingTest || !testEmailRecipient}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-glow-emerald transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {sendingTest ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>SENDING...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>SEND TEST EMAIL</span>
                  </>
                )}
              </button>
            </form>

            {testResult && (
              <div
                className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
                  testResult.success
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                {testResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
                <span>{testResult.message}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: EMAIL AUDIT LOGS */}
      {activeTab === 'LOGS' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-display font-bold text-white uppercase flex items-center gap-2">
                <ListFilter className="w-5 h-5 text-emerald-400" />
                <span>Live Email Audit Logs</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Historical log of all dispatched OTPs, selection notices, and notifications.</p>
            </div>

            <button
              onClick={fetchLogs}
              className="px-3 py-1.5 rounded-xl glass-input text-slate-300 text-xs font-semibold flex items-center gap-1.5 hover:text-white cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingLogs ? 'animate-spin' : ''}`} />
              <span>Refresh Logs</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] text-slate-400 uppercase tracking-widest bg-slate-900/80 border-b border-slate-800">
                <tr>
                  <th className="p-3">Sent Time</th>
                  <th className="p-3">Recipient</th>
                  <th className="p-3">Email Type</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Message ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {emailLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-500 italic">
                      No email logs recorded yet.
                    </td>
                  </tr>
                ) : (
                  emailLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3 text-slate-400 whitespace-nowrap">
                        {new Date(log.sentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="p-3 font-semibold text-slate-200">{log.recipient}</td>
                      <td className="p-3 font-sans font-medium text-slate-300">
                        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">{log.emailType}</span>
                      </td>
                      <td className="p-3 font-sans text-slate-300 max-w-xs truncate">{log.subject}</td>
                      <td className="p-3 font-sans">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            log.status === 'SENT'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : log.status === 'SIMULATED'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                              : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500 text-[10px] max-w-[140px] truncate">{log.messageId || 'N/A'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: EMAIL TEMPLATES MANAGER */}
      {activeTab === 'TEMPLATES' && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 animate-in fade-in">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-display font-bold text-white uppercase flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              <span>Admin Email Templates Manager</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Customize email subjects and layout parameters across 14 platform templates.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {templates.map((tmpl) => (
              <div key={tmpl.id} className="p-4 rounded-2xl glass-card space-y-2 border border-slate-800 hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-400 uppercase tracking-wide">{tmpl.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">ID: {tmpl.id}</span>
                </div>

                {editingTemplateId === tmpl.id ? (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={editingSubject}
                      onChange={(e) => setEditingSubject(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg glass-input text-xs text-white"
                    />
                    <button
                      onClick={() => handleSaveTemplateSubject(tmpl.id)}
                      className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-300 font-medium truncate pr-2">{tmpl.subject}</span>
                    <button
                      onClick={() => {
                        setEditingTemplateId(tmpl.id);
                        setEditingSubject(tmpl.subject);
                      }}
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold underline cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
