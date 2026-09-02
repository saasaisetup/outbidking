'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { COUNTRIES_DATA, CountryInfo } from '@/lib/pinitData';

interface TopNavbarProps {
  viewMode: 'globe' | 'flat';
  onToggleViewMode: (mode: 'globe' | 'flat') => void;
  isLightMode: boolean;
  onToggleTheme: () => void;
  onPinClick: () => void;
  onSelectCountry: (country: CountryInfo) => void;
  totalClaimed: number;
  totalRaised: number;
  liveOnlineCount?: number;
}

export function TopNavbar({
  viewMode,
  onToggleViewMode,
  isLightMode,
  onToggleTheme,
  onPinClick,
  onSelectCountry,
  totalClaimed,
  totalRaised,
  liveOnlineCount = 18,
}: TopNavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);

  const filteredCountries = Object.values(COUNTRIES_DATA).filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.currentLeader && c.currentLeader.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-center justify-between p-2.5 sm:p-3.5 gap-2">
      {/* Brand Header: worldpinit.lol */}
      <div className="pointer-events-auto flex items-center gap-2">
        <Link
          href="/"
          className={`group flex items-center gap-2 rounded-xl border px-3 py-1.5 shadow-pin-sm hover:border-[#ff5722] transition-colors backdrop-blur-md ${
            isLightMode
              ? 'border-slate-300 bg-white/95 text-slate-900'
              : 'border-[#1e293b] bg-[#0b0f19]/90 text-white'
          }`}
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] bg-[#ff5722] text-white shadow-xs">
            <svg viewBox="0 0 100 100" width="13" height="13" fill="currentColor">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8"/>
              <ellipse cx="50" cy="50" rx="45" ry="20" fill="none" stroke="currentColor" strokeWidth="8"/>
              <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="8"/>
            </svg>
          </span>
          <span className="text-sm font-extrabold tracking-tight">
            worldpinit<span className="text-[#ff5722]">.lol</span>
          </span>
          <span className="hidden xs:inline-block rounded bg-[#f59e0b]/15 border border-[#f59e0b]/30 px-1.5 py-0.5 text-[9px] font-mono font-bold text-[#fbbf24]">
            #1 PER COUNTRY
          </span>
        </Link>
      </div>

      {/* Center Live HUD Stats Pill */}
      <div className={`pointer-events-auto hidden lg:flex items-center gap-2.5 rounded-full border px-4 py-1.5 text-xs font-semibold shadow-pin-sm backdrop-blur-md ${
        isLightMode
          ? 'border-slate-300 bg-white/95 text-slate-800'
          : 'border-[#1e293b] bg-[#0b0f19]/90 text-white'
      }`}>
        <span className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-bold text-emerald-500">{liveOnlineCount} ONLINE</span>
        </span>

        <span className="text-slate-500">·</span>

        <span className="text-[#94a3b8]">
          <strong className={isLightMode ? 'text-slate-900' : 'text-white'}>31,810</strong> VISITORS
        </span>

        <span className="text-slate-500">·</span>

        <span className="text-[#ef4444] font-extrabold font-mono">
          ${totalRaised} RAISED
        </span>

        <span className="text-slate-500">·</span>

        <span className="text-[#94a3b8]">
          <strong className={isLightMode ? 'text-slate-900' : 'text-white'}>34,087</strong> CLICKS
        </span>

        <span className="text-slate-500">·</span>

        <span className={`font-bold font-mono ${isLightMode ? 'text-slate-900' : 'text-white'}`}>
          {totalClaimed}/195 CLAIMED
        </span>
      </div>

      {/* Right Controls: [GLOBE | FLAT] Toggle + Light/Dark Theme + Search + Claim CTA */}
      <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
        {/* Globe Left vs Flat Right Toggle Switch */}
        <div className={`flex items-center rounded-full border p-0.5 shadow-pin-sm backdrop-blur-md ${
          isLightMode ? 'border-slate-300 bg-white/95' : 'border-[#1e293b] bg-[#0b0f19]/95'
        }`}>
          <button
            type="button"
            onClick={() => onToggleViewMode('globe')}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'globe'
                ? 'bg-[#3b82f6] text-white shadow-xs'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <span>🌐</span>
            <span className="hidden xs:inline">GLOBE</span>
          </button>
          <button
            type="button"
            onClick={() => onToggleViewMode('flat')}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'flat'
                ? 'bg-[#ff5722] text-white shadow-xs'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <span>🗺️</span>
            <span className="hidden xs:inline">FLAT</span>
          </button>
        </div>

        {/* Light Mode / Dark Mode Toggle Button */}
        <button
          type="button"
          onClick={onToggleTheme}
          title={isLightMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold shadow-pin-sm transition-colors cursor-pointer ${
            isLightMode
              ? 'border-slate-300 bg-white text-slate-800 hover:border-[#ff5722]'
              : 'border-[#1e293b] bg-[#0b0f19] text-amber-400 hover:border-amber-400'
          }`}
        >
          {isLightMode ? '🌙' : '☀️'}
        </button>

        {/* Search Input */}
        <div ref={searchRef} className="relative hidden md:block">
          <div className={`flex items-center rounded-full border px-3 py-1 shadow-pin-sm focus-within:border-[#ff5722] transition-colors ${
            isLightMode ? 'border-slate-300 bg-white' : 'border-[#1e293b] bg-[#0b0f19]/90'
          }`}>
            <svg viewBox="0 0 20 20" width="12" height="12" fill="currentColor" className="text-[#94a3b8]">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            <input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-20 lg:w-28 bg-transparent px-2 py-0.5 text-xs placeholder:text-[#94a3b8] focus:outline-none"
            />
            <kbd className={`hidden lg:inline rounded px-1.5 py-0.5 text-[9px] font-mono font-bold text-[#94a3b8] ${
              isLightMode ? 'bg-slate-100' : 'bg-[#1e293b]'
            }`}>
              /
            </kbd>
          </div>

          {/* Autocomplete Dropdown */}
          {isSearchOpen && searchQuery.trim().length > 0 && (
            <div className={`absolute right-0 top-full mt-1.5 w-60 max-h-56 overflow-y-auto rounded-pin-md border py-1 shadow-2xl z-50 divide-y ${
              isLightMode
                ? 'border-slate-300 bg-white divide-slate-200 text-slate-900'
                : 'border-[#1e293b] bg-[#0b0f19] divide-[#1e293b] text-white'
            }`}>
              {filteredCountries.length > 0 ? (
                filteredCountries.map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => {
                      onSelectCountry(c);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-xs hover:bg-[#ff5722]/15 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span>{c.flag}</span>
                      <span className="font-semibold">{c.name}</span>
                    </div>
                    <span className="text-[10px] text-[#94a3b8]">
                      {c.currentLeader ? `👑 ${c.currentLeader.name}` : 'Unclaimed'}
                    </span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-xs text-[#94a3b8]">No match found</div>
              )}
            </div>
          )}
        </div>

        {/* Claim CTA Button */}
        <button
          type="button"
          onClick={onPinClick}
          className="flex items-center gap-1.5 rounded-full bg-amber-400 hover:bg-amber-500 text-amber-950 px-3.5 py-1.5 text-xs font-extrabold shadow-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span>📍</span>
          <span>Claim $1</span>
        </button>

        {/* Rules Link */}
        <Link
          href="/rules"
          title="Game Rules & Mechanics"
          className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold text-[#94a3b8] shadow-pin-sm hover:border-[#ff5722] transition-colors ${
            isLightMode ? 'border-slate-300 bg-white' : 'border-[#1e293b] bg-[#0b0f19]'
          }`}
        >
          ⓘ
        </Link>
      </div>
    </header>
  );
}
