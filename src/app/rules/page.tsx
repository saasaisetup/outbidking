'use client';

import React from 'react';
import Link from 'next/link';

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-[#06090e] text-white p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between pb-6 border-b border-[#1e293b]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#ff7043] hover:underline"
          >
            ← Back to Globe
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-extrabold text-white"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-[#0b0f19] text-[#ff5722] border border-[#1e293b]">
              <svg viewBox="0 0 100 100" width="12" height="12" fill="currentColor">
                <path d="M20,8 L42,8 L82,32 L42,56 L42,92 L20,92 Z" />
              </svg>
            </span>
            <span>pinit.lol</span>
          </Link>
        </div>

        <div className="mt-8 rounded-pin-lg border border-[#1e293b] bg-[#0b0f19] p-6 sm:p-8 shadow-2xl">
          <h1 className="text-2xl font-extrabold text-white">
            Game Rules & Mechanics
          </h1>
          <p className="mt-2 text-sm text-[#94a3b8] leading-relaxed">
            pinit.lol is a 24-hour pay-to-rank map game where products and founders compete for sovereign territory on a 3D Earth and 2D World War map.
          </p>

          <div className="mt-8 space-y-6">
            <div className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ff5722]/15 border border-[#ff5722]/30 text-sm font-bold text-[#ff7043]">
                1
              </span>
              <div>
                <h2 className="text-sm font-bold text-white">
                  1 Product Per Country
                </h2>
                <p className="mt-1 text-xs text-[#94a3b8] leading-relaxed">
                  Only 1 product or founder can hold a country throne at any given time.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f59e0b]/15 border border-[#f59e0b]/30 text-sm font-bold text-[#fbbf24]">
                2
              </span>
              <div>
                <h2 className="text-sm font-bold text-white">
                  24-Hour Reign
                </h2>
                <p className="mt-1 text-xs text-[#94a3b8] leading-relaxed">
                  Your stake reserves your sovereign throne for 24 hours. After 24 hours without an outbid, your product enters the permanent Hall of Fame.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#10b981]/15 border border-[#10b981]/30 text-sm font-bold text-emerald-400">
                3
              </span>
              <div>
                <h2 className="text-sm font-bold text-white">
                  Outbid Mechanics
                </h2>
                <p className="mt-1 text-xs text-[#94a3b8] leading-relaxed">
                  Anyone can outbid the current ruler by paying <strong>+$1 or higher</strong> than the previous stake.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#3b82f6]/15 border border-[#3b82f6]/30 text-sm font-bold text-blue-400">
                4
              </span>
              <div>
                <h2 className="text-sm font-bold text-white">
                  Live Traffic & Clicks
                </h2>
                <p className="mt-1 text-xs text-[#94a3b8] leading-relaxed">
                  Every visitor hovering and clicking the country pin or drawer lands directly on your website, delivering continuous real-time traffic.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
