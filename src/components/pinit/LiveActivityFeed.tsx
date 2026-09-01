'use client';

import React from 'react';
import Link from 'next/link';
import { INITIAL_ACTIVITY, ActivityItem, CountryInfo, COUNTRIES_DATA } from '@/lib/pinitData';

interface LiveActivityFeedProps {
  onSelectCountry?: (country: CountryInfo) => void;
}

export function LiveActivityFeed({ onSelectCountry }: LiveActivityFeedProps) {
  return (
    <aside
      aria-label="Live activity"
      className="pointer-events-none absolute left-3 bottom-12 z-10 hidden w-80 md:block md:bottom-12 md:left-4"
    >
      <div className="pointer-events-auto max-h-64 overflow-y-auto overscroll-contain rounded-pin-lg border border-[var(--pin-border)] bg-[var(--pin-card)]/95 p-3.5 shadow-pin-lg backdrop-blur-sm">
        <h2 className="text-[10px] font-bold uppercase tracking-wide text-[var(--pin-muted)]">
          Live activity
        </h2>

        <div className="mt-1.5">
          <ul className="divide-y divide-[var(--pin-border)]">
            {INITIAL_ACTIVITY.map((item) => (
              <li key={item.id} className="py-2.5 text-sm">
                {/* Product Name + Stake/Badge + External Visit Link */}
                <div className="flex items-center gap-2">
                  <img
                    src={item.logo}
                    alt=""
                    className="h-5 w-5 shrink-0 rounded-full bg-[var(--pin-border)] object-cover"
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
                    <span className="ml-auto shrink-0 rounded-full bg-[var(--pin-coral-soft)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--pin-coral-ink)]">
                      Launch-sponsored
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
                    className="inline-flex shrink-0 items-center justify-center rounded-full p-1 text-[var(--pin-muted)] transition-colors hover:bg-[var(--pin-coral-soft)] hover:text-[var(--pin-coral-ink)]"
                  >
                    <svg viewBox="0 0 20 20" width="12" height="12" fill="none" aria-hidden="true">
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
                      <path
                        d="M11.75 5.5H6.5A1 1 0 0 0 5.5 6.5V13.5A1 1 0 0 0 6.5 14.5H13.5A1 1 0 0 0 14.5 13.5V9"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>

                {/* Subtext: Status, Country, Category, Time */}
                <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 pl-7 text-xs text-[var(--pin-muted)]">
                  {item.action === 'claimed' ? (
                    <span className="shrink-0 rounded-full bg-[var(--pin-gold-soft)] px-1.5 py-0.5 font-mono text-[10px] font-bold text-[var(--pin-gold-ink)]">
                      #1
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-full bg-[var(--pin-paper)] px-1.5 py-0.5 font-mono text-[10px] font-bold text-[var(--pin-muted)]">
                      was #1
                    </span>
                  )}

                  <span>{item.action === 'claimed' ? 'claimed' : 'expired into the Hall of Fame from'}</span>

                  <button
                    type="button"
                    onClick={() => {
                      const country = COUNTRIES_DATA[item.countrySlug];
                      if (country && onSelectCountry) onSelectCountry(country);
                    }}
                    className="font-medium text-[var(--pin-ink)] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>{item.countryFlag}</span>
                    <span>{item.countryName}</span>
                  </button>

                  <span className="shrink-0 text-[11px] text-[var(--pin-muted)]">
                    {item.category}
                  </span>

                  <span className="ml-auto shrink-0 text-[11px] text-[var(--pin-muted)]">
                    {item.timeAgo}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
