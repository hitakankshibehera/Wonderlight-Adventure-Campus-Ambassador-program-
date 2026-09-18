'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Mail, Phone, MapPin, Instagram, Linkedin, Youtube, Twitter, Shield, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  const isAmbassadorRoute = pathname?.startsWith('/ambassador');

  if (isAdminRoute || isAmbassadorRoute) {
    return null;
  }

  return (
    <footer className="w-full bg-wonder-dark-950 border-t border-slate-800/80 pt-16 pb-12 font-sans relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/campus-ambassador" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 shadow-glow-emerald group-hover:scale-105 transition-transform flex-shrink-0 overflow-hidden">
                <img
                  src="/wla-logo.png"
                  alt="WLA - Wonderlight Adventure Company Logo"
                  className="w-full h-full object-cover rounded-full bg-black"
                />
              </div>
              <div>
                <span className="font-display font-extrabold text-xl tracking-wider text-white">WONDERLIGHT</span>
                <span className="text-emerald-400 font-bold ml-1.5 text-xs">ADVENTURE</span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Wonderlight Adventure is India’s premier youth travel and outdoor exploration collective. Empowering students to lead, travel responsibly, and build collegiate adventure communities.
            </p>

            <div className="space-y-1 text-xs">
              <p className="text-emerald-400 font-semibold tracking-wide">Travel. Lead. Explore. Earn.</p>
              <p className="text-slate-400">Your Campus. Your Network. Your Adventure.</p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg glass-card flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Program Navigation */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Program</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link href="/campus-ambassador" className="hover:text-emerald-400 transition-colors">Program Overview</Link></li>
              <li><Link href="/campus-ambassador/apply" className="hover:text-emerald-400 transition-colors text-emerald-300 font-medium">Apply Now 2026-27</Link></li>
              <li><Link href="/campus-ambassador/application-status" className="hover:text-emerald-400 transition-colors">Check Application Status</Link></li>
              <li><Link href="/campus-ambassador/results" className="hover:text-emerald-400 transition-colors">Selection Results</Link></li>
              <li><Link href="/campus-ambassador/leaderboard" className="hover:text-emerald-400 transition-colors">National Leaderboard</Link></li>
              <li><Link href="/campus-ambassador/rewards" className="hover:text-emerald-400 transition-colors">Rewards Catalog</Link></li>
            </ul>
          </div>

          {/* Column 3: Events & Expeditions */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Expeditions</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link href="/campus-ambassador/events" className="hover:text-emerald-400 transition-colors">All Upcoming Events</Link></li>
              <li><Link href="/campus-ambassador/events" className="hover:text-emerald-400 transition-colors">High-Altitude Treks</Link></li>
              <li><Link href="/campus-ambassador/events" className="hover:text-emerald-400 transition-colors">Photography Contests</Link></li>
              <li><Link href="/campus-ambassador/events" className="hover:text-emerald-400 transition-colors">Campus Travel Pop-ups</Link></li>
              <li><Link href="/campus-ambassador/certificate/WLA-CERT-2026-01" className="hover:text-emerald-400 transition-colors">Certificate Verification</Link></li>
              <li><Link href="/campus-ambassador/faq" className="hover:text-emerald-400 transition-colors">Frequently Asked Questions</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact & Office */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Contact & Support</h4>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs">Wonderlight Expeditions HQ, Sector 29, Gurugram, NCR India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-xs">ambassadors@wonderlight.adventure</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-xs">+91 (11) 4500-WONDER</span>
              </div>
              <div className="pt-2">
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
                  <span className="text-emerald-400 font-semibold">Cohort 2026–27:</span> Applications under rolling review. Shortlisted candidates notified via portal & WhatsApp.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Wonderlight Adventure Technologies Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/campus-ambassador/faq" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link href="/campus-ambassador/faq" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
            <Link href="/campus-ambassador/faq" className="hover:text-slate-400 transition-colors">Ambassador Code of Conduct</Link>
            <div className="flex items-center gap-1 text-slate-600">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-red-500 fill-red-500" />
              <span>for Campus Explorers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
