'use client';

import React from 'react';
import { DollarSign, Layers, Crown, MousePointerClick, TrendingUp } from 'lucide-react';
import { PlatformStats } from '@/lib/types';

interface StatsBarProps {
  stats: PlatformStats;
}

export function StatsBar({ stats }: StatsBarProps) {
  const cards = [
    {
      label: 'Total Volume Billed',
      value: `$${stats.totalVolume.toLocaleString()}`,
      subtext: `${stats.totalBidsCount} total bids placed`,
      icon: DollarSign,
      color: 'text-amber-400',
      borderColor: 'border-amber-500/20',
      bgGlow: 'from-amber-500/10 to-transparent',
    },
    {
      label: 'Rank #1 Price',
      value: stats.currentKing ? `$${stats.currentKing.totalBid.toLocaleString()}` : '$0',
      subtext: stats.currentKing ? `Next takeover: $${(stats.currentKing.totalBid + 5).toLocaleString()}` : 'Be first!',
      icon: Crown,
      color: 'text-yellow-400',
      borderColor: 'border-yellow-500/20',
      bgGlow: 'from-yellow-500/10 to-transparent',
    },
    {
      label: 'Active Projects',
      value: stats.totalProjectsCount.toString(),
      subtext: 'Competing on leaderboard',
      icon: Layers,
      color: 'text-blue-400',
      borderColor: 'border-blue-500/20',
      bgGlow: 'from-blue-500/10 to-transparent',
    },
    {
      label: 'Clicks Delivered',
      value: stats.totalClicksDelivered.toLocaleString(),
      subtext: 'High-intent founder visits',
      icon: MousePointerClick,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/20',
      bgGlow: 'from-emerald-500/10 to-transparent',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className={`relative overflow-hidden rounded-2xl bg-zinc-950/80 border ${c.borderColor} p-4 sm:p-5 flex flex-col justify-between backdrop-blur-md`}
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${c.bgGlow} rounded-full blur-xl pointer-events-none`} />

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                {c.label}
              </span>
              <div className={`p-2 rounded-xl bg-zinc-900 border border-zinc-800 ${c.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-3">
              <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                {c.value}
              </div>
              <p className="mt-1 text-xs text-zinc-500 font-medium">
                {c.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
