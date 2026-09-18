'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import QRCode from 'qrcode';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  CheckCircle2,
  Ticket,
  Download,
  Share2,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { dbService } from '@/lib/services/db';
import { EventItem, EventRegistration } from '@/types';
import { useAuth } from '@/lib/services/authContext';

export default function EventDetailsPage() {
  const params = useParams();
  const eventId = params?.eventId as string;
  const { user, ambassadorProfile } = useAuth();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [existingReg, setExistingReg] = useState<EventRegistration | null>(null);
  const [showRegModal, setShowRegModal] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const [regForm, setRegForm] = useState({
    fullName: user?.displayName || ambassadorProfile?.name || '',
    email: user?.email || ambassadorProfile?.email || '',
    phone: ambassadorProfile?.phone || '',
    college: ambassadorProfile?.college || '',
  });
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (!eventId) return;
    const ev = dbService.getEventById(eventId);
    if (ev) {
      setEvent(ev);
      // Check if user already registered
      const regs = dbService.getEventRegistrations(ev.eventId);
      const userReg = regs.find((r) => r.email === user?.email || (ambassadorProfile && r.ambassadorId === ambassadorProfile.ambassadorId));
      if (userReg) {
        setExistingReg(userReg);
        generateQR(userReg.qrCodeData);
      }
    }
  }, [eventId, user, ambassadorProfile]);

  const generateQR = async (text: string) => {
    try {
      const url = await QRCode.toDataURL(text, {
        width: 300,
        margin: 2,
        color: {
          dark: '#030712',
          light: '#ffffff',
        },
      });
      setQrDataUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    setIsRegistering(true);
    setTimeout(() => {
      try {
        const { registration } = dbService.registerForEvent(event.eventId, {
          userId: user?.id || 'guest-user',
          ambassadorId: ambassadorProfile?.ambassadorId,
          attendeeName: regForm.fullName || 'Attendee',
          email: regForm.email,
          phone: regForm.phone,
          college: regForm.college || 'Collegiate Participant',
        });

        setExistingReg(registration);
        generateQR(registration.qrCodeData);
        setIsRegistering(false);
        setShowRegModal(false);

        // Dispatch Event Registration Confirmation Email
        try {
          fetch('/api/events/register-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              studentName: regForm.fullName || 'Attendee',
              studentEmail: regForm.email,
              eventName: event.title,
              date: event.date,
              time: `${event.startTime} - ${event.endTime}`,
              venue: event.venue,
              registrationId: registration.id,
              college: regForm.college,
            }),
          });
        } catch (emailErr) {
          console.error('Error dispatching event registration email:', emailErr);
        }
      } catch (err: any) {
        alert(err.message || 'Registration failed');
        setIsRegistering(false);
      }
    }, 400);
  };

  if (!event) {
    return (
      <div className="min-h-screen py-24 text-center space-y-3">
        <h2 className="text-xl font-display font-bold text-white">Event Not Found</h2>
        <p className="text-xs text-slate-400">Could not locate the requested event details.</p>
        <Link href="/campus-ambassador/events" className="text-emerald-400 text-xs hover:underline">
          ← Back to Events Catalog
        </Link>
      </div>
    );
  }

  const seatsLeft = event.capacity - event.registeredCount;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto font-sans space-y-10">
      {/* Back Link */}
      <div>
        <Link
          href="/campus-ambassador/events"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </Link>
      </div>

      {/* Hero Banner Section */}
      <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden glass-panel border border-slate-700/80 shadow-2xl">
        <Image
          src={event.banner}
          alt={event.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-wonder-dark-950 via-wonder-dark-950/60 to-transparent" />

        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-widest backdrop-blur-md">
              {event.category}
            </span>
            <h1 className="text-2xl sm:text-4xl font-display font-black text-white leading-tight">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                {event.date}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                {event.startTime} - {event.endTime}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                {event.venue}, {event.city}
              </span>
            </div>
          </div>

          <div>
            {existingReg ? (
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>CONFIRMED PASS READY</span>
              </div>
            ) : (
              <button
                onClick={() => setShowRegModal(true)}
                className="px-6 py-3.5 rounded-xl bg-emerald-500 text-slate-950 font-display font-extrabold text-xs tracking-wider uppercase shadow-glow-emerald hover:brightness-110 flex items-center gap-2"
              >
                <Ticket className="w-4 h-4" />
                <span>REGISTER NOW</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmed QR Pass Banner (if registered) */}
      {existingReg && qrDataUrl && (
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-emerald-500/50 bg-gradient-to-r from-emerald-950/40 to-wonder-dark-900 shadow-glow-emerald flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Event Registration Pass</span>
            </div>
            <h3 className="text-xl font-display font-bold text-white">
              You are confirmed for {event.title}!
            </h3>
            <p className="text-xs text-slate-300 max-w-lg">
              Attendee: <strong>{existingReg.attendeeName}</strong> ({existingReg.email}) <br />
              Present this QR pass at the entrance desk for instant check-in.
            </p>
            <div className="text-[11px] text-slate-400">
              Registration Ref: <code className="text-emerald-400">{existingReg.id}</code> • Status: <strong>{existingReg.status}</strong>
            </div>
          </div>

          <div className="p-3 bg-white rounded-2xl shadow-xl flex flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="Event QR Pass" className="w-36 h-36" />
            <span className="text-[9px] font-bold text-black tracking-widest mt-1 uppercase">Scan At Venue</span>
          </div>
        </div>
      )}

      {/* Main Grid: Details, Schedule, Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Details, Schedule, Rules */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-base font-display font-bold text-white uppercase tracking-wider">
              About This Experience
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Schedule */}
          {event.schedule && event.schedule.length > 0 && (
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-base font-display font-bold text-white uppercase tracking-wider">
                Event Schedule & Itinerary
              </h3>
              <div className="space-y-3">
                {event.schedule.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl glass-card flex items-start gap-4 border-slate-800">
                    <span className="text-xs font-bold text-amber-400 whitespace-nowrap">{item.time}</span>
                    <span className="text-xs text-slate-200">{item.activity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rules & Guidelines */}
          {event.rules && event.rules.length > 0 && (
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-base font-display font-bold text-white uppercase tracking-wider">
                Guidelines & Requirements
              </h3>
              <ul className="space-y-2">
                {event.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Gallery */}
          {event.gallery && event.gallery.length > 0 && (
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-base font-display font-bold text-white uppercase tracking-wider">
                Expedition Gallery
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {event.gallery.map((imgUrl, idx) => (
                  <div key={idx} className="relative h-32 rounded-xl overflow-hidden">
                    <Image src={imgUrl} alt={`Gallery ${idx}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Quick Info Card, Prizes, Sponsors */}
        <div className="space-y-6">
          {/* Quick Info */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Event Quick Facts
            </h3>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Total Capacity:</span>
                <span className="font-bold text-white">{event.capacity} Attendees</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Seats Remaining:</span>
                <span className="font-bold text-emerald-400">{seatsLeft} slots</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Organizer:</span>
                <span className="font-bold text-white">{event.organizer}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Registration:</span>
                <span className="font-bold text-amber-400">{event.registrationStatus}</span>
              </div>
            </div>

            {!existingReg && (
              <button
                onClick={() => setShowRegModal(true)}
                className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-glow-emerald hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                <Ticket className="w-4 h-4" />
                <span>RESERVE MY SPOT</span>
              </button>
            )}
          </div>

          {/* Prizes */}
          {event.prizes && event.prizes.length > 0 && (
            <div className="glass-panel p-6 rounded-2xl border border-amber-500/30 space-y-3">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                <Award className="w-4 h-4" />
                <span>Prizes & Incentives</span>
              </h3>
              <ul className="space-y-2">
                {event.prizes.map((p, i) => (
                  <li key={i} className="text-xs text-slate-200 font-medium flex items-center gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sponsors */}
          {event.sponsors && event.sponsors.length > 0 && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Expedition Partners & Sponsors
              </h3>
              <div className="flex flex-wrap gap-2">
                {event.sponsors.map((s, i) => (
                  <span key={i} className="text-[11px] px-3 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Registration Modal Dialog */}
      {showRegModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-display font-bold text-white">Event Registration</h3>
              <p className="text-xs text-slate-400">{event.title}</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={regForm.fullName}
                  onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. student@college.edu"
                  value={regForm.email}
                  onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  WhatsApp Contact Phone *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={regForm.phone}
                  onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  College / Campus Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. KIIT University"
                  value={regForm.college}
                  onChange={(e) => setRegForm({ ...regForm, college: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowRegModal(false)}
                  className="px-4 py-2 rounded-xl glass-input text-slate-300 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRegistering}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold shadow-glow-emerald hover:brightness-110"
                >
                  {isRegistering ? 'Generating QR Pass...' : 'Confirm Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
