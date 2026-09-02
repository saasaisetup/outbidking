'use client';

import React, { useState } from 'react';
import { INITIAL_ACTIVITY, COUNTRIES_DATA, CountryInfo } from '@/lib/pinitData';

interface LiveReportDrawerProps {
  onSelectCountry?: (country: CountryInfo) => void;
  isLightMode?: boolean;
}

export function LiveReportDrawer({ onSelectCountry, isLightMode = false }: LiveReportDrawerProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="fixed bottom-12 left-3 z-30 w-80 sm:w-96 transition-all pointer-events-auto">
      {isOpen ? (
        <div className={`rounded-pin-lg border shadow-2xl backdrop-blur-md overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150 ${
          isLightMode
            ? 'border-[#e6dfd1] bg-white/95 text-slate-900 shadow-pin-md'
            : 'border-[#1e293b] bg-[#0b0f19]/95 text-white'
        }`}>
          {/* Header */}
          <div className={`flex items-center justify-between px-3.5 py-2.5 border-b ${
            isLightMode ? 'border-[#e6dfd1]' : 'border-[#1e293b]'
          }`}>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-black text-xs tracking-tight uppercase">
                ⚡ LIVE REPORT
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[#94a3b8] hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-xs font-bold"
            >
              ✕
            </button>
          </div>

          {/* Activity Feed */}
          <div className={`divide-y max-h-52 overflow-y-auto no-scrollbar ${
            isLightMode ? 'divide-[#f0e9dc]' : 'divide-[#1e293b]/60'
          }`}>
            {INITIAL_ACTIVITY.map((act) => (
              <div
                key={act.id}
                onClick={() => {
                  const country = COUNTRIES_DATA[act.countrySlug];
                  if (country && onSelectCountry) {
                    onSelectCountry(country);
                  }
                }}
                className={`flex items-center justify-between gap-3 px-3.5 py-2.5 transition-colors cursor-pointer ${
                  isLightMode ? 'hover:bg-amber-50/70' : 'hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={act.logo}
                    alt=""
                    className="h-6 w-6 rounded-full object-cover bg-white shrink-0 border border-slate-200 dark:border-slate-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/globe.svg';
                    }}
                  />
                  <div className="min-w-0">
                    <p className="font-black text-xs truncate leading-tight">
                      {act.productName}
                    </p>
                    <p className="text-[10px] text-[#94a3b8] truncate mt-0.5">
                      claimed <strong className={isLightMode ? 'text-slate-800 font-bold' : 'text-slate-200 font-bold'}>{act.countryCode} {act.countryName}</strong>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono text-xs font-extrabold text-amber-500 block">
                    ${act.stake}
                  </span>
                  <span className="text-[9px] text-[#94a3b8] block">
                    {act.timeAgo}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className={`p-2 text-center border-t ${
            isLightMode ? 'border-[#e6dfd1] bg-[#faf7f0]' : 'border-[#1e293b] bg-[#06090e]'
          }`}>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              ⊞ HIDE INTEL
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-black uppercase tracking-wider shadow-pin-sm backdrop-blur-md transition-all cursor-pointer ${
            isLightMode
              ? 'border-[#e6dfd1] bg-white/95 text-slate-800 hover:border-slate-400'
              : 'border-[#1e293b] bg-[#0b0f19]/95 text-white hover:border-[#334155]'
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          ⚡ REPORT ›
        </button>
      )}
    </div>
  );
}
