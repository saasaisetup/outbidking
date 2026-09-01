'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { COUNTRIES_DATA, INITIAL_ACTIVITY } from '@/lib/pinitData';
import { StakeModal } from '@/components/pinit/StakeModal';

interface CountryPageProps {
  params: Promise<{ slug: string }>;
}

export default function CountryDetailPage({ params }: CountryPageProps) {
  const { slug } = use(params);
  const country = COUNTRIES_DATA[slug] || {
    id: 'unknown',
    slug,
    name: slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    code: slug.slice(0, 2).toUpperCase(),
    flag: '🌍',
    coordinates: [0, 0] as [number, number],
    color: '#e1bee7',
  };

  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
  const isClaimed = !!country.currentLeader;
  const minStake = isClaimed ? country.currentLeader!.stake + 1 : 1;

  // Recent history for this country
  const countryHistory = INITIAL_ACTIVITY.filter(
    (a) => a.countrySlug.toLowerCase() === slug.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-[var(--pin-paper)] text-[var(--pin-ink)] p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Navigation Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[var(--pin-border)]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[var(--pin-coral-ink)] hover:underline"
          >
            ← Back to Globe
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-extrabold text-[var(--pin-ink)]"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-[var(--pin-ink)] text-[var(--pin-coral)]">
              <svg viewBox="0 0 100 100" width="12" height="12" fill="currentColor">
                <path d="M20,8 L42,8 L82,32 L42,56 L42,92 L20,92 Z" />
              </svg>
            </span>
            <span>pinit.lol</span>
          </Link>
        </div>

        {/* Country Header */}
        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{country.flag}</span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {country.name}
                </h1>
                <span className="rounded-full bg-[var(--pin-paper)] border border-[var(--pin-border)] px-2.5 py-0.5 font-mono text-xs font-bold text-[var(--pin-muted)]">
                  {country.code}
                </span>
              </div>
              <p className="text-xs text-[var(--pin-muted)] mt-1">
                {isClaimed
                  ? `Active #1 Placement · Expires in ${country.currentLeader!.expiresIn}`
                  : 'Unclaimed territory · Stake $1 to claim #1'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsStakeModalOpen(true)}
            className="rounded-full bg-[var(--pin-coral)] px-5 py-2.5 text-xs font-bold text-white shadow-pin-coral hover:bg-[var(--pin-coral-ink)] transition-transform hover:scale-105 cursor-pointer"
          >
            {isClaimed ? `Outbid from $${minStake}` : `Claim ${country.name} from $1`}
          </button>
        </div>

        {/* Current Leader Spotlight Card */}
        {isClaimed && (
          <div className="mt-8 rounded-pin-lg border border-[var(--pin-border)] bg-[var(--pin-card)] p-6 shadow-pin-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={country.currentLeader!.logo}
                  alt=""
                  className="h-12 w-12 rounded-full object-cover border border-[var(--pin-border)]"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-[var(--pin-ink)]">
                      {country.currentLeader!.name}
                    </h2>
                    <span className="rounded-full bg-[var(--pin-gold-soft)] px-2.5 py-0.5 font-mono text-xs font-bold text-[var(--pin-gold-ink)]">
                      👑 Reigning #1
                    </span>
                  </div>
                  <p className="text-xs text-[var(--pin-muted)] mt-0.5">
                    {country.currentLeader!.tagline}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl font-extrabold text-[var(--pin-ink)]">
                  ${country.currentLeader!.stake}
                </div>
                <div className="text-xs text-[var(--pin-muted)]">Current Stake</div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--pin-border)] flex items-center justify-between text-xs text-[var(--pin-muted)]">
              <span>Category: <strong className="text-[var(--pin-ink)]">{country.currentLeader!.category}</strong></span>
              <span>Expires in: <strong className="text-[var(--pin-coral-ink)]">{country.currentLeader!.expiresIn}</strong></span>
              <a
                href={country.currentLeader!.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[var(--pin-coral-ink)] hover:underline"
              >
                Visit Website ↗
              </a>
            </div>
          </div>
        )}

        {/* Country History / Hall of Fame Alumni */}
        <div className="mt-10">
          <h3 className="text-base font-bold text-[var(--pin-ink)] mb-4">
            {country.name} Hall of Fame Alumni
          </h3>

          <div className="rounded-pin-lg border border-[var(--pin-border)] bg-[var(--pin-card)] overflow-hidden shadow-pin-sm divide-y divide-[var(--pin-border)]">
            {countryHistory.length > 0 ? (
              countryHistory.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.logo}
                      alt=""
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <div>
                      <Link
                        href={`/p/${item.productSlug}`}
                        className="font-bold text-xs text-[var(--pin-ink)] hover:underline"
                      >
                        {item.productName}
                      </Link>
                      <div className="text-[11px] text-[var(--pin-muted)]">
                        {item.category} · {item.timeAgo}
                      </div>
                    </div>
                  </div>

                  <span className="font-extrabold text-xs text-[var(--pin-ink)]">
                    ${item.stake}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-[var(--pin-muted)]">
                No past expired placements yet for {country.name}. Be the first to stake!
              </div>
            )}
          </div>
        </div>
      </div>

      {isStakeModalOpen && (
        <StakeModal
          country={country}
          onClose={() => setIsStakeModalOpen(false)}
          onSuccess={(slug, placement) => {
            country.currentLeader = placement;
          }}
        />
      )}
    </div>
  );
}
