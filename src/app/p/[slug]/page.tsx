'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { SAMPLE_PRODUCTS, getProductFavicon } from '@/lib/pinitData';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = use(params);

  // Fallback dynamic generation if not in dictionary
  const product = SAMPLE_PRODUCTS[slug] || {
    id: slug,
    slug,
    name: slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    tagline: 'High-growth indie product',
    url: `https://${slug.replace(/-/g, '')}.com`,
    logo: getProductFavicon(slug),
    category: 'SaaS',
    description: 'A fast-growing product launched and staked on the pinit.lol 3D world map.',
    launchDate: 'September 2026',
    totalStaked: 2,
    allTimeClicks: 54,
    countriesClaimed: [
      {
        countryName: 'Global',
        countryFlag: '🌍',
        countrySlug: 'canada',
        rank: 1,
        staked: 2,
        date: 'Recent',
        status: 'active' as const,
      }
    ],
  };

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

        {/* Product Profile Header Card */}
        <div className="mt-8 rounded-pin-lg border border-[var(--pin-border)] bg-[var(--pin-card)] p-6 sm:p-8 shadow-pin-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={product.logo}
                alt=""
                className="h-16 w-16 rounded-2xl object-cover border border-[var(--pin-border)] p-1 bg-white shadow-sm shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/globe.svg';
                }}
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-extrabold tracking-tight">
                    {product.name}
                  </h1>
                  <span className="rounded-full bg-[var(--pin-paper)] border border-[var(--pin-border)] px-2.5 py-0.5 text-xs font-semibold text-[var(--pin-muted)]">
                    {product.category}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--pin-muted)] font-medium">
                  {product.tagline}
                </p>
              </div>
            </div>

            {/* Prominent Visit Website Button */}
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--pin-coral)] px-6 py-2.5 text-xs font-extrabold text-white shadow-pin-coral hover:bg-[var(--pin-coral-ink)] transition-transform hover:scale-105 cursor-pointer shrink-0"
            >
              <span>Visit Website</span>
              <span>↗</span>
            </a>
          </div>

          <div className="mt-6 pt-6 border-t border-[var(--pin-border)]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--pin-muted)] mb-2">
              About Product
            </h2>
            <p className="text-sm text-[var(--pin-ink)] leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-[var(--pin-border)] pt-6 text-center sm:text-left">
            <div>
              <div className="text-xl font-extrabold text-[var(--pin-ink)]">
                ${product.totalStaked}
              </div>
              <div className="text-[10px] uppercase font-bold text-[var(--pin-muted)]">
                Total Staked
              </div>
            </div>
            <div>
              <div className="text-xl font-extrabold text-emerald-600">
                {product.allTimeClicks}
              </div>
              <div className="text-[10px] uppercase font-bold text-[var(--pin-muted)]">
                Clicks Delivered
              </div>
            </div>
            <div>
              <div className="text-xl font-extrabold text-[var(--pin-ink)]">
                {product.countriesClaimed.length || 1}
              </div>
              <div className="text-[10px] uppercase font-bold text-[var(--pin-muted)]">
                Countries Ruled
              </div>
            </div>
          </div>
        </div>

        {/* Territory History */}
        <div className="mt-8">
          <h2 className="text-base font-bold text-[var(--pin-ink)] mb-4">
            Country Placements & Rankings
          </h2>

          <div className="rounded-pin-lg border border-[var(--pin-border)] bg-[var(--pin-card)] overflow-hidden shadow-pin-sm divide-y divide-[var(--pin-border)]">
            {product.countriesClaimed.length > 0 ? (
              product.countriesClaimed.map((c, i) => (
                <div key={i} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{c.countryFlag}</span>
                    <div>
                      <Link
                        href={`/country/${c.countrySlug}`}
                        className="font-bold text-sm text-[var(--pin-ink)] hover:underline"
                      >
                        {c.countryName}
                      </Link>
                      <div className="text-[11px] text-[var(--pin-muted)]">
                        Rank #{c.rank} · {c.date}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[var(--pin-gold-soft)] px-2.5 py-0.5 text-xs font-bold text-[var(--pin-gold-ink)]">
                      👑 ${c.staked}
                    </span>
                    <Link
                      href={`/country/${c.countrySlug}`}
                      className="rounded-full bg-[var(--pin-coral-soft)] px-3 py-1 text-xs font-bold text-[var(--pin-coral-ink)] hover:bg-[var(--pin-coral)] hover:text-white transition-colors"
                    >
                      View on Globe →
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-[var(--pin-muted)]">
                Active in global directory history.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
