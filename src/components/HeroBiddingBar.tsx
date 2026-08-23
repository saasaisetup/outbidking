'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Minus, Plus, ChevronDown, Globe } from 'lucide-react';
import { CATEGORIES } from '@/lib/categories';
import { PlatformStats } from '@/lib/types';
import { CategoryIcon } from './CategoryIcon';

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
    onBidAmountChange(Math.max(5, currentBidAmount - 1));
  };

  const handleIncrement = () => {
    onBidAmountChange(currentBidAmount + 1);
  };

  // Allow submitting
  const isFormValid = url.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    let finalUrl = url.trim();
    if (finalUrl.startsWith('@')) {
      finalUrl = `https://x.com/${finalUrl.substring(1)}`;
    }

    onSubmitBid({
      url: finalUrl,
      category: category || 'ai-agents-infrastructure',
      bidAmount: currentBidAmount || 5,
      logoUrl: faviconUrl || undefined,
      isHandle: isXHandle,
    });
  };

  const totalVisitorsFormatted = (stats?.totalClicksDelivered || 142732).toLocaleString();

  return (
    <section className="w-full max-w-4xl mx-auto px-3 sm:px-4 pt-5 sm:pt-7 pb-4 flex flex-col items-center text-center">
      {/* Visitor Pill displaying 1,081 online and visitors */}
      <button
        type="button"
        onClick={onOpenStats}
        className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] sm:text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors mb-5 sm:mb-6 shadow-2xs cursor-pointer max-w-full"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
        <span className="font-semibold text-zinc-800 dark:text-zinc-200">1,081 online</span>
        <span>·</span>
        <span className="font-medium text-zinc-600 dark:text-zinc-400">{totalVisitorsFormatted} visitors</span>
        <span>·</span>
        <span className="text-[#ea6c52] font-semibold flex items-center">
          stats <span className="ml-0.5">→</span>
        </span>
      </button>

      {/* Upscaled Headline: Grab [ #1 ] for ( - $14028 + ) ? */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-2xl xs:text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white leading-tight">
        <span>Grab</span>

        {/* 3D #1 Pill Badge */}
        <div className="inline-flex items-center px-3.5 sm:px-4.5 py-0.5 sm:py-1 rounded-2xl border-2 border-zinc-400/80 dark:border-zinc-500 bg-white dark:bg-[#181613] text-zinc-900 dark:text-white font-mono text-xl xs:text-2xl sm:text-4xl font-black shadow-[0_3px_0_0_#cbd5e1] dark:shadow-[0_3px_0_0_#4a453e] sm:shadow-[0_4px_0_0_#cbd5e1] sm:dark:shadow-[0_4px_0_0_#4a453e]">
          #{targetRank}
        </div>

        <span>for</span>

        {/* Oval Stepper Container with direct editable typing */}
        <div className="inline-flex items-center gap-2 sm:gap-3 px-3.5 sm:px-5 py-1 sm:py-1.5 rounded-full bg-zinc-100 dark:bg-[#1a1815] border border-zinc-200 dark:border-[#2e2a24] shadow-inner group">
          <button
            type="button"
            onClick={handleDecrement}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-[#12100e] border border-zinc-300 dark:border-[#2e2a24] flex items-center justify-center text-zinc-600 dark:text-zinc-400 font-bold text-xs hover:border-zinc-500 active:scale-90 transition-all cursor-pointer flex-shrink-0"
          >
            <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Directly editable number input */}
          <div className="flex items-center font-mono text-xl xs:text-2xl sm:text-4xl font-black text-zinc-900 dark:text-[#f4f3ef]">
            <span>$</span>
            <input
              type="number"
              min={5}
              max={999999}
              value={currentBidAmount === 0 ? '' : currentBidAmount}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                onBidAmountChange(isNaN(val) ? 0 : val);
              }}
              placeholder="0"
              className="w-24 xs:w-28 sm:w-40 bg-transparent text-center font-mono font-black outline-none border-b-2 border-transparent focus:border-amber-400 dark:focus:border-amber-400 transition-colors"
            />
          </div>

          <button
            type="button"
            onClick={handleIncrement}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-[#12100e] border border-zinc-300 dark:border-[#2e2a24] flex items-center justify-center text-zinc-600 dark:text-zinc-400 font-bold text-xs hover:border-zinc-500 active:scale-90 transition-all cursor-pointer flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        <span>?</span>
      </div>

      {/* Subtitle matching media_1787458001988.png */}
      <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-[#f87171] dark:text-[#f87171] max-w-lg font-medium leading-relaxed px-2">
        New spots start at $5. Paying less than the #1 price still puts you on the board at whatever place that bid can take.
      </p>

      {/* Main Responsive Input Form stretched to full max-w-4xl navbar alignment */}
      <form
        onSubmit={handleSubmit}
        className="mt-6 sm:mt-7 w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3"
      >
        {/* URL Input with rounded-full pill styling and matching navbar width */}
        <div className="flex-1 flex items-center gap-3 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-white dark:bg-[#181613] border border-zinc-200 dark:border-[#2e2a24] shadow-xs focus-within:border-[#f87171] transition-colors">
          {isXHandle ? (
            <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black flex-shrink-0">
              𝕏
            </div>
          ) : isInstagram ? (
            <div className="w-5 h-5 rounded-md overflow-hidden flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
                <defs>
                  <radialGradient id="ig-hero-full-grad" cx="25%" cy="110%" r="130%">
                    <stop offset="0%" stopColor="#fdf497" />
                    <stop offset="10%" stopColor="#fdf497" />
                    <stop offset="45%" stopColor="#fd5949" />
                    <stop offset="65%" stopColor="#d6249f" />
                    <stop offset="95%" stopColor="#285AEB" />
                  </radialGradient>
                </defs>
                <rect width="24" height="24" rx="5" fill="url(#ig-hero-full-grad)" />
                <rect x="4" y="4" width="16" height="16" rx="4" stroke="#ffffff" strokeWidth="2" fill="none" />
                <circle cx="12" cy="12" r="3.5" stroke="#ffffff" strokeWidth="2" fill="none" />
                <circle cx="16.5" cy="7.5" r="1" fill="#ffffff" />
              </svg>
            </div>
          ) : faviconUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={faviconUrl}
              alt=""
              className="w-5 h-5 rounded-md object-contain flex-shrink-0"
              onError={() => setFaviconUrl(null)}
            />
          ) : (
            <Globe className="w-4 h-4 text-zinc-400 flex-shrink-0" />
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

        {/* Category Dropdown with rounded-full pill styling */}
        <div className="relative w-full sm:w-72 flex items-center">
          <div className="absolute left-4 pointer-events-none z-10">
            <CategoryIcon slug={category || 'ai-agents-infrastructure'} size="sm" />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full py-3 sm:py-3.5 pl-12 pr-9 rounded-full bg-white dark:bg-[#181613] border border-zinc-200 dark:border-[#2e2a24] text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 font-medium focus:outline-none cursor-pointer appearance-none shadow-xs"
          >
            {CATEGORIES.filter((c) => c.slug !== 'all').map((c) => (
              <option key={c.slug} value={c.slug} className="dark:bg-[#181613] text-zinc-900 dark:text-zinc-200">
                {c.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
        </div>

        {/* Tactile Green "Rankbid" Button */}
        <button
          type="submit"
          className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-3.5 rounded-full font-black text-sm sm:text-base tracking-tight text-black bg-[#52d489] hover:bg-[#45c77c] border border-[#3cb56e] shadow-[0_4px_0_0_#2b8a53] active:translate-y-[2px] active:shadow-[0_2px_0_0_#2b8a53] transition-all duration-150 flex-shrink-0 select-none flex items-center justify-center cursor-pointer"
        >
          Rankbid
        </button>
      </form>

      {/* Subtext matching media_1787458001988.png */}
      <p className="mt-3.5 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-normal">
        Already on the list? Enter the same URL or @handle and up your bid.
      </p>
    </section>
  );
}
