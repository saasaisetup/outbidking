'use client';

import React, { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { HeroBiddingBar } from '@/components/HeroBiddingBar';
import { HeroCrown } from '@/components/HeroCrown';
import { CategoryFilters } from '@/components/CategoryFilters';
import { TopThreeCards } from '@/components/TopThreeCards';
import { LatestActivityTicker } from '@/components/LatestActivityTicker';
import { RankedList } from '@/components/RankedList';
import { Footer } from '@/components/Footer';

import { BidModal } from '@/components/BidModal';
import { RulesModal } from '@/components/RulesModal';
import { AboutModal } from '@/components/AboutModal';
import { StatsModal } from '@/components/StatsModal';
import { OutbidToast } from '@/components/OutbidToast';

import { Project, PlatformStats, BidTransaction, SSEEventData, CategorySlug } from '@/lib/types';
import { CATEGORIES } from '@/lib/categories';
import { soundManager } from '@/lib/sound';
import { ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<PlatformStats>({
    totalVolume: 62750,
    totalBidsCount: 500,
    totalProjectsCount: 991,
    totalClicksDelivered: 58290,
    currentKing: null,
    kingHoldDurationSeconds: 68400,
    highestSingleBid: 14018,
  });
  const [recentBids, setRecentBids] = useState<BidTransaction[]>([]);
  const [currentBidAmount, setCurrentBidAmount] = useState<number>(14023);

  // Modals state
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [prefillUrl, setPrefillUrl] = useState('');
  const [prefillBid, setPrefillBid] = useState<number | undefined>(undefined);

  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [toastEvent, setToastEvent] = useState<SSEEventData | null>(null);

  const currentCategory = CATEGORIES.find((c) => c.slug === slug) || {
    slug: slug as CategorySlug,
    name: slug.replace(/-/g, ' '),
    icon: '⚡',
    description: 'Category Leaderboard',
  };

  const fetchData = useCallback(async () => {
    try {
      const url = `/api/bids?category=${slug}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.projects) setProjects(data.projects);
      if (data.stats) {
        setStats(data.stats);
        if (data.projects && data.projects.length > 0) {
          setCurrentBidAmount(data.projects[0].totalBid + 5);
        }
      }
      if (data.recentBids) setRecentBids(data.recentBids);
    } catch (err) {
      console.error('[Outbid] Fetch error:', err);
    }
  }, [slug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleHeroSubmitBid = ({
    url,
    bidAmount,
  }: {
    url: string;
    bidAmount: number;
  }) => {
    setPrefillUrl(url);
    setPrefillBid(bidAmount);
    setIsBidModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0c0a] text-zinc-900 dark:text-white selection:bg-[#e05d44] selection:text-white font-sans transition-colors duration-200">
      <Header
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenCategories={() => {}}
      />

      <main className="w-full pb-16">
        {/* Back Link & Category Title */}
        <div className="w-full max-w-4xl mx-auto px-4 pt-4 pb-2 flex items-center justify-between">
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Categories</span>
          </Link>
          <span className="text-xs font-bold text-[#e05d44] flex items-center gap-1">
            <span>{currentCategory.icon}</span>
            <span>{currentCategory.name}</span>
          </span>
        </div>

        {/* Hero Section */}
        <HeroBiddingBar
          stats={stats}
          currentBidAmount={currentBidAmount}
          onBidAmountChange={(amt) => setCurrentBidAmount(amt)}
          onSubmitBid={handleHeroSubmitBid}
          onOpenStats={() => setIsStatsOpen(true)}
        />

        {/* Category Pills Bar */}
        <CategoryFilters
          selectedCategory={slug}
          onSelectCategory={(s) => {
            if (s === 'all') {
              window.location.href = '/';
            } else {
              window.location.href = `/category/${s}`;
            }
          }}
        />

        {/* Top 3 Tinted Cards */}
        <TopThreeCards
          topProjects={projects}
          onSelectProject={(p) => {
            setPrefillUrl(p.url);
            setPrefillBid(p.totalBid + 5);
            setIsBidModalOpen(true);
          }}
        />

        {/* Latest Activity Ticker */}
        <LatestActivityTicker
          recentBids={recentBids}
          onSelectBid={(tx) => {
            setPrefillUrl(tx.projectUrl);
            setPrefillBid(tx.amount + 5);
            setIsBidModalOpen(true);
          }}
        />

        {/* Ranked Table */}
        <RankedList
          projects={projects}
          onSelectProject={(p) => {
            setPrefillUrl(p.url);
            setPrefillBid(p.totalBid + 5);
            setIsBidModalOpen(true);
          }}
          onRefresh={() => fetchData()}
        />

        {/* Footer */}
        <Footer
          onOpenRules={() => setIsRulesOpen(true)}
          onOpenStats={() => setIsStatsOpen(true)}
        />
      </main>

      {/* Interactive Modals */}
      <BidModal
        isOpen={isBidModalOpen}
        onClose={() => setIsBidModalOpen(false)}
        initialUrl={prefillUrl}
        initialBidAmount={prefillBid || currentBidAmount}
        stats={stats}
        onBidSuccess={() => fetchData()}
      />

      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <StatsModal isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} stats={stats} />
    </div>
  );
}
