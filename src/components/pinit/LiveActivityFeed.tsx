'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { INITIAL_ACTIVITY, CountryInfo, COUNTRIES_DATA } from '@/lib/pinitData';

interface LiveActivityFeedProps {
  onSelectCountry?: (country: CountryInfo) => void;
  isSidebarCollapsed?: boolean;
}

export function LiveActivityFeed({ onSelectCountry, isSidebarCollapsed }: LiveActivityFeedProps) {
  const [isFeedCollapsed, setIsFeedCollapsed] = useState(false);

  if (isSidebarCollapsed || isFeedCollapsed) {
    return (
      <aside className="pointer-events-none absolute left-3 bottom-12 z-20 hidden md:block md:bottom-12 md:left-4">
        <button
          type="button"
          onClick={() => setIsFeedCollapsed(false)}
          className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-[var(--pin-border)] bg-[var(--pin-card)] px-3 py-1.5 text-[11px] font-bold text-[var(--pin-ink)] shadow-pin-lg hover:border-[var(--pin-coral)] hover:text-[var(--pin-coral-ink)] transition-transform hover:scale-105 cursor-pointer"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>Live Activity ({INITIAL_ACTIVITY.length})</span>
        </button>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Live activity"
      className="pointer-events-none absolute left-3 bottom-12 z-20 hidden md:block md:bottom-12 md:left-4 w-76 animate-in fade-in duration-200"
    >
      <div className="pointer-events-auto max-h-56 overflow-y-auto overscroll-contain rounded-pin-lg border border-[var(--pin-border)] bg-[var(--pin-card)]/95 p-3 shadow-pin-lg backdrop-blur-sm">
        {/* Header with Minimize Button */}
        <div className="flex items-center justify-between pb-1.5 border-b border-[var(--pin-border)]">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-[var(--pin-muted)]">
              Live Activity
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsFeedCollapsed(true)}
            title="Minimize live activity feed"
            className="rounded p-0.5 text-[10px] text-[var(--pin-muted)] hover:text-[var(--pin-ink)] hover:bg-[var(--pin-paper)] cursor-pointer"
          >
            Hide ✕
          </button>
        </div>

        <div className="mt-1">
          <ul className="divide-y divide-[var(--pin-border)]">
            {INITIAL_ACTIVITY.map((item) => (
              <li key={item.id} className="py-2 text-xs">
                <div className="flex items-center gap-2">
                  <img
                    src={item.logo}
                    alt=""
                    className="h-4.5 w-4.5 shrink-0 rounded-full bg-[var(--pin-border)] object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/globe.svg';
                    }}
                  />
                  <Link
                    href={`/p/${item.productSlug}`}
                    className="min-w-0 flex-1 truncate font-semibold text-[var(--pin-ink)] hover:underline"
                  >
                    {item.productName}
                  </Link>

                  {item.isLaunchSponsored ? (
                    <span className="ml-auto shrink-0 rounded-full bg-[var(--pin-coral-soft)] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[var(--pin-coral-ink)]">
                      Sponsored
                    </span>
                  ) : (
                    <span className="ml-auto shrink-0 font-semibold text-[var(--pin-ink)]">
                      ${item.stake}
                    </span>
                  )}

                  <a
                    href={item.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${item.productName}`}
                    className="inline-flex shrink-0 items-center justify-center rounded-full p-0.5 text-[var(--pin-muted)] hover:text-[var(--pin-coral-ink)]"
                  >
                    <svg viewBox="0 0 20 20" width="10" height="10" fill="none">
                      <path
                        d="M8.5 5.5H14.5V11.5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14.5 5.5L7.25 12.75"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </a>
                </div>

                <div className="mt-0.5 flex flex-wrap items-center gap-x-1 pl-6 text-[10px] text-[var(--pin-muted)]">
                  <span>{item.action === 'claimed' ? 'claimed' : 'expired on'}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const country = COUNTRIES_DATA[item.countrySlug];
                      if (country && onSelectCountry) onSelectCountry(country);
                    }}
                    className="font-medium text-[var(--pin-ink)] hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>{item.countryFlag}</span>
                    <span>{item.countryName}</span>
                  </button>
                  <span className="ml-auto text-[10px]">{item.timeAgo}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
