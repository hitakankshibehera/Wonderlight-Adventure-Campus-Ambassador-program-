'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Building,
  Users,
  DollarSign,
  FileText,
  Send,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/lib/services/authContext';
import { dbService } from '@/lib/services/db';

export default function EventProposalPage() {
  const { ambassadorProfile, user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    eventName: '',
    college: ambassadorProfile?.college || '',
    venue: '',
    date: '',
    expectedParticipants: '50-100',
    eventType: 'Workshop',
    objective: '',
    description: '',
    supportRequired: '',
    estimatedBudget: '',
    proposalFileUrl: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Record audit log and store draft event proposal for admin review
      dbService.addAuditLog({
        userId: user?.id || 'ambassador',
        userEmail: user?.email || 'ambassador@wonderlight.adventure',
        action: 'PROPOSE_CAMPUS_EVENT',
        details: `Submitted proposal for campus event "${form.eventName}" at ${form.college} (Status: UNDER_REVIEW)`,
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 font-sans">
      <div className="flex items-center gap-3">
        <Link
          href="/ambassador/events"
          className="p-2 rounded-xl glass-input text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-display font-black text-white uppercase">
            PROPOSE CAMPUS EVENT
          </h1>
          <p className="text-xs text-slate-400">
            Submit a campus event proposal for Wonderlight Admin review and sponsorship approval.
          </p>
        </div>
      </div>

      {submitted ? (
        <div className="glass-panel p-8 rounded-3xl border border-emerald-500/40 text-center space-y-4 shadow-glow-emerald">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-display font-black text-white uppercase">
            PROPOSAL SUBMITTED FOR REVIEW!
          </h2>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Your event proposal for <strong>{form.eventName}</strong> has been received by Wonderlight Event Operations. Status: <span className="text-amber-400 font-bold">UNDER REVIEW</span>.
          </p>
          <div className="pt-2">
            <Link
              href="/ambassador/events"
              className="px-6 py-2.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl"
            >
              Return to Events Portal
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
            <span>Official Approval Required: Ambassadors cannot publish official events directly. All proposed events require Admin review.</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Event Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Himalayan Travel Photography Contest 2026"
                value={form.eventName}
                onChange={(e) => setForm({ ...form, eventName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">College Campus</label>
                <input
                  type="text"
                  required
                  value={form.college}
                  onChange={(e) => setForm({ ...form, college: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Venue / Auditorium</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Campus Seminar Hall 3"
                  value={form.venue}
                  onChange={(e) => setForm({ ...form, venue: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Proposed Date</label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Expected Participants</label>
                <select
                  value={form.expectedParticipants}
                  onChange={(e) => setForm({ ...form, expectedParticipants: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs bg-wonder-dark-900 text-slate-200"
                >
                  <option value="25-50">25–50 Students</option>
                  <option value="50-100">50–100 Students</option>
                  <option value="100-250">100–250 Students</option>
                  <option value="250+">250+ Students</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Event Type</label>
                <select
                  value={form.eventType}
                  onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs bg-wonder-dark-900 text-slate-200"
                >
                  <option value="Workshop">Workshop</option>
                  <option value="Travel Quiz">Travel Quiz</option>
                  <option value="Photography Contest">Photography Contest</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Group Trip">Group Trip</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Objective &amp; Description</label>
              <textarea
                required
                rows={3}
                placeholder="Describe the purpose of this campus event..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Support Required (Banner, Banners, Merch)</label>
                <input
                  type="text"
                  placeholder="e.g. 50 T-shirts, Standees, Goodies"
                  value={form.supportRequired}
                  onChange={(e) => setForm({ ...form, supportRequired: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Estimated Budget (INR)</label>
                <input
                  type="text"
                  placeholder="e.g. ₹5,000"
                  value={form.estimatedBudget}
                  onChange={(e) => setForm({ ...form, estimatedBudget: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-glow-emerald hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>SUBMIT PROPOSAL FOR ADMIN APPROVAL</span>
          </button>
        </form>
      )}
    </div>
  );
}
