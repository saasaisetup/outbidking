'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { HeroBiddingBar } from '@/components/HeroBiddingBar';
import { CategoryFilters } from '@/components/CategoryFilters';
import { TopThreeCards } from '@/components/TopThreeCards';
import { LatestActivityTicker } from '@/components/LatestActivityTicker';
import { RankedList } from '@/components/RankedList';
import { BottomRevenueCounter } from '@/components/BottomRevenueCounter';
import { Footer } from '@/components/Footer';

import { BidModal } from '@/components/BidModal';
import { RulesModal } from '@/components/RulesModal';
import { AboutModal } from '@/components/AboutModal';
import { StatsModal } from '@/components/StatsModal';
import { OutbidToast } from '@/components/OutbidToast';

import { Project, PlatformStats, BidTransaction, SSEEventData, CategorySlug } from '@/lib/types';
import { soundManager } from '@/lib/sound';
import confetti from 'canvas-confetti';

export default function HomePage() {
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
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug>('all');
  const [currentBidAmount, setCurrentBidAmount] = useState<number>(14023);

  // Modals state
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [prefillUrl, setPrefillUrl] = useState('');
  const [prefillBid, setPrefillBid] = useState<number | undefined>(undefined);
  const [prefillCategory, setPrefillCategory] = useState('ai-agents-infrastructure');

  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [toastEvent, setToastEvent] = useState<SSEEventData | null>(null);

  const fetchData = useCallback(async (cat = selectedCategory) => {
    try {
      const url = `/api/bids?category=${cat}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.projects) {
        setProjects(data.projects);
        // If viewing a specific category, calculate category price to take #1 in that category
        if (cat !== 'all') {
          if (data.projects.length > 0) {
            setCurrentBidAmount(data.projects[0].totalBid + 5);
          } else {
            setCurrentBidAmount(6);
          }
        }
      }

      if (data.stats) {
        setStats(data.stats);
        if (cat === 'all' && data.stats.currentKing) {
          setCurrentBidAmount(data.stats.currentKing.totalBid + 5);
        }
      }

      if (data.recentBids) setRecentBids(data.recentBids);
    } catch (err) {
      console.error('[Outbid] Fetch error:', err);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchData(selectedCategory);
  }, [selectedCategory, fetchData]);

  useEffect(() => {
    let es: EventSource | null = null;
    try {
      es = new EventSource('/api/events');
      es.onmessage = (e) => {
        try {
          const parsed = JSON.parse(e.data) as SSEEventData;
          if (!parsed || !parsed.type) return;

          if (parsed.type === 'NEW_KING' || parsed.type === 'NEW_BID' || parsed.type === 'RANK_SHIFT') {
            setToastEvent(parsed);
            if (parsed.type === 'NEW_KING') {
              soundManager.playKingGong();
              confetti({ particleCount: 80, spread: 60, origin: { y: 0.5 } });
            } else {
              soundManager.playCashChing();
            }
            fetchData();
          } else if (parsed.type === 'CLICK_UPDATE') {
            if (parsed.data?.stats) {
              setStats(parsed.data.stats);
            }
          }
        } catch {
          // ignore
        }
      };
    } catch {
      // ignore
    }

    return () => {
      if (es) es.close();
    };
  }, [fetchData]);

  const handleHeroSubmitBid = ({
    url,
    category,
    bidAmount,
    logoUrl,
  }: {
    url: string;
    category: string;
    bidAmount: number;
    logoUrl?: string;
  }) => {
    setPrefillUrl(url);
    setPrefillCategory(category || (selectedCategory !== 'all' ? selectedCategory : 'ai-agents-infrastructure'));
    setPrefillBid(bidAmount);
    setIsBidModalOpen(true);
  };

  const handleSelectCardToOutbid = (project: Project, nextPrice: number) => {
    setCurrentBidAmount(nextPrice);
    setPrefillUrl(project.url);
    setPrefillBid(nextPrice);
    setPrefillCategory(project.category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen selection:bg-[#e05d44] selection:text-white font-sans transition-colors duration-200">
      {/* Top Header with working Light/Dark theme toggle */}
      <Header />

      <main className="w-full pb-12">
        {/* Hero Section with Favicon Grabber and Category Dropdown */}
        <HeroBiddingBar
          stats={stats}
          currentBidAmount={currentBidAmount}
          onBidAmountChange={(amt) => setCurrentBidAmount(amt)}
          onSubmitBid={handleHeroSubmitBid}
          onOpenStats={() => setIsStatsOpen(true)}
        />

        {/* Category Pills Bar matching media_1787414703339.png */}
        <CategoryFilters
          selectedCategory={selectedCategory}
          onSelectCategory={(slug) => setSelectedCategory(slug)}
        />

        {/* Top 3 Tinted Cards with Hover-Only Action */}
        <TopThreeCards
          topProjects={projects}
          onSelectProject={handleSelectCardToOutbid}
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

        {/* Ranked List (Rows #4 to #50+) with Top 10 / Top 20 Dividers */}
        <RankedList
          projects={projects}
          onSelectProject={handleSelectCardToOutbid}
          onRefresh={() => fetchData()}
        />

        {/* Bottom Giant Monospace Revenue Counter */}
        <BottomRevenueCounter stats={stats} />

        {/* Footer */}
        <Footer
          onOpenRules={() => setIsRulesOpen(true)}
          onOpenStats={() => setIsStatsOpen(true)}
        />
      </main>

      {/* Interactive Checkout Modal */}
      <BidModal
        isOpen={isBidModalOpen}
        onClose={() => setIsBidModalOpen(false)}
        initialUrl={prefillUrl}
        initialBidAmount={prefillBid || currentBidAmount}
        initialCategory={prefillCategory}
        stats={stats}
        onBidSuccess={() => fetchData()}
      />

      {/* Modals */}
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
      <StatsModal isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} stats={stats} />

      {/* Live Outbid Toast */}
      <OutbidToast
        event={toastEvent}
        onClose={() => setToastEvent(null)}
        onOutbid={(p, min) => {
          setPrefillUrl(p.url);
          setPrefillBid(min);
          setIsBidModalOpen(true);
        }}
      />
    </div>
  );
}
