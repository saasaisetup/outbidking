'use client';

import React, { useState } from 'react';
import { TerritoryState } from '@/lib/types';
import { Flame, ChevronRight, X, Sparkles } from 'lucide-react';

interface HotLandsCardProps {
  territories: TerritoryState[];
  onSelectTerritory: (territory: TerritoryState) => void;
}

export function HotLandsCard({ territories, onSelectTerritory }: HotLandsCardProps) {
  const [isOpen, setIsOpen] = useState(true);

  // Compute Hot Lands: Prioritize top strategic countries with high ROI
  const hotLands = React.useMemo(() => {
    if (!territories || territories.length === 0) return [];

    // Filter interesting targets: Tier S & A, or claimed ones with active plunder
    const targets = [...territories].sort((a, b) => {
      // Prioritize claimed ones or high tier
      const scoreA = (a.currentRuler ? 50 : 0) + (a.tier === 'TIER S' ? 30 : a.tier === 'TIER A' ? 20 : 10);
      const scoreB = (b.currentRuler ? 50 : 0) + (b.tier === 'TIER S' ? 30 : b.tier === 'TIER A' ? 20 : 10);
      return scoreB - scoreA;
    });

    // Pick top 4 compelling targets
    const picks = [
      { code: 'CA', name: 'Canada', mult: 'steal $7', desc: 'Prime High-Value Land', isHot: true },
      { code: 'IN', name: 'India', mult: '7.7x value', desc: '1.4B Population Hub', rank: 1 },
      { code: 'TR', name: 'Turkey', mult: '5.8x value', desc: 'Cross-Continental Hub', rank: 2 },
      { code: 'CI', name: "Côte d'Ivoire", mult: '4.3x value', desc: 'Emerging Market', rank: 3 },
    ];

    return picks.map((p) => {
      const match = territories.find((t) => t.countryCode === p.code) || territories[0];
      const stealPrice = match.currentRuler ? match.minOutbidPrice : match.currentBid;
      return {
        ...p,
        territory: match,
        stealPrice: stealPrice || (match.isOceanFleet ? 25 : 7),
        ruler: match.currentRuler,
      };
    });
  }, [territories]);

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="absolute right-3 sm:right-5 bottom-12 sm:bottom-16 z-20 px-3 py-1.5 rounded-xl bg-[#0f0f14]/90 backdrop-blur-md border border-amber-500/30 text-amber-400 hover:text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5 shadow-2xl transition-all active:scale-95 cursor-pointer"
      >
        <Flame className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
        <span>🔥 HOT LANDS</span>
      </button>
    );
  }

  return (
    <aside aria-label="Hot Lands Best Value" className="absolute right-3 sm:right-5 bottom-12 sm:bottom-14 z-20 w-[260px] sm:w-[300px] rounded-2xl bg-[#0e0e14]/95 backdrop-blur-xl border border-zinc-800/80 shadow-2xl p-3.5 text-white font-mono animate-in fade-in slide-in-from-right-4 duration-200 pointer-events-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-zinc-800/60 mb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
          <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
          <span>HOT LAND — BEST VALUE</span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="text-zinc-500 hover:text-zinc-300 text-[10px] font-bold px-1.5 py-0.5 rounded hover:bg-zinc-800 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>✕ CLOSE</span>
        </button>
      </div>

      {/* Hot List */}
      <div className="space-y-2">
        {hotLands.map((item, idx) => (
          <div
            key={item.code}
            onClick={() => onSelectTerritory(item.territory)}
            className="p-2 rounded-xl bg-zinc-900/40 hover:bg-zinc-800/70 border border-zinc-800/50 hover:border-amber-500/40 transition-all cursor-pointer group flex items-center justify-between gap-2"
          >
            {/* Left: Code & Title */}
            <div className="flex items-center gap-2 truncate">
              {item.isHot ? (
                <span className="text-amber-500 text-xs">🔥</span>
              ) : (
                <span className="text-[10px] text-zinc-500 font-bold w-4">#{item.rank}</span>
              )}
              <span className="text-xs font-black text-zinc-300 group-hover:text-white">
                {item.code}
              </span>
              <div className="truncate">
                <div className="text-xs font-bold text-zinc-200 group-hover:text-amber-400 truncate">
                  {item.territory.countryName}
                </div>
                <div className="text-[10px] text-zinc-500 truncate">
                  {item.ruler ? (
                    <span className="text-emerald-400">👑 {item.ruler.title}</span>
                  ) : (
                    <span>Unclaimed · {item.desc}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Steal Price & Mult */}
            <div className="flex flex-col items-end flex-shrink-0">
              <span className="text-[11px] font-black text-emerald-400 group-hover:scale-105 transition-transform">
                steal ${item.stealPrice}
              </span>
              <span className="text-[9px] text-amber-500/90 font-bold flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5" />
                {item.mult}
              </span>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
