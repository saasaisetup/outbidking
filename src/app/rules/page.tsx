'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { StatsModal } from '@/components/StatsModal';
import { PlatformStats } from '@/lib/types';
import { StatsPill } from '@/components/StatsPill';

export default function RulesPage() {
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [stats, setStats] = useState<PlatformStats>({
    totalVolume: 153694,
    totalBidsCount: 500,
    totalProjectsCount: 991,
    totalClicksDelivered: 58290,
    currentKing: null,
    kingHoldDurationSeconds: 68400,
    highestSingleBid: 14018,
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#0e0d0b] text-zinc-900 dark:text-white font-sans flex flex-col justify-between transition-colors duration-200">
      <div>
        <Header />

        <main className="w-full max-w-2xl mx-auto px-4 pt-6 pb-16 flex flex-col items-start">
          {/* Visitor Pill */}
          <div className="w-full flex justify-center mb-6">
            <StatsPill onOpenStats={() => setIsStatsOpen(true)} />
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Rules
          </h1>

          <p className="mt-4 text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
            <strong className="text-zinc-900 dark:text-white">outbidking.lol</strong> is a public leaderboard. There are no ads, no API keys, and no revenue share. You pay to stand above everyone else. Rank is the bid — nothing else.
          </p>

          {/* Section 1 */}
          <h2 className="mt-8 text-xl font-bold text-zinc-900 dark:text-white">
            How ranking works
          </h2>

          <div className="mt-3 space-y-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <p>
              New listings are whole US dollars, $5 minimum, $999,999 maximum, $1 at a time. Bids already on the board keep their amount until they raise or get outranked.
            </p>
            <p>
              Taking #1 costs at least $5 more than the current top bid. Paying less still puts you on the board at whatever rank that bid can take. Equal bids stay in the order they were placed — the older bid keeps the higher rank.
            </p>
            <p>
              Enter the same website or @handle again to raise that listing to any rank. The new bid must be at least $1 above your current bid; you only pay the difference. Someone else cannot take your rank by paying that difference.
            </p>
            <p>
              App Store, Play Store, GitHub, and similar platform links are keyed by their path, so different apps don&apos;t share a bid. Tracking query strings are ignored.
            </p>
          </div>

          {/* Section 2 */}
          <h2 className="mt-8 text-xl font-bold text-zinc-900 dark:text-white">
            What you can list
          </h2>

          <div className="mt-3 space-y-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <p>
              A product website, or an X @handle.
            </p>
            <p>
              Chat and invite links are not allowed — Telegram, WhatsApp, Discord, Messenger, Signal, and similar. The board is for products and profiles, not group chats.
            </p>
            <p>
              Links to sexual content are not allowed. If it is porn, NSFW, or an adult platform, it does not belong on the board.
            </p>
            <p>
              Query parameters are stripped from listing links. Affiliate, referral, and tracking URLs will not work.
            </p>
            <p>
              Link shortener URLs are not allowed. If you submit one, it is replaced by the URL it redirects to.
            </p>
          </div>

          {/* Section 3 */}
          <h2 className="mt-8 text-xl font-bold text-zinc-900 dark:text-white">
            Categories
          </h2>

          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Categories for existing listings were auto-assigned by AI. If your product is in the wrong category, DM <a href="https://x.com/shipxcode" target="_blank" rel="noopener noreferrer" className="text-[#e05d44] hover:underline font-bold">@shipxcode</a> on X to have it changed.
          </p>

          {/* Section 4 */}
          <h2 className="mt-8 text-xl font-bold text-zinc-900 dark:text-white">
            After you pay
          </h2>

          <div className="mt-3 space-y-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <p>
              Your listing is public. Clicks go to the URL or profile you submitted, without query parameters.
            </p>
            <p>
              A completed payment is what claims the rank.
            </p>
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
