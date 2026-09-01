'use client';

import React from 'react';
import Link from 'next/link';
import { COUNTRIES_DATA, CountryInfo } from '@/lib/pinitData';

interface GlobalStatsCardProps {
  onSelectCountry: (country: CountryInfo) => void;
}

export function GlobalStatsCard({ onSelectCountry }: GlobalStatsCardProps) {
  const canadaInfo = COUNTRIES_DATA['canada'];

  return (
    <aside
      aria-label="Global stats"
      className="pointer-events-none absolute right-3 top-3 z-10 hidden w-60 md:block md:right-4 md:top-4"
    >
      <div className="pointer-events-auto rounded-pin-lg border border-[var(--pin-border)] bg-[var(--pin-card)]/95 p-3.5 shadow-pin-lg backdrop-blur-sm">
        <h2 className="sr-only">Global stats</h2>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
          <div>
            <div className="text-base font-extrabold text-[var(--pin-ink)]">1</div>
            <div className="text-[10px] leading-tight font-medium uppercase tracking-wide text-[var(--pin-muted)]">
              country active
            </div>
          </div>
          <div>
            <div className="text-base font-extrabold text-[var(--pin-ink)]">1</div>
            <div className="text-[10px] leading-tight font-medium uppercase tracking-wide text-[var(--pin-muted)]">
              active placement
            </div>
          </div>
          <div>
            <div className="text-base font-extrabold text-[var(--pin-ink)]">$0</div>
            <div className="text-[10px] leading-tight font-medium uppercase tracking-wide text-[var(--pin-muted)]">
              staked now
            </div>
          </div>
          <div>
            <div className="text-base font-extrabold text-[var(--pin-ink)]">11</div>
            <div className="text-[10px] leading-tight font-medium uppercase tracking-wide text-[var(--pin-muted)]">
              all-time placements
            </div>
          </div>
        </div>

        {/* Trending Section */}
        <div className="mt-3 border-t border-[var(--pin-border)] pt-3">
          <h3 className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-[var(--pin-muted)]">
            Trending
          </h3>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => canadaInfo && onSelectCountry(canadaInfo)}
              title="Canada: 1 bid · #1 outoutbid.lol — every outbid.lol clone, in one directory"
              className="inline-flex max-w-32 items-center gap-1.5 rounded-full border border-[var(--pin-border)] bg-[var(--pin-paper)] px-2.5 py-1 text-[11px] font-medium text-[var(--pin-ink)] transition-colors hover:border-[var(--pin-coral)] cursor-pointer"
            >
              <span aria-hidden="true">🇨🇦</span>
              <span className="truncate font-semibold">Canada</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
