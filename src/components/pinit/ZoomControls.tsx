'use client';

import React from 'react';

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  isLightMode?: boolean;
}

export function ZoomControls({ onZoomIn, onZoomOut, isLightMode = false }: ZoomControlsProps) {
  return (
    <div className="pointer-events-auto fixed right-3 bottom-14 z-40 flex flex-col gap-2 sm:right-4 sm:bottom-14">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onZoomIn();
        }}
        aria-label="Zoom in"
        title="Zoom In"
        className={`flex h-10 w-10 items-center justify-center rounded-full border text-lg font-black shadow-2xl backdrop-blur-md transition-all active:scale-90 cursor-pointer ${
          isLightMode
            ? 'border-[#e6dfd1] bg-white/95 text-slate-800 hover:bg-slate-100 hover:border-slate-400'
            : 'border-[#1e293b] bg-[#0b0f19]/95 text-white hover:border-[#ff5722] hover:text-[#ff7043]'
        }`}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onZoomOut();
        }}
        aria-label="Zoom out"
        title="Zoom Out"
        className={`flex h-10 w-10 items-center justify-center rounded-full border text-lg font-black shadow-2xl backdrop-blur-md transition-all active:scale-90 cursor-pointer ${
          isLightMode
            ? 'border-[#e6dfd1] bg-white/95 text-slate-800 hover:bg-slate-100 hover:border-slate-400'
            : 'border-[#1e293b] bg-[#0b0f19]/95 text-white hover:border-[#ff5722] hover:text-[#ff7043]'
        }`}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>
  );
}
