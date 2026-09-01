'use client';

import React from 'react';

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export function ZoomControls({ onZoomIn, onZoomOut }: ZoomControlsProps) {
  return (
    <div className="pointer-events-auto absolute right-3 bottom-14 z-10 flex flex-col gap-1.5 sm:right-4 sm:bottom-14">
      <button
        type="button"
        onClick={onZoomIn}
        aria-label="Zoom in"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--pin-border)] bg-[var(--pin-card)] text-base font-bold text-[var(--pin-ink)] shadow-pin-sm hover:border-[var(--pin-coral)] hover:text-[var(--pin-coral-ink)] transition-colors cursor-pointer"
      >
        +
      </button>
      <button
        type="button"
        onClick={onZoomOut}
        aria-label="Zoom out"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--pin-border)] bg-[var(--pin-card)] text-base font-bold text-[var(--pin-ink)] shadow-pin-sm hover:border-[var(--pin-coral)] hover:text-[var(--pin-coral-ink)] transition-colors cursor-pointer"
      >
        −
      </button>
    </div>
  );
}
