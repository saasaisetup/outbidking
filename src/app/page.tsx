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
import { supabase } from '@/lib/supabase';
import { subscribeToLivePresence } from '@/lib/presence';
import confetti from 'canvas-confetti';

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [liveVisitors, setLiveVisitors] = useState<number>(1);
  const [timeFilter, setTimeFilter] = useState<'week' | 'all'>('week');
  const [stats, setStats] = useState<PlatformStats>({
    totalVolume: 0,
    totalBidsCount: 0,
    totalProjectsCount: 0,
    totalClicksDelivered: 0,
    currentKing: null,
    highestSingleBid: 0,
    kingHoldDurationSeconds: 0,
  });
  const [recentBids, setRecentBids] = useState<BidTransaction[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug>('all');
  const [currentBidAmount, setCurrentBidAmount] = useState<number>(1);

  // Modals state
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [prefillUrl, setPrefillUrl] = useState('');
  const [prefillBid, setPrefillBid] = useState<number | undefined>(undefined);
  const [prefillCategory, setPrefillCategory] = useState('agencies-studios-services');

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
        if (cat !== 'all') {
          if (data.projects.length > 0) {
            setCurrentBidAmount(data.projects[0].totalBid + 1);
          } else {
            setCurrentBidAmount(1);
          }
        }
      }

      if (data.stats) {
        setStats(data.stats);
        if (cat === 'all' && data.stats.currentKing) {
          setCurrentBidAmount(data.stats.currentKing.totalBid + 1);
        } else if (cat === 'all' && !data.stats.currentKing) {
          setCurrentBidAmount(1);
        }
      }

      if (data.recentBids) setRecentBids(data.recentBids);
    } catch (err) {
      console.error('[Outbid] Fetch error:', err);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchData(selectedCategory);

    // Handle Dodo Payments checkout return
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const paymentId = params.get('payment_id') || params.get('paymentId');
      const status = params.get('status');

      if (paymentId || status === 'succeeded' || status === 'success') {
        if (paymentId) {
          fetch(`/api/dodo/verify?payment_id=${paymentId}`)
            .then((r) => r.json())
            .then((res) => {
              if (res.success) {
                confetti({ particleCount: 120, spread: 80, origin: { y: 0.4 } });
                soundManager.playCashChing();
                fetchData(selectedCategory);
              }
            })
            .catch(() => {});
        }
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    const unsubscribePresence = subscribeToLivePresence((onlineCount) => {
      setLiveVisitors(onlineCount);
    });

    const channel = supabase
      .channel('realtime-leaderboard-feed')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        () => {
          fetchData();
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bid_transactions' },
        () => {
          soundManager.playCashChing();
          fetchData();
        }
      )
      .subscribe();

    const pollTimer = setInterval(() => {
      fetchData();
    }, 4000);

    return () => {
      unsubscribePresence();
      supabase.removeChannel(channel);
      clearInterval(pollTimer);
    };
  }, [selectedCategory, fetchData]);

  const handleHeroSubmitBid = ({
    url,
    category,
    bidAmount,
  }: {
    url: string;
    category: string;
    bidAmount: number;
    logoUrl?: string;
  }) => {
    setPrefillUrl(url);
    setPrefillCategory(category || (selectedCategory !== 'all' ? selectedCategory : 'agencies-studios-services'));
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

  // Filter projects by time if applicable
  const displayProjects = React.useMemo(() => {
    if (timeFilter === 'all') return projects;
    // For 'week', filter projects created or updated within the last 7 days
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return projects.filter((p) => new Date(p.updatedAt || p.createdAt) >= weekAgo || projects.length <= 3);
  }, [projects, timeFilter]);

  return (
    <div className="min-h-screen selection:bg-[#ea6c52] selection:text-white font-sans transition-colors duration-200 overflow-x-hidden">
      {/* Top Header */}
      <Header />

      <main className="w-full pb-12">
        {/* Hero Section with Unified Card and Time Filter Switch Pill */}
        <HeroBiddingBar
          stats={stats}
          currentBidAmount={currentBidAmount}
          timeFilter={timeFilter}
          onTimeFilterChange={setTimeFilter}
          onBidAmountChange={(amt) => setCurrentBidAmount(amt)}
          onSubmitBid={handleHeroSubmitBid}
          onOpenStats={() => setIsStatsOpen(true)}
        />

        {/* Category Horizontal Filter Pills Bar */}
        <CategoryFilters
          selectedCategory={selectedCategory}
          onSelectCategory={(slug) => setSelectedCategory(slug)}
        />

        {/* Top 3 Tinted Crown Cards */}
        <TopThreeCards
          topProjects={displayProjects}
          onSelectProject={handleSelectCardToOutbid}
        />

        {/* Latest Activity Ticker */}
        <LatestActivityTicker
          recentBids={recentBids}
          onSelectBid={(bid) => {
            const proj = projects.find((p) => p.id === bid.projectId);
            if (proj) handleSelectCardToOutbid(proj, proj.totalBid + 1);
          }}
        />

        {/* Complete Paginated Leaderboard */}
        <RankedList
          projects={displayProjects}
          onSelectProject={handleSelectCardToOutbid}
          onRefresh={() => fetchData()}
        />

        {/* Bottom Revenue Counter */}
        <BottomRevenueCounter
          stats={stats}
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
        initialBidAmount={prefillBid}
        initialCategory={prefillCategory}
        stats={stats}
        onBidSuccess={() => fetchData()}
      />

      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
      />

      <OutbidToast
        event={toastEvent}
        onClose={() => setToastEvent(null)}
        onOutbid={(proj, nextAmt) => handleSelectCardToOutbid(proj, nextAmt)}
      />
    </div>
  );
}
