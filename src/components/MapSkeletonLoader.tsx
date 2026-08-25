'use client';

import React from 'react';
import { Loader2, Radio } from 'lucide-react';

interface MapSkeletonLoaderProps {
  isLoading?: boolean;
}

export function MapSkeletonLoader({ isLoading = true }: MapSkeletonLoaderProps) {
  if (!isLoading) return null;

  return (
    <div
      aria-label="Loading World War Map"
      className="absolute inset-0 z-40 bg-[#020b08] flex flex-col justify-between overflow-hidden select-none pointer-events-none animate-in fade-in duration-300"
      style={{
        backgroundImage: `radial-gradient(#064e3b 1px, transparent 1px), radial-gradient(#047857 0.5px, #020b08 0.5px)`,
        backgroundSize: '32px 32px, 16px 16px',
        backgroundPosition: '0 0, 16px 16px',
      }}
    >
      {/* Top Header Skeleton Bar */}
      <header className="w-full h-12 bg-[#03150e]/90 border-b border-[#064e3b]/60 px-4 sm:px-6 flex items-center justify-between backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-sm text-[#ea6c52] tracking-wider">WARMAP</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/60 font-bold animate-pulse">WAR</span>
          </div>
          <span className="text-zinc-600 hidden md:inline">|</span>
          <div className="hidden md:flex items-center gap-4 text-[11px] font-mono text-emerald-500/80">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              SATELLITE INTEL CONNECTING...
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#052417] border border-emerald-800/60 text-emerald-400 text-xs font-mono">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>CALIBRATING SATELLITES</span>
          </div>
        </div>
      </header>

      {/* Main Map Body Skeleton matching media_1787680718177.png */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center p-4 sm:p-8">
        {/* Radar Scanning Line Effect */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(16, 185, 129, 0.15) 50%, transparent 100%)',
            animation: 'radarSweep 3.5s ease-in-out infinite',
          }}
        />

        {/* Tactical War Report Card (Top Left) */}
        <div className="absolute top-6 left-6 w-72 sm:w-80 p-4 rounded-xl bg-[#03150e]/90 border border-emerald-900/80 shadow-2xl backdrop-blur-md hidden sm:block">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold tracking-wider text-emerald-400 uppercase">
              WAR REPORT
            </span>
          </div>
          <p className="text-xs font-mono text-emerald-300/80 leading-relaxed">
            No blood spilled yet. The whole map is up for grabs.
          </p>
        </div>

        {/* Center Green Silhouette SVG matching user's uploaded green placeholder */}
        <div className="w-full max-w-5xl opacity-40 animate-pulse transition-opacity">
          <svg viewBox="0 0 1000 500" className="w-full h-auto drop-shadow-[0_0_20px_rgba(5,150,105,0.2)]">
            {/* North America */}
            <path
              d="M 120 100 Q 180 80 250 90 Q 280 130 250 180 Q 210 220 180 260 L 140 200 Z"
              fill="#062d1f"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            {/* Greenland */}
            <path
              d="M 330 50 Q 370 40 400 70 Q 380 110 340 100 Z"
              fill="#062d1f"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            {/* South America */}
            <path
              d="M 230 270 Q 290 280 320 330 Q 300 420 250 450 Q 220 380 210 320 Z"
              fill="#062d1f"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            {/* Europe */}
            <path
              d="M 440 90 Q 520 80 550 120 Q 520 160 460 160 Q 430 130 440 90 Z"
              fill="#062d1f"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            {/* Africa */}
            <path
              d="M 440 180 Q 530 180 560 240 Q 540 340 490 380 Q 430 320 420 230 Z"
              fill="#062d1f"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            {/* Asia & Russia */}
            <path
              d="M 540 80 Q 750 60 880 100 Q 850 200 750 240 Q 620 250 560 180 Z"
              fill="#062d1f"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            {/* Australia */}
            <path
              d="M 760 320 Q 860 320 880 380 Q 840 430 780 420 Q 740 370 760 320 Z"
              fill="#062d1f"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            {/* Antarctica */}
            <path
              d="M 150 480 Q 500 460 850 480 L 850 495 L 150 495 Z"
              fill="#062d1f"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />

            {/* Ocean Fleet Nodes matching screenshot */}
            <g transform="translate(100, 200)">
              <circle cx="0" cy="0" r="14" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="0" y="4" textAnchor="middle" fontSize="10">🚢</text>
            </g>
            <g transform="translate(350, 210)">
              <circle cx="0" cy="0" r="14" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="0" y="4" textAnchor="middle" fontSize="10">⚓</text>
            </g>
            <g transform="translate(680, 320)">
              <circle cx="0" cy="0" r="14" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="0" y="4" textAnchor="middle" fontSize="10">⚓</text>
            </g>
            <g transform="translate(920, 230)">
              <circle cx="0" cy="0" r="14" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="0" y="4" textAnchor="middle" fontSize="10">🛳️</text>
            </g>
          </svg>
        </div>

        {/* Center Calibration Spinner */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Radio className="w-6 h-6 text-emerald-400 animate-pulse" />
            </div>
          </div>
          <p className="text-xs font-mono text-emerald-400/90 font-bold tracking-widest uppercase">
            LOADING REAL-TIME SATELLITE INTEL
          </p>
        </div>

        {/* Bottom Right Unclaimed Box */}
        <div className="absolute bottom-6 right-6 w-72 p-4 rounded-xl bg-[#03150e]/90 border border-emerald-900/80 shadow-2xl backdrop-blur-md hidden sm:block">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono font-bold text-emerald-400">UNCLAIMED LAND</span>
            <span className="text-[10px] font-mono font-bold text-emerald-400/80">194 LEFT</span>
          </div>
          <p className="text-[11px] font-mono text-emerald-300/70">
            🔥 Every country is open. Claim your sovereign land starting at $1.
          </p>
        </div>
      </div>

      {/* Bottom Status Ticker */}
      <footer className="w-full h-8 bg-[#03150e]/90 border-t border-[#064e3b]/60 px-4 flex items-center justify-between text-[11px] font-mono text-emerald-500/70">
        <span>• DRAG TO PAN • SCROLL TO ZOOM • TAP A COUNTRY TO CONQUER</span>
        <span className="text-emerald-400 font-bold">100% LIVE REAL-TIME DATA</span>
      </footer>

      {/* Radar Animation Keyframes */}
      <style jsx>{`
        @keyframes radarSweep {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 0.35; }
          100% { transform: translateY(100%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
