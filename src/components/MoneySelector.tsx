'use client';

import React from 'react';
import { Sparkles, Trophy, Zap, TrendingUp, ArrowUp } from 'lucide-react';
import { PlatformStats, Project } from '@/lib/types';

interface MoneySelectorProps {
  amount: number;
  onChange: (amount: number) => void;
  stats: PlatformStats;
  existingProject?: Project | null;
}

export function MoneySelector({
  amount,
  onChange,
  stats,
  existingProject,
}: MoneySelectorProps) {
  const kingBid = stats.currentKing ? stats.currentKing.totalBid : 14018;
  const outbidKingTarget = kingBid + 5;

  const quickPresets = [
    { label: '+$5', delta: 5 },
    { label: '+$25', delta: 25 },
    { label: '+$100', delta: 100 },
    { label: '+$500', delta: 500 },
    { label: '+$1,000', delta: 1000 },
  ];

  // Calculate predicted rank
  const calculatePredictedRank = (bid: number) => {
    const total = existingProject ? existingProject.totalBid + bid : bid;
    if (total > kingBid) return { rank: 1, text: '👑 RANK #1 (Reigning Champion)' };
    if (total >= 13000) return { rank: 2, text: '🥈 Rank #2 (Top Podium)' };
    if (total >= 10000) return { rank: 4, text: '🥉 Rank #4 (Top 5 Elite)' };
    if (total >= 3500) return { rank: 7, text: '⭐ Rank #7 (Top 10 Spotlight)' };
    if (total >= 1000) return { rank: 15, text: '🚀 Rank #15 (Top 20)' };
    if (total >= 100) return { rank: 55, text: '📈 Rank #55' };
    return { rank: 120, text: '✅ On the Board' };
  };

  const prediction = calculatePredictedRank(amount);

  return (
    <div className="w-full flex flex-col gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-[#13110e] border border-zinc-200 dark:border-[#2a2620]">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-[#e05d44]" />
          <span>Decide Your Bid Amount</span>
        </label>
        <span className="text-[11px] font-mono text-zinc-500">
          $5 min · $1 at a time
        </span>
      </div>

      {/* Main Stepper & Numeric Input */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-lg font-bold text-zinc-400">
            $
          </span>
          <input
            type="number"
            min={5}
            max={999999}
            value={amount}
            onChange={(e) => onChange(Math.max(5, parseInt(e.target.value) || 5))}
            className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#1a1815] border border-zinc-200 dark:border-[#38332c] text-xl font-mono font-black text-zinc-900 dark:text-white focus:outline-none focus:border-[#e05d44] transition-colors"
          />
        </div>

        {/* Quick Outbid #1 Shortcut */}
        <button
          type="button"
          onClick={() => onChange(outbidKingTarget)}
          className="px-3.5 py-2.5 rounded-xl bg-[#e05d44] hover:bg-[#c94b33] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all flex-shrink-0 cursor-pointer"
        >
          <Trophy className="w-3.5 h-3.5 fill-current text-yellow-300" />
          <span>Take #1 (${outbidKingTarget.toLocaleString()})</span>
        </button>
      </div>

      {/* Range Slider */}
      <input
        type="range"
        min={5}
        max={Math.max(15000, outbidKingTarget + 1000)}
        step={5}
        value={amount}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full accent-[#e05d44] cursor-pointer"
      />

      {/* Quick Increment Chips */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        {quickPresets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => onChange(amount + preset.delta)}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#1c1916] border border-zinc-200 dark:border-[#332e27] hover:border-[#e05d44] dark:hover:border-[#e05d44] text-[11px] font-bold text-zinc-700 dark:text-zinc-300 active:scale-95 transition-all cursor-pointer shadow-2xs"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Live Position Prediction Engine */}
      <div className="p-3 rounded-xl bg-white dark:bg-[#181512] border border-zinc-200 dark:border-[#38332c] flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0 animate-pulse" />
          <div>
            <div className="font-bold text-zinc-900 dark:text-white">
              Predicted Rank: <span className="text-[#e05d44]">{prediction.text}</span>
            </div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Estimated traffic: ~{Math.min(25000, amount * 2).toLocaleString()} direct clicks
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
