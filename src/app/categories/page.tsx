'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { RulesModal } from '@/components/RulesModal';
import { AboutModal } from '@/components/AboutModal';
import { StatsModal } from '@/components/StatsModal';
import { CategoryIcon } from '@/components/CategoryIcon';
import { CATEGORIES } from '@/lib/categories';
import { PlatformStats } from '@/lib/types';
import { StatsPill } from '@/components/StatsPill';
import { Trophy, ArrowRight } from 'lucide-react';

export default function CategoriesPage() {
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
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

  const categoryList = CATEGORIES.filter((c) => c.slug !== 'all');

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-zinc-900 dark:text-[#f4f4f5] font-sans flex flex-col justify-between transition-colors duration-200">
      <div>
        {/* Header */}
        <Header
          onOpenRules={() => setIsRulesOpen(true)}
          onOpenAbout={() => setIsAboutOpen(true)}
          onOpenCategories={() => {}}
        />

        <main className="w-full max-w-4xl mx-auto px-4 pt-6 sm:pt-8 pb-16 flex flex-col items-start">
          {/* Visitor Pill */}
          <div className="w-full flex justify-center mb-8 sm:mb-10">
            <StatsPill onOpenStats={() => setIsStatsOpen(true)} />
          </div>

          {/* Top Title & CTA Button */}
          <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
            <div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                Categories
              </h1>
              <p className="mt-2 text-sm sm:text-base text-zinc-500 dark:text-zinc-400 font-normal">
                Every category has its own ranking. Pick one to see who leads it.
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

          {/* Grid of Categories */}
          <div className="mt-8 w-full grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {categoryList.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="group p-4 sm:p-5 rounded-[22px] bg-[#fbfaf8] dark:bg-[#121217] border border-zinc-200/90 dark:border-[#272732] hover:border-[#ea6c52] dark:hover:border-[#ea6c52] transition-all duration-150 flex items-center gap-3.5 shadow-2xs hover:shadow-sm"
              >
                {/* Category Icon */}
                <CategoryIcon slug={cat.slug} size="md" />

                <div className="flex-1 min-w-0">
                  <div className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white group-hover:text-[#ea6c52] transition-colors truncate">
                    {cat.name}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                    {cat.description}
                  </div>
                </div>

                <div className="text-zinc-400 group-hover:text-[#ea6c52] group-hover:translate-x-0.5 transition-all shrink-0">
                  →
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom CTA Card */}
          <div className="mt-12 p-6 rounded-3xl bg-gradient-to-br from-[#ea6c52]/10 via-[#f97316]/5 to-transparent border border-[#ea6c52]/30 w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <h3 className="font-black text-lg text-zinc-900 dark:text-white">
                Dominate your category leaderboard
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                Outbid your competition and lock in the #1 position today.
              </p>
            </div>
            <Link
              href="/"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#ea6c52] to-[#f97316] hover:from-[#e05d44] hover:to-[#ea580c] text-white font-black text-xs sm:text-sm tracking-tight shadow-md shadow-[#ea6c52]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              Grab #1 Throne ($1)
            </Link>
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
      />

      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <StatsModal isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} stats={stats} />
    </div>
  );
}
