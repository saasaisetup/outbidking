'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { COUNTRIES_DATA } from '@/lib/pinitData';

interface CountryPageProps {
  params: Promise<{ slug: string }>;
}

export default function CountryDetailPage({ params }: CountryPageProps) {
  const { slug } = use(params);

  const country = COUNTRIES_DATA[slug] || {
    id: slug,
    slug,
    name: slug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    code: 'GL',
    flag: '🌍',
    coordinates: [0, 0] as [number, number],
  };

  const isClaimed = !!country.currentLeader;

  return (
    <div className="min-h-screen bg-[#06090e] text-white p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Navigation Header */}
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

        {/* Country Header Card */}
        <div className="mt-8 rounded-pin-lg border border-[#1e293b] bg-[#0b0f19] p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{country.flag}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#94a3b8]">
                    {country.code}
                  </span>
                  <h1 className="text-2xl font-extrabold text-white">
                    {country.name}
                  </h1>
                </div>
                <p className="text-xs text-[#94a3b8] mt-0.5">
                  Sovereign territory on the world map
                </p>
              </div>
            </div>

            <Link
              href="/"
              className="rounded-full bg-[#ff5722] hover:bg-[#ff7043] px-5 py-2 text-xs font-extrabold text-white shadow-pin-coral transition-transform hover:scale-105"
            >
              Claim on Globe
            </Link>
          </div>

          {/* Current Sovereign Ruler Box */}
          <div className="mt-6 pt-6 border-t border-[#1e293b]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#94a3b8] mb-3">
              Current Sovereign Ruler
            </h2>

            {isClaimed ? (
              <div className="rounded-pin-md border border-[#1e293b] bg-[#06090e] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={country.currentLeader!.logo}
                    alt=""
                    className="h-12 w-12 rounded-xl object-cover border border-[#1e293b] bg-white p-1 shadow-xs"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/globe.svg';
                    }}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/p/${country.currentLeader!.id}`}
                        className="font-extrabold text-base text-white hover:underline hover:text-[#ff7043]"
                      >
                        {country.currentLeader!.name}
                      </Link>
                      <span className="rounded-full bg-[#f59e0b]/15 border border-[#f59e0b]/30 px-2 py-0.5 text-xs font-bold text-[#fbbf24]">
                        ${country.currentLeader!.stake} Stake
                      </span>
                    </div>
                    <p className="text-xs text-[#94a3b8] mt-1">
                      {country.currentLeader!.tagline}
                    </p>
                  </div>
                </div>

                <a
                  href={country.currentLeader!.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[#ff5722] hover:bg-[#ff7043] px-5 py-2 text-xs font-bold text-white shadow-pin-coral transition-transform hover:scale-105 shrink-0 text-center"
                >
                  Visit Website ↗
                </a>
              </div>
            ) : (
              <div className="rounded-pin-md border border-[#1e293b] bg-[#06090e] p-6 text-center">
                <p className="text-sm font-semibold text-white">
                  This territory is currently unclaimed.
                </p>
                <p className="text-xs text-[#94a3b8] mt-1">
                  Be the first product or founder to claim {country.name} for $1.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
