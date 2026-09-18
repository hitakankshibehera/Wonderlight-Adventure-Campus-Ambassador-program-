'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Gift,
  Award,
  Sparkles,
  Lock,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { dbService } from '@/lib/services/db';
import { RewardItem } from '@/types';
import { useAuth } from '@/lib/services/authContext';

export default function PublicRewardsPage() {
  const { user, ambassadorProfile } = useAuth();
  const [rewards, setRewards] = useState<RewardItem[]>([]);

  useEffect(() => {
    const refresh = () => {
      setRewards(dbService.getRewards());
    };
    refresh();
    return dbService.subscribe(refresh);
  }, []);

  const userXP = ambassadorProfile?.xp || 0;

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <Gift className="w-3.5 h-3.5" />
          <span>Incentives, Gear & Experiences</span>
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-white tracking-tight uppercase">
          AMBASSADOR REWARDS CATALOG
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Complete campus challenges, drive expedition bookings, and redeem your hard-earned XP for professional adventure gear, travel credits, and sponsored expeditions.
        </p>
      </div>

      {/* Ambassador XP Banner if logged in */}
      {ambassadorProfile && (
        <div className="p-6 rounded-2xl glass-panel border border-emerald-500/40 max-w-2xl mx-auto flex items-center justify-between gap-4 shadow-glow-emerald">
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider">Your Balance</div>
            <div className="text-2xl font-display font-black text-emerald-400">{userXP.toLocaleString()} XP</div>
            <div className="text-xs text-slate-300 font-medium">{ambassadorProfile.name} • {ambassadorProfile.level.replace('_', ' ')}</div>
          </div>
          <Link
            href="/ambassador/rewards"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-glow-emerald hover:brightness-110 transition-all flex items-center gap-1.5"
          >
            <span>Claim Rewards</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Rewards Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rewards.map((rew) => {
          const isUnlocked = userXP >= rew.requiredPoints;

          return (
            <div
              key={rew.id}
              className="glass-card rounded-2xl overflow-hidden group flex flex-col justify-between border-slate-800 hover:border-emerald-500/40"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={rew.image}
                  alt={rew.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-wonder-dark-950 via-transparent to-transparent" />

                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-500/30">
                    {rew.badge}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                  <span className="text-emerald-400 font-display font-bold">
                    {rew.valueDescription}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-900/90 text-slate-300 border border-slate-700">
                    {rew.stock} in stock
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-amber-400 font-semibold">{rew.category}</span>
                    <span className="text-slate-400">Min Tier: {rew.requiredLevel.replace('_', ' ')}</span>
                  </div>

                  <h3 className="font-display font-bold text-white text-lg group-hover:text-emerald-400 transition-colors">
                    {rew.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {rew.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">Required</div>
                    <div className="text-lg font-display font-black text-emerald-400">
                      {rew.requiredPoints.toLocaleString()} XP
                    </div>
                  </div>

                  {ambassadorProfile ? (
                    <Link
                      href="/ambassador/rewards"
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isUnlocked
                          ? 'bg-emerald-500 text-slate-950 shadow-glow-emerald hover:brightness-110'
                          : 'glass-input text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {isUnlocked ? (
                        <>
                          <Zap className="w-3.5 h-3.5" />
                          <span>CLAIM</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>LOCKED</span>
                        </>
                      )}
                    </Link>
                  ) : (
                    <Link
                      href="/campus-ambassador/apply"
                      className="px-4 py-2 rounded-xl glass-input text-xs font-semibold text-slate-300 hover:text-white"
                    >
                      Apply to Unlock
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {rewards.length === 0 && (
        <div className="glass-panel p-12 sm:p-16 rounded-3xl text-center space-y-4 border border-slate-800">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Gift className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-wide">
            REWARDS CATALOG
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto">
            Rewards will be announced by Wonderlight Adventure.
          </p>
        </div>
      )}
    </div>
  );
}
