'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { StatsModal } from '@/components/StatsModal';
import { PlatformStats } from '@/lib/types';
import { StatsPill } from '@/components/StatsPill';
import { Trophy, ArrowRight, ShieldCheck, Zap, Globe, Sparkles } from 'lucide-react';

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

        <main className="w-full max-w-4xl mx-auto px-4 pt-6 pb-20 flex flex-col items-start">
          {/* Visitor Pill */}
          <div className="w-full flex justify-center mb-6">
            <StatsPill onOpenStats={() => setIsStatsOpen(true)} />
          </div>

          {/* Top Title & 3D CTA Button */}
          <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
                About outbidking.lol
              </h1>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                The open pay-to-rank arena for modern products, AI tools, and founders.
              </p>
            </div>

            {/* 3D Tactile CTA Button */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-b from-[#ff7a59] via-[#ea6c52] to-[#d95b41] hover:brightness-105 border-t border-[#ff9e80] text-white font-black text-xs sm:text-sm tracking-tight shadow-[0_4px_0_0_#b8432a,0_6px_14px_rgba(234,108,82,0.4)] active:shadow-[0_1px_0_0_#b8432a] active:translate-y-[2px] transition-all cursor-pointer shrink-0"
            >
              <Trophy className="w-4 h-4 text-amber-200" />
              <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">Claim #1 Throne</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mission & Core Concepts */}
          <div className="mt-8 space-y-8 w-full">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#ea6c52]" />
                What is Outbid King?
              </h2>
              <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
                <strong className="text-zinc-900 dark:text-white font-semibold">outbidking.lol</strong> is a public pay-to-rank leaderboard for modern AI agents, apps, developer tools, and creators. There are zero ads, zero editorial gatekeeping, and zero fake review manipulation. Whoever holds the top bid holds the throne.
              </p>
            </section>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-[#121217] border border-zinc-200 dark:border-[#272732]">
                <div className="w-8 h-8 rounded-xl bg-[#ea6c52]/15 text-[#ea6c52] flex items-center justify-center font-bold mb-3">
                  1
                </div>
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Pure Transparency</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                  No hidden algorithms. Every rank corresponds exactly to the verified bid on the board.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-[#121217] border border-zinc-200 dark:border-[#272732]">
                <div className="w-8 h-8 rounded-xl bg-[#ea6c52]/15 text-[#ea6c52] flex items-center justify-center font-bold mb-3">
                  2
                </div>
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Live Real-Time Traffic</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                  Every link routes through high-speed click telemetry, sending verified human visitors directly to your tool.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-[#121217] border border-zinc-200 dark:border-[#272732]">
                <div className="w-8 h-8 rounded-xl bg-[#ea6c52]/15 text-[#ea6c52] flex items-center justify-center font-bold mb-3">
                  3
                </div>
                <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Instant Dodo Activation</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                  Pay securely with Cards, Apple Pay, or Google Pay via Dodo Payments for immediate ranking.
                </p>
              </div>
            </div>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#ea6c52]" />
                How Click Telemetry Works
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Every listing connects through a high-speed redirect endpoint (<code className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-xs font-mono">/r/[id]</code>) that records real unique human visits. The higher your ranking, the greater exposure your product receives.
              </p>
            </section>

            {/* Author Card */}
            <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-[#121217] border border-zinc-200 dark:border-[#272732] w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="font-bold text-sm text-zinc-900 dark:text-white">
                  Built by <a href="https://x.com/shipxankit" target="_blank" rel="noopener noreferrer" className="text-[#ea6c52] hover:underline">@shipxankit</a>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Founder & builder of outbidking.lol
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

            {/* Bottom 3D CTA Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#ea6c52]/10 via-[#f97316]/5 to-transparent border border-[#ea6c52]/30 w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <h3 className="font-black text-lg sm:text-xl text-zinc-900 dark:text-white">
                  Ready to claim the #1 King throne?
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                  Start your ascent today from just $1 USD.
                </p>
              </div>
              <Link
                href="/"
                className="px-6 py-3 rounded-full bg-gradient-to-b from-[#ff7a59] via-[#ea6c52] to-[#d95b41] hover:brightness-105 border-t border-[#ff9e80] text-white font-black text-xs sm:text-sm tracking-tight shadow-[0_4px_0_0_#b8432a,0_6px_14px_rgba(234,108,82,0.4)] active:shadow-[0_1px_0_0_#b8432a] active:translate-y-[2px] transition-all cursor-pointer shrink-0"
              >
                <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">Grab #1 Throne</span>
              </Link>
            </div>
          </div>
        </main>
      </div>

      <Footer onOpenStats={() => setIsStatsOpen(true)} />
      <StatsModal isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} stats={stats} />
    </div>
  );
}
