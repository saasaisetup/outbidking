'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CountryInfo, COUNTRIES_DATA } from '@/lib/pinitData';

interface TopNavbarProps {
  isLightMode: boolean;
  onToggleTheme: () => void;
  onSelectCountry: (country: CountryInfo) => void;
  totalClaimed: number;
  totalRaised: number;
  liveOnlineCount: number;
}

export function TopNavbar({
  isLightMode,
  onToggleTheme,
  onSelectCountry,
  totalClaimed,
  totalRaised,
  liveOnlineCount,
}: TopNavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const filteredCountries = searchQuery.trim()
    ? Object.values(COUNTRIES_DATA).filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.currentLeader?.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  return (
    <header className="fixed top-0 inset-x-0 z-40 px-3 py-2.5 sm:px-6 pointer-events-none">
      <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto">
        {/* Left: Brand Badge */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <Link
            href="/"
            className={`flex items-center gap-2.5 rounded-pin-md border px-3 py-1.5 backdrop-blur-md transition-all shadow-pin-sm ${
              isLightMode
                ? 'border-[#e6dfd1] bg-white/95 text-slate-900 hover:border-slate-400'
                : 'border-[#1e293b] bg-[#0b0f19]/95 text-white hover:border-[#334155]'
            }`}
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ff5722] text-white shadow-xs">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
            </div>
            <span className="font-extrabold text-sm tracking-tight">worldpinit.lol</span>
            <span className="rounded bg-[#ff5722]/15 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-[#ff7043]">
              #1 PER COUNTRY
            </span>
          </Link>
        </div>

        {/* Center: Live Stats HUD (Desktop / Tablet) */}
        <div className="hidden md:flex items-center gap-2 rounded-pin-md border px-3.5 py-1.5 text-[11px] font-mono backdrop-blur-md shadow-pin-sm pointer-events-auto transition-colors duration-150 border-inherit bg-inherit">
          <div className={`flex items-center gap-2.5 rounded-pin-md border px-3 py-1 ${
            isLightMode
              ? 'border-[#e6dfd1] bg-white/95 text-slate-700'
              : 'border-[#1e293b] bg-[#0b0f19]/95 text-slate-300'
          }`}>
            <span className="flex items-center gap-1 font-bold text-emerald-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {liveOnlineCount} ONLINE
            </span>
            <span className="opacity-30">·</span>
            <span className="font-medium">
              <strong className={isLightMode ? 'text-slate-900' : 'text-white'}>2,140</strong> VISITORS
            </span>
            <span className="opacity-30">·</span>
            <span className="font-bold text-[#ff7043]">
              ${totalRaised} RAISED
            </span>
            <span className="opacity-30">·</span>
            <span className="font-medium">
              <strong className={isLightMode ? 'text-slate-900' : 'text-white'}>1,580</strong> CLICKS
            </span>
            <span className="opacity-30">·</span>
            <span className="font-bold text-amber-500">
              {totalClaimed}/195 CLAIMED
            </span>
          </div>
        </div>

        {/* Right: Modern SVG Theme Toggle, Search, and Rules */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Crisp Modern SVG Theme Toggle (Sun/Moon) */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            title={isLightMode ? 'Switch to Dark Mode' : 'Switch to Warm Cream Light Mode'}
            className={`flex h-8 w-8 items-center justify-center rounded-full border shadow-pin-sm backdrop-blur-md transition-all cursor-pointer ${
              isLightMode
                ? 'border-[#e6dfd1] bg-white text-amber-600 hover:bg-amber-50 hover:border-amber-300'
                : 'border-[#1e293b] bg-[#0b0f19] text-amber-400 hover:bg-slate-800 hover:border-slate-700'
            }`}
          >
            {isLightMode ? (
              // Crisp Moon SVG
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            ) : (
              // Crisp Sun SVG
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            )}
          </button>

          {/* Quick Search */}
          <div className="relative">
            <div
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs backdrop-blur-md transition-all ${
                isLightMode
                  ? 'border-[#e6dfd1] bg-white text-slate-800'
                  : 'border-[#1e293b] bg-[#0b0f19] text-white'
              }`}
            >
              <svg viewBox="0 0 20 20" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="9" r="6" />
                <path d="m13.5 13.5 4 4" />
              </svg>
              <input
                type="text"
                placeholder="Search country or startup..."
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-28 sm:w-44 bg-transparent text-xs focus:outline-none placeholder:text-[#94a3b8]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-[#94a3b8] hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Search Dropdown */}
            {isSearchOpen && filteredCountries.length > 0 && (
              <div
                className={`absolute right-0 top-full mt-2 w-64 rounded-pin-md border p-1.5 shadow-2xl backdrop-blur-md animate-in fade-in duration-100 ${
                  isLightMode
                    ? 'border-[#e6dfd1] bg-white/95 text-slate-900'
                    : 'border-[#1e293b] bg-[#0b0f19]/95 text-white'
                }`}
              >
                {filteredCountries.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      onSelectCountry(c);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className={`flex w-full items-center justify-between gap-2 rounded-pin-sm px-2.5 py-1.5 text-left text-xs transition-colors cursor-pointer ${
                      isLightMode ? 'hover:bg-slate-100' : 'hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span>{c.flag}</span>
                      <span className="font-bold truncate">{c.name}</span>
                    </div>
                    {c.currentLeader ? (
                      <span className="font-bold text-[#fbbf24] text-[10px] shrink-0">
                        ${c.currentLeader.stake}
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#94a3b8] shrink-0">Free</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Rules / Info Link */}
          <Link
            href="/rules"
            aria-label="Rules"
            title="How it Works & Rules"
            className={`flex h-8 w-8 items-center justify-center rounded-full border shadow-pin-sm backdrop-blur-md transition-colors ${
              isLightMode
                ? 'border-[#e6dfd1] bg-white text-slate-700 hover:bg-slate-100'
                : 'border-[#1e293b] bg-[#0b0f19] text-[#94a3b8] hover:text-white'
            }`}
          >
            <span className="font-bold text-xs">ⓘ</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
