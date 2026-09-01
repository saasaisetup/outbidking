'use client';

import React, { useState } from 'react';
import { HOT_COUNTRIES, COUNTRIES_DATA, CountryInfo, HotCountryItem } from '@/lib/pinitData';

interface HotCountriesDrawerProps {
  onSelectCountry: (country: CountryInfo) => void;
  onClaimCountry: (country: CountryInfo) => void;
}

export function HotCountriesDrawer({
  onSelectCountry,
  onClaimCountry,
}: HotCountriesDrawerProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return (
      <div className="pointer-events-auto absolute right-3 bottom-12 z-30 sm:right-4">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 rounded-full border border-[var(--pin-border)] bg-[var(--pin-card)]/95 px-3.5 py-1.5 text-xs font-extrabold text-[var(--pin-ink)] shadow-pin-lg hover:border-amber-400 transition-transform hover:scale-105 cursor-pointer backdrop-blur-sm"
        >
          <span>🔥</span>
          <span>HOT COUNTRIES</span>
          <span className="text-[10px] text-[var(--pin-muted)] font-mono">‹</span>
        </button>
      </div>
    );
  }

  return (
    <aside
      aria-label="Hot countries best value"
      className="pointer-events-auto absolute right-3 bottom-12 z-30 w-84 sm:right-4 max-w-[calc(100vw-1.5rem)] animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      <div className="rounded-pin-lg border border-[var(--pin-border)] bg-[var(--pin-card)]/95 shadow-pin-lg backdrop-blur-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[var(--pin-border)] bg-[var(--pin-paper)]/50">
          <div className="flex items-center gap-1.5">
            <span>🔥</span>
            <h2 className="text-xs font-extrabold tracking-wide text-[var(--pin-ink)] uppercase">
              HOT COUNTRIES — BEST VALUE
            </h2>
          </div>
          <span className="text-[10px] font-bold text-[var(--pin-muted)] uppercase tracking-wider">
            Steal Turf
          </span>
        </div>

        {/* List of Hot Countries */}
        <div className="max-h-60 overflow-y-auto overscroll-contain divide-y divide-[var(--pin-border)] px-1">
          {HOT_COUNTRIES.map((item) => {
            const countryObj = COUNTRIES_DATA[item.countrySlug];
            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 text-xs hover:bg-[var(--pin-paper)]/70 transition-colors"
              >
                {/* Rank + Country & Ruler Info */}
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="font-mono text-[10px] font-bold text-[var(--pin-muted)] w-4 text-center">
                    #{item.rank}
                  </span>

                  <img
                    src={item.rulerLogo}
                    alt=""
                    className="h-6 w-6 shrink-0 rounded-full object-cover border border-[var(--pin-border)] bg-white"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/globe.svg';
                    }}
                  />

                  <div className="min-w-0">
                    <button
                      type="button"
                      onClick={() => countryObj && onSelectCountry(countryObj)}
                      className="font-bold text-[var(--pin-ink)] truncate hover:underline text-left block leading-tight cursor-pointer"
                    >
                      {item.countryFlag} {item.countryName}
                    </button>
                    <span className="text-[10px] text-[var(--pin-muted)] truncate block leading-tight">
                      {item.rulerName}
                    </span>
                  </div>
                </div>

                {/* Multiplier + Steal / Claim Button */}
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-[11px] font-bold text-amber-600 flex items-center gap-0.5">
                    <span>🔥</span>
                    <span>{item.multiplier}</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      if (countryObj) {
                        onSelectCountry(countryObj);
                        onClaimCountry(countryObj);
                      }
                    }}
                    className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-xs ${
                      item.isClaimed
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                        : 'bg-amber-400 hover:bg-amber-500 text-amber-950'
                    }`}
                  >
                    {item.isClaimed ? `steal $${item.stealPrice}` : `claim $${item.stealPrice}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Close Button */}
        <div className="border-t border-[var(--pin-border)] p-1.5 bg-[var(--pin-paper)]/30 text-center">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full flex items-center justify-center gap-1 py-1 text-[10px] font-bold text-[var(--pin-muted)] hover:text-[var(--pin-ink)] transition-colors cursor-pointer"
          >
            <span>✕</span>
            <span>CLOSE</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
