'use client';

import React, { useState } from 'react';
import { HOT_COUNTRIES, COUNTRIES_DATA, CountryInfo } from '@/lib/pinitData';

interface HotCountriesDrawerProps {
  onSelectCountry?: (country: CountryInfo) => void;
  onClaimCountry?: (country: CountryInfo) => void;
  isLightMode?: boolean;
}

export function HotCountriesDrawer({
  onSelectCountry,
  onClaimCountry,
  isLightMode = false,
}: HotCountriesDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-12 right-3 z-30 max-w-[280px] sm:max-w-xs transition-all pointer-events-auto">
      {isOpen ? (
        <div className={`rounded-pin-lg border shadow-2xl backdrop-blur-md overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150 ${
          isLightMode
            ? 'border-[#e6dfd1] bg-white/95 text-slate-900 shadow-pin-md'
            : 'border-[#1e293b] bg-[#0b0f19]/95 text-white'
        }`}>
          {/* Header */}
          <div className={`flex items-center justify-between px-3 py-2 border-b ${
            isLightMode ? 'border-[#e6dfd1]' : 'border-[#1e293b]'
          }`}>
            <div className="flex items-center gap-1.5">
              <span>🔥</span>
              <span className="font-extrabold text-[11px] tracking-tight uppercase">
                HOT LAND — BEST VALUE
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[#94a3b8] hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-xs"
            >
              ✕
            </button>
          </div>

          {/* Hot Deals List */}
          <div className={`divide-y max-h-52 overflow-y-auto no-scrollbar ${
            isLightMode ? 'divide-[#f0e9dc]' : 'divide-[#1e293b]/60'
          }`}>
            {HOT_COUNTRIES.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  const country = COUNTRIES_DATA[item.countrySlug];
                  if (country && onSelectCountry) {
                    onSelectCountry(country);
                  }
                }}
                className={`flex items-center justify-between gap-2 px-3 py-2 transition-colors cursor-pointer ${
                  isLightMode ? 'hover:bg-amber-50/70' : 'hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-mono text-[10px] font-bold text-[#94a3b8] w-3">
                    #{item.rank}
                  </span>
                  <img
                    src={item.rulerLogo}
                    alt=""
                    className="h-5 w-5 rounded-full object-cover bg-white shrink-0 border border-slate-200 dark:border-slate-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/globe.svg';
                    }}
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-[11px] truncate leading-tight">
                      <span className="font-mono text-[9px] text-[#94a3b8] mr-1">{item.countryCode}</span>
                      {item.countryName}
                    </p>
                    <p className="text-[9px] text-[#94a3b8] truncate">
                      {item.rulerName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="font-mono text-[9px] font-bold text-amber-500">
                    🔥 {item.multiplier}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const country = COUNTRIES_DATA[item.countrySlug];
                      if (country && onClaimCountry) {
                        onClaimCountry(country);
                      }
                    }}
                    className="rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-500 font-mono text-[9px] font-extrabold px-1.5 py-0.5 transition-colors cursor-pointer border border-emerald-500/30"
                  >
                    steal ${item.stealPrice}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className={`p-1.5 text-center border-t ${
            isLightMode ? 'border-[#e6dfd1] bg-[#faf7f0]' : 'border-[#1e293b] bg-[#06090e]'
          }`}>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[9px] font-bold uppercase tracking-wider text-[#94a3b8] hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              ✕ CLOSE
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider shadow-pin-sm backdrop-blur-md transition-all cursor-pointer ${
            isLightMode
              ? 'border-[#e6dfd1] bg-white/95 text-slate-800 hover:border-slate-400'
              : 'border-[#1e293b] bg-[#0b0f19]/95 text-white hover:border-[#334155]'
          }`}
        >
          <span>🔥</span>
          HOT LAND ›
        </button>
      )}
    </div>
  );
}
