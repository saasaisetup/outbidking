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
    <div className="pointer-events-auto absolute right-3 bottom-14 z-40 w-84 max-w-[calc(100vw-1.5rem)] sm:right-6 sm:bottom-14 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="rounded-pin-lg border border-[var(--pin-border)] bg-[var(--pin-card)] p-4 shadow-pin-lg">
        {/* Header: Flag + Name + Close Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{country.flag}</span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--pin-muted)]">
              {country.code}
            </span>
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
            <div className="rounded-pin-md border border-[var(--pin-border)] bg-[var(--pin-paper)] p-3">
              {/* Leader Avatar, Name, Stake, and VISIT Button */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <img
                    src={country.currentLeader!.logo}
                    alt=""
                    className="h-8 w-8 rounded-full object-cover bg-white border border-[var(--pin-border)] shrink-0 shadow-xs"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/globe.svg';
                    }}
                  />
                  <div className="min-w-0">
                    <Link
                      href={`/p/${country.currentLeader!.id}`}
                      className="font-extrabold text-sm text-[var(--pin-ink)] hover:underline truncate block leading-tight"
                    >
                      {country.currentLeader!.name}
                    </Link>
                    <span className="text-[11px] font-bold text-[var(--pin-coral-ink)]">
                      ${country.currentLeader!.stake}
                    </span>
                  </div>
                </div>

                {/* Primary VISIT Website Button */}
                <a
                  href={country.currentLeader!.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-[var(--pin-coral)] hover:bg-[var(--pin-coral-ink)] text-white px-3 py-1.5 text-xs font-extrabold shadow-pin-coral transition-transform hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
                >
                  <span>VISIT</span>
                  <span>↗</span>
                </a>
              </div>

              {/* Tagline */}
              <p className="mt-2 text-xs text-[var(--pin-muted)] leading-tight">
                {country.currentLeader!.tagline}
              </p>

              {/* Expiration & Clicks */}
              <div className="mt-2 pt-2 border-t border-[var(--pin-border)] flex items-center justify-between text-[11px] text-[var(--pin-muted)]">
                <span>Expires in <strong className="text-[var(--pin-ink)]">{country.currentLeader!.expiresIn}</strong></span>
                <span className="font-bold text-emerald-600">{country.currentLeader!.clicks} clicks</span>
              </div>
            </div>
          ) : (
            <div className="p-2">
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
          className="mt-3.5 w-full rounded-full bg-[var(--pin-coral)] py-2.5 text-center text-sm font-bold text-white shadow-pin-coral outline-none transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          {isClaimed
            ? `Outbid ${country.currentLeader!.name} from $${minStake}`
            : `Pin ${country.name} from $1`}
        </button>

        {/* Deep Links */}
        <div className="mt-2 flex items-center justify-center gap-3 text-[11px] font-semibold text-[var(--pin-muted)]">
          <Link
            href={`/country/${country.slug}`}
            className="hover:text-[var(--pin-coral-ink)] hover:underline"
          >
            View {country.name} history →
          </Link>
          {isClaimed && (
            <>
              <span>·</span>
              <Link
                href={`/p/${country.currentLeader!.id}`}
                className="hover:text-[var(--pin-coral-ink)] hover:underline"
              >
                Product details →
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
