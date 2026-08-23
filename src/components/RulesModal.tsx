'use client';

import React from 'react';
import { X, ShieldCheck, Zap } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RulesModal({ isOpen, onClose }: RulesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-7 shadow-xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 fill-[#e05d44] text-[#e05d44]" />
          <h2 className="text-xl font-black text-zinc-900 dark:text-white">Rules of Outbid</h2>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <h3 className="font-bold text-zinc-900 dark:text-white mb-1">1. Pay to Rank</h3>
            <p>
              Your ranking on the board is determined strictly by the dollar amount you pay. The highest cumulative bid claims Rank #1.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <h3 className="font-bold text-zinc-900 dark:text-white mb-1">2. Non-Consumable Bids</h3>
            <p>
              Your bids never expire. Your lifetime total stays on the leaderboard forever unless someone pays more to surpass you.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <h3 className="font-bold text-zinc-900 dark:text-white mb-1">3. Delta Top-Ups</h3>
            <p>
              If your URL is already on the board, you only pay the difference needed to reach your new higher rank.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <h3 className="font-bold text-zinc-900 dark:text-white mb-1">4. No Moderation Bias</h3>
            <p>
              We do not pick favorites or manipulate rankings. Everything is transparent and automated. Illegal or abusive content is strictly blocked.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2.5 rounded-xl bg-[#e05d44] hover:bg-[#c94b33] text-white font-bold text-sm transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
