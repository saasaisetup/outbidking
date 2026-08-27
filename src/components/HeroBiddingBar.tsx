'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Minus, Plus, ChevronDown, Globe, Loader2, Trophy } from 'lucide-react';
import { CATEGORIES } from '@/lib/categories';
import { PlatformStats, Project } from '@/lib/types';
import { CategoryIcon } from './CategoryIcon';
import { StatsPill } from './StatsPill';

interface HeroBiddingBarProps {
  stats: PlatformStats;
  currentBidAmount: number;
  projects?: Project[];
  selectedCategory?: string;
  onBidAmountChange: (amount: number) => void;
  onCategoryChange?: (category: string) => void;
  onSubmitBid: (params: {
    url: string;
    category: string;
    bidAmount: number;
    title?: string;
    description?: string;
    logoUrl?: string;
    isHandle?: boolean;
  }) => void;
  onOpenStats?: () => void;
}

export function HeroBiddingBar({
  stats,
  currentBidAmount,
  projects = [],
  selectedCategory = 'ai-agents-infrastructure',
  onBidAmountChange,
  onCategoryChange,
  onSubmitBid,
  onOpenStats,
}: HeroBiddingBarProps) {
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState(selectedCategory || 'ai-agents-infrastructure');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [extractedTitle, setExtractedTitle] = useState('');
  const [extractedDescription, setExtractedDescription] = useState('');
  const [isFetchingAvatar, setIsFetchingAvatar] = useState(false);
  const [isHandle, setIsHandle] = useState(false);
  const urlInputRef = useRef<HTMLInputElement | null>(null);

  // Sync category prop if updated from external category pills
  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'all') {
      setCategory(selectedCategory);
    }
  }, [selectedCategory]);

  // Synchronous optimistic preview + Asynchronous high-res resolution
  useEffect(() => {
    if (!url || url.trim().length < 2) {
      setAvatarUrl(null);
      setExtractedTitle('');
      setExtractedDescription('');
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
          if (data.title) {
            setExtractedTitle(data.title);
          }
          if (data.description) {
            setExtractedDescription(data.description);
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

  // Calculate dynamic projected rank based on the entered amount
  const calculateProjectedRank = (amt: number): number => {
    if (!projects || projects.length === 0) return 1;
    for (let i = 0; i < projects.length; i++) {
      if (amt > projects[i].totalBid) {
        return i + 1;
      }
    }
    return projects.length + 1;
  };

  const projectedRank = calculateProjectedRank(currentBidAmount);
  const top1Price = projects && projects.length > 0 ? projects[0].totalBid + 1 : 1;

  const handleDecrement = () => {
    onBidAmountChange(Math.max(1, currentBidAmount - 1));
  };

  const handleIncrement = () => {
    onBidAmountChange(currentBidAmount + 1);
  };

  const handleQuickSelect = (amount: number) => {
    onBidAmountChange(Math.max(1, amount));
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
      title: extractedTitle || undefined,
      description: extractedDescription || undefined,
      logoUrl: avatarUrl || undefined,
      isHandle,
    });
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-3 sm:px-4 pt-5 sm:pt-7 pb-4 flex flex-col items-center text-center">
      {/* Realtime StatsPill: Realistic Live Online Presence + Cumulative Visitors */}
      <StatsPill onOpenStats={onOpenStats} className="mb-5 sm:mb-6" />

      {/* Stepper Headline: Grab [ #Rank ] for ( - $Amount + ) ? */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-2xl xs:text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white leading-tight">
        <span>Grab</span>

        {/* 3D Dynamic Target Rank Badge */}
        <div className="inline-flex items-center px-3.5 sm:px-4.5 py-0.5 sm:py-1 rounded-2xl border-2 border-zinc-400/80 dark:border-zinc-500 bg-white dark:bg-[#121217] text-zinc-900 dark:text-white font-mono text-xl xs:text-2xl sm:text-4xl font-black shadow-[0_3px_0_0_#cbd5e1] dark:shadow-[0_3px_0_0_#272732] sm:shadow-[0_4px_0_0_#cbd5e1] sm:dark:shadow-[0_4px_0_0_#272732] transition-all">
          #{projectedRank}
        </div>

        <span>for</span>

        {/* Oval Stepper Container with fully editable input & increment/decrement */}
        <div className="inline-flex items-center gap-2 sm:gap-3 px-3.5 sm:px-5 py-1 sm:py-1.5 rounded-full bg-zinc-100 dark:bg-[#181822] border border-zinc-200 dark:border-[#272732] shadow-inner group hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors">
          <button
            type="button"
            onClick={handleDecrement}
            title="Decrease amount (-$1)"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-[#121217] border border-zinc-300 dark:border-[#272732] flex items-center justify-center text-zinc-600 dark:text-zinc-400 font-bold text-xs hover:border-zinc-500 hover:text-black dark:hover:text-white active:scale-90 transition-all cursor-pointer shrink-0 select-none shadow-2xs"
          >
            <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Directly editable number input with auto-select on focus */}
          <div className="flex items-center font-mono text-xl xs:text-2xl sm:text-4xl font-black text-zinc-900 dark:text-[#f4f4f5]">
            <span className="text-[#ea6c52] mr-0.5">$</span>
            <input
              type="number"
              min={1}
              max={999999}
              step={1}
              value={currentBidAmount === 0 ? '' : currentBidAmount}
              onFocus={(e) => e.target.select()}
              onChange={(e) => {
                const raw = e.target.value;
                if (raw === '') {
                  onBidAmountChange(1);
                  return;
                }
                const val = parseInt(raw, 10);
                onBidAmountChange(isNaN(val) ? 1 : Math.max(1, val));
              }}
              placeholder="1"
              className="w-16 xs:w-24 sm:w-32 bg-transparent text-center font-mono font-black outline-none border-b-2 border-transparent focus:border-[#ea6c52] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none cursor-text"
            />
          </div>

          <button
            type="button"
            onClick={handleIncrement}
            title="Increase amount (+$1)"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-[#121217] border border-zinc-300 dark:border-[#272732] flex items-center justify-center text-zinc-600 dark:text-zinc-400 font-bold text-xs hover:border-zinc-500 hover:text-black dark:hover:text-white active:scale-90 transition-all cursor-pointer shrink-0 select-none shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        <span>?</span>
      </div>

      {/* Quick Amount Selection Chips ($1, $2, $5, $10, Take #1) */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={() => handleQuickSelect(1)}
          className={`px-3 py-1 rounded-full text-xs font-bold font-mono transition-all cursor-pointer border ${
            currentBidAmount === 1
              ? 'bg-[#ea6c52] text-white border-[#ea6c52] shadow-xs'
              : 'bg-zinc-100 dark:bg-[#181822] text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-[#272732] hover:border-zinc-400'
          }`}
        >
          $1 Min
        </button>

        <button
          type="button"
          onClick={() => handleQuickSelect(2)}
          className={`px-3 py-1 rounded-full text-xs font-bold font-mono transition-all cursor-pointer border ${
            currentBidAmount === 2
              ? 'bg-[#ea6c52] text-white border-[#ea6c52] shadow-xs'
              : 'bg-zinc-100 dark:bg-[#181822] text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-[#272732] hover:border-zinc-400'
          }`}
        >
          $2
        </button>

        <button
          type="button"
          onClick={() => handleQuickSelect(5)}
          className={`px-3 py-1 rounded-full text-xs font-bold font-mono transition-all cursor-pointer border ${
            currentBidAmount === 5
              ? 'bg-[#ea6c52] text-white border-[#ea6c52] shadow-xs'
              : 'bg-zinc-100 dark:bg-[#181822] text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-[#272732] hover:border-zinc-400'
          }`}
        >
          $5
        </button>

        <button
          type="button"
          onClick={() => handleQuickSelect(10)}
          className={`px-3 py-1 rounded-full text-xs font-bold font-mono transition-all cursor-pointer border ${
            currentBidAmount === 10
              ? 'bg-[#ea6c52] text-white border-[#ea6c52] shadow-xs'
              : 'bg-zinc-100 dark:bg-[#181822] text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-[#272732] hover:border-zinc-400'
          }`}
        >
          $10
        </button>

        {top1Price > 1 && (
          <button
            type="button"
            onClick={() => handleQuickSelect(top1Price)}
            className={`px-3.5 py-1 rounded-full text-xs font-bold font-mono flex items-center gap-1 transition-all cursor-pointer border ${
              currentBidAmount === top1Price
                ? 'bg-[#ea6c52] text-white border-[#ea6c52] shadow-xs'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:border-amber-500'
            }`}
          >
            <Trophy className="w-3 h-3" />
            <span>Take #1 (${top1Price})</span>
          </button>
        )}
      </div>

      {/* Subtitle */}
      <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-[#f87171] max-w-lg font-medium leading-relaxed px-2">
        New spots start at $1. Paying less than the #1 price still puts you on the board at whatever place that bid can take.
      </p>

      {/* Main Responsive Input Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-5 sm:mt-6 w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3"
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

        {/* Category Dropdown (All 28 SaaS Categories Supported) */}
        <div className="relative w-full sm:w-72 flex items-center">
          <div className="absolute left-4 pointer-events-none z-10">
            <CategoryIcon slug={category || 'ai-agents-infrastructure'} size="sm" />
          </div>
          <select
            value={category}
            onChange={(e) => {
              const newCat = e.target.value;
              setCategory(newCat);
              onCategoryChange?.(newCat);
            }}
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

        {/* 3D Tactile Highlighted Rankbid Button (Clean label without money sign) */}
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
