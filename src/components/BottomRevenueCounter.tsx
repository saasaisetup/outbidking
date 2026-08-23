'use client';

import React from 'react';
import { PlatformStats } from '@/lib/types';

interface BottomRevenueCounterProps {
  stats: PlatformStats;
}

export function BottomRevenueCounter({ stats }: BottomRevenueCounterProps) {
  const displayTotal = stats.totalVolume || 148250;

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
      <div className="text-xs sm:text-sm font-semibold text-[#e05d44] mb-3">
        This simple side project made
      </div>

      {/* Giant Box Counter */}
      <div className="px-8 sm:px-12 py-5 rounded-2xl border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm flex items-center justify-center">
        <span className="font-mono text-4xl sm:text-6xl font-black text-zinc-900 dark:text-white tracking-tight">
          ${displayTotal.toLocaleString()}
        </span>
      </div>

      <div className="mt-3 text-xs sm:text-sm text-zinc-500 font-medium">
        since its launch 66 hours ago
      </div>
    </section>
  );
}
