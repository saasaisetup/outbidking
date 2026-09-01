'use client';

import React from 'react';
import Link from 'next/link';

export default function FAQPage() {
  const faqs = [
    {
      q: 'What is pinit.lol?',
      a: 'pinit.lol is an open, real-time attention market and 3D globe directory where indie hackers, AI builders, and creators stake on world countries to compete for #1 for 24 hours.'
    },
    {
      q: 'Do I have to live in the country I stake on?',
      a: 'No! Choosing a country is strategic. It is not an office location or targeted geographic ad. You can stake on Canada, Turkey, USA, India, or anywhere you want to claim your spotlight.'
    },
    {
      q: 'What do I receive when I stake on a country?',
      a: 'You get your product logo and link pinned to the 3D globe, featured in the live global activity feed, a dedicated permanent product page (/p/your-slug) with an indexable dofollow SEO backlink, and verified click analytics.'
    },
    {
      q: 'How does outbidding work?',
      a: 'If someone outbids you before your 24 hours expire, they take the #1 crown and your product moves to #2. You can top up your stake at any time to reclaim the throne.'
    },
    {
      q: 'What happens when 24 hours expire?',
      a: 'Your placement automatically graduates into the permanent Hall of Fame, preserving your backlinks and ranking history forever.'
    },
    {
      q: 'How does the Launch Offer work?',
      a: 'The first 100 country starts receive launch sponsorship credits. 94 free spots remain open for new builders.'
    }
  ];

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
          <h1 className="text-3xl font-extrabold tracking-tight">Frequently Asked Questions</h1>
          <p className="mt-1.5 text-sm text-[var(--pin-muted)]">
            Everything you need to know about staking, global visibility, and backlinks.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-pin-lg border border-[var(--pin-border)] bg-[var(--pin-card)] p-6 shadow-pin-sm"
            >
              <h2 className="text-base font-bold text-[var(--pin-ink)] mb-2">
                {faq.q}
              </h2>
              <p className="text-sm text-[var(--pin-muted)] leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
