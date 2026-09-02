'use client';

import React, { useState, useEffect } from 'react';
import { Globe } from '@/components/pinit/Globe';
import { FlatMap } from '@/components/pinit/FlatMap';
import { TopNavbar } from '@/components/pinit/TopNavbar';
import { HeroCard } from '@/components/pinit/HeroCard';
import { LiveReportDrawer } from '@/components/pinit/LiveReportDrawer';
import { HotCountriesDrawer } from '@/components/pinit/HotCountriesDrawer';
import { CountryClaimCard } from '@/components/pinit/CountryClaimCard';
import { BottomBar } from '@/components/pinit/BottomBar';
import { ZoomControls } from '@/components/pinit/ZoomControls';
import { CountryInfo, COUNTRIES_DATA } from '@/lib/pinitData';

export default function HomePage() {
  const [viewMode, setViewMode] = useState<'globe' | 'flat'>('globe');
  const [isLightMode, setIsLightMode] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

  // Open Claim for a specific or default country
  const handleOpenClaim = (country?: CountryInfo) => {
    setSelectedCountry(country || COUNTRIES_DATA['iran'] || COUNTRIES_DATA['united-states-of-america']);
  };

  // Handle Successful Claim / Invade & Color Change in Real Time
  const handleClaimSuccess = (countrySlug: string, placement: any, newColor?: string) => {
    const target = COUNTRIES_DATA[countrySlug];
    if (target) {
      const wasClaimed = !!target.currentLeader;
      target.currentLeader = placement;
      if (newColor) {
        target.color = newColor;
      }
      setSelectedCountry({ ...target });

      if (!wasClaimed) {
        setLiveClaimedCount((prev) => prev + 1);
      }
      setLiveRaisedAmount((prev) => prev + (placement.stake || 1));
    }
  };

  // Zoom Controls
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(viewMode === 'flat' ? 3.5 : 1.6, prev + 0.15));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(viewMode === 'flat' ? 0.65 : 0.75, prev - 0.15));
  };

  const handleWheelZoom = (delta: number) => {
    setZoomLevel((prev) =>
      Math.min(
        viewMode === 'flat' ? 3.5 : 1.6,
        Math.max(viewMode === 'flat' ? 0.65 : 0.75, prev + delta)
      )
    );
  };

  return (
    <main className={`relative h-screen w-screen overflow-hidden select-none touch-none ${
      isLightMode ? 'bg-[#f8fafc] text-slate-900' : 'bg-[#06090e] text-white'
    }`}>
      {/* Background Interactive Map: 3D Globe vs 2D Flat Map */}
      <div className="absolute inset-0 z-0">
        {viewMode === 'globe' ? (
          <Globe
            selectedCountry={selectedCountry}
            onSelectCountry={handleSelectCountry}
            zoomLevel={zoomLevel}
            onWheelZoom={handleWheelZoom}
            isLightMode={isLightMode}
          />
        ) : (
          <FlatMap
            selectedCountry={selectedCountry}
            onSelectCountry={handleSelectCountry}
            zoomLevel={zoomLevel}
            onWheelZoom={handleWheelZoom}
            isLightMode={isLightMode}
          />
        )}
      </div>

      {/* Top Navbar with [GLOBE | FLAT], Light/Dark mode, Real-Time Stats, Search, and Rules Icon */}
      <TopNavbar
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
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

      {/* Bottom Right: Command Side Drawer with Custom Bid, Multipliers, & 11 Color Swatches */}
      {selectedCountry && (
        <CountryClaimCard
          country={selectedCountry}
          onClose={() => setSelectedCountry(null)}
          onClaimSuccess={handleClaimSuccess}
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
