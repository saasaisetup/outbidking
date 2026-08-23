'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { StatsModal } from '@/components/StatsModal';
import { RulesModal } from '@/components/RulesModal';
import { PlatformStats } from '@/lib/types';

export default function AboutPage() {
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [stats, setStats] = useState<PlatformStats>({
    totalVolume: 194201,
    totalBidsCount: 500,
    totalProjectsCount: 991,
    totalClicksDelivered: 142732,
    currentKing: null,
    kingHoldDurationSeconds: 68400,
    highestSingleBid: 14043,
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#0e0d0b] text-zinc-900 dark:text-white font-sans flex flex-col justify-between transition-colors duration-200">
      <div>
        <Header />

        <main className="w-full max-w-2xl mx-auto px-4 pt-6 pb-16 flex flex-col items-start">
          {/* Visitor Pill */}
          <div className="w-full flex justify-center mb-6">
            <button
              onClick={() => setIsStatsOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">1,081 online</span>
              <span>·</span>
              <span>142,732 visitors</span>
              <span>·</span>
              <span className="text-[#ea6c52] font-semibold flex items-center">
                stats <span className="ml-0.5">→</span>
              </span>
            </button>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            About outbidking.lol
          </h1>

          <p className="mt-4 text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
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
            Every listing links through a high-speed redirect counter (<code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 text-xs font-mono">/r/[id]</code>) that records real unique human click traffic in real time. The higher your rank, the more referral traffic lands on your product.
          </p>

          {/* Author Card */}
          <div className="mt-8 p-5 rounded-2xl bg-zinc-50 dark:bg-[#181613] border border-zinc-200 dark:border-[#2e2a24] w-full flex items-center justify-between gap-4">
            <div>
              <div className="font-bold text-sm text-zinc-900 dark:text-white">
                Builder & Creator
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                The public pay-to-rank leaderboard at outbidking.lol
              </p>
            </div>
          </div>
        </main>
      </div>

      <Footer
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
      />

      <StatsModal isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} stats={stats} />
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
    </div>
  );
}
