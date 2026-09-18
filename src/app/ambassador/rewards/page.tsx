'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import {
  Gift,
  Award,
  Lock,
  Zap,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Sparkles,
  X,
} from 'lucide-react';
import { dbService } from '@/lib/services/db';
import { useAuth } from '@/lib/services/authContext';
import { RewardItem, RewardClaim } from '@/types';

export default function AmbassadorRewardsPage() {
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

  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [claims, setClaims] = useState<RewardClaim[]>([]);
  const [claimingReward, setClaimingReward] = useState<RewardItem | null>(null);

  const [addressForm, setAddressForm] = useState({
    fullName: profile?.name || '',
    street: 'Hostel Block 4, Room 218',
    city: profile?.city || '',
    state: profile?.state || '',
    postalCode: '751024',
    phone: profile?.phone || '',
  });
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setRewards(dbService.getRewards());
      setClaims(dbService.getRewardClaims(profile?.ambassadorId || 'WLA-CAP-001'));
    };
    refresh();
    return dbService.subscribe(refresh);
  }, [profile?.ambassadorId]);

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimingReward) return;

    setIsClaiming(true);
    setTimeout(() => {
      const res = dbService.claimReward(claimingReward.id, profile.ambassadorId, addressForm);
      setIsClaiming(false);

      if (res.success) {
        setClaimingReward(null);
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {}
      } else {
        alert(res.message);
      }
    }, 400);
  };

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            <Gift className="w-3.5 h-3.5" />
            <span>Merchandise &amp; Expeditions</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-black text-white uppercase">
            REWARDS REDEMPTION VAULT
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Redeem your available XP for official adventure duffels, action cams, and sponsored high-altitude trips.
          </p>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-emerald-500/40 text-right shadow-glow-emerald">
          <div className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Current Balance</div>
          <div className="text-2xl font-display font-black text-emerald-400">{profile.xp.toLocaleString()} XP</div>
          <div className="text-[11px] text-slate-300">{profile.level.replace('_', ' ')} Tier</div>
        </div>
      </div>

      {/* Rewards Catalog */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Catalog Inventory ({rewards.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((rew) => {
            const isAffordable = profile.xp >= rew.requiredPoints;
            const inStock = rew.stock > 0;

            return (
              <div
                key={rew.id}
                className="glass-card rounded-2xl overflow-hidden border-slate-800 flex flex-col justify-between"
              >
                <div className="relative h-48 w-full">
                  <Image src={rew.image} alt={rew.title} fill className="object-cover" />
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 text-[10px] font-bold">
                    {rew.badge}
                  </div>
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-slate-900/90 text-white text-[10px] font-bold">
                    {rew.valueDescription}
                  </div>
                </div>

                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-amber-400 font-semibold">{rew.category}</span>
                      <span className="text-slate-400">Stock: {rew.stock} left</span>
                    </div>
                    <h4 className="font-display font-bold text-white text-base leading-snug">{rew.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{rew.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[9px] text-slate-500 uppercase">Cost</div>
                      <div className="text-base font-display font-black text-emerald-400">
                        {rew.requiredPoints.toLocaleString()} XP
                      </div>
                    </div>

                    <button
                      onClick={() => setClaimingReward(rew)}
                      disabled={!isAffordable || !inStock}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isAffordable && inStock
                          ? 'bg-emerald-500 text-slate-950 shadow-glow-emerald hover:brightness-110'
                          : 'glass-input text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {isAffordable && inStock ? (
                        <>
                          <Zap className="w-3.5 h-3.5" />
                          <span>CLAIM</span>
                        </>
                      ) : !inStock ? (
                        <span>OUT OF STOCK</span>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>LOCKED</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Claim History Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-700/60 shadow-2xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">
            My Claimed Rewards &amp; Dispatch History ({claims.length})
          </h3>
          <span className="text-[10px] text-slate-500">Tracked with logistics partners</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {claims.map((c) => (
            <div key={c.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    c.status === 'FULFILLED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    c.status === 'APPROVED' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {c.status}
                  </span>
                  <span className="font-bold text-white text-sm">{c.rewardTitle}</span>
                </div>
                <div className="text-slate-400 text-[11px] flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span>Ship To: {c.shippingAddress.street}, {c.shippingAddress.city}</span>
                </div>
                {c.trackingNumber && (
                  <div className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Tracking: {c.trackingNumber}</span>
                  </div>
                )}
              </div>

              <div className="text-right">
                <span className="text-amber-400 font-bold">-{c.pointsDeducted} XP</span>
                <div className="text-[10px] text-slate-500">Claimed {new Date(c.claimedAt).toLocaleDateString()}</div>
              </div>
            </div>
          ))}

          {claims.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-500">
              No reward claims yet. When you hit point milestones, claim items here!
            </div>
          )}
        </div>
      </div>

      {/* Claim Shipping Modal */}
      {claimingReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                  Cost: {claimingReward.requiredPoints} XP
                </span>
                <h3 className="text-lg font-display font-bold text-white mt-1">Claim {claimingReward.title}</h3>
              </div>
              <button onClick={() => setClaimingReward(null)} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleClaimSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1">
                    Recipient Name
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.fullName}
                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1">
                    Campus / Hostel Shipping Address
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.street}
                    onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold uppercase tracking-wider mb-1">
                    Postal PIN Code
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.postalCode}
                    onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl glass-input"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setClaimingReward(null)}
                  className="px-4 py-2.5 rounded-xl glass-input text-slate-300 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isClaiming}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold shadow-glow-emerald hover:brightness-110"
                >
                  {isClaiming ? 'Processing...' : 'Confirm Reward Claim'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
