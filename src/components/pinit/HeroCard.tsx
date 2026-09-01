'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { COUNTRIES_DATA, CountryInfo, CATEGORIES_LIST } from '@/lib/pinitData';

interface HeroCardProps {
  onPinClick: () => void;
  onSelectCountry: (country: CountryInfo) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function HeroCard({
  onPinClick,
  onSelectCountry,
  selectedCategory,
  onSelectCategory,
}: HeroCardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement | null>(null);

  // Filter countries and sample products matching search query
  const filteredCountries = Object.values(COUNTRIES_DATA).filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.currentLeader && c.currentLeader.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Close search dropdown on click outside
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
    <div className="pointer-events-none absolute left-3 top-3 z-10 sm:left-4 sm:top-4 w-[min(22rem,calc(100%-8.75rem))] sm:w-[min(22rem,calc(100%-2rem))]">
      {/* Main Intro Card */}
      <div className="pointer-events-auto rounded-pin-lg border border-[var(--pin-border)] bg-[var(--pin-card)] p-4 shadow-pin-lg">
        {/* Brand Logo Header */}
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[var(--pin-coral)]"
          aria-label="pinit.lol home"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-[var(--pin-ink)] text-[var(--pin-coral)] transition-transform duration-200 ease-out group-hover:-rotate-6 group-hover:scale-105 shadow-sm">
            {/* Orange Flag Icon */}
            <svg viewBox="0 0 100 100" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M20,8 L42,8 L82,32 L42,56 L42,92 L20,92 Z" />
            </svg>
          </span>
          <span className="text-lg font-extrabold tracking-tight text-[var(--pin-ink)]">
            pinit<span className="font-semibold text-[var(--pin-coral-ink)]">.lol</span>
          </span>
        </Link>

        {/* Hero Title & Subtitle */}
        <h1 className="mt-3 text-xl font-extrabold leading-tight tracking-tight text-[var(--pin-ink)] sm:text-2xl">
          Put your product on the map.
        </h1>
        <p className="mt-1.5 hidden text-sm leading-relaxed text-[var(--pin-muted)] sm:block">
          Stake on your product and compete for #1 for 24 hours.
        </p>

        {/* Country & Product Search Box */}
        <div ref={searchRef} className="relative mt-3 block">
          <input
            type="search"
            placeholder="Search countries or products…"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            className="w-full rounded-full border border-[var(--pin-border-strong)] bg-[var(--pin-card)] px-4 py-1.5 text-sm text-[var(--pin-ink)] placeholder:text-[var(--pin-muted)] focus:border-[var(--pin-coral)] focus:outline-none focus:ring-1 focus:ring-[var(--pin-coral)] transition-shadow"
          />

          {/* Autocomplete Search Dropdown */}
          {isSearchOpen && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 max-h-56 overflow-y-auto rounded-pin-md border border-[var(--pin-border)] bg-[var(--pin-card)] py-1 shadow-pin-lg z-30 divide-y divide-[var(--pin-border)]">
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
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-xs text-[var(--pin-ink)] hover:bg-[var(--pin-coral-soft)] transition-colors"
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
                <div className="px-3 py-2 text-xs text-[var(--pin-muted)]">No country or product found</div>
              )}
            </div>
          )}
        </div>

        {/* Live Badge */}
        <span className="mt-3 hidden items-center gap-1.5 rounded-full bg-[var(--pin-paper)] px-2.5 py-1 text-xs font-medium text-[var(--pin-muted)] sm:inline-flex">
          <span aria-hidden="true">🟢</span> Live for 6d 4h
        </span>

        {/* Primary CTA Button: Pin your product */}
        <button
          type="button"
          onClick={onPinClick}
          className="mt-3 block w-full rounded-full bg-[var(--pin-coral)] px-4 py-2.5 text-center text-sm font-bold text-white shadow-pin-coral outline-none transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          Pin your product
        </button>

        {/* Secondary Link: Explore products */}
        <div className="mt-2 flex items-center justify-center gap-2 text-xs font-semibold">
          <Link
            href="/hall-of-fame"
            className="text-[var(--pin-coral-ink)] outline-none hover:underline"
          >
            Explore products
          </Link>
        </div>

        {/* 3 Feature Pills */}
        <ul className="mt-3 hidden gap-1.5 sm:flex flex-wrap">
          <li className="rounded-full bg-[var(--pin-paper)] px-2 py-1 text-[10px] font-semibold leading-tight text-[var(--pin-muted)]">
            24 hours on the live country board
          </li>
          <li className="rounded-full bg-[var(--pin-paper)] px-2 py-1 text-[10px] font-semibold leading-tight text-[var(--pin-muted)]">
            Permanent product page
          </li>
          <li className="rounded-full bg-[var(--pin-paper)] px-2 py-1 text-[10px] font-semibold leading-tight text-[var(--pin-muted)]">
            Hall of Fame and country history
          </li>
        </ul>

        {/* Strategic Note & FAQ Link */}
        <p className="mt-2 hidden text-[11px] leading-relaxed text-[var(--pin-muted)] sm:block">
          Choosing a country is strategic. It is not an office location or targeted ads.{' '}
          <Link href="/faq" className="font-semibold text-[var(--pin-coral-ink)] hover:underline">
            FAQ
          </Link>
        </p>
      </div>

      {/* Category Dropdown Card */}
      <div className="pointer-events-auto mt-2 hidden sm:block">
        <div className="flex items-center gap-2 rounded-pin-lg border border-[var(--pin-border)] bg-[var(--pin-card)]/95 px-3 py-2 shadow-pin-lg backdrop-blur-sm">
          <label htmlFor="category-select" className="shrink-0 text-[10px] font-bold uppercase tracking-wide text-[var(--pin-muted)]">
            Category
          </label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => onSelectCategory(e.target.value)}
            className="w-full min-w-0 rounded-pin-md border border-[var(--pin-border-strong)] bg-[var(--pin-paper)] px-2 py-1 text-xs font-medium text-[var(--pin-ink)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--pin-coral)] cursor-pointer"
          >
            {CATEGORIES_LIST.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
