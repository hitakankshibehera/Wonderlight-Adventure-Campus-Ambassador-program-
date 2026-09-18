'use client';

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Plus,
  Trash2,
  Users,
  Send,
  Sparkles,
  AlertTriangle,
  X,
} from 'lucide-react';
import { dbService } from '@/lib/services/db';
import { AnnouncementRecord } from '@/types';
import { useAuth } from '@/lib/services/authContext';

export default function AdminAnnouncementsPage() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<AnnouncementRecord[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'PROGRAM' as const,
    targetAudience: 'ALL' as const,
    priority: 'HIGH' as const,
    isPublished: true,
  });

  useEffect(() => {
    const refresh = () => {
      setAnnouncements(dbService.getAnnouncements());
    };
    refresh();
    return dbService.subscribe(refresh);
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    dbService.createAnnouncement({
      ...form,
      authorName: user?.displayName || 'Operations Desk',
    });
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-8 font-sans max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            <Bell className="w-3.5 h-3.5" />
            <span>Targeted Broadcast Dispatch</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-black text-white uppercase mt-1">
            ANNOUNCEMENT BROADCASTER
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Publish high-priority notices, bonus XP sprints, and expedition notifications directly to ambassador dashboards.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-glow-emerald hover:brightness-110 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>NEW BROADCAST</span>
        </button>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  ann.priority === 'URGENT' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                  ann.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  'bg-slate-800 text-slate-300'
                }`}>
                  {ann.priority} PRIORITY
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 uppercase">
                  {ann.category}
                </span>
                <span className="text-xs text-slate-400">
                  Target: <strong>{ann.targetAudience}</strong>
                </span>
              </div>

              <span className="text-xs text-slate-500">
                {new Date(ann.createdAt).toLocaleDateString()} at {new Date(ann.createdAt).toLocaleTimeString()}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-display font-bold text-white">{ann.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{ann.content}</p>
            </div>

            <div className="pt-2 text-[11px] text-slate-500">
              Published by: <strong>{ann.authorName}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl space-y-4">
            <h3 className="text-base font-display font-bold text-white">Broadcast Announcement</h3>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl glass-input"
                  placeholder="e.g. 2X XP Sprint for Tourism Week!"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl glass-input bg-wonder-dark-900 text-slate-200"
                  >
                    <option value="PROGRAM">Program</option>
                    <option value="EVENT">Event</option>
                    <option value="MISSION">Mission</option>
                    <option value="REWARD">Reward</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl glass-input bg-wonder-dark-900 text-slate-200"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target</label>
                  <select
                    value={form.targetAudience}
                    onChange={(e) => setForm({ ...form, targetAudience: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl glass-input bg-wonder-dark-900 text-slate-200"
                  >
                    <option value="ALL">All Ambassadors</option>
                    <option value="LEVEL">Specific Tier</option>
                    <option value="COLLEGE">Specific Campus</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Message Content</label>
                <textarea
                  rows={4}
                  required
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl glass-input"
                  placeholder="Type broadcast message..."
                />
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
                  Publish Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
