'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  ExternalLink,
  Sparkles,
  MapPin,
  X,
} from 'lucide-react';

interface PhotoItem {
  id: string;
  title: string;
  category: string;
  url: string;
  location: string;
}

const INITIAL_PHOTOS: PhotoItem[] = [
  {
    id: 'p1',
    title: 'Solang Ridge Alpine Camp',
    category: 'Alpine Treks',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=80',
    location: 'Manali, HP',
  },
  {
    id: 'p2',
    title: 'High-Altitude Stargazing',
    category: 'Night Sky',
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80',
    location: 'Spiti Valley',
  },
  {
    id: 'p3',
    title: 'Goa Ambassadors Sundowner',
    category: 'Conclave',
    url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80',
    location: 'Anjuna, Goa',
  },
  {
    id: 'p4',
    title: 'Drone Storytelling Workshop',
    category: 'Workshops',
    url: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=800&auto=format&fit=crop&q=80',
    location: 'Lodhi Road, Delhi',
  },
  {
    id: 'p5',
    title: 'Western Ghats Ridge Trail',
    category: 'Alpine Treks',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80',
    location: 'Sahyadri, MH',
  },
  {
    id: 'p6',
    title: 'National Conclave Awards',
    category: 'Conclave',
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
    location: 'Central Pavilion',
  },
];

export default function AdminGalleryPage() {
  const [photos, setPhotos] = useState<PhotoItem[]>(INITIAL_PHOTOS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    category: 'Alpine Treks',
    url: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&auto=format&fit=crop&q=80',
    location: '',
  });

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    setPhotos([
      {
        id: `p-${Date.now()}`,
        ...form,
      },
      ...photos,
    ]);
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    setPhotos(photos.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Visual Media Asset Management</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-black text-white uppercase mt-1">
            EXPEDITION &amp; AMBASSADOR GALLERY
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Curate verified photography albums, workshop captures, and annual conclave ceremonies.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-glow-emerald hover:brightness-110 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>UPLOAD NEW PHOTO</span>
        </button>
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {photos.map((p) => (
          <div
            key={p.id}
            className="glass-card rounded-2xl overflow-hidden border-slate-800 group relative flex flex-col justify-between"
          >
            <div className="relative h-56 w-full">
              <Image src={p.url} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-wonder-dark-950 via-transparent to-transparent" />
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-emerald-400 text-[10px] font-bold">
                {p.category}
              </div>
            </div>

            <div className="p-4 flex items-center justify-between">
              <div>
                <h4 className="font-display font-bold text-white text-sm">{p.title}</h4>
                <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>{p.location}</span>
                </div>
              </div>

              <button
                onClick={() => handleDelete(p.id)}
                className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl space-y-4">
            <h3 className="text-base font-display font-bold text-white">Add Photo to Gallery</h3>

            <form onSubmit={handleAddPhoto} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl glass-input"
                  placeholder="e.g. Kedarkantha Winter Basecamp"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl glass-input bg-wonder-dark-900 text-slate-200"
                >
                  <option value="Alpine Treks">Alpine Treks</option>
                  <option value="Night Sky">Night Sky</option>
                  <option value="Conclave">Conclave</option>
                  <option value="Workshops">Workshops</option>
                  <option value="Campus Life">Campus Life</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl glass-input"
                  placeholder="e.g. Uttarkashi, Uttarakhand"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl glass-input"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl glass-input text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold shadow-glow-emerald"
                >
                  Add Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
