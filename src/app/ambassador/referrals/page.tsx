'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Share2,
  Copy,
  Check,
  Download,
  Send,
  MessageCircle,
  Mail,
  TrendingUp,
  Users,
  Calendar,
  Sparkles,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { dbService } from '@/lib/services/db';
import { useAuth } from '@/lib/services/authContext';
import { ReferralRecord } from '@/types';

export default function AmbassadorReferralShareCenter() {
  const { ambassadorProfile } = useAuth();
  const defaultProfile = {
    id: 'amb-default',
    userId: 'user-default',
    ambassadorId: 'WLA-CAP-001',
    applicationId: 'WLA-2026-000',
    name: 'Ambassador Portal',
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

  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);

  useEffect(() => {
    const refresh = () => {
      setReferrals(dbService.getReferrals(profile.ambassadorId));
    };
    refresh();

    if (profile?.referralLink) {
      QRCode.toDataURL(profile.referralLink, {
        width: 300,
        margin: 1,
        color: { dark: '#030712', light: '#ffffff' },
      }).then(setQrDataUrl);
    }

    return dbService.subscribe(refresh);
  }, [profile?.ambassadorId, profile?.referralLink]);

  const copyLink = () => {
    navigator.clipboard.writeText(profile.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = `Hey! Check out Wonderlight Adventure student expeditions & treks. Use my campus ambassador link to get up to 25% off on upcoming departures: ${profile.referralLink}`;

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(profile.referralLink)}&text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareEmail = () => {
    window.open(`mailto:?subject=Exclusive%20Student%20Travel%20Invite%20from%20Wonderlight&body=${encodeURIComponent(shareText)}`, '_blank');
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.download = `WLA-${profile.referralCode}-QR.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const conversionRate = profile.stats.clicks > 0
    ? ((profile.stats.bookings / profile.stats.clicks) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto">
      {/* Page Title */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
          <Share2 className="w-3.5 h-3.5" />
          <span>Referral Growth Engine</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-display font-black text-white uppercase">
          AMBASSADOR SHARE CENTER
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Share your personalized invitation link and high-res QR code across college groups, batch chats, and clubs.
        </p>
      </div>

      {/* Main Sharing Box with QR Code */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-700/80 shadow-2xl grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        {/* Left 2 Cols: Link and Social Buttons */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Personalized Referral URL
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={profile.referralLink}
                className="w-full px-4 py-3 rounded-xl glass-input font-mono text-xs sm:text-sm text-emerald-300"
              />
              <button
                onClick={copyLink}
                className="px-5 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-glow-emerald hover:brightness-110 flex items-center gap-1.5 flex-shrink-0"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'COPIED!' : 'COPY'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Visitors are tracked for 60 days. Every confirmed trek booking earns you 8-15% commission.
            </p>
          </div>

          {/* Social Share Buttons */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Instant 1-Click Broadcast
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={shareWhatsApp}
                className="p-3 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold hover:bg-emerald-600/30 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={shareTelegram}
                className="p-3 rounded-xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold hover:bg-cyan-600/30 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Telegram</span>
              </button>

              <button
                onClick={shareEmail}
                className="p-3 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300 text-xs font-bold hover:bg-purple-600/30 flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>Email Batch</span>
              </button>

              <button
                onClick={copyLink}
                className="p-3 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold hover:text-white flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Instagram Bio</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Downloadable QR Code Card */}
        <div className="p-6 rounded-2xl glass-card border-emerald-500/40 text-center space-y-4 flex flex-col items-center justify-center">
          <div className="p-3 bg-white rounded-2xl shadow-xl">
            {qrDataUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={qrDataUrl} alt="Referral QR Code" className="w-40 h-40" />
            )}
          </div>

          <div className="space-y-1">
            <div className="text-xs font-bold text-white uppercase">{profile.referralCode}</div>
            <div className="text-[10px] text-slate-400">Print for campus canteen noticeboards</div>
          </div>

          <button
            onClick={downloadQR}
            className="w-full py-2.5 rounded-xl glass-input text-xs font-bold text-slate-200 hover:text-white flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Download High-Res QR</span>
          </button>
        </div>
      </div>

      {/* Conversion Funnel Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Real-Time Referral Attribution Funnel
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-4 rounded-2xl glass-card border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Clicks</div>
            <div className="text-2xl font-display font-black text-white mt-1">
              {profile.stats.clicks}
            </div>
            <div className="text-[10px] text-slate-500">Unique page views</div>
          </div>

          <div className="p-4 rounded-2xl glass-card border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Student Leads</div>
            <div className="text-2xl font-display font-black text-cyan-400 mt-1">
              {profile.stats.leads}
            </div>
            <div className="text-[10px] text-slate-500">Inquiries submitted</div>
          </div>

          <div className="p-4 rounded-2xl glass-card border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Bookings</div>
            <div className="text-2xl font-display font-black text-emerald-400 mt-1">
              {profile.stats.bookings}
            </div>
            <div className="text-[10px] text-slate-500">Paid expeditions</div>
          </div>

          <div className="p-4 rounded-2xl glass-card border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Sales Volume</div>
            <div className="text-2xl font-display font-black text-amber-400 mt-1">
              ₹{(profile.stats.revenue / 1000).toFixed(0)}k
            </div>
            <div className="text-[10px] text-slate-500">Gross attributed</div>
          </div>

          <div className="p-4 rounded-2xl glass-card border-slate-800">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Conversion Rate</div>
            <div className="text-2xl font-display font-black text-purple-400 mt-1">
              {conversionRate}%
            </div>
            <div className="text-[10px] text-slate-500">Lead to booking</div>
          </div>
        </div>
      </div>

      {/* Referral Activity Records Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-700/60 shadow-2xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">
            Recent Referral Activity ({referrals.length})
          </h3>
          <span className="text-[10px] text-slate-500">Fraud prevention enabled</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {referrals.map((ref) => (
            <div key={ref.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    ref.status === 'BOOKED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    ref.status === 'LEAD' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {ref.status}
                  </span>
                  <span className="font-medium text-white">{ref.leadName || 'Website Visitor'}</span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  {ref.tripInterest ? `Interest: ${ref.tripInterest}` : `Device: ${ref.visitorDevice || 'Browser'}`}
                </div>
              </div>

              <div className="text-right">
                {ref.bookingAmount ? (
                  <div>
                    <div className="text-emerald-400 font-bold">₹{ref.bookingAmount.toLocaleString()}</div>
                    <div className="text-[10px] text-amber-400 font-semibold">+₹{ref.commissionAmount} Commission</div>
                  </div>
                ) : (
                  <span className="text-slate-500 text-[11px]">{new Date(ref.timestamp).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          ))}

          {referrals.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-500">
              No referral activity yet. Share your link above to start generating leads!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
