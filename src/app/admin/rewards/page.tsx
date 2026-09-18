'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Gift,
  Plus,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  X,
  Package,
} from 'lucide-react';
import { dbService } from '@/lib/services/db';
import { RewardItem, RewardClaim, AmbassadorLevel, RewardCategory } from '@/types';
import { useAuth } from '@/lib/services/authContext';

export default function AdminRewardsManagerPage() {
  const { user } = useAuth();
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [claims, setClaims] = useState<RewardClaim[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fulfill modal
  const [fulfillingClaim, setFulfillingClaim] = useState<RewardClaim | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('BLUEDART-882190');

  const [form, setForm] = useState({
    title: '',
    category: 'MERCHANDISE' as RewardCategory,
    description: '',
    requiredPoints: 1500,
    requiredLevel: 'EXPLORER' as AmbassadorLevel,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    badge: '🎒 Campus Gear',
    valueDescription: 'Valued at ₹3,500',
    status: 'AVAILABLE' as const,
  });

  useEffect(() => {
    const refresh = () => {
      setRewards(dbService.getRewards());
      setClaims(dbService.getRewardClaims());
    };
    refresh();
    return dbService.subscribe(refresh);
  }, []);

  const handleCreateReward = (e: React.FormEvent) => {
    e.preventDefault();
    dbService.createReward(form);
    setShowCreateModal(false);
  };

  const handleFulfillClaim = (status: RewardClaim['status']) => {
    if (!fulfillingClaim) return;
    dbService.updateClaimStatus(
      fulfillingClaim.id,
      status,
      status === 'FULFILLED' ? trackingNumber : undefined,
      user?.displayName || 'Finance Lead'
    );
    setFulfillingClaim(null);
  };

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold border border-pink-500/30">
            <Gift className="w-3.5 h-3.5" />
            <span>Merchandise &amp; Dispatch Logistics</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-black text-white uppercase mt-1">
            REWARDS CATALOG &amp; FULFILLMENT
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Manage physical merchandise stock, review ambassador claims, and attach tracking numbers for courier dispatch.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-glow-emerald hover:brightness-110 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>ADD REWARD ITEM</span>
        </button>
      </div>

      {/* Claims Queue */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-700/80 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-400" />
            <span>Ambassador Reward Claims ({claims.length})</span>
          </h3>
          <span className="text-[10px] text-slate-400">Review &amp; Dispatch</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {claims.map((c) => (
            <div key={c.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    c.status === 'FULFILLED' ? 'bg-emerald-500/20 text-emerald-300' :
                    c.status === 'APPROVED' ? 'bg-cyan-500/20 text-cyan-300' :
                    'bg-amber-500/20 text-amber-300'
                  }`}>
                    {c.status}
                  </span>
                  <span className="font-bold text-white text-sm">{c.rewardTitle}</span>
                </div>
                <div className="text-slate-300">
                  Recipient: <strong>{c.ambassadorName}</strong> ({c.shippingAddress.phone})
                </div>
                <div className="text-slate-400 text-[11px] flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span>{c.shippingAddress.street}, {c.shippingAddress.city}, {c.shippingAddress.postalCode}</span>
                </div>
                {c.trackingNumber && (
                  <div className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Courier Tracking: {c.trackingNumber}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {c.status !== 'FULFILLED' ? (
                  <button
                    onClick={() => setFulfillingClaim(c)}
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold shadow-glow-emerald"
                  >
                    Process Fulfillment
                  </button>
                ) : (
                  <span className="text-emerald-400 font-semibold text-[11px]">✓ Dispatched</span>
                )}
              </div>
            </div>
          ))}

          {claims.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-500">
              No reward claims submitted yet.
            </div>
          )}
        </div>
      </div>

      {/* Rewards Catalog Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Catalog Stock &amp; Point Requirements ({rewards.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {rewards.map((rew) => (
            <div key={rew.id} className="glass-card rounded-2xl overflow-hidden border-slate-800 flex flex-col justify-between">
              <div className="relative h-40 w-full">
                <Image src={rew.image} alt={rew.title} fill className="object-cover" />
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 text-[10px] font-bold">
                  {rew.badge}
                </div>
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between text-xs text-amber-400 font-semibold">
                    <span>{rew.category}</span>
                    <span>Stock: {rew.stock}</span>
                  </div>
                  <h4 className="font-display font-bold text-white text-sm leading-snug mt-1">{rew.title}</h4>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between text-xs">
                  <span className="text-slate-400">Required:</span>
                  <span className="font-display font-black text-emerald-400">{rew.requiredPoints} XP</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fulfillment Modal */}
      {fulfillingClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl space-y-4">
            <h3 className="text-base font-display font-bold text-white">Process Reward Dispatch</h3>
            <p className="text-xs text-slate-300">
              Reward: <strong>{fulfillingClaim.rewardTitle}</strong> for <strong>{fulfillingClaim.ambassadorName}</strong>
            </p>

            <div className="space-y-1 text-xs">
              <label className="block text-slate-300 font-semibold">Attach Courier Tracking Number</label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-xs font-mono"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setFulfillingClaim(null)}
                className="px-4 py-2 rounded-xl glass-input text-slate-300 hover:text-white text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleFulfillClaim('FULFILLED')}
                className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-glow-emerald"
              >
                Mark Dispatched &amp; Fulfilled
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Reward Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-display font-bold text-white">Add Reward Catalog Item</h3>

            <form onSubmit={handleCreateReward} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Item Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl glass-input"
                  placeholder="e.g. Wonderlight Expedition Windbreaker"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Required Points (XP)</label>
                  <input
                    type="number"
                    required
                    value={form.requiredPoints}
                    onChange={(e) => setForm({ ...form, requiredPoints: parseInt(e.target.value) || 500 })}
                    className="w-full px-3.5 py-2 rounded-xl glass-input font-bold text-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 10 })}
                    className="w-full px-3.5 py-2 rounded-xl glass-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Image URL</label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl glass-input"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl glass-input"
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
                  Add to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
