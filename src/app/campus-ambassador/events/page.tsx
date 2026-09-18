'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  MapPin,
  Ticket,
  Search,
  Filter,
  ArrowRight,
  Clock,
  Users,
  Compass,
  Sparkles,
} from 'lucide-react';
import { dbService } from '@/lib/services/db';
import { EventItem, EventCategory } from '@/types';

const CATEGORIES: ('ALL' | EventCategory)[] = [
  'ALL',
  'Travel Meetup',
  'Workshop',
  'Seminar',
  'Competition',
  'Photography Contest',
  'Reel Challenge',
  'Travel Quiz',
  'Campus Drive',
  'Ambassador Meet',
  'Group Trip',
  'Webinar',
  'Adventure Activity',
];

export default function PublicEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | EventCategory>('ALL');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const refreshData = () => {
      setEvents(dbService.getEvents());
    };
    refreshData();
    return dbService.subscribe(refreshData);
  }, []);

  const cities = Array.from(new Set(events.map((e) => e.city)));

  const filteredEvents = events.filter((ev) => {
    const matchesCat = selectedCategory === 'ALL' || ev.category === selectedCategory;
    const matchesCity = selectedCity === 'ALL' || ev.city === selectedCity;
    const matchesQuery =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.venue.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCat && matchesCity && matchesQuery;
  });

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <Calendar className="w-3.5 h-3.5" />
          <span>Expeditions, Workshops & Conclaves</span>
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-white tracking-tight uppercase">
          UPCOMING WONDERLIGHT EVENTS
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Explore student meetups, high-altitude alpine camps, creator bootcamps, and inter-collegiate travel competitions across India.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by event title, destination, keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <MapPin className="w-4 h-4 text-slate-400" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl glass-input text-xs bg-wonder-dark-900 text-slate-200 w-full md:w-auto"
            >
              <option value="ALL">All Cities ({cities.length})</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Categories scrollable pill list */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-glow-emerald font-bold'
                    : 'glass-input text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.map((ev) => (
          <div
            key={ev.id}
            className="glass-card rounded-2xl overflow-hidden group flex flex-col justify-between border-slate-800/90 hover:border-emerald-500/40"
          >
            <div className="relative h-52 w-full overflow-hidden">
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
              <div className="absolute top-3 right-3">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 backdrop-blur-md border border-amber-500/30">
                  {ev.registrationStatus.replace('_', ' ')}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-200">
                <span className="flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  {ev.city}, {ev.state}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                  {ev.capacity - ev.registeredCount} seats left
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{ev.date} • {ev.startTime}</span>
                </div>
                <h3 className="font-display font-bold text-white text-lg group-hover:text-emerald-400 transition-colors">
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
                  <span>REGISTER</span>
                </Link>
                <Link
                  href={`/campus-ambassador/events/${ev.id}`}
                  className="px-4 py-2.5 rounded-xl glass-input text-slate-300 hover:text-white text-xs font-semibold"
                >
                  VIEW EVENT
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="glass-panel p-12 sm:p-16 rounded-3xl text-center space-y-4 border border-slate-800">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Calendar className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-wide">
            NO EVENTS YET
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto">
            Wonderlight events will appear here once they are announced by the leadership team.
          </p>
        </div>
      )}
    </div>
  );
}
