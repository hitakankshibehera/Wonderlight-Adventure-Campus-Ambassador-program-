'use client';

import React, { useState, useEffect } from 'react';
import {
  QrCode,
  CheckCircle2,
  AlertCircle,
  Search,
  Users,
  Calendar,
  Sparkles,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { dbService } from '@/lib/services/db';
import { EventItem, EventRegistration } from '@/types';
import { useAuth } from '@/lib/services/authContext';

export default function AdminAttendanceCheckInPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('ALL');
  const [qrInput, setQrInput] = useState('');
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string; reg?: EventRegistration } | null>(null);

  useEffect(() => {
    const refresh = () => {
      setEvents(dbService.getEvents());
      setRegistrations(dbService.getEventRegistrations());
    };
    refresh();
    return dbService.subscribe(refresh);
  }, []);

  const handleCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrInput.trim()) return;

    const res = dbService.checkInAttendee(qrInput, user?.displayName || 'Lead Event Manager');
    setScanResult({
      success: res.success,
      message: res.message,
      reg: res.registration,
    });
    setQrInput('');
  };

  const filteredRegistrations = registrations.filter((r) =>
    selectedEventId === 'ALL' || r.eventId === selectedEventId
  );

  const attendedCount = filteredRegistrations.filter((r) => r.status === 'ATTENDED').length;
  const attendancePct = filteredRegistrations.length > 0
    ? Math.round((attendedCount / filteredRegistrations.length) * 100)
    : 0;

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold border border-cyan-500/30">
          <QrCode className="w-3.5 h-3.5" />
          <span>Real-time Venue Desk</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-display font-black text-white uppercase mt-1">
          QR CODE ATTENDANCE SCANNER
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Scan attendee event passes or search student names/emails to verify check-in and prevent duplicate entry.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Total Registrations</div>
          <div className="text-3xl font-display font-black text-white mt-1">{filteredRegistrations.length}</div>
          <div className="text-[10px] text-slate-500">Confirmed passes issued</div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Verified Check-ins</div>
          <div className="text-3xl font-display font-black text-emerald-400 mt-1">{attendedCount}</div>
          <div className="text-[10px] text-slate-500">Admitted to venue</div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Attendance Rate</div>
          <div className="text-3xl font-display font-black text-amber-400 mt-1">{attendancePct}%</div>
          <div className="text-[10px] text-slate-500">Live turnout velocity</div>
        </div>
      </div>

      {/* Scanner Input Panel */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/40 shadow-glow-cyan space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-display font-bold text-white uppercase tracking-wider">
              Scan Pass or Search Participant
            </h3>
            <p className="text-xs text-slate-400">Scan QR via barcode reader or type registration ID / email</p>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="px-3.5 py-2 rounded-xl glass-input text-xs bg-wonder-dark-900 text-slate-200"
            >
              <option value="ALL">All Events ({events.length})</option>
              {events.map((ev) => (
                <option key={ev.eventId} value={ev.eventId}>
                  {ev.title} ({ev.city})
                </option>
              ))}
            </select>
          </div>
        </div>

        <form onSubmit={handleCheckIn} className="flex gap-3">
          <div className="relative flex-1">
            <QrCode className="w-5 h-5 absolute left-3.5 top-3 text-cyan-400 pointer-events-none" />
            <input
              type="text"
              autoFocus
              placeholder="Paste encrypted QR string, Registration ID, or Attendee Email..."
              value={qrInput}
              onChange={(e) => setQrInput(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl glass-input text-xs sm:text-sm font-mono"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-glow-cyan hover:brightness-110 flex items-center gap-2 flex-shrink-0"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>VERIFY &amp; CHECK-IN</span>
          </button>
        </form>

        {/* Demo Quick Paste Buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span>Try scanning demo passes:</span>
          <button
            type="button"
            onClick={() => setQrInput('WLA-EVT-REG-01-AARAV-EVT-2026-001')}
            className="text-cyan-400 hover:underline font-mono text-[11px]"
          >
            Aarav Pass (EVT-001)
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setQrInput('WLA-EVT-REG-02-ANANYA-EVT-2026-002')}
            className="text-cyan-400 hover:underline font-mono text-[11px]"
          >
            Ananya Pass (EVT-002)
          </button>
        </div>

        {/* Scan Result Notification */}
        {scanResult && (
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3.5 animate-in fade-in ${
              scanResult.success
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-500/10 border-amber-500/40 text-amber-300'
            }`}
          >
            {scanResult.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            )}
            <div className="space-y-0.5 text-xs">
              <div className="font-bold text-sm text-white">{scanResult.message}</div>
              {scanResult.reg && (
                <div className="text-slate-300">
                  Attendee: <strong>{scanResult.reg.attendeeName}</strong> ({scanResult.reg.college}) • Event: {scanResult.reg.eventId}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Live Registration Check-In Roster */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Participant List &amp; Live Attendance Status</span>
          <span className="text-emerald-400 font-semibold">{attendedCount} Checked In</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {filteredRegistrations.map((r) => (
            <div key={r.id} className="p-4 flex items-center justify-between gap-4 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{r.attendeeName}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    r.status === 'ATTENDED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {r.status}
                  </span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  {r.college} • {r.email} • Event: <code className="text-amber-400">{r.eventId}</code>
                </div>
              </div>

              <div className="text-right">
                {r.status === 'ATTENDED' ? (
                  <div className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" />
                    <span>Checked in at {new Date(r.checkedInAt || '').toLocaleTimeString()}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      dbService.checkInAttendee(r.qrCodeData, user?.displayName || 'Admin');
                      setRegistrations(dbService.getEventRegistrations());
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold hover:bg-emerald-500/30 text-[11px]"
                  >
                    Manual Check-In
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredRegistrations.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-500">
              No registrations found for the selected event.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
