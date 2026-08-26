'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Minus, Plus, ChevronDown, Globe } from 'lucide-react';
import { CATEGORIES } from '@/lib/categories';
import { PlatformStats } from '@/lib/types';
import { StatsPill } from './StatsPill';

interface HeroBiddingBarProps {
  stats: PlatformStats;
  currentBidAmount: number;
  targetRank?: number;
  timeFilter?: 'week' | 'all';
  onTimeFilterChange?: (filter: 'week' | 'all') => void;
  onBidAmountChange: (amount: number) => void;
  onSubmitBid: (params: { url: string; category: string; bidAmount: number; logoUrl?: string; isHandle?: boolean }) => void;
  onOpenStats?: () => void;
}

export function HeroBiddingBar({
  stats,
  currentBidAmount,
  targetRank = 1,
  timeFilter = 'week',
  onTimeFilterChange,
  onBidAmountChange,
  onSubmitBid,
  onOpenStats,
}: HeroBiddingBarProps) {
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('agencies-studios-services');
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
  const [isXHandle, setIsXHandle] = useState(false);
  const [isInstagram, setIsInstagram] = useState(false);
  const urlInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!url || url.length < 2) {
      setFaviconUrl(null);
      setIsXHandle(false);
      setIsInstagram(false);
      return;
    }

    const trimmed = url.trim().toLowerCase();

    // Check if input is an X handle
    if (trimmed.startsWith('@') || trimmed.includes('x.com/') || trimmed.includes('twitter.com/')) {
      setIsXHandle(true);
      setIsInstagram(false);
      const cleanHandle = trimmed.replace(/^@/, '').replace(/^(https?:\/\/)?(www\.)?(x\.com|twitter\.com)\//, '').split('/')[0].split('?')[0];
      setFaviconUrl(`https://unavatar.io/twitter/${cleanHandle}`);
      return;
    }

    // Check if input is an Instagram handle/URL
    if (trimmed.includes('instagram.com/')) {
      setIsInstagram(true);
      setIsXHandle(false);
      return;
    }

    setIsXHandle(false);
    setIsInstagram(false);
    const timer = setTimeout(() => {
      try {
        const domain = trimmed.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
        if (domain.includes('.')) {
          setFaviconUrl(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
        }
      } catch {
        // ignore
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
    if (!url.trim()) return;

    let finalUrl = url.trim();
    if (finalUrl.startsWith('@')) {
      finalUrl = `https://x.com/${finalUrl.substring(1)}`;
    }

    onSubmitBid({
      url: finalUrl,
      category: category || 'agencies-studios-services',
      bidAmount: currentBidAmount || 1,
      logoUrl: faviconUrl || undefined,
      isHandle: isXHandle,
    });
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-3 sm:px-4 pt-4 sm:pt-6 pb-2 flex flex-col items-center text-center">
      {/* Realtime StatsPill: Live Online Presence + Cumulative Visitors */}
      <StatsPill onOpenStats={onOpenStats} className="mb-4 sm:mb-5" />

      {/* Stepper Headline: Grab [ #1 ] for ( - $1 + ) ? */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-2xl xs:text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white leading-tight">
        <span>Grab</span>

        {/* 3D #1 Pill Badge */}
        <div className="inline-flex items-center px-3 sm:px-4 py-0.5 sm:py-1 rounded-2xl border-2 border-zinc-400/80 dark:border-zinc-500 bg-white dark:bg-[#181613] text-zinc-900 dark:text-white font-mono text-xl xs:text-2xl sm:text-4xl font-black shadow-[0_3px_0_0_#cbd5e1] dark:shadow-[0_3px_0_0_#4a453e]">
          #{targetRank}
        </div>

        <span>for</span>

        {/* Oval Stepper Container */}
        <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-zinc-100 dark:bg-[#1a1815] border border-zinc-200 dark:border-[#2e2a24] shadow-inner group">
          <button
            type="button"
            onClick={handleDecrement}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-[#12100e] border border-zinc-300 dark:border-[#2e2a24] flex items-center justify-center text-zinc-600 dark:text-zinc-400 font-bold text-xs hover:border-zinc-500 active:scale-90 transition-all cursor-pointer shrink-0"
          >
            <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Editable number input */}
          <div className="flex items-center font-mono text-xl xs:text-2xl sm:text-4xl font-black text-zinc-900 dark:text-[#f4f3ef]">
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
              className="w-20 xs:w-24 sm:w-32 bg-transparent text-center font-mono font-black outline-none border-b-2 border-transparent focus:border-[#ea6c52] transition-colors"
            />
          </div>

          <button
            type="button"
            onClick={handleIncrement}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-[#12100e] border border-zinc-300 dark:border-[#2e2a24] flex items-center justify-center text-zinc-600 dark:text-zinc-400 font-bold text-xs hover:border-zinc-500 active:scale-90 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        <span>?</span>
      </div>

      {/* Subtitle */}
      <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-[#f87171] max-w-lg font-medium leading-relaxed px-2">
        New spots start at $1. Paying less than the #1 price still puts you on the board at whatever place that bid can take.
      </p>

      {/* Unified Hero Input Card matching media_1787760908931.png */}
      <form
        onSubmit={handleSubmit}
        className="mt-5 sm:mt-6 w-full max-w-2xl mx-auto"
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#181613] border border-zinc-200/90 dark:border-[#2e2a24] shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_25px_rgba(0,0,0,0.35)]">
          {/* URL Input */}
          <div className="flex-1 flex items-center gap-2.5 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-zinc-50/80 dark:bg-[#12100e] border border-transparent focus-within:border-zinc-300 dark:focus-within:border-zinc-700 transition-colors">
            {isXHandle ? (
              <div className="w-4 h-4 rounded-full bg-black text-white flex items-center justify-center text-[9px] font-black shrink-0">
                𝕏
              </div>
            ) : isInstagram ? (
              <div className="w-4 h-4 rounded-sm overflow-hidden flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
                  <rect width="24" height="24" rx="5" fill="#e1306c" />
                  <rect x="4" y="4" width="16" height="16" rx="4" stroke="#ffffff" strokeWidth="2" fill="none" />
                  <circle cx="12" cy="12" r="3.5" stroke="#ffffff" strokeWidth="2" fill="none" />
                </svg>
              </div>
            ) : faviconUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={faviconUrl}
                alt=""
                className="w-4 h-4 rounded object-contain shrink-0"
                onError={() => setFaviconUrl(null)}
              />
            ) : (
              <Globe className="w-4 h-4 text-zinc-400 shrink-0" />
            )}

            <input
              ref={urlInputRef}
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="URL, @handle, or an X post"
              className="w-full bg-transparent text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none font-medium"
            />
          </div>

          {/* Niche Dropdown */}
          <div className="relative sm:w-44 flex items-center">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full py-2.5 sm:py-3 pl-3.5 pr-8 rounded-xl sm:rounded-2xl bg-zinc-50/80 dark:bg-[#12100e] border border-transparent text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-medium focus:outline-none cursor-pointer appearance-none"
            >
              {CATEGORIES.filter((c) => c.slug !== 'all').map((c) => (
                <option key={c.slug} value={c.slug} className="dark:bg-[#181613] text-zinc-900 dark:text-zinc-200">
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          </div>

          {/* Premium Orange CTA Button */}
          <button
            type="submit"
            className="px-6 sm:px-7 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#ea6c52] to-[#f97316] hover:from-[#e05d44] hover:to-[#ea580c] text-white font-black text-xs sm:text-sm tracking-tight shadow-md shadow-[#ea6c52]/30 hover:shadow-lg hover:shadow-[#ea6c52]/50 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center shrink-0"
          >
            Grab it
          </button>
        </div>
      </form>

      {/* Time Filter Switch Pill matching media_1787760908931.png */}
      <div className="mt-5 sm:mt-6 inline-flex items-center p-1 rounded-full bg-zinc-100 dark:bg-[#181613] border border-zinc-200/80 dark:border-[#2e2a24] text-xs font-semibold shadow-inner">
        <button
          type="button"
          onClick={() => onTimeFilterChange?.('week')}
          className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
            timeFilter === 'week'
              ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xs font-bold'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          This week
        </button>
        <button
          type="button"
          onClick={() => onTimeFilterChange?.('all')}
          className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${
            timeFilter === 'all'
              ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xs font-bold'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          All-time
        </button>
      </div>
    </section>
  );
}
