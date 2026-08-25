'use client';

import React from 'react';
import { Loader2, Globe } from 'lucide-react';

interface MapSkeletonLoaderProps {
  isLoading?: boolean;
}

export function MapSkeletonLoader({ isLoading = true }: MapSkeletonLoaderProps) {
  if (!isLoading) return null;

  return (
    <div
      aria-label="Loading World Map Intel"
      className="absolute inset-0 z-40 bg-[#07070b]/95 backdrop-blur-md flex flex-col justify-center items-center overflow-hidden select-none pointer-events-none transition-opacity duration-300 animate-in fade-in"
    >
      {/* Background Matrix Grid */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#3f3f46 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Central High-Tech Telemetry Loader */}
      <div className="relative z-10 flex flex-col items-center gap-4 p-6 rounded-3xl bg-[#0e0e14]/90 border border-zinc-800/80 shadow-2xl backdrop-blur-xl">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin" />
          <Globe className="w-7 h-7 text-amber-400 absolute" />
        </div>

        <div className="flex flex-col items-center gap-1 font-mono text-center">
          <div className="flex items-center gap-2 text-xs font-black text-white tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>CALIBRATING SATELLITE INTEL</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Syncing 207 sovereign nations, islands & naval corridors...
          </p>
        </div>
      </div>
    </div>
  );
}
