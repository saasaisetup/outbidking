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

  // Dynamic live stats
  const [liveClaimedCount, setLiveClaimedCount] = useState<number>(5);
  const [liveRaisedAmount, setLiveRaisedAmount] = useState<number>(22);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Synchronize dynamic territories from backend /api/territories on load & poll
  useEffect(() => {
    let active = true;

    async function fetchLiveTerritories() {
      try {
        const res = await fetch('/api/territories', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (!active || !data.territories) return;

        let claimed = 0;
        let raised = 0;

        data.territories.forEach((t: any) => {
          if (t.currentRuler) {
            claimed++;
            raised += (t.currentRuler.bidAmount || t.currentBid || 1);

            // Match into COUNTRIES_DATA by code or name
            const matched = Object.values(COUNTRIES_DATA).find(
              (c) => c.code.toUpperCase() === t.countryCode?.toUpperCase() ||
                     c.name.toLowerCase() === t.countryName?.toLowerCase()
            );

            if (matched) {
              matched.currentLeader = {
                id: `ruler-${t.countryCode}`,
                name: t.currentRuler.title || t.currentRuler.rulerName || 'Sovereign Ruler',
                tagline: t.currentRuler.warCry || 'Conquered territory',
                url: t.currentRuler.url,
                logo: t.currentRuler.logoUrl || '/globe.svg',
                stake: t.currentRuler.bidAmount || t.currentBid || 1,
                category: t.currentRuler.category || 'SaaS',
                claimedAt: 'Active',
                expiresIn: '24h 00m',
                clicks: t.clicks || 0,
                customColor: t.currentRuler.customColor,
              };

              if (t.currentRuler.customColor) {
                matched.color = t.currentRuler.customColor;
              }
            }
          }
        });

        if (claimed > 0) {
          setLiveClaimedCount(claimed);
        }
        if (raised > 0) {
          setLiveRaisedAmount(raised);
        }
        setRefreshTrigger((prev) => prev + 1);
      } catch (err) {
        console.warn('Could not sync territories with API:', err);
      }
    }

    fetchLiveTerritories();
    const interval = setInterval(fetchLiveTerritories, 10000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

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
      setRefreshTrigger((prev) => prev + 1);
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
      {/* Background 3D Globe View with Dynamic Refresh */}
      <div className="absolute inset-0 z-0" key={refreshTrigger}>
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
