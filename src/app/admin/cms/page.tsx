'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sliders,
  CheckCircle2,
  Save,
  ExternalLink,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Eye,
} from 'lucide-react';
import { dbService } from '@/lib/services/db';
import { CMSConfig, CMSSectionToggles } from '@/types';

export default function AdminCMSPage() {
  const [config, setConfig] = useState<CMSConfig>(dbService.getCMSConfig());
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setConfig(dbService.getCMSConfig());
    };
    refresh();
    return dbService.subscribe(refresh);
  }, []);

  const toggleSection = (key: keyof CMSSectionToggles) => {
    const updatedSections = {
      ...config.sections,
      [key]: !config.sections[key],
    };
    const updated = dbService.updateCMSConfig({ sections: updatedSections });
    setConfig(updated);
    flashSuccess();
  };

  const toggleApplicationsOpen = () => {
    const updated = dbService.updateCMSConfig({ applicationsOpen: !config.applicationsOpen });
    setConfig(updated);
    flashSuccess();
  };

  const handleSaveText = (e: React.FormEvent) => {
    e.preventDefault();
    dbService.updateCMSConfig({
      heroHeadline: config.heroHeadline,
      heroSubheadline: config.heroSubheadline,
      primaryTagline: config.primaryTagline,
      secondaryTagline: config.secondaryTagline,
      programBatch: config.programBatch,
      applicationDeadline: config.applicationDeadline,
      contactEmail: config.contactEmail,
      contactPhone: config.contactPhone,
    });
    flashSuccess();
  };

  const flashSuccess = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const sectionsList: { key: keyof CMSSectionToggles; label: string; desc: string }[] = [
    { key: 'hero', label: 'Hero Banner Section', desc: 'Cinematic travel visual, primary call to action, and cohort tags' },
    { key: 'about', label: 'About The Program', desc: '"More than an Ambassador" headline & student-to-travel flow' },
    { key: 'whatTheyDo', label: 'What Ambassadors Do', desc: '6 role cards: promotion, community, referrals, events, reels' },
    { key: 'benefits', label: 'What You Unlock (Benefits)', desc: 'Perks: commissions, LOR, sponsored treks, merchandise' },
    { key: 'howItWorks', label: 'How It Works (Roadmap)', desc: '6 animated steps from application to reward claim' },
    { key: 'levels', label: 'Ambassador Levels & Tiers', desc: 'Interactive Explorer, Voyager, Trailblazer & Star badges' },
    { key: 'missions', label: 'Missions & Challenges', desc: 'Live preview of action tasks with XP rewards' },
    { key: 'events', label: 'Upcoming Gatherings & Treks', desc: 'Event cards catalog with remaining seat counters' },
    { key: 'leaderboard', label: 'Leaderboard Recognition', desc: 'Public rankings preview with top collegiate ambassadors' },
    { key: 'gallery', label: 'Community Expedition Gallery', desc: 'Campus photos and high-altitude trek albums' },
    { key: 'faq', label: 'FAQ Accordions', desc: 'Common questions on eligibility, rewards, and time commitment' },
    { key: 'cta', label: 'Final Call To Action Banner', desc: '"Your Campus is Waiting. Are You Ready to Lead the Journey?"' },
  ];

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
            <Sliders className="w-3.5 h-3.5" />
            <span>Dynamic Marketing CMS</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-black text-white uppercase mt-1">
            HOMEPAGE SECTION TOGGLES &amp; CONTENT
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Toggle landing page sections ON or OFF with zero code deployment and edit marketing copy in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-emerald-400 text-xs font-bold flex items-center gap-1 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Saved &amp; Published Live!</span>
            </span>
          )}

          <Link
            href="/campus-ambassador"
            target="_blank"
            className="px-4 py-2.5 rounded-xl glass-input text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
          >
            <span>Preview Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* MASTER APPLICATION FORM CONTROL CARD */}
      <div className={`glass-panel rounded-3xl p-6 sm:p-8 border shadow-2xl transition-all ${
        config.applicationsOpen
          ? 'border-emerald-500/50 bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-slate-950'
          : 'border-rose-500/50 bg-gradient-to-r from-rose-950/40 via-slate-900/90 to-slate-950'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                config.applicationsOpen ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                {config.applicationsOpen ? 'ONLINE • ACCEPTING APPLICATIONS' : 'OFFLINE • REGISTRATIONS CLOSED'}
              </span>
              <span className="text-slate-400 text-xs font-semibold">Super Admin Master Control</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-tight">
              CAMPUS AMBASSADOR REGISTRATION FORM (&quot;APPLY NOW&quot;)
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {config.applicationsOpen
                ? 'The registration form (/campus-ambassador/apply) is currently OPEN. Candidates across India can submit applications.'
                : 'The registration form (/campus-ambassador/apply) is currently CLOSED. "Apply Now" buttons are updated and visitors see a closed notification banner.'}
            </p>
          </div>

          <button
            onClick={toggleApplicationsOpen}
            className={`px-6 py-4 rounded-2xl font-display font-black text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-3 shadow-2xl cursor-pointer ${
              config.applicationsOpen
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-950/50 hover:scale-105'
                : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-emerald-950/50 hover:scale-105'
            }`}
          >
            {config.applicationsOpen ? (
              <>
                <ToggleRight className="w-6 h-6 text-white" />
                <span>CLOSE REGISTRATION FORM NOW</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-6 h-6 text-slate-950" />
                <span>OPEN REGISTRATION FORM NOW</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Section Toggles Grid */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl space-y-6">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <h3 className="font-display font-bold text-white text-base uppercase tracking-wider">
            1. Homepage Section Visibility Controls
          </h3>
          <span className="text-[10px] text-slate-400">Changes reflect instantly</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sectionsList.map((sec) => {
            const isEnabled = config.sections[sec.key];
            return (
              <div
                key={sec.key}
                onClick={() => toggleSection(sec.key)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                  isEnabled
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : 'bg-slate-900/30 border-slate-800 opacity-60'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-white text-xs sm:text-sm flex items-center gap-2">
                    <span>{sec.label}</span>
                    <span className={`text-[9px] font-black px-2 py-0.2 rounded-full ${
                      isEnabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {isEnabled ? 'ON' : 'OFF'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{sec.desc}</p>
                </div>

                <div className="text-emerald-400 flex-shrink-0">
                  {isEnabled ? (
                    <ToggleRight className="w-8 h-8 text-emerald-400" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-600" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Copy Editor */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="font-display font-bold text-white text-base uppercase tracking-wider">
            2. Marketing Copy &amp; Campaign Metadata
          </h3>
          <p className="text-xs text-slate-400">Update taglines, cohort session names, and application deadlines.</p>
        </div>

        <form onSubmit={handleSaveText} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Primary Tagline</label>
              <input
                type="text"
                value={config.primaryTagline}
                onChange={(e) => setConfig({ ...config, primaryTagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Secondary Tagline</label>
              <input
                type="text"
                value={config.secondaryTagline}
                onChange={(e) => setConfig({ ...config, secondaryTagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Cohort Batch</label>
              <input
                type="text"
                value={config.programBatch}
                onChange={(e) => setConfig({ ...config, programBatch: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input font-bold text-emerald-400"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Application Deadline</label>
              <input
                type="text"
                value={config.applicationDeadline}
                onChange={(e) => setConfig({ ...config, applicationDeadline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Contact Email</label>
              <input
                type="email"
                value={config.contactEmail}
                onChange={(e) => setConfig({ ...config, contactEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Contact Phone</label>
              <input
                type="text"
                value={config.contactPhone}
                onChange={(e) => setConfig({ ...config, contactPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Hero Subheadline Narrative</label>
            <textarea
              rows={2}
              value={config.heroSubheadline}
              onChange={(e) => setConfig({ ...config, heroSubheadline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl glass-input"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-glow-emerald hover:brightness-110 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>SAVE &amp; PUBLISH CHANGES</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
