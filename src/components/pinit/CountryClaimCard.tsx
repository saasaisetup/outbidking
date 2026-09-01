'use client';

import React from 'react';
import Link from 'next/link';
import { CountryInfo } from '@/lib/pinitData';

interface CountryClaimCardProps {
  country: CountryInfo;
  onClose: () => void;
  onClaim: (country: CountryInfo) => void;
}

export function CountryClaimCard({
  country,
  onClose,
  onClaim,
}: CountryClaimCardProps) {
  const isClaimed = !!country.currentLeader;
  const minStake = isClaimed ? country.currentLeader!.stake + 1 : 1;

  return (
    <div className="pointer-events-auto absolute right-3 bottom-14 z-30 w-80 md:right-6 md:bottom-14 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="rounded-pin-lg border border-[var(--pin-border)] bg-[var(--pin-card)] p-4 shadow-pin-lg">
        {/* Header: Flag + Code + Name + Close Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--pin-muted)]">
              {country.code}
            </span>
            <span className="text-base">{country.flag}</span>
            <h3 className="font-extrabold text-base text-[var(--pin-ink)]">
              {country.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close country details"
            className="rounded-full p-1 text-[var(--pin-muted)] hover:bg-[var(--pin-paper)] hover:text-[var(--pin-ink)] transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-3">
          {isClaimed ? (
            <div className="rounded-pin-md border border-[var(--pin-border)] bg-[var(--pin-paper)] p-2.5">
              <div className="flex items-center gap-2">
                <img
                  src={country.currentLeader!.logo}
                  alt=""
                  className="h-7 w-7 rounded-full object-cover bg-white border border-[var(--pin-border)]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/globe.svg';
                  }}
                />
                <div className="min-w-0 flex-1 truncate font-bold text-xs text-[var(--pin-ink)]">
                  {country.currentLeader!.name}
                </div>
                <div className="font-extrabold text-xs text-[var(--pin-coral-ink)]">
                  ${country.currentLeader!.stake}
                </div>
              </div>
              <p className="mt-1 text-[11px] text-[var(--pin-muted)] truncate">
                {country.currentLeader!.tagline}
              </p>
              <div className="mt-1 flex items-center justify-between text-[10px] text-[var(--pin-muted)]">
                <span>Expires in {country.currentLeader!.expiresIn}</span>
                <span className="text-[var(--pin-coral-ink)] font-semibold">{country.currentLeader!.clicks} clicks</span>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xs text-[var(--pin-muted)]">Nobody owns the board yet.</p>
              <p className="mt-1 text-xs font-semibold text-[var(--pin-ink)]">
                Starting stake: <span className="font-bold text-[var(--pin-coral-ink)]">$1</span>
              </p>
            </div>
          )}
        </div>

        {/* Action Button: Pin / Outbid */}
        <button
          type="button"
          onClick={() => onClaim(country)}
          className="mt-4 w-full rounded-full bg-[var(--pin-coral)] py-2.5 text-center text-sm font-bold text-white shadow-pin-coral outline-none transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          {isClaimed
            ? `Outbid ${country.currentLeader!.name} from $${minStake}`
            : `Pin ${country.name} from $1`}
        </button>

        {/* Deep Link to Country Page */}
        <div className="mt-2 text-center">
          <Link
            href={`/country/${country.slug}`}
            className="text-[11px] font-semibold text-[var(--pin-muted)] hover:text-[var(--pin-coral-ink)] hover:underline"
          >
            View {country.name} history →
          </Link>
        </div>
      </div>
    </div>
  );
}
