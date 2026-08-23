'use client';

import React from 'react';
import { X, Trophy, Zap, ShieldCheck } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#181613] border border-zinc-200 dark:border-[#2e2a24] shadow-2xl p-6 sm:p-8 text-zinc-900 dark:text-white max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-xl bg-[#e05d44] text-white flex items-center justify-center font-bold">
            ⚡
          </div>
          <h2 className="text-2xl font-black tracking-tight">About outbidking.lol</h2>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mb-6">
          The public pay-to-rank game of viral attention.
        </p>

        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
          <p>
            <strong className="text-zinc-900 dark:text-white">outbidking.lol</strong> is an open leaderboard experiment. There are no advertising algorithms, no hidden auction quality scores, and no SEO gatekeepers.
          </p>

          <p>
            Rank is determined purely by the highest cumulative bid. The project holding #1 gets maximum visibility and massive direct referral traffic from thousands of daily visitors.
          </p>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#13110e] border border-zinc-200 dark:border-[#2a2620] space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#e05d44]">
              Platform Transparency
            </h4>
            <ul className="text-xs space-y-1 text-zinc-600 dark:text-zinc-400 list-disc list-inside">
              <li>100% public bidding ledger.</li>
              <li>Outbound clicks tracked live via <code>/r/:id</code> redirect.</li>
              <li>Real-time Server-Sent Events broadcast every rank shift.</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <span>Built by <a href="https://x.com/shipxcode" target="_blank" rel="noopener noreferrer" className="text-[#e05d44] font-bold hover:underline">@shipxcode</a></span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold hover:opacity-90 transition-opacity"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
