'use client';

import React from 'react';
import { Compass, Zap, Flame, Crown, Award, Star } from 'lucide-react';
import { AmbassadorLevel } from '@/types';

interface LevelBadgeIconProps {
  level: AmbassadorLevel | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showName?: boolean;
}

export const LevelBadgeIcon: React.FC<LevelBadgeIconProps> = ({
  level,
  size = 'md',
  className = '',
  showName = false,
}) => {
  const normLevel = (level || '').toUpperCase();

  let icon = <Compass className="w-4 h-4 text-emerald-400" />;
  let badgeBg = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
  let name = 'Explorer';

  if (normLevel === 'VOYAGER') {
    icon = <Zap className="w-4 h-4 text-cyan-400" />;
    badgeBg = 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400';
    name = 'Voyager';
  } else if (normLevel === 'TRAILBLAZER') {
    icon = <Flame className="w-4 h-4 text-amber-400" />;
    badgeBg = 'bg-amber-500/10 border-amber-500/30 text-amber-400';
    name = 'Trailblazer';
  } else if (normLevel === 'WONDERLIGHT_CAMPUS_STAR' || normLevel === 'STAR') {
    icon = <Crown className="w-4 h-4 text-yellow-400" />;
    badgeBg = 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300 shadow-glow-gold';
    name = 'Campus Star';
  }

  const sizeClasses =
    size === 'sm'
      ? 'w-6 h-6 p-1 text-xs'
      : size === 'lg'
      ? 'w-10 h-10 p-2 text-base'
      : 'w-8 h-8 p-1.5 text-sm';

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div
        className={`rounded-xl border flex items-center justify-center transition-all ${badgeBg} ${sizeClasses}`}
        title={name}
      >
        {icon}
      </div>
      {showName && <span className="font-display font-bold uppercase">{name}</span>}
    </div>
  );
};
