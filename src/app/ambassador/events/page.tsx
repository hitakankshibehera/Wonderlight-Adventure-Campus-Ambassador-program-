'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import {
  Calendar,
  Ticket,
  Clock,
  MapPin,
  CheckCircle2,
  Download,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { dbService } from '@/lib/services/db';
import { useAuth } from '@/lib/services/authContext';
import { EventItem, EventRegistration } from '@/types';

export default function AmbassadorEventsPage() {
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

  const [allEvents, setAllEvents] = useState<EventItem[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [selectedPass, setSelectedPass] = useState<{ reg: EventRegistration; qrUrl: string } | null>(null);

  useEffect(() => {
    const refresh = () => {
      setAllEvents(dbService.getEvents());
      const userRegs = dbService
        .getEventRegistrations()
        .filter((r) => r.ambassadorId === profile.ambassadorId || r.email === profile.email);
      setRegistrations(userRegs);
    };
    refresh();
    return dbService.subscribe(refresh);
  }, [profile.ambassadorId, profile.email]);

  const viewPass = async (reg: EventRegistration) => {
    try {
      const qr = await QRCode.toDataURL(reg.qrCodeData, {
        width: 300,
        margin: 2,
        color: { dark: '#030712', light: '#ffffff' },
      });
      setSelectedPass({ reg, qrUrl: qr });
    } catch (e) {
      console.error(e);
    }
  };

  const registeredEventIds = new Set(registrations.map((r) => r.eventId));

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold border border-cyan-500/30">
          <Calendar className="w-3.5 h-3.5" />
          <span>Events &amp; QR Attendance Pass</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-display font-black text-white uppercase">
          MY EXPEDITIONS &amp; EVENT PASSES
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Manage your confirmed registrations, download encrypted venue check-in passes, and view attendance records.
        </p>
      </div>

      {/* Confirmed Passes Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
          My Registered Passes ({registrations.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {registrations.map((reg) => {
            const ev = allEvents.find((e) => e.eventId === reg.eventId);
            return (
              <div
                key={reg.id}
                className="glass-card rounded-2xl p-6 border-emerald-500/40 space-y-4 shadow-glow-emerald bg-gradient-to-r from-emerald-950/30 to-wonder-dark-900"
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    reg.status === 'ATTENDED' ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {reg.status === 'ATTENDED' ? '✓ ATTENDED (+150 XP)' : 'CONFIRMED PASS'}
                  </span>
                  <span className="text-xs text-slate-400">{ev?.date}</span>
                </div>

                <div>
                  <h4 className="font-display font-bold text-white text-base leading-snug">
                    {ev?.title || reg.eventId}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{ev?.venue}, {ev?.city}</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Attendee: <strong className="text-white">{reg.attendeeName}</strong>
                  </span>
                  <button
                    onClick={() => viewPass(reg)}
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold shadow-glow-emerald hover:brightness-110 flex items-center gap-1.5"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>SHOW QR PASS</span>
                  </button>
                </div>
              </div>
            );
          })}

          {registrations.length === 0 && (
            <div className="glass-panel p-8 rounded-2xl text-center text-xs text-slate-400 border-slate-800 col-span-2">
              You have not registered for any events yet. Explore upcoming gatherings below!
            </div>
          )}
        </div>
      </div>

      {/* Available Upcoming Events */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Upcoming Wonderlight Gatherings &amp; Treks
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {allEvents.map((ev) => {
            const isRegistered = registeredEventIds.has(ev.eventId);
            return (
              <div key={ev.id} className="glass-card rounded-2xl p-6 border-slate-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-400 font-semibold">{ev.category}</span>
                    <span className="text-slate-400">{ev.capacity - ev.registeredCount} seats left</span>
                  </div>
                  <h4 className="font-display font-bold text-white text-base leading-snug">{ev.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{ev.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400">{ev.date}</div>
                  {isRegistered ? (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Registered</span>
                    </span>
                  ) : (
                    <Link
                      href={`/campus-ambassador/events/${ev.id}`}
                      className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold shadow-glow-emerald hover:brightness-110"
                    >
                      Register
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pass QR Modal Dialog */}
      {selectedPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-sm rounded-3xl p-6 sm:p-8 border border-emerald-500/50 shadow-glow-emerald text-center space-y-4">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 uppercase tracking-widest">
              Scan At Venue Check-in
            </span>

            <div className="p-4 bg-white rounded-2xl shadow-2xl mx-auto w-48 h-48 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedPass.qrUrl} alt="Check-in QR" className="w-40 h-40" />
            </div>

            <div className="space-y-1">
              <h4 className="font-display font-bold text-white text-base">
                {selectedPass.reg.attendeeName}
              </h4>
              <p className="text-xs text-slate-400">{selectedPass.reg.college}</p>
              <div className="text-[10px] font-mono text-emerald-400 pt-1">
                {selectedPass.reg.qrCodeData}
              </div>
            </div>

            <button
              onClick={() => setSelectedPass(null)}
              className="w-full py-2.5 rounded-xl glass-input text-xs font-semibold text-slate-300 hover:text-white"
            >
              Close Pass
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
