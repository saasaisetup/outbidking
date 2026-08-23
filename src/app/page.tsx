'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { HeroBiddingBar } from '@/components/HeroBiddingBar';
import { CategoryFilters } from '@/components/CategoryFilters';
import { TopThreeCards } from '@/components/TopThreeCards';
import { LatestActivityTicker } from '@/components/LatestActivityTicker';
import { RankedList } from '@/components/RankedList';
import { BottomRevenueCounter } from '@/components/BottomRevenueCounter';
import { Footer } from '@/components/Footer';

// World War Map Components
import { WorldWarMap } from '@/components/WorldWarMap';
import { WorldPowersDrawer } from '@/components/WorldPowersDrawer';
import { UnclaimedLandDrawer } from '@/components/UnclaimedLandDrawer';
import { CommandSideDrawer } from '@/components/CommandSideDrawer';

import { BidModal } from '@/components/BidModal';
import { RulesModal } from '@/components/RulesModal';
import { AboutModal } from '@/components/AboutModal';
import { StatsModal } from '@/components/StatsModal';
import { OutbidToast } from '@/components/OutbidToast';

import { Project, PlatformStats, BidTransaction, SSEEventData, CategorySlug, TerritoryState, WorldPower, WarEvent, MapStats } from '@/lib/types';
import { soundManager } from '@/lib/sound';
import confetti from 'canvas-confetti';
import { supabase } from '@/lib/supabase';
import { subscribeToLivePresence } from '@/lib/presence';
import { Globe, Layers, ExternalLink } from 'lucide-react';

export default function HomePage() {
  const [viewMode, setViewMode] = useState<'board' | 'map'>('board');
  const [projects, setProjects] = useState<Project[]>([]);
  const [liveVisitors, setLiveVisitors] = useState<number>(134);
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

  // World War Map State
  const [territories, setTerritories] = useState<TerritoryState[]>([]);
  const [powers, setPowers] = useState<WorldPower[]>([]);
  const [warEvents, setWarEvents] = useState<WarEvent[]>([]);
  const [mapStats, setMapStats] = useState<MapStats>({
    onlineCount: 134,
    totalVisitors: 13029,
    totalPlundered: 2709,
    totalClicks: 14722,
    claimedCount: 132,
    totalCountries: 194,
  });
  const [selectedTerritory, setSelectedTerritory] = useState<TerritoryState | null>(null);
  const [isCommandDrawerOpen, setIsCommandDrawerOpen] = useState(false);

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

  const fetchTerritories = useCallback(async () => {
    try {
      const res = await fetch('/api/territories');
      const data = await res.json();
      if (data.success) {
        if (data.territories) setTerritories(data.territories);
        if (data.powers) setPowers(data.powers);
        if (data.warEvents) setWarEvents(data.warEvents);
        if (data.stats) {
          setMapStats({
            ...data.stats,
            onlineCount: liveVisitors || data.stats.onlineCount,
          });
        }
      }
    } catch (err) {
      console.error('[Outbid] Fetch territories error:', err);
    }
  }, [liveVisitors]);

  useEffect(() => {
    fetchData(selectedCategory);
    fetchTerritories();

    const unsubscribePresence = subscribeToLivePresence((onlineCount) => {
      setLiveVisitors(onlineCount);
      setMapStats((prev) => ({ ...prev, onlineCount }));
    });

    const channel = supabase
      .channel('realtime-global-feed')
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
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'territories' },
        () => {
          fetchTerritories();
        }
      )
      .subscribe();

    const pollTimer = setInterval(() => {
      fetchData();
      fetchTerritories();
    }, 4000);

    return () => {
      unsubscribePresence();
      supabase.removeChannel(channel);
      clearInterval(pollTimer);
    };
  }, [selectedCategory, fetchData, fetchTerritories]);

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

  const handleSelectTerritory = (t: TerritoryState) => {
    setSelectedTerritory(t);
    setIsCommandDrawerOpen(true);
  };

  const handleSelectCountryByCode = (code: string) => {
    const t = territories.find((item) => item.countryCode === code);
    if (t) {
      handleSelectTerritory(t);
    }
  };

  return (
    <div className="min-h-screen selection:bg-[#e05d44] selection:text-white font-sans transition-colors duration-200">
      {/* Top Header */}
      <Header />

      {/* Main View Mode Selector (Map vs Board) with Direct VISIT Button */}
      <div className="w-full max-w-5xl mx-auto px-4 pt-3 pb-1 flex items-center justify-between">
        <div className="inline-flex p-1 rounded-2xl bg-zinc-100 dark:bg-[#181613] border border-zinc-200 dark:border-[#2e2a24] shadow-xs">
          <button
            type="button"
            onClick={() => setViewMode('board')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer select-none ${
              viewMode === 'board'
                ? 'bg-white dark:bg-[#25221d] text-zinc-900 dark:text-white shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4 text-[#ea6c52]" />
            <span>Classic Board</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer select-none ${
              viewMode === 'map'
                ? 'bg-[#ea6c52] text-white shadow-xs'
                : 'text-zinc-500 hover:text-[#ea6c52]'
            }`}
          >
            <span>🗺️</span>
            <span>World War Map</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-black/20 text-white">
              WAR
            </span>
          </button>
        </div>

        {/* VISIT Fullscreen Map Link */}
        <Link
          href="/map"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-zinc-900 border border-zinc-700 hover:border-[#ea6c52] text-xs font-mono font-black text-zinc-300 hover:text-white transition-all shadow-xs group"
        >
          <span>FULLSCREEN MAP</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#ea6c52] group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {viewMode === 'board' ? (
        <main className="w-full pb-12">
          {/* Hero Section with Favicon Grabber and Category Dropdown */}
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
            onSelectCategory={(slug) => setSelectedCategory(slug)}
          />

          {/* Top 3 Tinted Cards */}
          <TopThreeCards
            topProjects={projects}
            onSelectProject={handleSelectCardToOutbid}
          />

          {/* Latest Activity Ticker */}
          <LatestActivityTicker
            recentBids={recentBids}
            onSelectBid={(bid) => {
              const proj = projects.find((p) => p.id === bid.projectId);
              if (proj) handleSelectCardToOutbid(proj, proj.totalBid + 5);
            }}
          />

          {/* Complete Paginated Leaderboard */}
          <RankedList
            projects={projects}
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
      ) : (
        <main className="w-full pb-12 pt-3">
          <div className="w-full px-2 sm:px-6">
            {/* Full-Sized Interactive World War Map Container */}
            <div className="relative rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl bg-[#070709] h-[78vh] min-h-[580px]">
              <WorldWarMap
                territories={territories}
                selectedTerritory={selectedTerritory}
                onSelectTerritory={handleSelectTerritory}
              />

              {/* Left HUD Panel */}
              <WorldPowersDrawer
                powers={powers}
                warEvents={warEvents}
                onSelectCountry={handleSelectCountryByCode}
              />

              {/* Right HUD Panel */}
              <UnclaimedLandDrawer
                territories={territories}
                onSelectCountry={handleSelectCountryByCode}
              />
            </div>
          </div>
        </main>
      )}

      {/* Right Slide-in Command Side Drawer */}
      <CommandSideDrawer
        territory={selectedTerritory}
        isOpen={isCommandDrawerOpen}
        onClose={() => {
          setIsCommandDrawerOpen(false);
          setSelectedTerritory(null);
        }}
        onConquerSuccess={() => {
          fetchTerritories();
          fetchData();
        }}
      />

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
