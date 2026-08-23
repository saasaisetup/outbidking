'use client';

import React from 'react';
import Link from 'next/link';
import { MapStats } from '@/lib/types';
import { HelpCircle, Globe, Layers } from 'lucide-react';

interface WarHeaderProps {
  stats: MapStats;
  onOpenConquerWorld: () => void;
  onOpenHelp: () => void;
  isMapPage?: boolean;
}

export function WarHeader({
  stats,
  onOpenConquerWorld,
  onOpenHelp,
  isMapPage = false,
}: WarHeaderProps) {
  const onlineCount = stats.onlineCount || 148;
  const totalVisitors = (stats.totalVisitors || 13401).toLocaleString();
  const totalPlundered = (stats.totalPlundered || 2733).toLocaleString();
  const totalClicks = (stats.totalClicks || 15100).toLocaleString();
  const claimedCount = stats.claimedCount || 134;
  const totalCountries = stats.totalCountries || 194;

  return (
    <header className="w-full bg-[#0a0a0e]/95 backdrop-blur-md border-b border-zinc-900 px-2.5 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between font-mono text-xs z-30 select-none">
      {/* Left: Brand + War Ticker */}
      <div className="flex items-center gap-2 sm:gap-4 overflow-hidden shrink-0">
        <Link
          href="/"
          className="flex items-center gap-1 sm:gap-1.5 font-black text-xs sm:text-sm tracking-tight text-white hover:text-[#ea6c52] transition-colors shrink-0"
        >
          <span className="text-[#ea6c52] font-black text-sm sm:text-base">WARMAP</span>
          <span className="text-zinc-400 font-normal text-[10px] sm:text-xs">.lol</span>
          <span className="ml-0.5 sm:ml-1 px-1 sm:px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold bg-[#ea6c52]/20 text-[#ea6c52] border border-[#ea6c52]/30">
            WAR
          </span>
        </Link>

        {/* Mobile Compact Live Presence Badge */}
        <div className="flex md:hidden items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-bold text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span>{onlineCount}</span>
          <span className="text-[8px] text-zinc-400 uppercase">LIVE</span>
        </div>

        {/* Ticker Subtitle for Desktop */}
        <div className="hidden lg:flex items-center gap-2 text-zinc-500 text-[11px] font-semibold border-l border-zinc-800 pl-3">
          <span className="uppercase tracking-widest text-zinc-400">
            BID ON ANY COUNTRY · YOUR LOGO RULES IT
          </span>
        </div>
      </div>

      {/* Center: Live Realtime Ticker Stats (Desktop) */}
      <div className="hidden md:flex items-center gap-3 sm:gap-4 text-[11px] text-zinc-400">
        {/* Live Realtime Presence */}
        <div className="flex items-center gap-1.5 font-bold text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>{onlineCount}</span>
          <span className="text-zinc-400 text-[10px] font-normal uppercase">ONLINE</span>
        </div>

        <div className="text-zinc-700">·</div>

        <div>
          <strong className="text-zinc-200 font-bold">{totalVisitors}</strong>{' '}
          <span className="text-zinc-400 text-[10px] uppercase">VISITORS</span>
        </div>

        <div className="text-zinc-700">·</div>

        <div>
          <strong className="text-[#ea6c52] font-bold">${totalPlundered}</strong>{' '}
          <span className="text-zinc-400 text-[10px] uppercase">PLUNDERED</span>
        </div>

        <div className="text-zinc-700">·</div>

        <div>
          <strong className="text-zinc-200 font-bold">{totalClicks}</strong>{' '}
          <span className="text-zinc-400 text-[10px] uppercase">CLICKS</span>
        </div>

        <div className="text-zinc-700">·</div>

        <div>
          <strong className="text-emerald-400 font-bold">{claimedCount}/{totalCountries}</strong>{' '}
          <span className="text-zinc-400 text-[10px] uppercase">CLAIMED</span>
        </div>
      </div>

      {/* Right: Master Buyout $5,000 + View Switcher + Help */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Conquer the World Super-button */}
        <button
          type="button"
          onClick={onOpenConquerWorld}
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:text-amber-200 text-[10px] sm:text-[11px] font-black tracking-wider transition-all shadow-md cursor-pointer group shrink-0"
        >
          <span>🌎</span>
          <span className="hidden xs:inline">CONQUER</span>
          <span className="text-amber-400 font-mono font-black">$5,000</span>
        </button>

        {/* View Switcher: Classic Board */}
        {isMapPage ? (
          <Link
            href="/"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-[11px] font-bold transition-colors shrink-0"
          >
            <Layers className="w-3.5 h-3.5 text-[#ea6c52]" />
            <span>Classic Board</span>
          </Link>
        ) : (
          <Link
            href="/map"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ea6c52] hover:bg-[#d95338] text-white text-[11px] font-black transition-colors shadow-sm shrink-0"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Battle Map</span>
          </Link>
        )}

        {/* How War Works Help Button */}
        <button
          type="button"
          onClick={onOpenHelp}
          className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 flex items-center justify-center cursor-pointer transition-colors shrink-0"
          title="War Rules & Guide"
        >
          <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </header>
  );
}
