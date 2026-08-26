'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Minus, Plus, ChevronDown, Globe } from 'lucide-react';
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
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
  const [isXHandle, setIsXHandle] = useState(false);
  const [isInstagram, setIsInstagram] = useState(false);
  const [isGithub, setIsGithub] = useState(false);
  const [isYoutube, setIsYoutube] = useState(false);
  const [isDiscord, setIsDiscord] = useState(false);
  const urlInputRef = useRef<HTMLInputElement | null>(null);

  // High-precision multi-platform logo fetcher
  useEffect(() => {
    if (!url || url.trim().length < 2) {
      setFaviconUrl(null);
      setIsXHandle(false);
      setIsInstagram(false);
      setIsGithub(false);
      setIsYoutube(false);
      setIsDiscord(false);
      return;
    }

    const trimmed = url.trim().toLowerCase();

    // 1. Twitter / X Handle & URL
    if (trimmed.startsWith('@') || trimmed.includes('x.com/') || trimmed.includes('twitter.com/')) {
      setIsXHandle(true);
      setIsInstagram(false);
      setIsGithub(false);
      setIsYoutube(false);
      setIsDiscord(false);
      const cleanHandle = trimmed
        .replace(/^@/, '')
        .replace(/^(https?:\/\/)?(www\.)?(x\.com|twitter\.com)\//, '')
        .split('/')[0]
        .split('?')[0];
      setFaviconUrl(`https://unavatar.io/twitter/${cleanHandle}`);
      return;
    }

    // 2. GitHub Handle & Repo
    if (trimmed.includes('github.com/')) {
      setIsGithub(true);
      setIsXHandle(false);
      setIsInstagram(false);
      setIsYoutube(false);
      setIsDiscord(false);
      const cleanHandle = trimmed
        .replace(/^(https?:\/\/)?(www\.)?github\.com\//, '')
        .split('/')[0]
        .split('?')[0];
      setFaviconUrl(`https://github.com/${cleanHandle}.png`);
      return;
    }

    // 3. Instagram
    if (trimmed.includes('instagram.com/')) {
      setIsInstagram(true);
      setIsXHandle(false);
      setIsGithub(false);
      setIsYoutube(false);
      setIsDiscord(false);
      const cleanHandle = trimmed
        .replace(/^(https?:\/\/)?(www\.)?instagram\.com\//, '')
        .split('/')[0]
        .split('?')[0]
        .replace(/^@/, '');
      setFaviconUrl(`https://unavatar.io/instagram/${cleanHandle}`);
      return;
    }

    // 4. YouTube
    if (trimmed.includes('youtube.com/') || trimmed.includes('youtu.be/')) {
      setIsYoutube(true);
      setIsXHandle(false);
      setIsInstagram(false);
      setIsGithub(false);
      setIsDiscord(false);
      setFaviconUrl(`https://unavatar.io/youtube/${trimmed.replace(/^(https?:\/\/)?(www\.)?youtube\.com\/(c\/|user\/|@)?/, '').split('/')[0]}`);
      return;
    }

    // 5. Discord
    if (trimmed.includes('discord.gg/') || trimmed.includes('discord.com/')) {
      setIsDiscord(true);
      setIsXHandle(false);
      setIsInstagram(false);
      setIsGithub(false);
      setIsYoutube(false);
      setFaviconUrl('https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png');
      return;
    }

    // 6. Generic Website Domain
    setIsXHandle(false);
    setIsInstagram(false);
    setIsGithub(false);
    setIsYoutube(false);
    setIsDiscord(false);

    const timer = setTimeout(() => {
      try {
        const domain = trimmed.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
        if (domain.includes('.')) {
          // Primary Google S2 Favicon 128px
          setFaviconUrl(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
        }
      } catch {
        // ignore
      }
    }, 120);

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
      logoUrl: faviconUrl || undefined,
      isHandle: isXHandle,
    });
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-3 sm:px-4 pt-5 sm:pt-7 pb-4 flex flex-col items-center text-center">
      {/* Realtime StatsPill: Live Online Presence + Cumulative Visitors */}
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

      {/* Main Responsive Input Form stretched to full max-w-4xl navbar alignment */}
      <form
        onSubmit={handleSubmit}
        className="mt-6 sm:mt-7 w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3"
      >
        {/* URL Input with rounded-full pill styling and auto logo grabber */}
        <div className="flex-1 flex items-center gap-3 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-white dark:bg-[#121217] border border-zinc-200 dark:border-[#272732] shadow-xs focus-within:border-[#ea6c52] transition-colors">
          {isXHandle ? (
            <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black shrink-0">
              𝕏
            </div>
          ) : isInstagram ? (
            <div className="w-5 h-5 rounded-md overflow-hidden flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
                <defs>
                  <radialGradient id="ig-hero-grad-3" cx="25%" cy="110%" r="130%">
                    <stop offset="0%" stopColor="#fdf497" />
                    <stop offset="10%" stopColor="#fdf497" />
                    <stop offset="45%" stopColor="#fd5949" />
                    <stop offset="65%" stopColor="#d6249f" />
                    <stop offset="95%" stopColor="#285AEB" />
                  </radialGradient>
                </defs>
                <rect width="24" height="24" rx="5" fill="url(#ig-hero-grad-3)" />
                <rect x="4" y="4" width="16" height="16" rx="4" stroke="#ffffff" strokeWidth="2" fill="none" />
                <circle cx="12" cy="12" r="3.5" stroke="#ffffff" strokeWidth="2" fill="none" />
              </svg>
            </div>
          ) : isGithub ? (
            <div className="w-5 h-5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center text-[10px] font-bold shrink-0">
              gh
            </div>
          ) : faviconUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={faviconUrl}
              alt=""
              className="w-5 h-5 rounded-md object-contain shrink-0 bg-white/10 p-0.5"
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

        {/* Always Highlighted Tactile Premium Orange "Rankbid" Button */}
        <button
          type="submit"
          className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-3.5 rounded-full font-black text-sm sm:text-base tracking-tight transition-all duration-150 flex-shrink-0 select-none flex items-center justify-center bg-gradient-to-r from-[#ea6c52] to-[#f97316] hover:from-[#e05d44] hover:to-[#ea580c] text-white border border-[#d95b41] shadow-[0_4px_14px_rgba(234,108,82,0.35)] hover:shadow-[0_6px_20px_rgba(234,108,82,0.5)] active:translate-y-[2px] active:shadow-[0_2px_6px_rgba(234,108,82,0.4)] cursor-pointer opacity-100"
        >
          Rankbid
        </button>
      </form>

      {/* Subtext */}
      <p className="mt-3.5 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-normal">
        Already on the list? Enter the same URL or @handle and up your bid.
      </p>
    </section>
  );
}
