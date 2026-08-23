'use client';

import React, { useState } from 'react';
import { TerritoryState } from '@/lib/types';
import { ChevronUp, ChevronDown, Flag, Shield, Anchor } from 'lucide-react';

interface UnclaimedLandDrawerProps {
  territories: TerritoryState[];
  onSelectCountry: (code: string) => void;
}

export function UnclaimedLandDrawer({
  territories,
  onSelectCountry,
}: UnclaimedLandDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const unclaimed = territories.filter((t) => !t.currentRuler);
  const unclaimedCount = unclaimed.length;

  return (
    <div className="absolute bottom-4 right-4 z-20 flex flex-col items-end">
      {/* Expanded Drawer List */}
      {isOpen && (
        <div className="mb-2 w-72 sm:w-80 max-h-80 rounded-2xl bg-[#0e0e12]/95 backdrop-blur-xl border border-zinc-800 shadow-2xl p-3 flex flex-col font-mono text-xs overflow-hidden animate-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-[11px] text-zinc-400 font-bold">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Flag className="w-3.5 h-3.5" />
              <span>UNCLAIMED TERRITORIES ({unclaimedCount})</span>
            </span>
            <span>MIN BID</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-zinc-900 pr-1 mt-1 space-y-0.5">
            {unclaimed.map((t) => (
              <button
                key={t.countryCode}
                onClick={() => {
                  onSelectCountry(t.countryCode);
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between py-2 px-2 rounded-xl hover:bg-zinc-800/60 transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{t.flag}</span>
                  <div>
                    <div className="text-zinc-200 group-hover:text-white font-bold text-xs truncate max-w-[140px]">
                      {t.countryName}
                    </div>
                    <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                      {t.isOceanFleet ? (
                        <span className="text-emerald-400 font-bold">⚓ Trade Route</span>
                      ) : (
                        <span>{t.population} pop</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                    t.isOceanFleet
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-zinc-800 text-zinc-300'
                  }`}>
                    ${t.currentBid || (t.isOceanFleet ? 25 : 3)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Trigger Button Matching warmap.lol Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0e0e12]/90 hover:bg-[#14141a] backdrop-blur-md border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 text-xs font-mono font-black tracking-wider shadow-xl transition-all cursor-pointer select-none"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <Flag className="w-3.5 h-3.5 text-emerald-400" />
        <span>UNCLAIMED — {unclaimedCount || 60} LEFT</span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5 ml-1" /> : <ChevronUp className="w-3.5 h-3.5 ml-1" />}
      </button>
    </div>
  );
}
