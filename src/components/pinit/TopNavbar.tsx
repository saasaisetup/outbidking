'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { COUNTRIES_DATA, CountryInfo } from '@/lib/pinitData';

interface TopNavbarProps {
  viewMode: 'globe' | 'flat';
  onToggleViewMode: (mode: 'globe' | 'flat') => void;
  onPinClick: () => void;
  onSelectCountry: (country: CountryInfo) => void;
  totalClaimed: number;
  totalRaised: number;
  liveOnlineCount?: number;
}

export function TopNavbar({
  viewMode,
  onToggleViewMode,
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
      {/* Brand Header */}
      <div className="pointer-events-auto flex items-center gap-2">
        <Link
          href="/"
          className="group flex items-center gap-2 rounded-xl border border-[#1e293b] bg-[#0b0f19]/90 px-3 py-1.5 shadow-pin-sm hover:border-[#ff5722] transition-colors backdrop-blur-md"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] bg-[#06090e] text-[#ff5722] border border-[#1e293b] shadow-xs">
            <svg viewBox="0 0 100 100" width="13" height="13" fill="currentColor">
              <path d="M20,8 L42,8 L82,32 L42,56 L42,92 L20,92 Z" />
            </svg>
          </span>
          <span className="text-sm font-extrabold tracking-tight text-white">
            pinit<span className="text-[#ff5722]">.lol</span>
          </span>
          <span className="hidden xs:inline-block rounded bg-[#f59e0b]/15 border border-[#f59e0b]/30 px-1.5 py-0.5 text-[9px] font-mono font-bold text-[#fbbf24]">
            #1 PER COUNTRY
          </span>
        </Link>
      </div>

      {/* Center Live HUD Stats Pill (Matching WARMAP in Dark Mode) */}
      <div className="pointer-events-auto hidden lg:flex items-center gap-2.5 rounded-full border border-[#1e293b] bg-[#0b0f19]/90 px-4 py-1.5 text-xs font-semibold shadow-pin-sm backdrop-blur-md">
        <span className="flex items-center gap-1.5 text-white">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-bold text-emerald-400">{liveOnlineCount} ONLINE</span>
        </span>

        <span className="text-[#334155]">·</span>

        <span className="text-[#94a3b8]">
          <strong className="text-white">31,810</strong> VISITORS
        </span>

        <span className="text-[#334155]">·</span>

        <span className="text-[#ef4444] font-extrabold font-mono">
          ${totalRaised} RAISED
        </span>

        <span className="text-[#334155]">·</span>

        <span className="text-[#94a3b8]">
          <strong className="text-white">34,087</strong> CLICKS
        </span>

        <span className="text-[#334155]">·</span>

        <span className="text-white font-bold font-mono">
          {totalClaimed}/195 CLAIMED
        </span>
      </div>

      {/* Right Controls: [FLAT | GLOBE] Toggle + Search + Claim CTA + Info */}
      <div className="pointer-events-auto flex items-center gap-2">
        {/* Globe vs Flat Map Toggle Switch (Matching Screenshot 5) */}
        <div className="flex items-center rounded-full border border-[#1e293b] bg-[#0b0f19]/95 p-0.5 shadow-pin-sm backdrop-blur-md">
          <button
            type="button"
            onClick={() => onToggleViewMode('flat')}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'flat'
                ? 'bg-[#1e293b] text-white shadow-xs'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <span>🗺️</span>
            <span className="hidden xs:inline">FLAT</span>
          </button>
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
        </div>

        {/* Search Input */}
        <div ref={searchRef} className="relative hidden md:block">
          <div className="flex items-center rounded-full border border-[#1e293b] bg-[#0b0f19]/90 px-3 py-1 shadow-pin-sm focus-within:border-[#ff5722] transition-colors">
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
              className="w-20 lg:w-28 bg-transparent px-2 py-0.5 text-xs text-white placeholder:text-[#94a3b8] focus:outline-none"
            />
            <kbd className="hidden lg:inline rounded bg-[#1e293b] px-1.5 py-0.5 text-[9px] font-mono font-bold text-[#94a3b8]">
              /
            </kbd>
          </div>

          {/* Autocomplete Dropdown */}
          {isSearchOpen && searchQuery.trim().length > 0 && (
            <div className="absolute right-0 top-full mt-1.5 w-60 max-h-56 overflow-y-auto rounded-pin-md border border-[#1e293b] bg-[#0b0f19] py-1 shadow-2xl z-50 divide-y divide-[#1e293b]">
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
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-xs text-white hover:bg-[#1e293b] transition-colors cursor-pointer"
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

        {/* Claim / Pin CTA Button */}
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
          className="flex h-7 w-7 items-center justify-center rounded-full border border-[#1e293b] bg-[#0b0f19] text-xs font-bold text-[#94a3b8] shadow-pin-sm hover:border-[#ff5722] hover:text-white transition-colors"
        >
          ⓘ
        </Link>
      </div>
    </header>
  );
}
