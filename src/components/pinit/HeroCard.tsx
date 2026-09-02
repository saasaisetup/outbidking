'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CATEGORIES_LIST, CountryInfo, COUNTRIES_DATA } from '@/lib/pinitData';

interface HeroCardProps {
  onPinClick: () => void;
  onSelectCountry: (country: CountryInfo) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isLightMode?: boolean;
}

export function HeroCard({
  onPinClick,
  onSelectCountry,
  selectedCategory,
  onSelectCategory,
  isCollapsed = false,
  onToggleCollapse,
  isLightMode = false,
}: HeroCardProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = searchQuery.trim()
    ? Object.values(COUNTRIES_DATA).filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.currentLeader?.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <div className="fixed top-14 left-3 z-30 max-w-[280px] sm:max-w-xs transition-all duration-200 pointer-events-auto">
      {isCollapsed ? (
        <button
          type="button"
          onClick={onToggleCollapse}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-extrabold shadow-pin-sm backdrop-blur-md transition-all cursor-pointer ${
            isLightMode
              ? 'border-[#e6dfd1] bg-white/95 text-slate-800 hover:border-slate-400'
              : 'border-[#1e293b] bg-[#0b0f19]/95 text-white hover:border-[#334155]'
          }`}
        >
          <span>📍</span>
          <span>Pin Product & Search</span>
        </button>
      ) : (
        <div className={`relative rounded-pin-lg border p-4 shadow-2xl backdrop-blur-md transition-all ${
          isLightMode
            ? 'border-[#e6dfd1] bg-white/95 text-slate-900 shadow-pin-md'
            : 'border-[#1e293b] bg-[#0b0f19]/95 text-white'
        }`}>
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h1 className="text-sm font-extrabold tracking-tight">
                Put your product on the map.
              </h1>
              <p className="mt-0.5 text-[11px] text-[#94a3b8] leading-tight">
                Stake on your product and compete for #1 for 24 hours.
              </p>
            </div>
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="rounded p-1 text-[#94a3b8] hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-[10px] font-bold"
              >
                ^ Hide
              </button>
            )}
          </div>

          {/* Quick Search */}
          <div className="relative mt-3">
            <input
              type="text"
              placeholder="Search countries or products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full rounded-pin-md border px-3 py-1.5 text-xs focus:border-[#ff5722] focus:outline-none transition-colors ${
                isLightMode
                  ? 'border-[#e6dfd1] bg-[#faf7f0] text-slate-900 placeholder:text-slate-400'
                  : 'border-[#1e293b] bg-[#06090e] text-white placeholder:text-[#64748b]'
              }`}
            />
            {filteredCountries.length > 0 && (
              <div className={`absolute left-0 right-0 top-full mt-1.5 z-40 rounded-pin-md border p-1 shadow-2xl backdrop-blur-md ${
                isLightMode
                  ? 'border-[#e6dfd1] bg-white/95 text-slate-900'
                  : 'border-[#1e293b] bg-[#0b0f19]/95 text-white'
              }`}>
                {filteredCountries.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      onSelectCountry(c);
                      setSearchQuery('');
                    }}
                    className={`flex w-full items-center justify-between rounded-pin-sm px-2.5 py-1.5 text-left text-xs transition-colors cursor-pointer ${
                      isLightMode ? 'hover:bg-slate-100' : 'hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span>{c.flag}</span>
                      <span className="font-bold truncate">{c.name}</span>
                    </div>
                    {c.currentLeader ? (
                      <span className="font-bold text-[#fbbf24] text-[10px] shrink-0">
                        ${c.currentLeader.stake}
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#94a3b8] shrink-0">Available</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Micro Status */}
          <div className="mt-2.5 flex items-center justify-between text-[10px]">
            <span className="flex items-center gap-1 font-semibold text-emerald-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live for 6d 4h
            </span>
            <Link
              href="/categories"
              className="text-[#ff7043] font-bold hover:underline"
            >
              Explore products →
            </Link>
          </div>

          {/* Pin a Country CTA Button */}
          <button
            type="button"
            onClick={onPinClick}
            className="mt-3 w-full rounded-pin-md bg-[#ff5722] hover:bg-[#ff7043] py-2.5 text-center text-xs font-extrabold text-white shadow-pin-coral transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            Pin a Country
          </button>

          {/* Benefits Tags */}
          <div className="mt-2.5 flex flex-wrap gap-1 text-[9px] font-medium text-[#94a3b8]">
            <span className={`rounded-pin-sm border px-1.5 py-0.5 ${
              isLightMode ? 'border-[#e6dfd1] bg-[#faf7f0]' : 'border-[#1e293b] bg-[#06090e]'
            }`}>
              24h on country board
            </span>
            <span className={`rounded-pin-sm border px-1.5 py-0.5 ${
              isLightMode ? 'border-[#e6dfd1] bg-[#faf7f0]' : 'border-[#1e293b] bg-[#06090e]'
            }`}>
              Permanent SEO backlink
            </span>
            <span className={`rounded-pin-sm border px-1.5 py-0.5 ${
              isLightMode ? 'border-[#e6dfd1] bg-[#faf7f0]' : 'border-[#1e293b] bg-[#06090e]'
            }`}>
              Hall of Fame history
            </span>
          </div>

          {/* Category Filter Selector */}
          <div className={`mt-3 pt-2.5 border-t ${
            isLightMode ? 'border-[#e6dfd1]' : 'border-[#1e293b]'
          }`}>
            <label className="block text-[9px] font-bold uppercase tracking-wider text-[#94a3b8] mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => onSelectCategory(e.target.value)}
              className={`w-full rounded-pin-md border px-2 py-1 text-xs outline-none cursor-pointer ${
                isLightMode
                  ? 'border-[#e6dfd1] bg-[#faf7f0] text-slate-900'
                  : 'border-[#1e293b] bg-[#06090e] text-white'
              }`}
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
