'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  Compass,
  CheckCircle2,
  Sparkles,
  MapPin,
  Calendar,
  Send,
  ArrowRight,
  ShieldCheck,
  Tag,
  Star,
  Users,
} from 'lucide-react';
import { dbService } from '@/lib/services/db';
import { Ambassador } from '@/types';

export default function ReferralTripLandingPage() {
  const params = useParams();
  const code = params?.referralCode as string;

  const [ambassador, setAmbassador] = useState<Ambassador | null>(null);
  const [clickLogged, setClickLogged] = useState(false);

  // Inquiry form
  const [leadForm, setLeadForm] = useState({
    name: '',
    email: '',
    phone: '',
    tripInterest: 'Kedarkantha Winter Snow Trek',
  });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  // Instant booking simulation
  const [bookingAmount, setBookingAmount] = useState(16500);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  useEffect(() => {
    if (!code) return;
    const amb = dbService.getAmbassadorById(code);
    if (amb) {
      setAmbassador(amb);
      if (!clickLogged) {
        dbService.recordReferralClick(amb.referralCode);
        setClickLogged(true);
      }
    }
  }, [code, clickLogged]);

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ambassador) return;

    setIsSubmittingLead(true);
    setTimeout(() => {
      dbService.recordReferralLead({
        referralCode: ambassador.referralCode,
        leadName: leadForm.name,
        leadEmail: leadForm.email,
        leadPhone: leadForm.phone,
        tripInterest: leadForm.tripInterest,
      });

      setIsSubmittingLead(false);
      setLeadSubmitted(true);
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    }, 400);
  };

  const handleSimulateBooking = () => {
    if (!ambassador || !leadForm.name || !leadForm.email) {
      alert('Please fill out your details in the inquiry form above first.');
      return;
    }

    setIsBooking(true);
    setTimeout(() => {
      dbService.recordReferralBooking({
        referralCode: ambassador.referralCode,
        leadName: leadForm.name,
        leadEmail: leadForm.email,
        leadPhone: leadForm.phone || '+91 98765 00000',
        tripInterest: leadForm.tripInterest,
        bookingAmount,
      });

      setIsBooking(false);
      setBookingConfirmed(true);
      try {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#10b981', '#f59e0b', '#06b6d4'],
        });
      } catch (e) {}
    }, 500);
  };

  const featuredTrips = [
    {
      title: 'Kedarkantha Winter Snow Summit (12,500 ft)',
      days: '5 Days / 4 Nights',
      price: 9500,
      originalPrice: 12000,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Goa Coastal Adventure & Water Sports Retreat',
      days: '4 Days / 3 Nights',
      price: 14500,
      originalPrice: 18000,
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Spiti Valley High-Altitude 4x4 Overland',
      days: '7 Days / 6 Nights',
      price: 24500,
      originalPrice: 29000,
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto font-sans space-y-10">
      {/* Ambassador Personalized Greeting Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-emerald-500/40 shadow-glow-emerald bg-gradient-to-r from-emerald-950/40 via-wonder-dark-900 to-wonder-dark-950 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10 text-center sm:text-left">
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-glow-emerald flex-shrink-0">
            <Image
              src={ambassador?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
              alt={ambassador?.name || 'Ambassador'}
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Campus Ambassador Invitation</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
              Explore with {ambassador?.name || 'Wonderlight Ambassador'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300">
              Campus Lead at <strong>{ambassador?.college || 'Your University'}</strong> • Special student discount code <code className="text-amber-400 font-bold px-1.5 py-0.5 bg-slate-900 rounded">{code}</code> applied!
            </p>
          </div>

          <div className="p-3.5 rounded-2xl glass-card text-center sm:text-right border-emerald-500/30">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Student Discount</div>
            <div className="text-2xl font-display font-black text-amber-400">UP TO 25% OFF</div>
            <div className="text-[10px] text-emerald-400 font-semibold">Verified Partner Referral</div>
          </div>
        </div>
      </div>

      {/* Featured Expeditions */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">HANDPICKED DEPARTURES</span>
          <h2 className="text-2xl font-display font-black text-white uppercase mt-0.5">
            RECOMMENDED STUDENT EXPEDITIONS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredTrips.map((trip, idx) => (
            <div
              key={idx}
              onClick={() => setLeadForm({ ...leadForm, tripInterest: trip.title })}
              className={`glass-card rounded-2xl overflow-hidden border cursor-pointer transition-all ${
                leadForm.tripInterest === trip.title
                  ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="relative h-44 w-full">
                <Image src={trip.image} alt={trip.title} fill className="object-cover" />
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 text-[10px] font-bold">
                  {trip.days}
                </div>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="font-display font-bold text-white text-sm leading-snug">
                  {trip.title}
                </h3>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <div>
                    <span className="line-through text-slate-500 mr-2">₹{trip.originalPrice}</span>
                    <span className="text-emerald-400 font-display font-black text-base">₹{trip.price}</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-semibold">Select Trip</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Inquiry / Lead Capture Form */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-700/80 shadow-2xl space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Tag className="w-4 h-4" />
            <span>Lock In Your Special Campus Rate</span>
          </div>
          <h3 className="text-2xl font-display font-black text-white mt-1">
            REQUEST EXPEDITION ITINERARY &amp; QUOTE
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Wonderlight team coordinates travel permits, guides, safety gear, and student group departures.
          </p>
        </div>

        {leadSubmitted ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="font-display font-bold text-white text-lg">Inquiry Received!</h4>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Our expedition coordinator will WhatsApp the complete student travel dossier and discounted quote to <strong>{leadForm.phone}</strong>.
            </p>
            <div className="text-[11px] text-emerald-400 font-semibold">
              Attributed to {ambassador?.name}&apos;s referral portal!
            </div>

            {/* Direct Booking Simulation Button */}
            {!bookingConfirmed ? (
              <div className="pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleSimulateBooking}
                  disabled={isBooking}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs shadow-glow-gold hover:brightness-110"
                >
                  {isBooking ? 'Processing Booking...' : `Simulate Instant Confirmed Booking (₹${bookingAmount.toLocaleString()})`}
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                🎉 Booking Confirmed! ₹{bookingAmount.toLocaleString()} credited to {ambassador?.name}&apos;s referral stats!
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleLeadSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Mohanty"
                  value={leadForm.name}
                  onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  College Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rahul.m@kiit.ac.in"
                  value={leadForm.email}
                  onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
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
                  placeholder="+91 94370 12345"
                  value={leadForm.phone}
                  onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Preferred Expedition
                </label>
                <input
                  type="text"
                  value={leadForm.tripInterest}
                  onChange={(e) => setLeadForm({ ...leadForm, tripInterest: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero spam guarantee. Handled by official expedition division.</span>
              </span>

              <button
                type="submit"
                disabled={isSubmittingLead}
                className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-glow-emerald hover:brightness-110 flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmittingLead ? 'Sending Request...' : 'SEND TRIP INQUIRY'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
