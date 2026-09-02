'use client';

import React from 'react';
import Link from 'next/link';
import { SAMPLE_PRODUCTS } from '@/lib/pinitData';

export default function HallOfFamePage() {
  const products = Object.values(SAMPLE_PRODUCTS);

  return (
    <div className="min-h-screen bg-[#06090e] text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between pb-6 border-b border-[#1e293b]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#ff7043] hover:underline"
          >
            ← Back to Globe
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-extrabold text-white"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-[#0b0f19] text-[#ff5722] border border-[#1e293b]">
              <svg viewBox="0 0 100 100" width="12" height="12" fill="currentColor">
                <path d="M20,8 L42,8 L82,32 L42,56 L42,92 L20,92 Z" />
              </svg>
            </span>
            <span>pinit.lol</span>
          </Link>
        </div>

        <div className="mt-8">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <h1 className="text-2xl font-extrabold text-white">
              Hall of Fame
            </h1>
          </div>
          <p className="mt-1 text-sm text-[#94a3b8]">
            Legendary products and founders that have staked sovereign territories on the pinit.lol world map.
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="rounded-pin-lg border border-[#1e293b] bg-[#0b0f19] p-5 shadow-2xl flex flex-col justify-between hover:border-[#334155] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.logo}
                        alt=""
                        className="h-10 w-10 rounded-xl object-cover border border-[#1e293b] p-1 bg-white shadow-xs shrink-0"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/globe.svg';
                        }}
                      />
                      <div>
                        <Link
                          href={`/p/${p.slug}`}
                          className="font-extrabold text-base text-white hover:text-[#ff7043] hover:underline block"
                        >
                          {p.name}
                        </Link>
                        <span className="text-xs text-[#94a3b8]">{p.category}</span>
                      </div>
                    </div>

                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-[#ff5722] hover:bg-[#ff7043] px-3 py-1 text-xs font-bold text-white transition-transform hover:scale-105 shrink-0"
                    >
                      VISIT ↗
                    </a>
                  </div>

                  <p className="mt-3 text-xs text-slate-300 leading-relaxed">
                    {p.tagline}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1e293b] flex items-center justify-between text-xs text-[#94a3b8]">
                  <span>${p.totalStaked} total stake</span>
                  <span className="font-bold text-emerald-400">{p.allTimeClicks} clicks</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
