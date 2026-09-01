'use client';

import React from 'react';
import Link from 'next/link';

interface LaunchOfferCardProps {
  onChooseCountry?: () => void;
}

export function LaunchOfferCard({ onChooseCountry }: LaunchOfferCardProps) {
  return (
    <div className="pointer-events-auto mt-2 hidden md:block w-60">
      <div
        data-testid="campaign-card"
        className="rounded-pin-lg border border-[var(--pin-border)] bg-[var(--pin-card)] shadow-pin-lg overflow-hidden"
      >
        {/* Card Header with Coral Pin Icon */}
        <div className="flex items-start gap-2 px-3 py-2.5 bg-white">
          <span className="mt-0.5 shrink-0">
            <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
              <path
                d="M10 17.5c-2.8-3.4-4.5-5.6-4.5-8a4.5 4.5 0 1 1 9 0c0 2.4-1.7 4.6-4.5 8Z"
                fill="var(--pin-coral)"
              />
              <circle cx="10" cy="9" r="1.7" fill="var(--pin-card)" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-extrabold tracking-tight text-[var(--pin-ink)]">Launch offer</p>
            <p className="mt-0.5 text-[11px] font-semibold text-[var(--pin-coral-ink)]">94 free spots left</p>
            {/* Progress Bar */}
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-[var(--pin-paper)]">
              <div
                className="h-full rounded-full bg-[var(--pin-coral)] transition-all duration-500"
                style={{ width: '6%' }}
              />
            </div>
          </div>
        </div>

        {/* Card Body Information */}
        <div className="border-t border-[var(--pin-border)] px-3 py-2.5 bg-[var(--pin-card)]/90">
          <p className="mb-2 text-[11px] text-[var(--pin-muted)]">6 of 100 free country starts claimed</p>
          <ul className="space-y-1 text-[11px] leading-relaxed text-[var(--pin-ink)]">
            <li>• New URLs receive up to $1 credit on paid placements</li>
            <li>• The $1 credit continues for 10 days after the free spots are claimed</li>
            <li>• One free launch placement per network</li>
          </ul>

          <button
            type="button"
            onClick={onChooseCountry}
            className="mt-2.5 block text-[11px] font-semibold text-[var(--pin-coral-ink)] hover:underline text-left cursor-pointer"
          >
            Choose a country →
          </button>

          <p className="mt-1.5 text-[11px] font-semibold text-[var(--pin-muted)]">
            <Link
              href="/rules"
              className="underline-offset-2 hover:underline hover:text-[var(--pin-ink)]"
            >
              Rules
            </Link>{' '}
            ·{' '}
            <Link
              href="/faq"
              className="underline-offset-2 hover:underline hover:text-[var(--pin-ink)]"
            >
              FAQ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
