'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { INITIAL_ACTIVITY, CountryInfo, COUNTRIES_DATA } from '@/lib/pinitData';

interface LiveReportDrawerProps {
  onSelectCountry?: (country: CountryInfo) => void;
}

export function LiveReportDrawer({ onSelectCountry }: LiveReportDrawerProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return (
      <div className="pointer-events-auto absolute left-3 bottom-12 z-30 sm:left-4">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 rounded-full border border-[#1e293b] bg-[#0b0f19]/90 px-3.5 py-1.5 text-xs font-extrabold text-white shadow-pin-lg hover:border-[#ff5722] transition-transform hover:scale-105 cursor-pointer backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>⚡ WAR REPORT</span>
          <span className="text-[10px] text-[#94a3b8] font-mono">›</span>
        </button>
      </div>
    );
  }

  return (
    <aside
      aria-label="Live intel feed report"
      className="pointer-events-auto absolute left-3 bottom-12 z-30 w-80 sm:left-4 max-w-[calc(100vw-1.5rem)] animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      <div className="rounded-pin-lg border border-[#1e293b] bg-[#0b0f19]/95 shadow-pin-lg backdrop-blur-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[#1e293b] bg-[#06090e]/50">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <h2 className="text-xs font-extrabold tracking-wide text-white uppercase">
              ⚡ WAR REPORT
            </h2>
          </div>
          <span className="text-[10px] font-medium text-[#94a3b8]">
            Live Intel Feed
          </span>
        </div>

        {/* Scrollable Feed */}
        <div className="max-h-56 overflow-y-auto overscroll-contain divide-y divide-[#1e293b] px-1">
          {INITIAL_ACTIVITY.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2.5 text-xs hover:bg-[#151d30]/70 transition-colors"
            >
              {/* Logo + Name + Country */}
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <img
                  src={item.logo}
                  alt=""
                  className="h-6 w-6 shrink-0 rounded-full object-cover border border-[#1e293b] bg-[#0b0f19]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/globe.svg';
                  }}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/p/${item.productSlug}`}
                      className="font-bold text-white truncate hover:underline hover:text-[#ff7043]"
                    >
                      {item.productName}
                    </Link>
                  </div>
                  <div className="text-[10px] text-[#94a3b8] flex items-center gap-1">
                    <span>claimed</span>
                    <button
                      type="button"
                      onClick={() => {
                        const c = COUNTRIES_DATA[item.countrySlug];
                        if (c && onSelectCountry) onSelectCountry(c);
                      }}
                      className="font-semibold text-[#f1f5f9] hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>{item.countryFlag}</span>
                      <span>{item.countryName}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Stake + Time + Direct Clickable Visit Link */}
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <span className="font-extrabold text-xs text-white font-mono">
                  ${item.stake}
                </span>
                <span className="text-[10px] text-[#94a3b8]">
                  {item.timeAgo}
                </span>
                <a
                  href={item.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${item.productName}`}
                  className="inline-flex items-center justify-center rounded p-1 text-[#94a3b8] hover:text-[#ff5722] hover:bg-[#ff5722]/15 transition-colors cursor-pointer"
                >
                  <svg viewBox="0 0 20 20" width="12" height="12" fill="none">
                    <path
                      d="M8.5 5.5H14.5V11.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14.5 5.5L7.25 12.75"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Hide Button */}
        <div className="border-t border-[#1e293b] p-1.5 bg-[#06090e]/30 text-center">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full flex items-center justify-center gap-1.5 py-1 text-[10px] font-bold text-[#94a3b8] hover:text-white transition-colors cursor-pointer"
          >
            <span>◫</span>
            <span>HIDE INTEL</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
