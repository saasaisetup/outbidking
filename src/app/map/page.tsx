'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { WarHeader } from '@/components/WarHeader';
import { WorldWarMap } from '@/components/WorldWarMap';
import { WorldPowersDrawer } from '@/components/WorldPowersDrawer';
import { UnclaimedLandDrawer } from '@/components/UnclaimedLandDrawer';
import { CommandSideDrawer } from '@/components/CommandSideDrawer';
import { HowWarWorksModal } from '@/components/HowWarWorksModal';
import { TerritoryState, WorldPower, WarEvent, MapStats } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { soundManager } from '@/lib/sound';
import confetti from 'canvas-confetti';

export default function WorldMapPage() {
  const [territories, setTerritories] = useState<TerritoryState[]>([]);
  const [powers, setPowers] = useState<WorldPower[]>([]);
  const [warEvents, setWarEvents] = useState<WarEvent[]>([]);
  const [stats, setStats] = useState<MapStats>({
    onlineCount: 132,
    totalVisitors: 13008,
    totalPlundered: 2709,
    totalClicks: 14692,
    claimedCount: 132,
    totalCountries: 194,
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
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error('[Map] Fetch error:', err);
    }
  }, []);

  useEffect(() => {
    fetchTerritoryData();

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
    const us = territories.find((t) => t.countryCode === 'US') || territories[0];
    if (us) {
      handleSelectTerritory(us);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#070709] text-white flex flex-col overflow-hidden font-sans select-none">
      {/* Tactical Top Bar */}
      <WarHeader
        stats={stats}
        onOpenConquerWorld={handleConquerTheWorld}
        onOpenHelp={() => setIsHelpOpen(true)}
        isMapPage={true}
      />

      {/* Main World War Map Canvas */}
      <main className="relative flex-1 w-full h-[calc(100vh-56px)] overflow-hidden">
        <WorldWarMap
          territories={territories}
          onSelectTerritory={handleSelectTerritory}
        />

        {/* Left HUD: Live War Stream & World Powers */}
        <WorldPowersDrawer
          powers={powers}
          warEvents={warEvents}
          onSelectCountry={handleSelectCountryByCode}
        />

        {/* Right HUD: Unclaimed Land Drawer */}
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

      {/* How War Works Modal */}
      <HowWarWorksModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
