'use client';

import React from 'react';
import { Flame, ArrowUpRight, Crown, Sparkles } from 'lucide-react';
import { BidTransaction } from '@/lib/types';

interface LiveActivityFeedProps {
  recentBids: BidTransaction[];
  onProjectClick?: (url: string) => void;
}

export function LiveActivityFeed({ recentBids }: LiveActivityFeedProps) {
  if (!recentBids || recentBids.length === 0) return null;

  const formatTimeAgo = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-zinc-950/70 border border-zinc-800/80 p-3">
      <div className="flex items-center gap-3">
        {/* Pulsing Tag */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-[11px] uppercase tracking-wider">Live Bids</span>
        </div>

        {/* Scrolling or flex list */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          {recentBids.slice(0, 8).map((tx) => (
            <div
              key={tx.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300 flex-shrink-0 hover:border-zinc-700 transition-colors"
            >
              {tx.newRank === 1 ? (
                <Crown className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              ) : tx.isTopUp ? (
                <Sparkles className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
              ) : (
                <Flame className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
              )}

              <span className="font-semibold text-white truncate max-w-[140px]">
                {tx.projectTitle}
              </span>

              <span className="text-zinc-500">•</span>

              <span className="font-bold text-amber-400 font-mono">
                +${tx.amount.toLocaleString()}
              </span>

              <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-zinc-400 font-bold">
                #{tx.newRank}
              </span>

              <span className="text-[10px] text-zinc-500">
                {formatTimeAgo(tx.createdAt)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
