'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Outbid Error Boundary]', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-zinc-900 dark:text-white flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#121217] text-center shadow-lg">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-black tracking-tight mb-2">Something went wrong</h2>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
          The page encountered an unexpected issue, but all leaderboard data is safe.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#ea6c52] hover:bg-[#d95b41] text-white font-bold text-xs tracking-tight transition-colors shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold text-xs tracking-tight transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Leaderboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
