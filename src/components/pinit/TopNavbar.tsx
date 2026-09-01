'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { COUNTRIES_DATA, CountryInfo } from '@/lib/pinitData';

interface TopNavbarProps {
  onPinClick: () => void;
  onSelectCountry: (country: CountryInfo) => void;
  totalClaimed: number;
  totalRaised: number;
  liveOnlineCount?: number;
}

export function TopNavbar({
  onPinClick,
  onSelectCountry,
  totalClaimed,
  totalRaised,
  liveOnlineCount = 1,
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
    <header className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-center justify-between p-2.5 sm:p-4 gap-2">
      {/* Brand Header */}
      <div className="pointer-events-auto flex items-center gap-2">
        <Link
          href="/"
          className="group flex items-center gap-2 rounded-xl border border-[var(--pin-border)] bg-[var(--pin-card)] px-3 py-1.5 shadow-pin-sm hover:border-[var(--pin-coral)] transition-colors"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] bg-[var(--pin-ink)] text-[var(--pin-coral)] shadow-xs">
            <svg viewBox="0 0 100 100" width="13" height="13" fill="currentColor">
              <path d="M20,8 L42,8 L82,32 L42,56 L42,92 L20,92 Z" />
            </svg>
          </span>
          <span className="text-sm font-extrabold tracking-tight text-[var(--pin-ink)]">
            pinit<span className="text-[var(--pin-coral-ink)]">.lol</span>
          </span>
          <span className="hidden xs:inline-block rounded bg-[var(--pin-gold-soft)] px-1.5 py-0.5 text-[9px] font-mono font-bold text-[var(--pin-gold-ink)]">
            #1 PER COUNTRY
          </span>
        </Link>
      </div>

      {/* Center Live Stats Pill (Real-Time $12 raised) */}
      <div className="pointer-events-auto hidden md:flex items-center gap-2 rounded-full border border-[var(--pin-border)] bg-[var(--pin-card)]/95 px-4 py-1.5 text-xs font-semibold shadow-pin-sm backdrop-blur-sm">
        <span className="flex items-center gap-1.5 text-[var(--pin-ink)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>{liveOnlineCount} live</span>
        </span>

        <span className="text-[var(--pin-border-strong)]">·</span>

        <span className="text-[var(--pin-ink)]">
          <strong>{totalClaimed}</strong> countries claimed
        </span>

        <span className="text-[var(--pin-border-strong)]">·</span>

        <span className="text-[var(--pin-muted)]">195 total</span>

        <span className="text-[var(--pin-border-strong)]">·</span>

        <span className="font-extrabold text-emerald-600">
          ${totalRaised} raised
        </span>
      </div>

      {/* Right Actions: Search + Pin CTA + Rules */}
      <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
        {/* Search Input */}
        <div ref={searchRef} className="relative hidden sm:block">
          <div className="flex items-center rounded-full border border-[var(--pin-border)] bg-[var(--pin-card)] px-3 py-1 shadow-pin-sm focus-within:border-[var(--pin-coral)] transition-colors">
            <svg viewBox="0 0 20 20" width="12" height="12" fill="currentColor" className="text-[var(--pin-muted)]">
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
              className="w-20 md:w-32 bg-transparent px-2 py-0.5 text-xs text-[var(--pin-ink)] placeholder:text-[var(--pin-muted)] focus:outline-none"
            />
            <kbd className="hidden md:inline rounded bg-[var(--pin-paper)] px-1.5 py-0.5 text-[9px] font-mono font-bold text-[var(--pin-muted)] border border-[var(--pin-border)]">
              /
            </kbd>
          </div>

          {/* Autocomplete Dropdown */}
          {isSearchOpen && searchQuery.trim().length > 0 && (
            <div className="absolute right-0 top-full mt-1.5 w-60 max-h-56 overflow-y-auto rounded-pin-md border border-[var(--pin-border)] bg-[var(--pin-card)] py-1 shadow-pin-lg z-50 divide-y divide-[var(--pin-border)]">
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
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-xs text-[var(--pin-ink)] hover:bg-[var(--pin-coral-soft)] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span>{c.flag}</span>
                      <span className="font-semibold">{c.name}</span>
                    </div>
                    <span className="text-[10px] text-[var(--pin-muted)]">
                      {c.currentLeader ? `👑 ${c.currentLeader.name}` : 'Unclaimed'}
                    </span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-xs text-[var(--pin-muted)]">No match found</div>
              )}
            </div>
          )}
        </div>

        {/* Claim / Pin CTA Button */}
        <button
          type="button"
          onClick={onPinClick}
          className="flex items-center gap-1.5 rounded-full bg-amber-400 hover:bg-amber-500 text-amber-950 px-3.5 sm:px-4 py-1.5 text-xs font-extrabold shadow-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span>📍</span>
          <span>Claim $1</span>
        </button>

        {/* Rules Link */}
        <Link
          href="/rules"
          title="Game Rules & Mechanics"
          className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--pin-border)] bg-[var(--pin-card)] text-xs font-bold text-[var(--pin-muted)] shadow-pin-sm hover:border-[var(--pin-coral)] hover:text-[var(--pin-ink)] transition-colors"
        >
          ⓘ
        </Link>
      </div>
    </header>
  );
}
