'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  Mail,
  Phone,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { dbService } from '@/lib/services/db';

export default function FAQPage() {
  const cms = dbService.getCMSConfig();
  const faqItems = cms.faqItems || [];

  const [openId, setOpenId] = useState<string | null>(faqItems[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');

  const categories = ['ALL', ...Array.from(new Set(faqItems.map((f) => f.category)))];

  const filteredFaqs = faqItems.filter((item) => {
    const matchesCategory = activeCategory === 'ALL' || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto font-sans space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Frequently Asked Questions</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight uppercase">
          EVERYTHING YOU NEED TO KNOW
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
          Clear answers regarding eligibility, incentives, time commitments, and how Wonderlight empowers your collegiate journey.
        </p>
      </div>

      {/* Search Bar & Category Pills */}
      <div className="space-y-4">
        <div className="relative max-w-xl mx-auto">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search questions about missions, payments, eligibility..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-2xl glass-input text-xs"
          />
        </div>

        <div className="flex items-center justify-center gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-glow-emerald'
                  : 'glass-input text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordions */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className="glass-card rounded-2xl overflow-hidden border border-slate-800 transition-all"
            >
              <button
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className="w-full p-5 text-left flex items-center justify-between gap-4"
              >
                <span className="font-display font-bold text-white text-sm sm:text-base">
                  {faq.question}
                </span>
                <span className="p-1 rounded-lg bg-slate-800 text-slate-400 flex-shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 animate-in fade-in">
                  <p>{faq.answer}</p>
                  <div className="mt-3 text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                    Category: {faq.category}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Contact Banner */}
      <div className="glass-panel rounded-3xl p-8 border border-slate-700/60 text-center space-y-4">
        <h3 className="text-xl font-display font-bold text-white">Still have questions?</h3>
        <p className="text-xs text-slate-300 max-w-md mx-auto">
          Our Campus Ambassador Support Desk is here to assist with any questions about partnerships, campus drives, or regional logistics.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
          <a
            href={`mailto:${cms.contactEmail}`}
            className="px-4 py-2 rounded-xl glass-input text-slate-200 hover:text-emerald-400 flex items-center gap-2"
          >
            <Mail className="w-3.5 h-3.5 text-emerald-400" />
            <span>{cms.contactEmail}</span>
          </a>
          <a
            href={`tel:${cms.contactPhone}`}
            className="px-4 py-2 rounded-xl glass-input text-slate-200 hover:text-emerald-400 flex items-center gap-2"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span>{cms.contactPhone}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
