'use client';

import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--pin-paper)] text-[var(--pin-ink)] p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
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

        <div className="mt-8">
          <h1 className="text-3xl font-extrabold tracking-tight">Terms of Service</h1>
          <p className="mt-1.5 text-sm text-[var(--pin-muted)]">
            Last updated: August 2026
          </p>
        </div>

        <div className="mt-8 space-y-6 text-sm text-[var(--pin-muted)] leading-relaxed">
          <section className="rounded-pin-lg border border-[var(--pin-border)] bg-[var(--pin-card)] p-6 shadow-pin-sm">
            <h2 className="text-base font-bold text-[var(--pin-ink)] mb-2">1. Terms of Staking</h2>
            <p>
              Staking amounts represent promotional placement fees for 24 hours of frontpage country board placement, followed by automatic graduation into the Hall of Fame.
            </p>
          </section>

          <section className="rounded-pin-lg border border-[var(--pin-border)] bg-[var(--pin-card)] p-6 shadow-pin-sm">
            <h2 className="text-base font-bold text-[var(--pin-ink)] mb-2">2. Acceptable Use</h2>
            <p>
              Submissions must be legitimate software, applications, creator portfolios, or community links. Spam, illegal content, or malicious sites will be removed immediately.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
