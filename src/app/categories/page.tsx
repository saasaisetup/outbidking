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

export default function CategoriesPage() {
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [stats, setStats] = useState<PlatformStats>({
    totalVolume: 194201,
    totalBidsCount: 500,
    totalProjectsCount: 991,
    totalClicksDelivered: 142732,
    currentKing: null,
    kingHoldDurationSeconds: 68400,
    highestSingleBid: 14043,
  });

  const categoryList = CATEGORIES.filter((c) => c.slug !== 'all');

  return (
    <div className="min-h-screen bg-white dark:bg-[#0e0d0b] text-zinc-900 dark:text-white font-sans flex flex-col justify-between transition-colors duration-200">
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

          {/* Headline & Subtitle */}
          <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Categories
          </h1>
          <p className="mt-2 text-sm sm:text-base text-zinc-500 dark:text-zinc-400 font-normal">
            Every category has its own ranking. Pick one to see who leads it.
          </p>

          {/* Grid of Categories matching uploaded image media_1787458405907.png */}
          <div className="mt-8 w-full grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {categoryList.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="group p-4 sm:p-5 rounded-[22px] bg-[#fbfaf8] dark:bg-[#181613] border border-zinc-200/90 dark:border-[#2b2721] hover:border-[#ea6c52] dark:hover:border-[#ea6c52] transition-all duration-150 flex items-center gap-3.5 shadow-2xs hover:shadow-sm"
              >
                {/* Category Icon using custom terracotta pill styling */}
                <CategoryIcon slug={cat.slug} size="md" />

                <div className="flex-1 min-w-0">
                  <div className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white group-hover:text-[#ea6c52] transition-colors truncate">
                    {cat.name}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
      />

      {/* Modals */}
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <StatsModal isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} stats={stats} />
    </div>
  );
}
