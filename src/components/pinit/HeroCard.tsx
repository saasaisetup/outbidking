'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { COUNTRIES_DATA, CountryInfo, CATEGORIES_LIST } from '@/lib/pinitData';

interface HeroCardProps {
  onPinClick: () => void;
  onSelectCountry: (country: CountryInfo) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function HeroCard({
  onPinClick,
  onSelectCountry,
  selectedCategory,
  onSelectCategory,
  isCollapsed,
  onToggleCollapse,
}: HeroCardProps) {
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
    <div className="pointer-events-none absolute left-3 top-16 z-30 sm:left-4 sm:top-16 w-[min(21rem,calc(100%-8.75rem))] sm:w-[min(21rem,calc(100%-2rem))]">
      {/* Collapsed Pill Button */}
      {isCollapsed ? (
        <button
          type="button"
          onClick={onToggleCollapse}
          className="pointer-events-auto flex items-center gap-2 rounded-full border border-[var(--pin-border)] bg-[var(--pin-card)] px-3.5 py-1.5 text-xs font-bold text-[var(--pin-ink)] shadow-pin-lg hover:border-[var(--pin-coral)] hover:text-[var(--pin-coral-ink)] transition-transform hover:scale-105 cursor-pointer backdrop-blur-sm"
        >
          <span>📍</span>
          <span>Show Menu & Search</span>
        </button>
      ) : (
        <div className="pointer-events-auto rounded-pin-lg border border-[var(--pin-border)] bg-[var(--pin-card)]/95 p-4 shadow-pin-lg backdrop-blur-md">
          {/* Header with Title and Hide Toggle */}
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-extrabold leading-tight tracking-tight text-[var(--pin-ink)] sm:text-xl">
              Put your product on the map.
            </h1>

            <button
              type="button"
              onClick={onToggleCollapse}
              title="Hide sidebar to view full globe"
              className="rounded-full border border-[var(--pin-border)] p-1 text-[var(--pin-muted)] hover:bg-[var(--pin-paper)] hover:text-[var(--pin-ink)] transition-colors cursor-pointer text-xs flex items-center gap-1 px-2 shrink-0 ml-2"
            >
              <svg viewBox="0 0 20 20" width="12" height="12" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span className="text-[10px] font-semibold">Hide</span>
            </button>
          </div>

          <p className="mt-1 hidden text-xs leading-relaxed text-[var(--pin-muted)] sm:block">
            Stake on your product and compete for #1 for 24 hours.
          </p>

          {/* Country & Product Search Box */}
          <div ref={searchRef} className="relative mt-2.5 block">
            <input
              type="search"
              placeholder="Search countries or products…"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full rounded-full border border-[var(--pin-border-strong)] bg-[var(--pin-card)] px-3.5 py-1.5 text-xs text-[var(--pin-ink)] placeholder:text-[var(--pin-muted)] focus:border-[var(--pin-coral)] focus:outline-none focus:ring-1 focus:ring-[var(--pin-coral)]"
            />

            {/* Autocomplete Search Dropdown */}
            {isSearchOpen && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 max-h-56 overflow-y-auto rounded-pin-md border border-[var(--pin-border)] bg-[var(--pin-card)] py-1 shadow-pin-lg z-50 divide-y divide-[var(--pin-border)]">
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
                  <div className="px-3 py-2 text-xs text-[var(--pin-muted)]">No country found</div>
                )}
              </div>
            )}
          </div>

          {/* Live Badge */}
          <div className="mt-2.5 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--pin-paper)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--pin-muted)]">
              <span aria-hidden="true">🟢</span> Live for 6d 4h
            </span>

            <Link
              href="/hall-of-fame"
              className="text-[11px] font-semibold text-[var(--pin-coral-ink)] hover:underline"
            >
              Explore products →
            </Link>
          </div>

          {/* Action Button: Pin a country */}
          <button
            type="button"
            onClick={onPinClick}
            className="mt-3 block w-full rounded-full bg-[var(--pin-coral)] px-4 py-2.5 text-center text-sm font-bold text-white shadow-pin-coral outline-none transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            Pin a Country
          </button>

          {/* Feature Pills */}
          <ul className="mt-2.5 hidden gap-1 sm:flex flex-wrap">
            <li className="rounded-full bg-[var(--pin-paper)] px-2 py-0.5 text-[10px] font-semibold text-[var(--pin-muted)]">
              24h on country board
            </li>
            <li className="rounded-full bg-[var(--pin-paper)] px-2 py-0.5 text-[10px] font-semibold text-[var(--pin-muted)]">
              Permanent SEO backlink
            </li>
            <li className="rounded-full bg-[var(--pin-paper)] px-2 py-0.5 text-[10px] font-semibold text-[var(--pin-muted)]">
              Hall of Fame history
            </li>
          </ul>

          {/* Category Dropdown */}
          <div className="mt-2.5 pt-2.5 border-t border-[var(--pin-border)] flex items-center gap-2">
            <label htmlFor="category-select" className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-[var(--pin-muted)]">
              Category
            </label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => onSelectCategory(e.target.value)}
              className="w-full min-w-0 rounded-pin-md border border-[var(--pin-border-strong)] bg-[var(--pin-paper)] px-2 py-1 text-xs font-medium text-[var(--pin-ink)] outline-none cursor-pointer"
            >
              {CATEGORIES_LIST.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
