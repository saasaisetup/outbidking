'use client';

import React, { useState } from 'react';
import { WorldPower, WarEvent } from '@/lib/types';
import { Crown, ExternalLink, Flame, Shield, ChevronDown, ChevronUp, EyeOff, Eye } from 'lucide-react';

interface WorldPowersDrawerProps {
  powers: WorldPower[];
  warEvents: WarEvent[];
  onSelectCountry?: (countryCode: string) => void;
}

export function WorldPowersDrawer({
  powers,
  warEvents,
  onSelectCountry,
}: WorldPowersDrawerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFeedCollapsed, setIsFeedCollapsed] = useState(false);

  return (
    <aside aria-label="World Powers and War Intel" className="absolute left-3 sm:left-5 top-16 sm:top-20 z-20 flex flex-col gap-3 max-w-[280px] sm:max-w-[320px] pointer-events-none">
      {/* Visibility Toggle Button */}
      <button
        type="button"
        onClick={() => setIsVisible(!isVisible)}
        className="pointer-events-auto self-start px-2.5 py-1 rounded-lg bg-[#0d0d11]/90 backdrop-blur-md border border-zinc-800 text-[11px] font-mono text-zinc-400 hover:text-white flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
      >
        {isVisible ? (
          <>
            <EyeOff className="w-3 h-3 text-[#ea6c52]" />
            <span>HIDE INTEL</span>
          </>
        ) : (
          <>
            <Eye className="w-3 h-3 text-[#ea6c52]" />
            <span>⚡ WAR REPORT</span>
          </>
        )}
      </button>

      {isVisible && (
        <div className="flex flex-col gap-3 pointer-events-auto animate-in fade-in slide-in-from-left-4 duration-200">
          {/* 1. Live War Activity Stream (Top Left) */}
          <div className="rounded-2xl bg-[#0e0e12]/95 backdrop-blur-md border border-zinc-800/80 shadow-2xl p-3 text-white">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60 mb-2">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ea6c52] animate-ping" />
                <span>LIVE WAR STREAM</span>
              </div>
              <button
                type="button"
                onClick={() => setIsFeedCollapsed(!isFeedCollapsed)}
                className="text-zinc-500 hover:text-zinc-300 p-0.5 cursor-pointer"
              >
                {isFeedCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
            </div>

            {!isFeedCollapsed && (
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 text-xs font-mono scrollbar-thin">
                {warEvents.slice(0, 4).map((we) => (
                  <div
                    key={we.id}
                    onClick={() => onSelectCountry && onSelectCountry(we.countryCode)}
                    className="flex items-center justify-between p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-[11px] font-bold text-zinc-400">{we.countryCode}</span>
                      <span className="font-bold text-zinc-100 truncate group-hover:text-[#ea6c52]">
                        {we.rulerTitle}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                      <span className="font-extrabold text-[#ea6c52]">${we.amount}</span>
                      <span className="text-[10px] text-zinc-500">{we.timestamp}</span>
                      <ExternalLink className="w-2.5 h-2.5 text-zinc-500 group-hover:text-zinc-300" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. World Powers Leaderboard (Bottom Left) */}
          <div className="rounded-2xl bg-[#0e0e12]/95 backdrop-blur-md border border-zinc-800/80 shadow-2xl p-3 text-white">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800/60 mb-2">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider text-zinc-300">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>WORLD POWERS</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">BY PLUNDER</span>
            </div>

            <div className="space-y-1 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
              {powers.slice(0, 8).map((power) => (
                <div
                  key={power.rank}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                  onClick={() => power.countries[0] && onSelectCountry && onSelectCountry(power.countries[0])}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {/* Rank Badge */}
                    <div className="w-5 text-center flex-shrink-0">
                      {power.rank === 1 ? (
                        <Crown className="w-4 h-4 text-amber-400 fill-amber-400 inline" />
                      ) : (
                        <span className="font-mono text-xs font-bold text-zinc-500">{power.rank}</span>
                      )}
                    </div>

                    {/* Empire Color dot & Title */}
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: power.color }}
                    />
                    <div className="truncate">
                      <p className="text-xs font-bold text-zinc-200 truncate group-hover:text-[#ea6c52]">
                        {power.title}
                      </p>
                      <p className="text-[10px] font-mono text-zinc-500">
                        {power.territoriesCount} {power.territoriesCount === 1 ? 'territory' : 'territories'}
                      </p>
                    </div>
                  </div>

                  {/* Total Plunder */}
                  <div className="font-mono font-black text-xs text-[#ea6c52] flex-shrink-0 ml-2">
                    ${power.totalPlunder.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
