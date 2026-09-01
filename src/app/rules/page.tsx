'use client';

import React from 'react';
import Link from 'next/link';

export default function RulesPage() {
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

        {/* Page Content */}
        <div className="mt-8">
          <h1 className="text-3xl font-extrabold tracking-tight">Game Rules & Mechanics</h1>
          <p className="mt-1.5 text-sm text-[var(--pin-muted)]">
            How staking, outbidding, and the 24-hour country clock work on pinit.lol.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <section className="rounded-pin-lg border border-[var(--pin-border)] bg-[var(--pin-card)] p-6 shadow-pin-sm">
            <h2 className="text-base font-bold text-[var(--pin-ink)] mb-2">
              1. The 24-Hour Country Board
            </h2>
            <p className="text-sm text-[var(--pin-muted)] leading-relaxed">
              When you stake on an unclaimed country (minimum $1), you immediately claim the #1 spot on that country for <strong>24 continuous hours</strong>.
              Your product logo and link appear on the 3D world globe and in the live global activity feed.
            </p>
          </section>

          <section className="rounded-pin-lg border border-[var(--pin-border)] bg-[var(--pin-card)] p-6 shadow-pin-sm">
            <h2 className="text-base font-bold text-[var(--pin-ink)] mb-2">
              2. Outbidding & Stealing #1
            </h2>
            <p className="text-sm text-[var(--pin-muted)] leading-relaxed">
              Any other builder can outbid you before your 24-hour clock expires by staking a higher amount (minimum +$1 increment).
              When outbid, your product moves down to #2 and stays on the country board until the round concludes.
            </p>
          </section>

          <section className="rounded-pin-lg border border-[var(--pin-border)] bg-[var(--pin-card)] p-6 shadow-pin-sm">
            <h2 className="text-base font-bold text-[var(--pin-ink)] mb-2">
              3. Permanent Hall of Fame & SEO Backlink
            </h2>
            <p className="text-sm text-[var(--pin-muted)] leading-relaxed">
              When the 24-hour period finishes, your product automatically moves into the <strong>Hall of Fame</strong> for that country.
              Every listing maintains a permanent, indexable dofollow backlink on its dedicated product page (e.g. <code>/p/your-product</code>).
            </p>
          </section>

          <section className="rounded-pin-lg border border-[var(--pin-border)] bg-[var(--pin-card)] p-6 shadow-pin-sm">
            <h2 className="text-base font-bold text-[var(--pin-ink)] mb-2">
              4. Strategic Country Selection
            </h2>
            <p className="text-sm text-[var(--pin-muted)] leading-relaxed">
              Selecting a country is purely strategic for game visibility and prestige. It does not represent an office location or physical restriction.
              You are free to stake on any sovereign nation across North America, Europe, Asia, Africa, or Oceania!
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
