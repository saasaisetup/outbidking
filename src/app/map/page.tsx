'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { WarHeader } from '@/components/WarHeader';
import { WorldWarMap } from '@/components/WorldWarMap';
import { WorldPowersDrawer } from '@/components/WorldPowersDrawer';
import { UnclaimedLandDrawer } from '@/components/UnclaimedLandDrawer';
import { ConquerTerritoryModal } from '@/components/ConquerTerritoryModal';
import { RulesModal } from '@/components/RulesModal';
import { TerritoryState, WorldPower, WarEvent, MapStats, SSEEventData } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { soundManager } from '@/lib/sound';
import confetti from 'canvas-confetti';

export default function WorldMapPage() {
  const [territories, setTerritories] = useState<TerritoryState[]>([]);
  const [powers, setPowers] = useState<WorldPower[]>([]);
  const [warEvents, setWarEvents] = useState<WarEvent[]>([]);
  const [stats, setStats] = useState<MapStats>({
    onlineCount: 119,
    totalVisitors: 12759,
    totalPlundered: 2709,
    totalClicks: 14426,
    claimedCount: 132,
    totalCountries: 194,
  });

  const [selectedTerritory, setSelectedTerritory] = useState<TerritoryState | null>(null);
  const [isConquerModalOpen, setIsConquerModalOpen] = useState(false);
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
      console.error('[Map] Fetch territories error:', err);
    }
  }, []);

  useEffect(() => {
    fetchTerritoryData();

    // 1. Supabase Realtime Postgres Changes for Territories
    const channel = supabase
      .channel('realtime-territories-channel')
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
        (payload) => {
          soundManager.playKingGong();
          confetti({ particleCount: 80, spread: 60, origin: { y: 0.5 } });
          fetchTerritoryData();
        }
      )
      .subscribe();

    // 2. 4-second auto-poll fallback
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
    setIsConquerModalOpen(true);
  };

  const handleSelectCountryByCode = (code: string) => {
    const t = territories.find((item) => item.countryCode === code);
    if (t) {
      handleSelectTerritory(t);
    }
  };

  const handleConquerTheWorld = () => {
    // Open US as prime capital or super-spot
    const us = territories.find((t) => t.countryCode === 'US') || territories[0];
    if (us) {
      handleSelectTerritory(us);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col overflow-hidden font-sans select-none">
      {/* Tactical Top Bar */}
      <WarHeader
        stats={stats}
        onOpenConquerWorld={handleConquerTheWorld}
        onOpenHelp={() => setIsHelpOpen(true)}
        isMapPage={true}
      />

      {/* Main World War Map Canvas Container */}
      <main className="relative flex-1 w-full h-[calc(100vh-56px)] overflow-hidden">
        {/* Interactive Pan & Zoom World Map */}
        <WorldWarMap
          territories={territories}
          onSelectTerritory={handleSelectTerritory}
        />

        {/* Left HUD Panel: Live War Stream & World Powers */}
        <WorldPowersDrawer
          powers={powers}
          warEvents={warEvents}
          onSelectCountry={handleSelectCountryByCode}
        />

        {/* Right HUD Panel: Unclaimed Territories */}
        <UnclaimedLandDrawer
          territories={territories}
          onSelectCountry={handleSelectCountryByCode}
        />
      </main>

      {/* Conquer Territory Modal */}
      <ConquerTerritoryModal
        territory={selectedTerritory}
        isOpen={isConquerModalOpen}
        onClose={() => {
          setIsConquerModalOpen(false);
          setSelectedTerritory(null);
        }}
        onConquerSuccess={() => {
          fetchTerritoryData();
        }}
      />

      {/* War Rules & Guide Modal */}
      <RulesModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
