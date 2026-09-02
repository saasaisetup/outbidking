'use client';

import React, { useState, useEffect } from 'react';
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
  const [isLightMode, setIsLightMode] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
  const [modalCountry, setModalCountry] = useState<CountryInfo | null>(null);

  // Dynamic live states for real-time updates
  const [liveClaimedCount, setLiveClaimedCount] = useState<number>(5);
  const [liveRaisedAmount, setLiveRaisedAmount] = useState<number>(22);

  // Handle Theme Toggle
  const handleToggleTheme = () => {
    setIsLightMode((prev) => {
      const next = !prev;
      if (typeof document !== 'undefined') {
        if (next) {
          document.documentElement.classList.add('light-theme');
        } else {
          document.documentElement.classList.remove('light-theme');
        }
      }
      return next;
    });
  };

  // Auto collapse hero card on mobile initially
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      setIsSidebarCollapsed(true);
    }
  }, []);

  const handleSelectCountry = (country: CountryInfo) => {
    setSelectedCountry(country);
  };

  // Open Claim Modal for a specific country
  const handleOpenClaim = (country?: CountryInfo) => {
    setModalCountry(country || selectedCountry || COUNTRIES_DATA['united-states-of-america']);
    setIsStakeModalOpen(true);
  };

  // Handle Successful Claim in Real Time
  const handleClaimSuccess = (countrySlug: string, placement: any) => {
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
    setZoomLevel((prev) => Math.min(1.6, prev + 0.15));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(0.75, prev - 0.15));
  };

  const handleWheelZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(1.6, Math.max(0.75, prev + delta)));
  };

  return (
    <main className={`relative h-screen w-screen overflow-hidden select-none touch-none ${
      isLightMode ? 'bg-[#faf7f0] text-slate-900' : 'bg-[#06090e] text-white'
    }`}>
      {/* Background 3D Globe View */}
      <div className="absolute inset-0 z-0">
        <Globe
          selectedCountry={selectedCountry}
          onSelectCountry={handleSelectCountry}
          zoomLevel={zoomLevel}
          onWheelZoom={handleWheelZoom}
          isLightMode={isLightMode}
        />
      </div>

      {/* Top Navbar with Responsive HUD & Theme Toggle */}
      <TopNavbar
        isLightMode={isLightMode}
        onToggleTheme={handleToggleTheme}
        onSelectCountry={handleSelectCountry}
        totalClaimed={liveClaimedCount}
        totalRaised={liveRaisedAmount}
        liveOnlineCount={18}
      />

      {/* Top Left: Collapsible Hero Card */}
      <HeroCard
        onPinClick={() => handleOpenClaim(selectedCountry || undefined)}
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
        onClaimCountry={(c) => handleOpenClaim(c)}
      />

      {/* Bottom Floating Country Claim / Outbid Card */}
      {selectedCountry && (
        <CountryClaimCard
          country={selectedCountry}
          onClose={() => setSelectedCountry(null)}
          onClaim={(c) => handleOpenClaim(c)}
          isLightMode={isLightMode}
        />
      )}

      {/* 2-Step Interactive Stake Modal */}
      {isStakeModalOpen && (
        <StakeModal
          country={modalCountry}
          onClose={() => setIsStakeModalOpen(false)}
          onSuccess={handleClaimSuccess}
          isLightMode={isLightMode}
        />
      )}

      {/* Bottom Right: Zoom Controls */}
      <ZoomControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />

      {/* Bottom Center: Navigation Pill */}
      <BottomBar />
    </main>
  );
}
