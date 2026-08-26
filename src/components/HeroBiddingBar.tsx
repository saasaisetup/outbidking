'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Minus, Plus, ChevronDown, Globe, Loader2 } from 'lucide-react';
import { CATEGORIES } from '@/lib/categories';
import { PlatformStats } from '@/lib/types';
import { CategoryIcon } from './CategoryIcon';
import { StatsPill } from './StatsPill';

interface HeroBiddingBarProps {
  stats: PlatformStats;
  currentBidAmount: number;
  targetRank?: number;
  onBidAmountChange: (amount: number) => void;
  onSubmitBid: (params: { url: string; category: string; bidAmount: number; logoUrl?: string; isHandle?: boolean }) => void;
  onOpenStats?: () => void;
}

export function HeroBiddingBar({
  stats,
  currentBidAmount,
  targetRank = 1,
  onBidAmountChange,
  onSubmitBid,
  onOpenStats,
}: HeroBiddingBarProps) {
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('ai-agents-infrastructure');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isFetchingAvatar, setIsFetchingAvatar] = useState(false);
  const [isHandle, setIsHandle] = useState(false);
  const urlInputRef = useRef<HTMLInputElement | null>(null);

  // Synchronous optimistic preview + Asynchronous high-res resolution
  useEffect(() => {
    if (!url || url.trim().length < 2) {
      setAvatarUrl(null);
      setIsHandle(false);
      setIsFetchingAvatar(false);
      return;
    }

    const trimmed = url.trim();
    const isTwitter = trimmed.startsWith('@') || trimmed.includes('x.com/') || trimmed.includes('twitter.com/');
    setIsHandle(isTwitter);

    // 1. Immediate Instant Synchronous Preview
    if (isTwitter) {
      const handle = trimmed
        .replace(/^@/, '')
        .replace(/^(https?:\/\/)?(www\.)?(x\.com|twitter\.com)\//, '')
        .split('/')[0]
        .split('?')[0];
      setAvatarUrl(`https://unavatar.io/x/${handle}`);
    } else if (trimmed.includes('github.com/')) {
      const handle = trimmed.replace(/^(https?:\/\/)?(www\.)?github\.com\//, '').split('/')[0];
      setAvatarUrl(`https://github.com/${handle}.png?size=200`);
    } else if (trimmed.includes('instagram.com/')) {
      const handle = trimmed.replace(/^(https?:\/\/)?(www\.)?instagram\.com\//, '').split('/')[0].replace(/^@/, '');
      setAvatarUrl(`https://unavatar.io/instagram/${handle}`);
    } else if (trimmed.includes('.')) {
      const domain = trimmed.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
      setAvatarUrl(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
    } else {
      setAvatarUrl(null);
    }

    // 2. High-Res Live Server Resolution via /api/avatar
    const timer = setTimeout(async () => {
      try {
        setIsFetchingAvatar(true);
        const res = await fetch(`/api/avatar?input=${encodeURIComponent(trimmed)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.logoUrl) {
            setAvatarUrl(data.logoUrl);
          }
        }
      } catch {
        // keep optimistic preview
      } finally {
        setIsFetchingAvatar(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [url]);

  const handleDecrement = () => {
    onBidAmountChange(Math.max(1, currentBidAmount - 1));
  };

  const handleIncrement = () => {
    onBidAmountChange(currentBidAmount + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      urlInputRef.current?.focus();
      return;
    }

    let finalUrl = url.trim();
    if (finalUrl.startsWith('@')) {
      finalUrl = `https://x.com/${finalUrl.substring(1)}`;
    }

    onSubmitBid({
      url: finalUrl,
      category: category || 'ai-agents-infrastructure',
      bidAmount: currentBidAmount || 1,
      logoUrl: avatarUrl || undefined,
      isHandle,
    });
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-3 sm:px-4 pt-5 sm:pt-7 pb-4 flex flex-col items-center text-center">
      {/* Realtime StatsPill: Realistic Live Online Presence + Cumulative Visitors */}
      <StatsPill onOpenStats={onOpenStats} className="mb-5 sm:mb-6" />

      {/* Stepper Headline: Grab [ #1 ] for ( - $1 + ) ? */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-2xl xs:text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white leading-tight">
        <span>Grab</span>

        {/* 3D #1 Pill Badge */}
        <div className="inline-flex items-center px-3.5 sm:px-4.5 py-0.5 sm:py-1 rounded-2xl border-2 border-zinc-400/80 dark:border-zinc-500 bg-white dark:bg-[#121217] text-zinc-900 dark:text-white font-mono text-xl xs:text-2xl sm:text-4xl font-black shadow-[0_3px_0_0_#cbd5e1] dark:shadow-[0_3px_0_0_#272732] sm:shadow-[0_4px_0_0_#cbd5e1] sm:dark:shadow-[0_4px_0_0_#272732]">
          #{targetRank}
        </div>

        <span>for</span>

        {/* Oval Stepper Container with direct editable typing */}
        <div className="inline-flex items-center gap-2 sm:gap-3 px-3.5 sm:px-5 py-1 sm:py-1.5 rounded-full bg-zinc-100 dark:bg-[#181822] border border-zinc-200 dark:border-[#272732] shadow-inner group">
          <button
            type="button"
            onClick={handleDecrement}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-[#121217] border border-zinc-300 dark:border-[#272732] flex items-center justify-center text-zinc-600 dark:text-zinc-400 font-bold text-xs hover:border-zinc-500 active:scale-90 transition-all cursor-pointer shrink-0"
          >
            <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Directly editable number input */}
          <div className="flex items-center font-mono text-xl xs:text-2xl sm:text-4xl font-black text-zinc-900 dark:text-[#f4f4f5]">
            <span>$</span>
            <input
              type="number"
              min={1}
              max={999999}
              value={currentBidAmount === 0 ? '' : currentBidAmount}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                onBidAmountChange(isNaN(val) ? 1 : Math.max(1, val));
              }}
              placeholder="1"
              className="w-20 xs:w-28 sm:w-36 bg-transparent text-center font-mono font-black outline-none border-b-2 border-transparent focus:border-[#ea6c52] transition-colors"
            />
          </div>

          <button
            type="button"
            onClick={handleIncrement}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-[#121217] border border-zinc-300 dark:border-[#272732] flex items-center justify-center text-zinc-600 dark:text-zinc-400 font-bold text-xs hover:border-zinc-500 active:scale-90 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        <span>?</span>
      </div>

      {/* Subtitle */}
      <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-[#f87171] max-w-lg font-medium leading-relaxed px-2">
        New spots start at $1. Paying less than the #1 price still puts you on the board at whatever place that bid can take.
      </p>

      {/* Main Responsive Input Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-6 sm:mt-7 w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3"
      >
        {/* URL Input with Live Profile Avatar / Logo renderer */}
        <div className="flex-1 flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-3.5 rounded-full bg-white dark:bg-[#121217] border border-zinc-200 dark:border-[#272732] shadow-xs focus-within:border-[#ea6c52] transition-colors">
          {avatarUrl ? (
            <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-700 bg-white flex items-center justify-center shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-full h-full object-contain p-0.5"
                onError={() => setAvatarUrl(null)}
              />
              {isFetchingAvatar && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Loader2 className="w-3 h-3 text-white animate-spin" />
                </div>
              )}
            </div>
          ) : (
            <Globe className="w-5 h-5 text-zinc-400 shrink-0" />
          )}

          <input
            ref={urlInputRef}
            type="text"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Your product URL or @handle"
            className="w-full bg-transparent text-sm sm:text-base text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none font-medium"
          />
        </div>

        {/* Category Dropdown */}
        <div className="relative w-full sm:w-72 flex items-center">
          <div className="absolute left-4 pointer-events-none z-10">
            <CategoryIcon slug={category || 'ai-agents-infrastructure'} size="sm" />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full py-3 sm:py-3.5 pl-12 pr-9 rounded-full bg-white dark:bg-[#121217] border border-zinc-200 dark:border-[#272732] text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-medium focus:outline-none cursor-pointer appearance-none shadow-xs"
          >
            {CATEGORIES.filter((c) => c.slug !== 'all').map((c) => (
              <option key={c.slug} value={c.slug} className="dark:bg-[#121217] text-zinc-900 dark:text-zinc-200">
                {c.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
        </div>

        {/* 3D Tactile Highlighted Rankbid Button */}
        <button
          type="submit"
          className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-3.5 rounded-full font-black text-sm sm:text-base tracking-tight transition-all duration-150 flex-shrink-0 select-none flex items-center justify-center bg-gradient-to-b from-[#ff7a59] via-[#ea6c52] to-[#d95b41] hover:brightness-105 border-t border-[#ff9e80] text-white shadow-[0_4px_0_0_#b8432a,0_8px_18px_rgba(234,108,82,0.4)] active:shadow-[0_1px_0_0_#b8432a] active:translate-y-[3px] cursor-pointer opacity-100"
        >
          <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">Rankbid</span>
        </button>
      </form>

      {/* Subtext */}
      <p className="mt-3.5 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-normal">
        Already on the list? Enter the same URL or @handle and up your bid.
      </p>
    </section>
  );
}
