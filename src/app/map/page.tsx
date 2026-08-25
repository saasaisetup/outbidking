'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { WarHeader } from '@/components/WarHeader';
import { WorldWarMap } from '@/components/WorldWarMap';
import { WorldPowersDrawer } from '@/components/WorldPowersDrawer';
import { UnclaimedLandDrawer } from '@/components/UnclaimedLandDrawer';
import { CommandSideDrawer } from '@/components/CommandSideDrawer';
import { HowWarWorksModal } from '@/components/HowWarWorksModal';
import { HotLandsCard } from '@/components/HotLandsCard';
import { ConquerWorldModal } from '@/components/ConquerWorldModal';
import { TerritoryState, WorldPower, WarEvent, MapStats } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { subscribeToLivePresence } from '@/lib/presence';
import { soundManager } from '@/lib/sound';
import confetti from 'canvas-confetti';

export default function WorldMapPage() {
  const [territories, setTerritories] = useState<TerritoryState[]>([]);
  const [powers, setPowers] = useState<WorldPower[]>([]);
  const [warEvents, setWarEvents] = useState<WarEvent[]>([]);
  const [liveVisitors, setLiveVisitors] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isConquerWorldOpen, setIsConquerWorldOpen] = useState(false);
  const [stats, setStats] = useState<MapStats>({
    onlineCount: 1,
    totalVisitors: 0,
    totalPlundered: 0,
    totalClicks: 0,
    claimedCount: 0,
    totalCountries: 207,
  });

  const [selectedTerritory, setSelectedTerritory] = useState<TerritoryState | null>(null);
  const [isCommandDrawerOpen, setIsCommandDrawerOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const fetchTerritoryData = useCallback(async () => {
    try {
      const res = await fetch('/api/territories');
      const data = await res.json();
      if (data.success) {
        if (data.territories) setTerritories(data.territories);
        if (data.powers) setPowers(data.powers);
        if (data.warEvents) setWarEvents(data.warEvents);
        if (data.stats) {
          setStats((prev) => ({
            ...data.stats,
            onlineCount: liveVisitors || data.stats.onlineCount,
          }));
        }
      }
    } catch (err) {
      console.error('[Map] Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [liveVisitors]);

  useEffect(() => {
    fetchTerritoryData();

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
                soundManager.playKingGong();
                fetchTerritoryData();
              }
            })
            .catch(() => {});
        }
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    // Realtime Presence Tracker for live visitors
    const unsubscribePresence = subscribeToLivePresence((onlineCount) => {
      setLiveVisitors(onlineCount);
      setStats((prev) => ({ ...prev, onlineCount }));
    });

    // Supabase Realtime Channel
    const channel = supabase
      .channel('realtime-territories-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'territories' },
        () => {
          fetchTerritoryData();
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'territory_claims' },
        () => {
          soundManager.playKingGong();
          confetti({ particleCount: 80, spread: 60, origin: { y: 0.5 } });
          fetchTerritoryData();
        }
      )
      .subscribe();

    const pollTimer = setInterval(() => {
      fetchTerritoryData();
    }, 4000);

    return () => {
      unsubscribePresence();
      supabase.removeChannel(channel);
      clearInterval(pollTimer);
    };
  }, [fetchTerritoryData]);

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

  const handleConquerTheWorld = () => {
    setIsConquerWorldOpen(true);
  };

  return (
    <div className="h-screen w-screen bg-[#07070b] text-white flex flex-col overflow-hidden font-sans select-none">
      {/* Tactical Top Bar with Live Realtime Presence */}
      <WarHeader
        stats={stats}
        onOpenConquerWorld={handleConquerTheWorld}
        onOpenHelp={() => setIsHelpOpen(true)}
        isMapPage={true}
      />

      {/* Main Full-Bleed World War Map Canvas */}
      <main className="relative flex-1 w-full h-[calc(100vh-56px)] overflow-hidden">
        <WorldWarMap
          territories={territories}
          selectedTerritory={selectedTerritory}
          onSelectTerritory={handleSelectTerritory}
        />

        {/* Left HUD: Live War Stream & World Powers */}
        <WorldPowersDrawer
          powers={powers}
          warEvents={warEvents}
          onSelectCountry={handleSelectCountryByCode}
        />

        {/* Right HUD: Hot Land Best Value */}
        <HotLandsCard
          territories={territories}
          onSelectTerritory={handleSelectTerritory}
        />

        {/* Bottom-Right HUD: Unclaimed Land Quick Launcher */}
        <UnclaimedLandDrawer
          territories={territories}
          onSelectCountry={handleSelectCountryByCode}
        />
      </main>

      {/* Right Slide-in Command Side Drawer */}
      <CommandSideDrawer
        territory={selectedTerritory}
        isOpen={isCommandDrawerOpen}
        onClose={() => {
          setIsCommandDrawerOpen(false);
          setSelectedTerritory(null);
        }}
        onConquerSuccess={() => {
          fetchTerritoryData();
        }}
      />

      {/* Conquer World $5,000 Modal */}
      <ConquerWorldModal
        isOpen={isConquerWorldOpen}
        onClose={() => setIsConquerWorldOpen(false)}
      />

      {/* How War Works Modal */}
      <HowWarWorksModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
