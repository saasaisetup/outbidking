'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { INITIAL_ACTIVITY, CATEGORIES_LIST } from '@/lib/pinitData';

export default function HallOfFamePage() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');

  const filtered = INITIAL_ACTIVITY.filter((item) => {
    const matchesCat = !selectedCategory || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !search ||
      item.productName.toLowerCase().includes(search.toLowerCase()) ||
      item.countryName.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[var(--pin-paper)] text-[var(--pin-ink)] p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
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

        {/* Page Title */}
        <div className="mt-8">
          <h1 className="text-3xl font-extrabold tracking-tight">Hall of Fame</h1>
          <p className="mt-1.5 text-sm text-[var(--pin-muted)]">
            Explore products that claimed #1 spots and staked their claim across world countries.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <input
            type="search"
            placeholder="Search products or countries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-full border border-[var(--pin-border-strong)] bg-white px-4 py-2 text-xs text-[var(--pin-ink)] placeholder:text-[var(--pin-muted)] focus:border-[var(--pin-coral)] focus:outline-none"
          />

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-full border border-[var(--pin-border-strong)] bg-white px-4 py-2 text-xs font-medium text-[var(--pin-ink)] focus:border-[var(--pin-coral)] focus:outline-none"
          >
            {CATEGORIES_LIST.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Placements List / Table */}
        <div className="mt-6 rounded-pin-lg border border-[var(--pin-border)] bg-[var(--pin-card)] overflow-hidden shadow-pin-lg">
          <div className="divide-y divide-[var(--pin-border)]">
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 hover:bg-[var(--pin-paper)] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.logo}
                      alt=""
                      className="h-9 w-9 rounded-full object-cover bg-white border border-[var(--pin-border)]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/globe.svg';
                      }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/p/${item.productSlug}`}
                          className="font-bold text-sm text-[var(--pin-ink)] hover:underline truncate"
                        >
                          {item.productName}
                        </Link>
                        {item.action === 'claimed' ? (
                          <span className="rounded-full bg-[var(--pin-gold-soft)] px-2 py-0.5 font-mono text-[10px] font-bold text-[var(--pin-gold-ink)]">
                            Active #1
                          </span>
                        ) : (
                          <span className="rounded-full bg-[var(--pin-paper)] px-2 py-0.5 font-mono text-[10px] font-bold text-[var(--pin-muted)]">
                            Hall of Fame
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-[var(--pin-muted)]">
                        <span>{item.countryFlag} {item.countryName}</span>
                        <span>·</span>
                        <span>{item.category}</span>
                        <span>·</span>
                        <span>{item.timeAgo}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-sm text-[var(--pin-ink)]">
                      ${item.stake}
                    </span>
                    <a
                      href={item.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-[var(--pin-coral-soft)] px-3 py-1 text-xs font-bold text-[var(--pin-coral-ink)] hover:bg-[var(--pin-coral)] hover:text-white transition-colors"
                    >
                      Visit ↗
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-sm text-[var(--pin-muted)]">
                No products found in this category.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
