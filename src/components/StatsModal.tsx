'use client';

import React from 'react';
import { X, TrendingUp, Users, DollarSign, MousePointerClick, Flame, Crown } from 'lucide-react';
import { PlatformStats } from '@/lib/types';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PlatformStats;
}

export function StatsModal({ isOpen, onClose, stats }: StatsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-7 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-[#e05d44]" />
          <h2 className="text-xl font-black text-zinc-900 dark:text-white">Live Platform Stats</h2>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <div className="text-[11px] font-semibold text-zinc-500 uppercase">Live Online</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-500 font-mono mt-0.5">
              1,082
            </div>
            <div className="text-[10px] text-zinc-400">active founders now</div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <div className="text-[11px] font-semibold text-zinc-500 uppercase">Total Visitors</div>
            <div className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white font-mono mt-0.5">
              1,170,800
            </div>
            <div className="text-[10px] text-zinc-400">since launch</div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <div className="text-[11px] font-semibold text-zinc-500 uppercase">Total Volume</div>
            <div className="text-xl sm:text-2xl font-black text-[#e05d44] font-mono mt-0.5">
              ${(stats.totalVolume || 148250).toLocaleString()}
            </div>
            <div className="text-[10px] text-zinc-400">across 991+ projects</div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <div className="text-[11px] font-semibold text-zinc-500 uppercase">Clicks Delivered</div>
            <div className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white font-mono mt-0.5">
              {(stats.totalClicksDelivered || 58290).toLocaleString()}
            </div>
            <div className="text-[10px] text-zinc-400">direct outbound traffic</div>
          </div>
        </div>

        {stats.currentKing && (
          <div className="p-3.5 rounded-xl bg-[#fef2f0] dark:bg-[#1a0f0d] border border-[#fecaca] dark:border-[#3a1d19] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-[#e05d44]" />
              <div>
                <div className="text-xs font-bold text-zinc-900 dark:text-white">
                  Current King: {stats.currentKing.title}
                </div>
                <div className="text-[10px] text-zinc-500">
                  Total Bid: ${stats.currentKing.totalBid.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="text-xs font-bold text-[#e05d44] font-mono">
              Rank #1
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
