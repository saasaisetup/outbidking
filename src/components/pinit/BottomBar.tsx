'use client';

import React from 'react';
import Link from 'next/link';

interface BottomBarProps {
  isLightMode?: boolean;
}

export function BottomBar({ isLightMode = false }: BottomBarProps) {
  return (
    <div className="fixed bottom-3 inset-x-0 z-30 flex flex-col items-center gap-1.5 pointer-events-none">
      {/* Micro Interaction Hint */}
      <div className="flex items-center gap-2 text-[10px] font-mono tracking-wider font-extrabold text-amber-500 drop-shadow-md">
        <span>● DRAG TO SPIN / PAN</span>
        <span className="opacity-40">·</span>
        <span>SCROLL TO ZOOM</span>
        <span className="opacity-40">·</span>
        <span className="text-yellow-400">TAP A COUNTRY</span>
      </div>

      {/* Navigation Links Pill */}
      <div className={`flex items-center gap-2.5 rounded-full border px-4 py-1 text-xs backdrop-blur-md shadow-pin-sm pointer-events-auto transition-all ${
        isLightMode
          ? 'border-[#e6dfd1] bg-white/95 text-slate-800'
          : 'border-[#1e293b] bg-[#0b0f19]/95 text-[#94a3b8]'
      }`}>
        <a
          href="https://indietools.lol"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#ff5722] font-semibold transition-colors cursor-pointer"
        >
          IndieTools
        </a>
        <span className="opacity-30">·</span>
        <a
          href="https://x.com/shipxankit"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[#ff5722] font-semibold transition-colors cursor-pointer"
        >
          𝕏
        </a>
        <span className="opacity-30">·</span>
        <Link
          href="/hall-of-fame"
          className="font-extrabold text-[#ff7043] hover:underline"
        >
          Hall of Fame
        </Link>
        <span className="opacity-30">·</span>
        <Link
          href="/categories"
          className="hover:text-[#ff5722] font-semibold transition-colors"
        >
          Categories
        </Link>
      </div>
    </div>
  );
}
