'use client';

import React, { useState } from 'react';
import { TerritoryState } from '@/lib/types';
import { Flag, ChevronRight, X, ChevronDown, ChevronUp } from 'lucide-react';

interface UnclaimedLandDrawerProps {
  territories: TerritoryState[];
  onSelectCountry: (countryCode: string) => void;
}

export function UnclaimedLandDrawer({
  territories,
  onSelectCountry,
}: UnclaimedLandDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const unclaimed = territories.filter((t) => !t.currentRuler);

  return (
    <aside aria-label="Unclaimed Land Territories" className="absolute right-3 sm:right-5 bottom-12 sm:bottom-6 z-20 flex flex-col items-end pointer-events-none">
      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto px-3.5 py-2 rounded-2xl bg-[#0e0e12]/95 backdrop-blur-md border border-emerald-500/40 text-emerald-400 hover:text-emerald-300 font-mono text-xs font-bold flex items-center gap-2 shadow-2xl cursor-pointer transition-all hover:scale-105 active:scale-95"
      >
        <Flag className="w-3.5 h-3.5 fill-emerald-500/30" />
        <span>UNCLAIMED — {unclaimed.length} LEFT</span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>

      {/* Expanded List Panel */}
      {isOpen && (
        <div className="pointer-events-auto mt-2 w-64 sm:w-72 rounded-2xl bg-[#0e0e12]/98 backdrop-blur-md border border-zinc-800 shadow-2xl p-3 text-white animate-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-2">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>UNCLAIMED TERRITORIES</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-zinc-500 hover:text-zinc-300 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1 max-h-72 overflow-y-auto pr-1 text-xs font-mono scrollbar-thin">
            {unclaimed.map((t) => (
              <div
                key={t.countryCode}
                onClick={() => {
                  onSelectCountry(t.countryCode);
                  setIsOpen(false);
                }}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/20 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-base">{t.flag}</span>
                  <span className="font-bold text-zinc-400 group-hover:text-emerald-300">{t.countryCode}</span>
                  <span className="text-zinc-200 truncate group-hover:text-white">{t.countryName}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                  <span className="font-extrabold text-emerald-400">${t.currentBid}</span>
                  <ChevronRight className="w-3 h-3 text-zinc-600 group-hover:text-emerald-400 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
