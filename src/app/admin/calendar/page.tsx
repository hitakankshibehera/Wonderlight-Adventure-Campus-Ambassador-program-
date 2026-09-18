'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Sparkles,
  Ticket,
  ArrowRight,
} from 'lucide-react';
import { dbService } from '@/lib/services/db';
import { EventItem } from '@/types';

export default function AdminEventCalendarPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [currentMonth, setCurrentMonth] = useState('October 2026');

  useEffect(() => {
    const refresh = () => {
      setEvents(dbService.getEvents());
    };
    refresh();
    return dbService.subscribe(refresh);
  }, []);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // October 2026 starts on Thursday (index 4) with 31 days
  const startDayIndex = 4;
  const daysInMonth = 31;

  const getEventsForDay = (day: number) => {
    const dayStr = day < 10 ? `0${day}` : `${day}`;
    const dateMatch = `2026-10-${dayStr}`;
    return events.filter((e) => e.date === dateMatch);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Adventure Activity':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Photography Contest':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Seminar':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'Reel Challenge':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'Ambassador Meet':
        return 'bg-pink-500/20 text-pink-300 border-pink-500/40';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    }
  };

  return (
    <div className="space-y-8 font-sans max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold border border-cyan-500/30">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Interactive Scheduling Grid</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-black text-white uppercase mt-1">
            CAMPUS EVENT CALENDAR
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Visual month-by-month itinerary of treks, collegiate photography workshops, and webinars.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 rounded-xl glass-input text-slate-300 hover:text-white">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-display font-bold text-white text-sm sm:text-base px-3">
            {currentMonth}
          </span>
          <button className="p-2 rounded-xl glass-input text-slate-300 hover:text-white">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800 shadow-2xl p-4 sm:p-6">
        {/* Days Header */}
        <div className="grid grid-cols-7 gap-2 text-center pb-4 border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
          {daysOfWeek.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Days Cells */}
        <div className="grid grid-cols-7 gap-2 pt-3">
          {/* Empty cells before month start */}
          {Array.from({ length: startDayIndex }).map((_, idx) => (
            <div key={`empty-${idx}`} className="min-h-24 sm:min-h-32 p-2 rounded-2xl bg-slate-900/20 border border-slate-800/30 opacity-40" />
          ))}

          {/* Days 1 to 31 */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const day = idx + 1;
            const dayEvents = getEventsForDay(day);

            return (
              <div
                key={`day-${day}`}
                className="min-h-24 sm:min-h-32 p-2 rounded-2xl glass-card border-slate-800/80 flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div className="text-right text-xs font-bold text-slate-400">
                  {day}
                </div>

                <div className="space-y-1 my-1 overflow-y-auto max-h-20">
                  {dayEvents.map((ev) => (
                    <Link
                      key={ev.id}
                      href={`/campus-ambassador/events/${ev.id}`}
                      className={`block p-1.5 rounded-lg border text-[10px] font-semibold truncate hover:brightness-125 transition-all ${getCategoryColor(
                        ev.category
                      )}`}
                      title={`${ev.title} (${ev.city})`}
                    >
                      {ev.title}
                    </Link>
                  ))}
                </div>

                <div className="text-[9px] text-slate-500">
                  {dayEvents.length > 0 ? `${dayEvents.length} event` : ''}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
