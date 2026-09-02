'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SAMPLE_PRODUCTS, CATEGORIES_LIST } from '@/lib/pinitData';

export default function HallOfFamePage() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLightMode, setIsLightMode] = useState(false);

  const allProducts = Object.values(SAMPLE_PRODUCTS).sort((a, b) => b.totalStaked - a.totalStaked);

  const filteredProducts = selectedCategory
    ? allProducts.filter((p) => {
        const cat = CATEGORIES_LIST.find((c) => c.value === selectedCategory);
        return cat && p.category.toLowerCase().includes(cat.label.replace(/^[^\s]+\s/, '').toLowerCase());
      })
    : allProducts;

  return (
    <div className={`min-h-screen p-4 sm:p-8 transition-colors duration-150 ${
      isLightMode ? 'bg-[#faf7f0] text-slate-900' : 'bg-[#06090e] text-white'
    }`}>
      <div className="max-w-4xl mx-auto">
        {/* Top Header */}
        <div className={`flex items-center justify-between pb-6 border-b ${
          isLightMode ? 'border-[#e6dfd1]' : 'border-[#1e293b]'
        }`}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#ff7043] hover:underline"
          >
            ← Back to Globe
          </Link>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsLightMode(!isLightMode)}
              className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors cursor-pointer ${
                isLightMode
                  ? 'border-[#e6dfd1] bg-white text-amber-600'
                  : 'border-[#1e293b] bg-[#0b0f19] text-amber-400'
              }`}
            >
              {isLightMode ? '🌙' : '☀️'}
            </button>
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-extrabold"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-[#ff5722] text-white shadow-xs">
                🌍
              </span>
              <span>worldpinit.lol</span>
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <div className="mt-8">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🏆</span>
            <h1 className="text-3xl font-black tracking-tight">
              Hall of Fame
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#94a3b8]">
            Legendary startups, builders, and products that have staked sovereign territories on the world map.
          </p>

          {/* Category Filter Pills (Matching Screenshot 4) */}
          <div className="mt-6 flex flex-wrap gap-2">
            {CATEGORIES_LIST.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setSelectedCategory(cat.value)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.value
                    ? 'border-[#ff5722] bg-[#ff5722] text-white shadow-xs'
                    : isLightMode
                    ? 'border-[#e6dfd1] bg-white text-slate-700 hover:border-slate-400'
                    : 'border-[#1e293b] bg-[#0b0f19] text-[#94a3b8] hover:text-white hover:border-[#334155]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Line-Wise Leaderboard Cards (Matching Screenshot 4) */}
          <div className="mt-6 space-y-3.5">
            {filteredProducts.map((p, idx) => {
              const rank = idx + 1;
              return (
                <div
                  key={p.id}
                  className={`rounded-2xl border p-4 sm:p-5 shadow-lg transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isLightMode
                      ? 'border-[#e6dfd1] bg-white text-slate-900 shadow-pin-sm hover:border-slate-400'
                      : 'border-[#1e293b] bg-[#0b0f19] text-white hover:border-[#334155]'
                  }`}
                >
                  {/* Left Side: Rank Badge + Logo + Information */}
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    {/* Rank Badge */}
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-black shadow-xs ${
                      rank === 1
                        ? 'bg-gradient-to-b from-amber-400 to-amber-600 text-slate-950 border border-amber-300 ring-2 ring-amber-400/30'
                        : rank === 2
                        ? 'bg-gradient-to-b from-slate-200 to-slate-400 text-slate-950 border border-slate-300'
                        : rank === 3
                        ? 'bg-gradient-to-b from-amber-600 to-amber-800 text-white border border-amber-500'
                        : isLightMode
                        ? 'bg-slate-100 text-slate-700 border border-slate-200'
                        : 'bg-[#1e293b] text-slate-300 border border-slate-700'
                    }`}>
                      #{rank}
                    </div>

                    {/* Logo */}
                    <img
                      src={p.logo}
                      alt={p.name}
                      className="h-12 w-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-800 p-1 bg-white shadow-xs shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/globe.svg';
                      }}
                    />

                    {/* Meta Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/p/${p.slug}`}
                          className="font-extrabold text-base hover:text-[#ff7043] transition-colors truncate"
                        >
                          {p.name}
                        </Link>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isLightMode ? 'bg-amber-100/80 text-amber-800' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {p.category}
                        </span>
                        <span className="font-mono text-[10px] text-emerald-500 font-bold">
                          ● {p.allTimeClicks} clicks
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[#94a3b8] line-clamp-1">
                        {p.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Right Side: Stake Amount & Orange Visit Button */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-inherit">
                    <div className="text-left sm:text-right">
                      <span className="font-mono text-sm font-black text-[#ff7043] block">
                        ${p.totalStaked} USD
                      </span>
                      <span className="text-[10px] text-[#94a3b8] block">
                        Total Verified Bid
                      </span>
                    </div>

                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-[#ff5722] hover:bg-[#ff7043] px-4 py-2 text-xs font-extrabold text-white transition-all shadow-pin-coral hover:scale-105 shrink-0 cursor-pointer"
                    >
                      VISIT ↗
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
