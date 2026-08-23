'use client';

import React from 'react';
import Link from 'next/link';
import { MapStats } from '@/lib/types';
import { HelpCircle, Globe, Layers, Skull } from 'lucide-react';

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
    <header className="w-full bg-[#0a0a0e]/95 backdrop-blur-md border-b border-zinc-900 px-3 sm:px-5 py-2.5 flex items-center justify-between font-mono text-xs z-30 select-none">
      {/* Left: Brand + War Ticker */}
      <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
        <Link
          href="/"
          className="flex items-center gap-1.5 font-black text-sm tracking-tight text-white hover:text-[#ea6c52] transition-colors shrink-0"
        >
          <span className="text-[#ea6c52] font-black text-base">WARMAP</span>
          <span className="text-zinc-400 font-normal text-xs">.lol</span>
          <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#ea6c52]/20 text-[#ea6c52] border border-[#ea6c52]/30">
            WAR ROOM
          </span>
        </Link>

        {/* Ticker Subtitle */}
        <div className="hidden lg:flex items-center gap-2 text-zinc-500 text-[11px] font-semibold border-l border-zinc-800 pl-3">
          <span className="uppercase tracking-widest text-zinc-400">
            BID ON ANY COUNTRY · YOUR LOGO RULES IT
          </span>
        </div>
      </div>

      {/* Center: Live Realtime Ticker Stats */}
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
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Conquer the World Super-button */}
        <button
          type="button"
          onClick={onOpenConquerWorld}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:text-amber-200 text-[11px] font-black tracking-wider transition-all shadow-md cursor-pointer group"
        >
          <span>🌎</span>
          <span className="hidden sm:inline">CONQUER THE WORLD</span>
          <span className="text-amber-400 font-mono font-black">$5,000</span>
        </button>

        {/* View Switcher: Classic Board */}
        {isMapPage ? (
          <Link
            href="/"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-[11px] font-bold transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-[#ea6c52]" />
            <span>Classic Board</span>
          </Link>
        ) : (
          <Link
            href="/map"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ea6c52] hover:bg-[#d95338] text-white text-[11px] font-black transition-colors shadow-sm"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Battle Map</span>
          </Link>
        )}

        {/* How War Works Help Button */}
        <button
          type="button"
          onClick={onOpenHelp}
          className="w-7 h-7 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 flex items-center justify-center cursor-pointer transition-colors"
          title="War Rules & Guide"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
