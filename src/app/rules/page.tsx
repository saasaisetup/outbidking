'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { StatsModal } from '@/components/StatsModal';
import { PlatformStats } from '@/lib/types';
import { StatsPill } from '@/components/StatsPill';
import { Trophy, ArrowRight, ShieldCheck } from 'lucide-react';

export default function RulesPage() {
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
                Rules
              </h1>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                How the pay-to-rank game and outbidding mechanics operate.
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
            <strong className="text-zinc-900 dark:text-white">outbidking.lol</strong> is a public leaderboard. There are no hidden algorithms, no fake reviews, and no editorial gatekeeping. You pay to stand above everyone else. Rank is your bid — nothing else.
          </p>

          {/* Section 1 */}
          <h2 className="mt-8 text-xl font-bold text-zinc-900 dark:text-white">
            How ranking works
          </h2>

          <div className="mt-3 space-y-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <p>
              New listings are whole US dollars, <strong className="text-zinc-900 dark:text-white">$1 minimum</strong>, $999,999 maximum, $1 at a time. Bids already on the board keep their amount until they raise or get outranked.
            </p>
            <p>
              Taking #1 costs at least $1 more than the current top bid. Paying less still puts you on the board at whatever rank that bid can take. Equal bids stay in the order they were placed — the older bid keeps the higher rank.
            </p>
            <p>
              Enter the same website or @handle again to raise that listing to any rank. The new bid must be at least $1 above your current bid; you only pay the difference.
            </p>
          </div>

          {/* Section 2 */}
          <h2 className="mt-8 text-xl font-bold text-zinc-900 dark:text-white">
            What you can list
          </h2>

          <div className="mt-3 space-y-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <p>
              A product website, app, SaaS, dev tool, or an X @handle.
            </p>
            <p>
              Query parameters are stripped from listing links. Links containing illegal materials or phishing attempts are purged immediately.
            </p>
          </div>

          {/* Section 3 */}
          <h2 className="mt-8 text-xl font-bold text-zinc-900 dark:text-white">
            Payments & Security
          </h2>

          <div className="mt-3 p-4 rounded-2xl bg-zinc-50 dark:bg-[#121217] border border-zinc-200 dark:border-[#272732] w-full flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
              <div>
                <div className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-white">
                  Powered exclusively by Dodo Payments
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Global checkout supporting Cards, Apple Pay, and Google Pay with instant live ranking.
                </p>
              </div>
            </div>
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
        onOpenRules={() => {}}
        onOpenStats={() => setIsStatsOpen(true)}
      />

      <StatsModal isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} stats={stats} />
    </div>
  );
}
