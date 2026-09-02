'use client';

import React, { useState } from 'react';
import { Globe } from '@/components/pinit/Globe';
import { FlatMap } from '@/components/pinit/FlatMap';
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
  const [viewMode, setViewMode] = useState<'globe' | 'flat'>('globe');
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo | null>(null);
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Dynamic live states for real-time updates
  const [liveClaimedCount, setLiveClaimedCount] = useState<number>(4);
  const [liveRaisedAmount, setLiveRaisedAmount] = useState<number>(12);

  // Handle Country Selection on Globe, Flat Map, Search, or Hot List
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

      if (!wasClaimed) {
        setLiveClaimedCount((prev) => prev + 1);
      }
      setLiveRaisedAmount((prev) => prev + (placement.stake || 1));
    }
  };

  // Zoom Controls
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(viewMode === 'flat' ? 2.5 : 1.5, prev + 0.15));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(viewMode === 'flat' ? 0.75 : 0.85, prev - 0.15));
  };

  const handleWheelZoom = (delta: number) => {
    setZoomLevel((prev) =>
      Math.min(
        viewMode === 'flat' ? 2.5 : 1.5,
        Math.max(viewMode === 'flat' ? 0.75 : 0.85, prev + delta)
      )
    );
  };

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#06090e] select-none text-white">
      {/* Background Interactive Map: 3D Globe vs 2D Flat Map */}
      <div className="absolute inset-0 z-0">
        {viewMode === 'globe' ? (
          <Globe
            selectedCountry={selectedCountry}
            onSelectCountry={handleSelectCountry}
            zoomLevel={zoomLevel}
            onWheelZoom={handleWheelZoom}
          />
        ) : (
          <FlatMap
            selectedCountry={selectedCountry}
            onSelectCountry={handleSelectCountry}
            zoomLevel={zoomLevel}
            onWheelZoom={handleWheelZoom}
          />
        )}
      </div>

      {/* Top Navbar with Flat vs Globe Switch, Real-Time Stats ($12 raised), Search, and Claim CTA */}
      <TopNavbar
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        onPinClick={() => handleOpenStake(selectedCountry || undefined)}
        onSelectCountry={handleSelectCountry}
        totalClaimed={liveClaimedCount}
        totalRaised={liveRaisedAmount}
        liveOnlineCount={18}
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

      {/* Bottom Left: Collapsible WAR REPORT Drawer */}
      <LiveReportDrawer onSelectCountry={handleSelectCountry} />

      {/* Bottom Right: Collapsible HOT LAND Drawer */}
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

      {/* Bottom Center: Navigation Pill & Interaction Hints */}
      <BottomBar />

      {/* Modal: Claim / Pin on Country */}
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
