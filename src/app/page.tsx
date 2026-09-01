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

  // Calculate live claimed countries & total raised
  const activeCountries = Object.values(COUNTRIES_DATA).filter((c) => !!c.currentLeader);
  const totalClaimed = activeCountries.length;
  const totalRaised = activeCountries.reduce((sum, c) => sum + (c.currentLeader?.stake || 0), 0);

  // Handle Country Selection on Globe or from Search / Hot List
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
      {/* 3D Interactive Orthographic Globe in Background */}
      <div className="absolute inset-0 z-0">
        <Globe
          selectedCountry={selectedCountry}
          onSelectCountry={handleSelectCountry}
          zoomLevel={zoomLevel}
          onWheelZoom={handleWheelZoom}
        />
      </div>

      {/* Top Navbar with Live Counter, Search, and Claim CTA */}
      <TopNavbar
        onPinClick={() => handleOpenStake(selectedCountry || undefined)}
        onSelectCountry={handleSelectCountry}
        totalClaimed={totalClaimed}
        totalRaised={totalRaised}
        liveOnlineCount={1}
      />

      {/* Top Left: Collapsible Hero Card & Category Filter */}
      <div className="pt-12 sm:pt-14">
        <HeroCard
          onPinClick={() => handleOpenStake(selectedCountry || undefined)}
          onSelectCountry={handleSelectCountry}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </div>

      {/* Bottom Left: Collapsible LIVE REPORT Drawer */}
      <LiveReportDrawer onSelectCountry={handleSelectCountry} />

      {/* Bottom Right: Collapsible HOT COUNTRIES Drawer */}
      <HotCountriesDrawer
        onSelectCountry={handleSelectCountry}
        onClaimCountry={(c) => handleOpenStake(c)}
      />

      {/* Bottom Right: Country Claim Drawer when a Country is Selected */}
      {selectedCountry && (
        <CountryClaimCard
          country={selectedCountry}
          onClose={() => setSelectedCountry(null)}
          onClaim={(c) => handleOpenStake(c)}
        />
      )}

      {/* Bottom Right: Zoom Controls with strict bounds */}
      <div className="hidden sm:block">
        <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
      </div>

      {/* Bottom Center: Navigation Pill & Footer */}
      <BottomBar />

      {/* Modal: Pin on Country with Logo Preview */}
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
