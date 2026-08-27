'use client';

import React from 'react';
import Link from 'next/link';
import { BidTransaction } from '@/lib/types';
import { ProductLogo } from './ProductLogo';
import { formatProjectTitle } from './TopThreeCards';
import { Zap, ArrowUpRight, TrendingUp } from 'lucide-react';

interface LatestActivityTickerProps {
  recentBids: BidTransaction[];
  onSelectBid?: (tx: BidTransaction) => void;
}

export function LatestActivityTicker({ recentBids, onSelectBid }: LatestActivityTickerProps) {
  if (!recentBids || recentBids.length === 0) return null;

  const formatTimeAgo = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
      <div className="flex flex-col gap-2.5">
        {/* Label & Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-zinc-900 dark:text-zinc-100">
            <span className="w-2 h-2 rounded-full bg-[#ea6c52] animate-pulse" />
            <span className="tracking-tight">Recent Live Activity</span>
          </div>

          <Link
            href="/stats"
            className="text-[11px] font-bold text-[#ea6c52] hover:underline flex items-center gap-0.5"
          >
            <span>Live Ledger</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Horizontal Ticker with Responsive Cards */}
        <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar py-1 -mx-3 px-3 sm:mx-0 sm:px-0">
          {recentBids.slice(0, 15).map((tx) => {
            const displayTitle = formatProjectTitle({ title: tx.projectTitle, url: tx.projectUrl });

            return (
              <div
                key={tx.id}
                onClick={() => onSelectBid?.(tx)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-zinc-100/90 dark:bg-[#181822] border border-zinc-200/80 dark:border-[#272732] hover:border-[#ea6c52] dark:hover:border-[#ea6c52]/60 transition-all duration-150 flex-shrink-0 shadow-2xs cursor-pointer hover:shadow-xs group min-w-[210px]"
              >
                {/* Product Logo */}
                <ProductLogo
                  url={tx.projectUrl}
                  normalizedUrl={tx.projectUrl.replace(/^(https?:\/\/)?(www\.)?/, '')}
                  title={displayTitle}
                  size="sm"
                />

                {/* Content */}
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="font-extrabold text-xs text-zinc-900 dark:text-white truncate group-hover:text-[#ea6c52] transition-colors">
                    {displayTitle}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">
                    <span className="font-bold text-zinc-700 dark:text-zinc-300 font-mono">#{tx.newRank || 1}</span>
                    <span>·</span>
                    <span className="font-extrabold text-[#ea6c52] font-mono">+${tx.amount.toLocaleString()}</span>
                    <span>·</span>
                    <span className="text-[10px] text-zinc-400 font-mono">{formatTimeAgo(tx.createdAt)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
