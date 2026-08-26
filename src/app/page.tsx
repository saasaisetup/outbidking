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
import { StatsModal } from '@/components/StatsModal';
import { ProjectDetailsModal } from '@/components/ProjectDetailsModal';
import { OutbidToast } from '@/components/OutbidToast';

import { Project, PlatformStats, BidTransaction, SSEEventData, CategorySlug } from '@/lib/types';
import { soundManager } from '@/lib/sound';
import { supabase } from '@/lib/supabase';
import { subscribeToLivePresence } from '@/lib/presence';
import confetti from 'canvas-confetti';

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [liveVisitors, setLiveVisitors] = useState<number>(1);
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
  const [prefillTitle, setPrefillTitle] = useState('');
  const [prefillDescription, setPrefillDescription] = useState('');
  const [prefillBid, setPrefillBid] = useState<number | undefined>(undefined);
  const [prefillCategory, setPrefillCategory] = useState('ai-agents-infrastructure');

  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [selectedDetailProject, setSelectedDetailProject] = useState<Project | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [toastEvent, setToastEvent] = useState<SSEEventData | null>(null);

  const fetchData = useCallback(async (cat = selectedCategory) => {
    try {
      const url = `/api/bids?category=${cat}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.projects) {
        setProjects(data.projects);
        const topPrice = data.projects.length > 0 ? data.projects[0].totalBid + 1 : 1;
        setCurrentBidAmount(topPrice);
      }

      if (data.stats) {
        setStats(data.stats);
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
    title,
    description,
    logoUrl,
  }: {
    url: string;
    category: string;
    bidAmount: number;
    title?: string;
    description?: string;
    logoUrl?: string;
  }) => {
    setPrefillUrl(url);
    setPrefillTitle(title || '');
    setPrefillDescription(description || '');
    setPrefillCategory(category);
    setPrefillBid(bidAmount);
    setIsBidModalOpen(true);
  };

  const handleSelectCardToOutbid = (project: Project, nextPrice: number) => {
    setPrefillUrl(project.url);
    setPrefillTitle(project.title);
    setPrefillDescription(project.description);
    setPrefillCategory(project.category);
    setPrefillBid(nextPrice);
    setIsBidModalOpen(true);
  };

  const handleOpenDetails = (project: Project) => {
    setSelectedDetailProject(project);
    setIsDetailsOpen(true);
  };

  const handleSelectCategory = (slug: CategorySlug) => {
    setSelectedCategory(slug);
    fetchData(slug);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-zinc-900 dark:text-[#f4f4f5] selection:bg-[#ea6c52] selection:text-white font-sans transition-colors duration-200">
      {/* Header */}
      <Header />

      <main className="w-full pb-16">
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
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* Top 3 Tinted Crown Cards */}
        <TopThreeCards
          topProjects={projects}
          onSelectProject={handleSelectCardToOutbid}
          onViewDetails={handleOpenDetails}
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
          projects={projects}
          onSelectProject={handleSelectCardToOutbid}
          onViewDetails={handleOpenDetails}
          onRefresh={() => fetchData()}
        />

        {/* Bottom Revenue Counter */}
        <BottomRevenueCounter stats={stats} />

        {/* Footer */}
        <Footer onOpenStats={() => setIsStatsOpen(true)} />
      </main>

      {/* Interactive Modals */}
      <BidModal
        isOpen={isBidModalOpen}
        onClose={() => setIsBidModalOpen(false)}
        initialUrl={prefillUrl}
        initialTitle={prefillTitle}
        initialDescription={prefillDescription}
        initialBidAmount={prefillBid || currentBidAmount}
        initialCategory={prefillCategory}
        stats={stats}
        onBidSuccess={() => fetchData()}
      />

      <ProjectDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        project={selectedDetailProject}
        onOutbid={(p, nextAmt) => handleSelectCardToOutbid(p, nextAmt)}
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
