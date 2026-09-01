'use client';

import React, { useState } from 'react';
import { Globe } from '@/components/pinit/Globe';
import { TopNavbar } from '@/components/pinit/TopNavbar';
import { HeroCard } from '@/components/pinit/HeroCard';
import { LiveReportDrawer } from '@/components/pinit/LiveReportDrawer';
import { HotCountriesDrawer } from '@/components/pinit/HotCountriesDrawer';
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

  // Dynamic live states for real-time updates
  const [liveClaimedCount, setLiveClaimedCount] = useState<number>(4);
  const [liveRaisedAmount, setLiveRaisedAmount] = useState<number>(12);

  // Handle Country Selection on Globe, Search, or Hot List
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

  // Handle Successful Stake in Real Time
  const handleStakeSuccess = (countrySlug: string, placement: any) => {
    const target = COUNTRIES_DATA[countrySlug];
    if (target) {
      const wasClaimed = !!target.currentLeader;
      target.currentLeader = placement;
      setSelectedCountry({ ...target });

      // Increment live stats in real-time
      if (!wasClaimed) {
        setLiveClaimedCount((prev) => prev + 1);
      }
      setLiveRaisedAmount((prev) => prev + (placement.stake || 1));
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
      {/* 3D Interactive Orthographic Globe in Background */}
      <div className="absolute inset-0 z-0">
        <Globe
          selectedCountry={selectedCountry}
          onSelectCountry={handleSelectCountry}
          zoomLevel={zoomLevel}
          onWheelZoom={handleWheelZoom}
        />
      </div>

      {/* Top Navbar with Real-Time Stats ($12 raised), Search, and Claim CTA */}
      <TopNavbar
        onPinClick={() => handleOpenStake(selectedCountry || undefined)}
        onSelectCountry={handleSelectCountry}
        totalClaimed={liveClaimedCount}
        totalRaised={liveRaisedAmount}
        liveOnlineCount={1}
      />

      {/* Top Left: Collapsible Hero Card */}
      <HeroCard
        onPinClick={() => handleOpenStake(selectedCountry || undefined)}
        onSelectCountry={handleSelectCountry}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Bottom Left: Collapsible LIVE REPORT Drawer */}
      <LiveReportDrawer onSelectCountry={handleSelectCountry} />

      {/* Bottom Right: Collapsible HOT COUNTRIES Drawer */}
      <HotCountriesDrawer
        onSelectCountry={handleSelectCountry}
        onClaimCountry={(c) => handleOpenStake(c)}
      />

      {/* Bottom Right: Country Claim Drawer with Real-Time VISIT button */}
      {selectedCountry && (
        <CountryClaimCard
          country={selectedCountry}
          onClose={() => setSelectedCountry(null)}
          onClaim={(c) => handleOpenStake(c)}
        />
      )}

      {/* Bottom Right: Zoom Controls */}
      <div className="hidden sm:block">
        <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
      </div>

      {/* Bottom Center: Navigation Pill */}
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
