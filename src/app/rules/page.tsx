'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { StatsModal } from '@/components/StatsModal';
import { PlatformStats } from '@/lib/types';
import { StatsPill } from '@/components/StatsPill';
import { Trophy, ArrowRight, ShieldCheck, Crown, Medal, Award, Flame, ExternalLink, Zap } from 'lucide-react';

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

        <main className="w-full max-w-3xl mx-auto px-4 pt-6 pb-16 flex flex-col items-start">
          {/* Visitor Pill */}
          <div className="w-full flex justify-center mb-4">
            <StatsPill onOpenStats={() => setIsStatsOpen(true)} />
          </div>

          {/* Back to Leaderboard Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-[#181822] hover:bg-zinc-200 dark:hover:bg-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300 transition-colors mb-5 border border-zinc-200 dark:border-zinc-800 cursor-pointer shadow-2xs group"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">←</span>
            <span>Back to Leaderboard</span>
          </Link>

          {/* Top Title & CTA Button */}
          <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2.5">
                <span>Rules & Prestige Perks</span>
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                How the pay-to-rank game, Crown rewards, and outbidding mechanics operate.
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

          {/* Overview Callout */}
          <p className="mt-6 text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
            <strong className="text-zinc-900 dark:text-white">outbidking.lol</strong> is an uncensored, high-velocity leaderboard. There are no hidden algorithms, no fake reviews, and no editorial gatekeeping. You pay to stand above everyone else. Rank is pure market demand — nothing else.
          </p>

          {/* Crown Hierarchy & FOMO Perks Section */}
          <h2 className="mt-10 text-xl sm:text-2xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <span>👑 The Crown Hierarchy & Rewards</span>
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Every spot on the leaderboard unlocks prestigious visual badges and valuable referral visibility:
          </p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full">
            {/* Rank 1: Gold Crown */}
            <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-transparent border-2 border-amber-500/40 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👑</span>
                  <div>
                    <h3 className="text-base font-black text-amber-600 dark:text-amber-400">
                      Rank #1 — The King
                    </h3>
                    <span className="text-[10px] font-bold text-amber-700/80 dark:text-amber-300 uppercase tracking-wider">
                      Gold Crown Tier
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white font-mono font-black text-xs">
                  #1 SPOT
                </span>
              </div>
              <ul className="mt-3 space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-500 font-bold">✓</span>
                  <span><strong>Top Spotlight Domination</strong>: First brand every visitor sees.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-500 font-bold">✓</span>
                  <span><strong>10x Direct Traffic & Clicks</strong> with prominent custom card glow.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-500 font-bold">✓</span>
                  <span><strong>King Badge & Duration Counter</strong> tracking your reign length.</span>
                </li>
              </ul>
            </div>

            {/* Rank 2: Silver Crown */}
            <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-200/50 via-zinc-100/30 to-transparent dark:from-slate-800/40 dark:via-zinc-900/40 dark:to-transparent border-2 border-slate-300 dark:border-slate-700 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🥈</span>
                  <div>
                    <h3 className="text-base font-black text-slate-700 dark:text-slate-200">
                      Rank #2 — The Viceroy
                    </h3>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Silver Crown Tier
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-slate-600 text-white font-mono font-black text-xs">
                  #2 SPOT
                </span>
              </div>
              <ul className="mt-3 space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                <li className="flex items-start gap-1.5">
                  <span className="text-slate-500 font-bold">✓</span>
                  <span><strong>Silver Crown Emblem</strong> displayed on profile and card.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-slate-500 font-bold">✓</span>
                  <span><strong>Prime Second-Row Visibility</strong> directly under the King.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-slate-500 font-bold">✓</span>
                  <span>One step away from claiming the #1 Throne.</span>
                </li>
              </ul>
            </div>

            {/* Rank 3: Bronze Crown */}
            <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-900/15 via-orange-950/10 to-transparent border-2 border-amber-800/30 dark:border-amber-700/40 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🥉</span>
                  <div>
                    <h3 className="text-base font-black text-amber-800 dark:text-amber-500">
                      Rank #3 — The Knight
                    </h3>
                    <span className="text-[10px] font-bold text-amber-700/80 dark:text-amber-400 uppercase tracking-wider">
                      Bronze Crown Tier
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-800 text-white font-mono font-black text-xs">
                  #3 SPOT
                </span>
              </div>
              <ul className="mt-3 space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-700 font-bold">✓</span>
                  <span><strong>Bronze Crown Emblem</strong> on top-3 podium.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-700 font-bold">✓</span>
                  <span><strong>Elite Podium Recognition</strong> across desktop & mobile.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-700 font-bold">✓</span>
                  <span>Instant frontpage high conversion backlink.</span>
                </li>
              </ul>
            </div>

            {/* Rank 4+: Frontpage Contenders */}
            <div className="p-4 rounded-3xl bg-gradient-to-br from-zinc-100/60 to-transparent dark:from-[#181822] dark:to-transparent border-2 border-zinc-200 dark:border-[#272732] relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <h3 className="text-base font-black text-zinc-900 dark:text-white">
                      Rank #4+ — Contenders
                    </h3>
                    <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Frontpage Placement
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono font-black text-xs">
                  #4 TO #100
                </span>
              </div>
              <ul className="mt-3 space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
                <li className="flex items-start gap-1.5">
                  <span className="text-[#ea6c52] font-bold">✓</span>
                  <span><strong>Permanent Dofollow Backlink</strong> for domain authority & SEO.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#ea6c52] font-bold">✓</span>
                  <span><strong>Transparent Live Click Tracking</strong> & Stats Ledger record.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-[#ea6c52] font-bold">✓</span>
                  <span>Instant top-up capability: pay only the difference to climb.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 1: How Bidding Operates */}
          <h2 className="mt-10 text-xl font-bold text-zinc-900 dark:text-white">
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

          {/* Section 2: What You Can List */}
          <h2 className="mt-8 text-xl font-bold text-zinc-900 dark:text-white">
            What you can list
          </h2>

          <div className="mt-3 space-y-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <p>
              A product website, app, SaaS, dev tool, agency, personal portfolio, or an X @handle.
            </p>
            <p>
              Query parameters are stripped from listing links. Links containing illegal materials or phishing attempts are purged immediately without refund.
            </p>
          </div>

          {/* Section 3: Payments & Security */}
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
                  Global checkout supporting Credit Cards, Apple Pay, and Google Pay with instant live ranking fulfillment.
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
