'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { StatsModal } from '@/components/StatsModal';
import { PlatformStats } from '@/lib/types';
import { StatsPill } from '@/components/StatsPill';
import { Trophy, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [stats, setStats] = useState<PlatformStats>({
    totalVolume: 0,
    totalBidsCount: 0,
    totalProjectsCount: 0,
    totalClicksDelivered: 0,
    currentKing: null,
    kingHoldDurationSeconds: 0,
    highestSingleBid: 0,
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-zinc-900 dark:text-[#f4f4f5] font-sans flex flex-col justify-between transition-colors duration-200">
      <div>
        <Header />

        <main className="w-full max-w-2xl mx-auto px-4 pt-6 pb-16 flex flex-col items-start">
          {/* Visitor Pill */}
          <div className="w-full flex justify-center mb-6">
            <StatsPill onOpenStats={() => setIsStatsOpen(true)} />
          </div>

          {/* Top Title & CTA Button */}
          <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
                About outbidking.lol
              </h1>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                The public pay-to-rank arena for modern products and founders.
              </p>
            </div>

            {/* Prominent CTA Button */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#ea6c52] to-[#f97316] hover:from-[#e05d44] hover:to-[#ea580c] text-white font-black text-xs sm:text-sm tracking-tight shadow-md shadow-[#ea6c52]/30 hover:shadow-lg hover:shadow-[#ea6c52]/50 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <Trophy className="w-4 h-4 text-amber-200" />
              <span>Claim #1 Throne</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <p className="mt-6 text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
            <strong className="text-zinc-900 dark:text-white font-semibold">outbidking.lol</strong> is a public pay-to-rank leaderboard for modern AI agents, apps, developer tools, and creators: no ads, no black-box algorithms, no fake review manipulation. Just outbid your competitors to claim the #1 King throne.
          </p>

          <h2 className="mt-8 text-xl font-bold text-zinc-900 dark:text-white">
            Why pay-to-rank?
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Traditional directories hide the best tools behind opaque editorial algorithms or paid sponsorships masquerading as organic reviews. On outbidking.lol, visibility is 100% transparent. If you hold the top bid, you hold the throne.
          </p>

          <h2 className="mt-8 text-xl font-bold text-zinc-900 dark:text-white">
            How clicks work
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Every listing links through a high-speed redirect counter (<code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-xs font-mono">/r/[id]</code>) that records real unique human click traffic in real time. The higher your rank, the more referral traffic lands on your product.
          </p>

          {/* Author Card */}
          <div className="mt-8 p-5 rounded-2xl bg-zinc-50 dark:bg-[#121217] border border-zinc-200 dark:border-[#272732] w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="font-bold text-sm text-zinc-900 dark:text-white">
                Built by <a href="https://x.com/shipxankit" target="_blank" rel="noopener noreferrer" className="text-[#ea6c52] hover:underline">@shipxankit</a>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                The public pay-to-rank leaderboard at outbidking.lol
              </p>
            </div>
            <a
              href="https://x.com/shipxankit"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5 shrink-0"
            >
              <span>Follow @shipxankit on 𝕏</span>
              <span>↗</span>
            </a>
          </div>

          {/* Bottom CTA Card */}
          <div className="mt-10 p-6 rounded-3xl bg-gradient-to-br from-[#ea6c52]/10 via-[#f97316]/5 to-transparent border border-[#ea6c52]/30 w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <h3 className="font-black text-lg text-zinc-900 dark:text-white">
                Ready to take the #1 Throne?
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                Lock your rank today starting at just $1 USD.
              </p>
            </div>
            <Link
              href="/"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#ea6c52] to-[#f97316] hover:from-[#e05d44] hover:to-[#ea580c] text-white font-black text-xs sm:text-sm tracking-tight shadow-md shadow-[#ea6c52]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              Grab #1 Throne
            </Link>
          </div>
        </main>
      </div>

      <Footer
        onOpenAbout={() => {}}
        onOpenStats={() => setIsStatsOpen(true)}
      />

      <StatsModal isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} stats={stats} />
    </div>
  );
}
