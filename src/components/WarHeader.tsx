'use client';

import React from 'react';
import Link from 'next/link';
import { Globe, HelpCircle, Flame, ArrowRight, Layers } from 'lucide-react';
import { MapStats } from '@/lib/types';

interface WarHeaderProps {
  stats: MapStats;
  onOpenConquerWorld: () => void;
  onOpenHelp: () => void;
  onSwitchToClassic?: () => void;
  isMapPage?: boolean;
}

export function WarHeader({
  stats,
  onOpenConquerWorld,
  onOpenHelp,
  onSwitchToClassic,
  isMapPage = false,
}: WarHeaderProps) {
  return (
    <header className="w-full bg-[#0a0a0c]/95 backdrop-blur-md border-b border-[#1f1f23] text-white px-3 sm:px-6 py-2.5 flex items-center justify-between z-30 sticky top-0 shadow-lg">
      {/* Brand & Ticker */}
      <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex items-center gap-1.5 font-black text-base sm:text-xl tracking-wider text-white">
            <span className="text-[#ea6c52]">WARMAP</span>
            <span className="text-zinc-500">.lol</span>
          </div>
          <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#ea6c52]/20 text-[#ea6c52] border border-[#ea6c52]/40">
            WAR ROOM
          </span>
        </Link>

        {/* Tactical HUD Stats */}
        <div className="hidden lg:flex items-center gap-3.5 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-zinc-200">{stats.onlineCount}</span> ONLINE
          </div>
          <span className="text-zinc-700">·</span>
          <div>
            <span className="font-bold text-zinc-200">{stats.totalVisitors.toLocaleString()}</span> VISITORS
          </div>
          <span className="text-zinc-700">·</span>
          <div>
            <span className="font-extrabold text-[#ea6c52]">${stats.totalPlundered.toLocaleString()}</span> PLUNDERED
          </div>
          <span className="text-zinc-700">·</span>
          <div>
            <span className="font-bold text-zinc-200">{stats.totalClicks.toLocaleString()}</span> CLICKS
          </div>
          <span className="text-zinc-700">·</span>
          <div>
            <span className="font-bold text-emerald-400">{stats.claimedCount}/{stats.totalCountries}</span> CLAIMED
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Toggle back to Classic Board */}
        {onSwitchToClassic ? (
          <button
            type="button"
            onClick={onSwitchToClassic}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-xs font-bold text-zinc-300 hover:text-white transition-all cursor-pointer shadow-xs"
          >
            <Layers className="w-3.5 h-3.5 text-[#ea6c52]" />
            <span className="hidden sm:inline">Classic Board</span>
          </button>
        ) : (
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-xs font-bold text-zinc-300 hover:text-white transition-all cursor-pointer shadow-xs"
          >
            <Layers className="w-3.5 h-3.5 text-[#ea6c52]" />
            <span className="hidden sm:inline">Classic Board</span>
          </Link>
        )}

        {/* Super Spot: Conquer the World */}
        <button
          type="button"
          onClick={onOpenConquerWorld}
          className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 hover:from-amber-500/30 hover:to-amber-500/30 border border-amber-500/60 text-amber-300 font-extrabold text-xs tracking-tight shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_20px_rgba(245,158,11,0.35)] transition-all cursor-pointer active:scale-95"
        >
          <span>🌏</span>
          <span className="hidden xs:inline">CONQUER THE WORLD</span>
          <span className="font-mono text-amber-400 font-black">$5,000</span>
        </button>

        {/* Help / Rules Button */}
        <button
          type="button"
          onClick={onOpenHelp}
          className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center text-xs font-bold cursor-pointer transition-colors"
          title="War Rules & Guide"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
