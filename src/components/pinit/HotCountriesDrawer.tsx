'use client';

import React, { useState, useEffect } from 'react';
import { HOT_COUNTRIES, COUNTRIES_DATA, CountryInfo } from '@/lib/pinitData';

interface HotCountriesDrawerProps {
  onSelectCountry: (country: CountryInfo) => void;
  onClaimCountry: (country: CountryInfo) => void;
}

export function HotCountriesDrawer({
  onSelectCountry,
  onClaimCountry,
}: HotCountriesDrawerProps) {
  const [isOpen, setIsOpen] = useState(true);

  // Auto-collapse on mobile screens initially
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      setIsOpen(false);
    }
  }, []);

  if (!isOpen) {
    return (
      <div className="pointer-events-auto absolute right-2.5 bottom-12 z-20 sm:right-4">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1.5 rounded-full border border-[#1e293b] bg-[#0b0f19]/90 px-3 py-1 text-[11px] font-extrabold text-white shadow-pin-lg hover:border-amber-400 transition-transform hover:scale-105 cursor-pointer backdrop-blur-md"
        >
          <span>🔥</span>
          <span>HOT LAND</span>
          <span className="text-[9px] text-[#94a3b8] font-mono">‹</span>
        </button>
      </div>
    );
  }

  return (
    <aside
      aria-label="Hot land best value"
      className="pointer-events-auto absolute right-2.5 bottom-12 z-30 w-76 sm:w-84 sm:right-4 max-w-[calc(100vw-1.5rem)] animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      <div className="rounded-pin-lg border border-[#1e293b] bg-[#0b0f19]/95 shadow-pin-lg backdrop-blur-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-3.5 py-2 border-b border-[#1e293b] bg-[#06090e]/50">
          <div className="flex items-center gap-1.5">
            <span>🔥</span>
            <h2 className="text-xs font-extrabold tracking-wide text-white uppercase">
              HOT LAND — BEST VALUE
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-[10px] text-[#94a3b8] hover:text-white font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* List of Hot Countries */}
        <div className="max-h-56 overflow-y-auto overscroll-contain divide-y divide-[#1e293b] px-1">
          {HOT_COUNTRIES.map((item) => {
            const countryObj = COUNTRIES_DATA[item.countrySlug];
            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 text-xs hover:bg-[#151d30]/70 transition-colors"
              >
                {/* Rank + Country & Ruler Info */}
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="font-mono text-[10px] font-bold text-[#94a3b8] w-3 text-center">
                    #{item.rank}
                  </span>

                  <img
                    src={item.rulerLogo}
                    alt=""
                    className="h-5 w-5 shrink-0 rounded-full object-cover border border-[#1e293b] bg-[#06090e]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/globe.svg';
                    }}
                  />

                  <div className="min-w-0">
                    <button
                      type="button"
                      onClick={() => countryObj && onSelectCountry(countryObj)}
                      className="font-bold text-white truncate hover:underline hover:text-[#fbbf24] text-left block leading-tight cursor-pointer text-[11px]"
                    >
                      {item.countryFlag} {item.countryName}
                    </button>
                    <span className="text-[9px] text-[#94a3b8] truncate block leading-tight">
                      {item.rulerName}
                    </span>
                  </div>
                </div>

                {/* Multiplier + Steal / Claim Button */}
                <div className="flex items-center gap-1.5 shrink-0 ml-1.5">
                  <span className="text-[10px] font-bold text-amber-400 flex items-center gap-0.5">
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
                    className={`rounded-full px-2.5 py-0.5 text-[9px] font-extrabold transition-transform hover:scale-105 active:scale-95 cursor-pointer shadow-xs ${
                      item.isClaimed
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black'
                        : 'bg-amber-400 hover:bg-amber-300 text-amber-950 font-black'
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
        <div className="border-t border-[#1e293b] p-1 bg-[#06090e]/30 text-center">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full flex items-center justify-center gap-1 py-0.5 text-[9px] font-bold text-[#94a3b8] hover:text-white transition-colors cursor-pointer"
          >
            <span>✕</span>
            <span>CLOSE</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
