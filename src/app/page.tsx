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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Handle Country Selection on Globe or Search
  const handleSelectCountry = (country: CountryInfo) => {
    setSelectedCountry(country);
  };

  // Open Staking / Pinning Modal
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

  // Strict Zoom Bounds: 0.85 (min) to 1.45 (max)
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(1.45, prev + 0.15));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(0.85, prev - 0.15));
  };

  const handleWheelZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(1.45, Math.max(0.85, prev + delta)));
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[var(--pin-paper)] select-none">
      {/* 3D Interactive Orthographic Globe */}
      <div className="absolute inset-0 z-0">
        <Globe
          selectedCountry={selectedCountry}
          onSelectCountry={handleSelectCountry}
          zoomLevel={zoomLevel}
          onWheelZoom={handleWheelZoom}
        />
      </div>

      {/* Top Left: Hero Card & Search with Hide Toggle */}
      <HeroCard
        onPinClick={() => handleOpenStake(selectedCountry || undefined)}
        onSelectCountry={handleSelectCountry}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
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
      <LiveActivityFeed
        onSelectCountry={handleSelectCountry}
        isSidebarCollapsed={isSidebarCollapsed}
      />

      {/* Bottom Right: Country Claim Drawer */}
      {selectedCountry && (
        <CountryClaimCard
          country={selectedCountry}
          onClose={() => setSelectedCountry(null)}
          onClaim={(c) => handleOpenStake(c)}
        />
      )}

      {/* Bottom Right: Zoom Controls with strict bounds */}
      <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />

      {/* Bottom Center: Navigation Pill & Footer */}
      <BottomBar />

      {/* Modal: Pin on Country */}
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
