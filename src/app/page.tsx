'use client';

import React, { useState } from 'react';
import { Globe } from '@/components/pinit/Globe';
import { HeroCard } from '@/components/pinit/HeroCard';
import { GlobalStatsCard } from '@/components/pinit/GlobalStatsCard';
import { LaunchOfferCard } from '@/components/pinit/LaunchOfferCard';
import { LiveActivityFeed } from '@/components/pinit/LiveActivityFeed';
import { CountryClaimCard } from '@/components/pinit/CountryClaimCard';
import { StakeModal } from '@/components/pinit/StakeModal';
import { BottomBar } from '@/components/pinit/BottomBar';
import { ZoomControls } from '@/components/pinit/ZoomControls';
import { CountryInfo, COUNTRIES_DATA } from '@/lib/pinitData';

export default function HomePage() {
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo | null>(null);
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Handle Country Selection on Globe or from Search
  const handleSelectCountry = (country: CountryInfo) => {
    setSelectedCountry(country);
  };

  // Open Staking Modal
  const handleOpenStake = (country?: CountryInfo) => {
    if (country) {
      setSelectedCountry(country);
    }
    setIsStakeModalOpen(true);
  };

  // Handle Successful Stake
  const handleStakeSuccess = (countrySlug: string, placement: any) => {
    const target = COUNTRIES_DATA[countrySlug];
    if (target) {
      target.currentLeader = placement;
      setSelectedCountry({ ...target });
    }
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(2.5, prev + 0.25));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(0.75, prev - 0.25));
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[var(--pin-paper)] select-none">
      {/* 3D Interactive Orthographic Globe in Background */}
      <div className="absolute inset-0 z-0">
        <Globe
          selectedCountry={selectedCountry}
          onSelectCountry={handleSelectCountry}
          zoomLevel={zoomLevel}
        />
      </div>

      {/* Top Left: Hero Card & Country Search */}
      <HeroCard
        onPinClick={() => handleOpenStake(selectedCountry || undefined)}
        onSelectCountry={handleSelectCountry}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Top Right: Global Stats & Trending */}
      <GlobalStatsCard onSelectCountry={handleSelectCountry} />

      {/* Middle Right: Launch Offer Card */}
      <div className="pointer-events-none absolute right-3 top-44 z-10 hidden md:block md:right-4">
        <LaunchOfferCard
          onChooseCountry={() => {
            const keys = Object.keys(COUNTRIES_DATA);
            const randomKey = keys[Math.floor(Math.random() * keys.length)];
            setSelectedCountry(COUNTRIES_DATA[randomKey]);
          }}
        />
      </div>

      {/* Bottom Left: Live Activity Feed */}
      <LiveActivityFeed onSelectCountry={handleSelectCountry} />

      {/* Bottom Right: Country Claim Drawer */}
      {selectedCountry && (
        <CountryClaimCard
          country={selectedCountry}
          onClose={() => setSelectedCountry(null)}
          onClaim={(c) => handleOpenStake(c)}
        />
      )}

      {/* Bottom Right: Zoom Controls */}
      <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />

      {/* Bottom Center: Navigation Pill & Footer */}
      <BottomBar />

      {/* Modal: Stake on Country */}
      {isStakeModalOpen && (
        <StakeModal
          country={selectedCountry}
          onClose={() => setIsStakeModalOpen(false)}
          onSuccess={handleStakeSuccess}
        />
      )}
    </main>
  );
}
