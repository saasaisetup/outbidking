'use client';

import React, { useState, useEffect } from 'react';
import { Globe } from '@/components/pinit/Globe';
import { TopNavbar } from '@/components/pinit/TopNavbar';
import { HeroCard } from '@/components/pinit/HeroCard';
import { LiveReportDrawer } from '@/components/pinit/LiveReportDrawer';
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
      } catch (err) {
        console.warn('Could not sync territories with API:', err);
      }
    }

    fetchLiveTerritories();
    const interval = setInterval(fetchLiveTerritories, 12000);

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
      if (placement.customColor) {
        target.color = placement.customColor;
      }
      setSelectedCountry({ ...target });

      if (!wasClaimed) {
        setLiveClaimedCount((prev) => prev + 1);
      }
      setLiveRaisedAmount((prev) => prev + (placement.stake || 1));
    }
  };

  // Zoom Controls with responsive limits and clear steps
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(2.5, +(prev + 0.25).toFixed(2)));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(0.5, +(prev - 0.25).toFixed(2)));
  };

  const handleWheelZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(2.5, Math.max(0.5, prev + delta)));
  };

  return (
    <main className={`relative h-screen w-screen overflow-hidden select-none touch-none ${
      isLightMode ? 'bg-[#faf7f0] text-slate-900' : 'bg-[#06090e] text-white'
    }`}>
      {/* Background 3D Globe View (Continuous 360 rotation without reset) */}
      <div className="absolute inset-0 z-0">
        <Globe
          selectedCountry={selectedCountry}
          onSelectCountry={handleSelectCountry}
          zoomLevel={zoomLevel}
          onWheelZoom={handleWheelZoom}
          isLightMode={isLightMode}
        />
      </div>

      {/* Top Navbar with Responsive HUD & Modern SVG Theme Toggle */}
      <TopNavbar
        isLightMode={isLightMode}
        onToggleTheme={handleToggleTheme}
        onSelectCountry={handleSelectCountry}
        totalClaimed={liveClaimedCount}
        totalRaised={liveRaisedAmount}
        liveOnlineCount={18}
      />

      {/* Top Right: Collapsible Hero Card */}
      <HeroCard
        onPinClick={() => handleOpenClaim(selectedCountry || undefined)}
        onSelectCountry={handleSelectCountry}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isLightMode={isLightMode}
      />

      {/* Bottom Left: Collapsible WAR REPORT Drawer */}
      <LiveReportDrawer
        onSelectCountry={handleSelectCountry}
        isLightMode={isLightMode}
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

      {/* Bottom Right: Responsive Zoom In / Out Buttons */}
      <ZoomControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        isLightMode={isLightMode}
      />

      {/* Bottom Center: Navigation Pill */}
      <BottomBar isLightMode={isLightMode} />
    </main>
  );
}
