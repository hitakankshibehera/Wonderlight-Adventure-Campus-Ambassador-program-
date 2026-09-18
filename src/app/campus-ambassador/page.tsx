'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Compass,
  ArrowRight,
  Sparkles,
  Award,
  Users,
  TrendingUp,
  Camera,
  Calendar,
  Gift,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Star,
  MapPin,
  ExternalLink,
  Flame,
  ArrowUpRight,
  Clock,
  Ticket,
} from 'lucide-react';
import { dbService } from '@/lib/services/db';
import { CMSConfig, EventItem, Mission, Ambassador } from '@/types';
import { LEVEL_CONFIGS } from '@/lib/services/seedData';

export default function CampusAmbassadorLandingPage() {
  const [cms, setCms] = useState<CMSConfig>(dbService.getCMSConfig());
  const [events, setEvents] = useState<EventItem[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [topAmbassadors, setTopAmbassadors] = useState<Ambassador[]>([]);
  const [activeLevelTab, setActiveLevelTab] = useState<string>('EXPLORER');

  useEffect(() => {
    const refreshData = () => {
      setCms(dbService.getCMSConfig());
      setEvents(dbService.getEvents().slice(0, 3));
      setMissions(dbService.getMissions().slice(0, 3));
      setTopAmbassadors(dbService.getAmbassadors().slice(0, 3));
    };

    refreshData();
    return dbService.subscribe(refreshData);
  }, []);

  const sections = cms.sections || {
    hero: true,
    about: true,
    whatTheyDo: true,
    benefits: true,
    howItWorks: true,
    levels: true,
    missions: true,
    events: true,
    leaderboard: true,
    gallery: true,
    faq: true,
    cta: true,
  };

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* 1. HERO SECTION */}
      {sections.hero && (
        <section className="relative min-h-[92vh] flex items-center justify-center pt-16 pb-24 overflow-hidden">
          {/* Background Cinematic Image with dark gradients */}
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&auto=format&fit=crop&q=85"
              alt="Himalayan Mountain Expedition"
              fill
              priority
              className="object-cover object-center opacity-30 scale-105 animate-pulse-slow"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-wonder-dark-950 via-wonder-dark-950/80 to-transparent" />
            <div className="absolute inset-0 bg-hero-pattern" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
            {/* Top Cohort Announcement Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-panel border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-semibold shadow-glow-emerald shimmer-badge animate-in fade-in duration-500">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <img src="/wla-logo.png" alt="WLA Logo" className="w-5 h-5 rounded-full object-cover border border-emerald-400/60 animate-pulse" />
              <span>Applications Open • Cohort {cms.programBatch || '2026–27'} • Pan India</span>
            </div>

            {/* Main Brand Title & Headings */}
            <div className="space-y-4">
              <div className="text-xs sm:text-sm tracking-[0.3em] font-extrabold uppercase text-slate-400">
                WONDERLIGHT ADVENTURE
              </div>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tight text-white uppercase leading-[1.08]">
                CAMPUS AMBASSADOR <br />
                <span className="gradient-text-emerald">PROGRAM</span>
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-amber-400 tracking-wide">
                &ldquo;{cms.primaryTagline || 'Travel. Lead. Explore. Earn.'}&rdquo;
              </p>
            </div>

            {/* Description Subtext */}
            <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              &ldquo;{cms.heroSubheadline || 'Become the official student representative of Wonderlight Adventure at your campus and build your own travel community.'}&rdquo;
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/campus-ambassador/apply"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 text-slate-950 font-display font-extrabold text-sm sm:text-base tracking-wider uppercase shadow-glow-emerald hover:brightness-110 hover:scale-[1.02] transition-all flex items-center justify-center gap-2.5"
              >
                <span>APPLY NOW FOR 2026-27</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#about"
                className="w-full sm:w-auto px-8 py-4 rounded-xl glass-panel text-white hover:bg-slate-800/80 font-display font-bold text-sm sm:text-base tracking-wider uppercase transition-all flex items-center justify-center gap-2"
              >
                <span>EXPLORE PROGRAM</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
            </div>

            {/* Live Ticker / Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-slate-800/60 max-w-4xl mx-auto">
              <div className="p-3 rounded-xl glass-card text-center">
                <div className="text-2xl sm:text-3xl font-display font-black text-emerald-400">50+</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">Partner Campuses</div>
              </div>
              <div className="p-3 rounded-xl glass-card text-center">
                <div className="text-2xl sm:text-3xl font-display font-black text-amber-400">₹15,000+</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">Avg. Monthly Perks</div>
              </div>
              <div className="p-3 rounded-xl glass-card text-center">
                <div className="text-2xl sm:text-3xl font-display font-black text-cyan-400">100%</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">Sponsored Treks</div>
              </div>
              <div className="p-3 rounded-xl glass-card text-center">
                <div className="text-2xl sm:text-3xl font-display font-black text-purple-400">Official</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">Verifiable LOR</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. ABOUT THE PROGRAM SECTION */}
      {sections.about && (
        <section id="about" className="py-24 relative bg-wonder-dark-900/60 border-y border-slate-800/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
              <span className="text-xs font-bold text-emerald-400 tracking-[0.2em] uppercase">ABOUT THE MOVEMENT</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white tracking-tight uppercase">
                MORE THAN AN AMBASSADOR. <br />
                <span className="gradient-text-gold">BECOME A CAMPUS TRAVEL LEADER.</span>
              </h2>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed pt-2">
                The Wonderlight Campus Ambassador Program gives students the opportunity to represent Wonderlight Adventure in their college while gaining practical exposure to marketing, sales, communication, event management, community building, and real-world travel expeditions.
              </p>
            </div>

            {/* Visual Flow Architecture */}
            <div className="glass-panel rounded-3xl p-8 lg:p-12 border border-slate-700/60 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <h3 className="text-center text-xs font-bold tracking-widest text-slate-400 uppercase mb-8">
                HOW YOU POWER THE TRAVEL ECOSYSTEM
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10 items-center">
                {/* Step 1 */}
                <div className="glass-card p-6 rounded-2xl text-center space-y-3 border-emerald-500/30">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
                    01
                  </div>
                  <h4 className="font-display font-bold text-white text-base">You (Student)</h4>
                  <p className="text-xs text-slate-400">Passionate explorer with leadership mindset</p>
                </div>

                <div className="hidden md:flex justify-center text-emerald-400">
                  <ArrowRight className="w-6 h-6 animate-pulse" />
                </div>

                {/* Step 2 */}
                <div className="glass-card p-6 rounded-2xl text-center space-y-3 border-teal-500/30">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-lg">
                    02
                  </div>
                  <h4 className="font-display font-bold text-white text-base">Your Campus</h4>
                  <p className="text-xs text-slate-400">Hostel networks, societies, clubs & fests</p>
                </div>

                <div className="hidden md:flex justify-center text-teal-400">
                  <ArrowRight className="w-6 h-6 animate-pulse" />
                </div>

                {/* Step 3 */}
                <div className="glass-card p-6 rounded-2xl text-center space-y-3 border-amber-500/30">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
                    03
                  </div>
                  <h4 className="font-display font-bold text-white text-base">Travel Community</h4>
                  <p className="text-xs text-slate-400">Students joining weekend treks & expeditions</p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-800 text-center flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-slate-300">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <strong>Result:</strong> Real corporate leadership credentials
                </span>
                <span className="hidden sm:inline text-slate-600">•</span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Direct financial earnings & travel sponsorship
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. WHAT AMBASSADORS DO */}
      {sections.whatTheyDo && (
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
              <span className="text-xs font-bold text-emerald-400 tracking-[0.2em] uppercase">YOUR ROLE & RESPONSIBILITIES</span>
              <h2 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight uppercase">
                WHAT AMBASSADORS DO
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                Drive youth excitement, spark adventure culture, and represent Wonderlight professionally across campuses.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="glass-card p-8 rounded-2xl space-y-4 group">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Campus Promotion
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Promote Wonderlight travel experiences, seasonal group trek offers, and adventure campaigns across your university groups and bulletin boards.
                </p>
              </div>

              {/* Card 2 */}
              <div className="glass-card p-8 rounded-2xl space-y-4 group">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-white group-hover:text-cyan-400 transition-colors">
                  Community Building
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Build and moderate an active campus travel club on WhatsApp/Telegram connecting adventure enthusiasts from your university.
                </p>
              </div>

              {/* Card 3 */}
              <div className="glass-card p-8 rounded-2xl space-y-4 group">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-white group-hover:text-amber-400 transition-colors">
                  Referral Generation
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Share personalized referral links and QR codes to generate qualified student inquiries and earn lucrative booking commissions.
                </p>
              </div>

              {/* Card 4 */}
              <div className="glass-card p-8 rounded-2xl space-y-4 group">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-white group-hover:text-purple-400 transition-colors">
                  Event Management
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Coordinate travel photography contests, outdoor workshops, college fest travel desks, and orientation webinars on campus.
                </p>
              </div>

              {/* Card 5 */}
              <div className="glass-card p-8 rounded-2xl space-y-4 group">
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-white group-hover:text-pink-400 transition-colors">
                  Content Creation
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Shoot viral short-form travel reels, unbox official merch kits, and document collegiate trek departures for social media.
                </p>
              </div>

              {/* Card 6 */}
              <div className="glass-card p-8 rounded-2xl space-y-4 group">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Brand Representation
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Serve as the dignified, professional ambassador of Wonderlight Adventure, upholding safety, sustainability, and leave-no-trace ethics.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. BENEFITS SECTION ("WHAT YOU UNLOCK") */}
      {sections.benefits && (
        <section className="py-24 bg-wonder-dark-900/80 border-t border-slate-800/80 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
              <span className="text-xs font-bold text-amber-400 tracking-[0.2em] uppercase">PERKS & RECOGNITION</span>
              <h2 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight uppercase">
                WHAT YOU UNLOCK
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                Tangible career credentials, financial commissions, high-value gear, and once-in-a-lifetime expedition access.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-card p-6 rounded-2xl space-y-3 border-emerald-500/20">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  💰
                </div>
                <h3 className="font-display font-bold text-white text-base">Performance Incentives</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Earn 8% to 15% direct financial commission on all travel bookings facilitated through your referral code.
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl space-y-3 border-cyan-500/20">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                  📜
                </div>
                <h3 className="font-display font-bold text-white text-base">Verifiable Certificate</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Cryptographically signed Certificate of Appointment and Completion with unique QR verification.
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl space-y-3 border-amber-500/20">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  🌟
                </div>
                <h3 className="font-display font-bold text-white text-base">Executive LOR</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  High-performing ambassadors unlock a personalized Letter of Recommendation from Wonderlight Leadership.
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl space-y-3 border-purple-500/20">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                  🏔️
                </div>
                <h3 className="font-display font-bold text-white text-base">Sponsored Expeditions</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Unlock fully-sponsored Himalayan treks, Goa retreats, and high-altitude training camps.
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl space-y-3 border-slate-700/40">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center font-bold">
                  🎒
                </div>
                <h3 className="font-display font-bold text-white text-base">Exclusive Merch Kit</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Official ambassador duffel bags, custom adventure hoodies, metal hydro-flasks, and badges.
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl space-y-3 border-slate-700/40">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center font-bold">
                  🤝
                </div>
                <h3 className="font-display font-bold text-white text-base">National Networking</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Connect with collegiate student leaders, adventure photographers, and tourism entrepreneurs across India.
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl space-y-3 border-slate-700/40">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center font-bold">
                  📈
                </div>
                <h3 className="font-display font-bold text-white text-base">Marketing Mastery</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-world analytics, lead generation, campus community building, and campaign management experience.
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl space-y-3 border-slate-700/40">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center font-bold">
                  🚀
                </div>
                <h3 className="font-display font-bold text-white text-base">Career Fast-Track</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Pre-Placement Interviews (PPI) and direct recruitment priority for Wonderlight corporate internships.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. HOW IT WORKS (6 ANIMATED TIMELINE STEPS) */}
      {sections.howItWorks && (
        <section className="py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-20">
              <span className="text-xs font-bold text-emerald-400 tracking-[0.2em] uppercase">JOURNEY ROADMAP</span>
              <h2 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight uppercase">
                HOW IT WORKS
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                A seamless 6-step progression from student applicant to celebrated Campus Travel Leader.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
              {/* Step 1 */}
              <div className="glass-card p-8 rounded-2xl border-slate-800 relative">
                <div className="text-4xl font-display font-black text-emerald-400/30 mb-4">01</div>
                <h3 className="text-lg font-display font-bold text-white mb-2">APPLY ONLINE</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Complete the 6-step online application sharing your college details, social channels, and vision for campus outreach.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-800/80 text-[11px] text-emerald-400 font-semibold">
                  Generates Application ID (WLA-2026-XXXXX)
                </div>
              </div>

              {/* Step 2 */}
              <div className="glass-card p-8 rounded-2xl border-slate-800 relative">
                <div className="text-4xl font-display font-black text-teal-400/30 mb-4">02</div>
                <h3 className="text-lg font-display font-bold text-white mb-2">GET SHORTLISTED</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Our evaluation team reviews your profile, leadership record, and campus network size during screening rounds.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-800/80 text-[11px] text-teal-400 font-semibold">
                  Track live status on public portal
                </div>
              </div>

              {/* Step 3 */}
              <div className="glass-card p-8 rounded-2xl border-slate-800 relative">
                <div className="text-4xl font-display font-black text-cyan-400/30 mb-4">03</div>
                <h3 className="text-lg font-display font-bold text-white mb-2">GET SELECTED</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Successful candidates are published on the official national selection list and receive an official appointment letter.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-800/80 text-[11px] text-cyan-400 font-semibold">
                  Published in Cohort Batch Results
                </div>
              </div>

              {/* Step 4 */}
              <div className="glass-card p-8 rounded-2xl border-slate-800 relative">
                <div className="text-4xl font-display font-black text-amber-400/30 mb-4">04</div>
                <h3 className="text-lg font-display font-bold text-white mb-2">RECEIVE AMBASSADOR ID</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Log in to your specialized dashboard to receive your unique Ambassador ID (e.g., WLA-KIIT-024) and personalized referral URL.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-800/80 text-[11px] text-amber-400 font-semibold">
                  Share Center & custom QR ready
                </div>
              </div>

              {/* Step 5 */}
              <div className="glass-card p-8 rounded-2xl border-slate-800 relative">
                <div className="text-4xl font-display font-black text-purple-400/30 mb-4">05</div>
                <h3 className="text-lg font-display font-bold text-white mb-2">COMPLETE MISSIONS</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Execute campus missions, post viral reels, host travel desks, bring students to events, and drive trip bookings.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-800/80 text-[11px] text-purple-400 font-semibold">
                  Earn XP & climb national leaderboard
                </div>
              </div>

              {/* Step 6 */}
              <div className="glass-card p-8 rounded-2xl border-slate-800 relative">
                <div className="text-4xl font-display font-black text-yellow-400/30 mb-4">06</div>
                <h3 className="text-lg font-display font-bold text-white mb-2">UNLOCK REWARDS</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Redeem earned XP for expedition duffels, action cameras, sponsored treks, and corporate letter of recommendation.
                </p>
                <div className="mt-4 pt-4 border-t border-slate-800/80 text-[11px] text-yellow-400 font-semibold">
                  Claim catalog goods directly to doorstep
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. AMBASSADOR LEVELS */}
      {sections.levels && (
        <section className="py-24 bg-wonder-dark-900/60 border-y border-slate-800/60 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
              <span className="text-xs font-bold text-emerald-400 tracking-[0.2em] uppercase">GAMIFIED PROGRESSION</span>
              <h2 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight uppercase">
                AMBASSADOR TIERS & LEVELS
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                Advance through 4 distinct ranks as you earn XP and facilitate confirmed bookings.
              </p>
            </div>

            {/* Level Selector Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              {Object.keys(LEVEL_CONFIGS).map((lvlKey) => {
                const cfg = LEVEL_CONFIGS[lvlKey];
                const isActive = activeLevelTab === lvlKey;
                return (
                  <button
                    key={lvlKey}
                    onClick={() => setActiveLevelTab(lvlKey)}
                    className={`px-5 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center gap-2 ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 shadow-glow-emerald'
                        : 'glass-input text-slate-300 hover:text-white'
                    }`}
                  >
                    <span>{cfg.badge}</span>
                    <span>{cfg.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Level Detail Card */}
            {(() => {
              const current = LEVEL_CONFIGS[activeLevelTab];
              return (
                <div className="glass-panel rounded-3xl p-8 lg:p-12 border border-slate-700/60 max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                        <span>Tier Milestone</span>
                      </div>
                      <h3 className="text-3xl font-display font-black text-white flex items-center gap-3">
                        <span>{current.badge}</span>
                        <span>{current.name}</span>
                      </h3>
                      <p className="text-sm text-slate-300">
                        {current.reward}
                      </p>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="p-3 rounded-xl glass-card">
                          <div className="text-xs text-slate-400">Min Required XP</div>
                          <div className="text-xl font-display font-black text-emerald-400">{current.minPoints} XP</div>
                        </div>
                        <div className="p-3 rounded-xl glass-card">
                          <div className="text-xs text-slate-400">Min Bookings</div>
                          <div className="text-xl font-display font-black text-amber-400">{current.minBookings} Bookings</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Unlocked Privileges</h4>
                      <ul className="space-y-2.5">
                        {current.benefits.map((b, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </section>
      )}

      {/* 7. MISSIONS SYSTEM PREVIEW */}
      {sections.missions && (
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <span className="text-xs font-bold text-emerald-400 tracking-[0.2em] uppercase">ACTION CENTER</span>
                <h2 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight uppercase mt-1">
                  CAMPUS MISSIONS & CHALLENGES
                </h2>
                <p className="text-slate-400 text-sm max-w-xl mt-2">
                  Complete gamified activities designed to grow your personal brand and earn high-yield XP.
                </p>
              </div>

              <Link
                href="/campus-ambassador/apply"
                className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold text-sm transition-colors"
              >
                <span>Unlock Full Missions Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {missions.map((mis) => (
                <div key={mis.id} className="glass-card p-6 rounded-2xl space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                        {mis.category}
                      </span>
                      <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        +{mis.xp} XP
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-white text-base leading-snug">
                      {mis.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {mis.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ends {mis.endDate}</span>
                    </span>
                    <span className="text-emerald-400 font-medium">Eligible: {mis.eligibilityLevel}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. EVENTS SECTION PREVIEW */}
      {sections.events && (
        <section className="py-24 bg-wonder-dark-900/60 border-t border-slate-800/60 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <span className="text-xs font-bold text-emerald-400 tracking-[0.2em] uppercase">EXPEDITIONS & GATHERINGS</span>
                <h2 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight uppercase mt-1">
                  UPCOMING WONDERLIGHT EVENTS
                </h2>
                <p className="text-slate-400 text-sm max-w-xl mt-2">
                  High-altitude camps, photography contests, and ambassador conclaves across India.
                </p>
              </div>

              <Link
                href="/campus-ambassador/events"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass-panel text-white hover:bg-slate-800 text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <span>View All 12 Categories</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((ev) => (
                <div key={ev.id} className="glass-card rounded-2xl overflow-hidden group flex flex-col justify-between">
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={ev.banner}
                      alt={ev.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-wonder-dark-950 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
                        {ev.category}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-200">
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        {ev.city}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                        {ev.capacity - ev.registeredCount} seats left
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="text-xs text-amber-400 font-semibold">{ev.date} • {ev.startTime}</div>
                      <h3 className="font-display font-bold text-white text-base group-hover:text-emerald-400 transition-colors">
                        {ev.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {ev.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
                      <Link
                        href={`/campus-ambassador/events/${ev.id}`}
                        className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold text-center shadow-glow-emerald hover:brightness-110 transition-all flex items-center justify-center gap-1.5"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        <span>REGISTER NOW</span>
                      </Link>
                      <Link
                        href={`/campus-ambassador/events/${ev.id}`}
                        className="px-3 py-2.5 rounded-xl glass-input text-slate-300 hover:text-white text-xs font-semibold"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. LEADERBOARD PREVIEW */}
      {sections.leaderboard && (
        <section className="py-24 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
              <span className="text-xs font-bold text-amber-400 tracking-[0.2em] uppercase">NATIONAL RECOGNITION</span>
              <h2 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight uppercase">
                CAMPUS AMBASSADOR LEADERBOARD
              </h2>
              <p className="text-slate-400 text-sm">
                Top student ambassadors inspiring campus adventures across India this season.
              </p>
            </div>

            <div className="max-w-4xl mx-auto glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-2xl">
              <div className="space-y-3">
                {topAmbassadors.map((amb, index) => (
                  <div
                    key={amb.id}
                    className="p-4 rounded-2xl glass-card flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-display font-black text-sm ${
                        index === 0 ? 'bg-amber-400 text-slate-950 shadow-glow-gold' :
                        index === 1 ? 'bg-slate-300 text-slate-950' :
                        'bg-amber-700 text-white'
                      }`}>
                        #{index + 1}
                      </div>
                      <div className="w-10 h-10 rounded-xl overflow-hidden relative border border-slate-700">
                        <Image
                          src={amb.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                          alt={amb.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-display font-bold text-white text-sm sm:text-base flex items-center gap-2">
                          <span>{amb.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                            {amb.ambassadorId}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400">{amb.college} • {amb.city}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-base sm:text-lg font-display font-black text-emerald-400">{amb.xp.toLocaleString()} XP</div>
                      <div className="text-[11px] text-slate-400">{amb.stats.bookings} Bookings • {amb.stats.eventsAttended} Events</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800 text-center">
                <Link
                  href="/campus-ambassador/leaderboard"
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-emerald-400 transition-colors uppercase tracking-wider"
                >
                  <span>View Complete All-India Leaderboard & College Rankings</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 10. HOMEPAGE FINAL CTA */}
      {sections.cta && (
        <section className="py-28 relative overflow-hidden bg-gradient-to-b from-wonder-dark-950 via-wonder-dark-900 to-wonder-dark-950">
          <div className="absolute inset-0 bg-hero-pattern opacity-50 pointer-events-none" />
          <div className="max-w-4xl mx-auto px-4 text-center space-y-8 relative z-10">
            <div className="w-16 h-16 mx-auto rounded-full p-0.5 bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-500 shadow-glow-emerald animate-pulse overflow-hidden">
              <img src="/wla-logo.png" alt="WLA Logo" className="w-full h-full object-cover rounded-full bg-black animate-spin-slow" />
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-amber-400 tracking-[0.25em] uppercase">THE HORIZON IS CALLING</span>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-white uppercase tracking-tight">
                YOUR CAMPUS IS WAITING. <br />
                <span className="gradient-text-emerald">ARE YOU READY TO LEAD THE JOURNEY?</span>
              </h2>
              <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto">
                Step up, lead your peers into unforgettable mountain and coastal adventures, and fast-track your leadership trajectory with Wonderlight Adventure.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/campus-ambassador/apply"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-display font-extrabold text-sm sm:text-base tracking-wider uppercase shadow-glow-emerald hover:brightness-110 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <span>BECOME A CAMPUS AMBASSADOR →</span>
              </Link>
              <Link
                href="/campus-ambassador/events"
                className="w-full sm:w-auto px-8 py-4 rounded-xl glass-panel text-white hover:bg-slate-800/80 font-display font-bold text-sm sm:text-base tracking-wider uppercase transition-all"
              >
                VIEW UPCOMING EVENTS
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
