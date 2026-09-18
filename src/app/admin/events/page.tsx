'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calendar,
  Plus,
  Trash2,
  Edit,
  MapPin,
  Clock,
  Users,
  Ticket,
  ExternalLink,
  X,
  CheckCircle2,
} from 'lucide-react';
import { dbService } from '@/lib/services/db';
import { EventItem, EventCategory } from '@/types';

export default function AdminEventsManagerPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [form, setForm] = useState({
    title: '',
    category: 'Adventure Activity' as EventCategory,
    description: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00 AM',
    endTime: '05:00 PM',
    venue: '',
    city: '',
    state: '',
    capacity: 100,
    registrationStatus: 'OPEN' as const,
    banner: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop&q=80',
    rules: ['Valid student ID required at entry desk'],
    schedule: [{ time: '10:00 AM', activity: 'Inaugural Session' }],
    prizes: ['Certificate of Participation'],
    organizer: 'Wonderlight Adventure Division',
  });

  useEffect(() => {
    const refresh = () => {
      setEvents(dbService.getEvents());
    };
    refresh();
    return dbService.subscribe(refresh);
  }, []);

  const handleDelete = (ev: EventItem) => {
    if (window.confirm(`Delete event "${ev.title}"?`)) {
      dbService.deleteEvent(ev.eventId);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    dbService.createEvent({
      ...form,
      gallery: [form.banner],
    });
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-8 font-sans max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold border border-cyan-500/30">
            <Calendar className="w-3.5 h-3.5" />
            <span>Expedition &amp; Gathering Creator</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-black text-white uppercase mt-1">
            EVENT OPERATIONS &amp; ROSTERS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Schedule high-altitude camps, travel photo contests, conclaves, and monitor venue capacities.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-glow-emerald hover:brightness-110 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>CREATE NEW EVENT</span>
        </button>
      </div>

      {/* Events Table / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((ev) => (
          <div
            key={ev.id}
            className="glass-card rounded-2xl overflow-hidden border-slate-800 flex flex-col justify-between"
          >
            <div className="relative h-44 w-full">
              <Image src={ev.banner} alt={ev.title} fill className="object-cover" />
              <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-emerald-400 text-[10px] font-bold">
                {ev.category}
              </div>
              <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 text-[10px] font-bold">
                {ev.registrationStatus}
              </div>
            </div>

            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="text-[11px] text-amber-400 font-semibold">{ev.date} • {ev.startTime}</div>
                <h4 className="font-display font-bold text-white text-base leading-snug">{ev.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-2">{ev.description}</p>
                <div className="text-[10px] text-slate-500">{ev.venue}, {ev.city}</div>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Capacity:</span>
                  <span className="font-bold text-white">{ev.registeredCount} / {ev.capacity} registered</span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <Link
                    href={`/campus-ambassador/events/${ev.id}`}
                    className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>View Public Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  <button
                    onClick={() => handleDelete(ev)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete Event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-display font-bold text-white">Create New Campus Event</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">Event Title *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl glass-input"
                    placeholder="e.g. Western Ghats Monsoon Trek Workshop"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as EventCategory })}
                    className="w-full px-3.5 py-2 rounded-xl glass-input bg-wonder-dark-900"
                  >
                    <option value="Adventure Activity">Adventure Activity</option>
                    <option value="Photography Contest">Photography Contest</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Travel Quiz">Travel Quiz</option>
                    <option value="Ambassador Meet">Ambassador Meet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Event Date</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl glass-input"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Start Time</label>
                  <input
                    type="text"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl glass-input"
                    placeholder="10:00 AM"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Capacity Limit</label>
                  <input
                    type="number"
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) || 50 })}
                    className="w-full px-3.5 py-2 rounded-xl glass-input"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Venue Name</label>
                  <input
                    type="text"
                    required
                    value={form.venue}
                    onChange={(e) => setForm({ ...form, venue: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl glass-input"
                    placeholder="e.g. Student Activity Hall"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl glass-input"
                    placeholder="e.g. Pune"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">Banner Image URL</label>
                  <input
                    type="url"
                    value={form.banner}
                    onChange={(e) => setForm({ ...form, banner: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl glass-input"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl glass-input"
                    placeholder="Explain the experience, guidelines, and benefits..."
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl glass-input text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold shadow-glow-emerald"
                >
                  Save &amp; Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
