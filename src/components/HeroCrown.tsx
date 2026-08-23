'use client';

import React from 'react';
import { Crown, ExternalLink } from 'lucide-react';
import { Project } from '@/lib/types';

interface HeroCrownProps {
  king: Project | null | undefined;
  onOutbidKing: (targetBid: number) => void;
}

export function HeroCrown({ king, onOutbidKing }: HeroCrownProps) {
  const defaultKing: Project = {
    id: 'proj_outbid',
    url: 'https://outbid.lol',
    normalizedUrl: 'outbid.lol',
    title: 'outbid.lol',
    description: 'No ads, no API keys, no revenue sharing. Just outbid your competition to get to the top. Will you take #1 when this site goes viral?',
    category: 'saas-devtools',
    totalBid: 5,
    initialBid: 5,
    clicks: 14820,
    totalKingDurationSeconds: 64800,
    rank: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const activeKing = king || defaultKing;
  const nextOutbidPrice = activeKing.totalBid + 1;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pt-4 pb-2">
      <div className="w-full rounded-3xl bg-[#181613] border border-[#2e2a24] p-5 sm:p-6 shadow-xl flex items-center justify-between gap-4 transition-all duration-200 hover:border-zinc-700">
        {/* Left Info */}
        <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
          {/* Logo / App Icon with lines or favicon */}
          <div className="w-12 h-12 rounded-2xl bg-white text-black p-2 flex flex-col justify-center gap-1 flex-shrink-0 shadow-md">
            <div className="w-4 h-1.5 rounded-full bg-[#e05d44]" />
            <div className="w-7 h-1.5 rounded-full bg-black" />
            <div className="w-5 h-1.5 rounded-full bg-black" />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <a
                href={`/r/${activeKing.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline truncate"
              >
                {activeKing.title}
              </a>
            </h2>

            <p className="mt-1 text-xs sm:text-sm text-[#a8a29e] leading-relaxed line-clamp-2">
              {activeKing.description}
            </p>
          </div>
        </div>

        {/* Right: Golden Crown Button from screenshot */}
        <button
          onClick={() => onOutbidKing(nextOutbidPrice)}
          title={`Outbid #1 for $${nextOutbidPrice}`}
          className="w-11 h-11 rounded-2xl bg-[#facc15] hover:bg-[#fde047] text-black flex items-center justify-center font-black flex-shrink-0 shadow-lg shadow-yellow-500/20 active:scale-90 transition-all cursor-pointer"
        >
          <Crown className="w-6 h-6 fill-current text-black" />
        </button>
      </div>
    </div>
  );
}
