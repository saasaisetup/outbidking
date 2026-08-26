'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Loader2, ShieldCheck, Globe, Crown, Upload, Image as ImageIcon, CreditCard, CheckCircle2, ChevronDown } from 'lucide-react';
import { PlatformStats } from '@/lib/types';
import { CATEGORIES } from '@/lib/categories';
import { CategoryIcon } from './CategoryIcon';

interface BidModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialUrl?: string;
  initialBidAmount?: number;
  initialCategory?: string;
  stats: PlatformStats;
  onBidSuccess: () => void;
}

export function BidModal({
  isOpen,
  onClose,
  initialUrl = '',
  initialBidAmount = 1,
  initialCategory = 'ai-agents-infrastructure',
  stats,
  onBidSuccess,
}: BidModalProps) {
  const [url, setUrl] = useState(initialUrl);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [bidAmount, setBidAmount] = useState(initialBidAmount);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isCustomLogo, setIsCustomLogo] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingAvatar, setIsFetchingAvatar] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Top price to grab rank #1
  const kingBid = stats?.currentKing?.totalBid || 0;
  const takeNumberOneAmount = kingBid > 0 ? kingBid + 1 : 1;

  const fetchAvatarAndMeta = async (inputUrl: string) => {
    const trimmed = inputUrl.trim();
    if (!trimmed) {
      if (!isCustomLogo) setAvatarUrl(null);
      setTitle('');
      return;
    }

    try {
      setIsFetchingAvatar(true);
      const res = await fetch(`/api/avatar?input=${encodeURIComponent(trimmed)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.logoUrl && !isCustomLogo) {
          setAvatarUrl(data.logoUrl);
        }
        if (data.title && !title) {
          setTitle(data.title);
        }
      }
    } catch {
      // Fallback
    } finally {
      setIsFetchingAvatar(false);
    }
  };

  useEffect(() => {
    if (initialUrl) {
      setUrl(initialUrl);
      fetchAvatarAndMeta(initialUrl);
    }
    if (initialBidAmount) {
      setBidAmount(initialBidAmount);
    }
    if (initialCategory) {
      setCategory(initialCategory);
    }
  }, [initialUrl, initialBidAmount, initialCategory]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      setErrorMessage('Image size exceeds 3MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarUrl(reader.result as string);
      setIsCustomLogo(true);
      setErrorMessage('');
    };
    reader.readAsDataURL(file);
  };

  const addAmount = (increment: number) => {
    setBidAmount((prev) => Math.max(1, prev + increment));
  };

  const handleSetTakeNumberOne = () => {
    setBidAmount(takeNumberOneAmount);
  };

  const handleSubmitDodoBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setErrorMessage('Please provide a valid website URL or @handle');
      return;
    }
    if (bidAmount < 1) {
      setErrorMessage('Minimum bid is $1');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      let finalTitle = title.trim();
      const cleanUrl = url.trim().toLowerCase();
      if (!finalTitle) {
        if (cleanUrl.startsWith('@')) {
          finalTitle = cleanUrl;
        } else if (cleanUrl.includes('x.com/') || cleanUrl.includes('twitter.com/')) {
          const handle = cleanUrl.replace(/^(https?:\/\/)?(www\.)?(x\.com|twitter\.com)\//, '').split('/')[0].split('?')[0].replace(/^@/, '');
          finalTitle = `@${handle}`;
        } else {
          finalTitle = url.trim().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
        }
      }

      const clientOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://outbidking.lol';

      const res = await fetch('/api/dodo/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url.trim(),
          title: finalTitle,
          description: description?.trim() || '',
          category,
          bidAmount,
          logoUrl: avatarUrl,
          origin: clientOrigin,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.paymentLink) {
        setErrorMessage(data.error || 'Failed to create Dodo Payments checkout');
        setIsLoading(false);
        return;
      }

      // Redirect directly to official Dodo Payments checkout page
      window.location.href = data.paymentLink;
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong creating checkout');
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#121217] border border-zinc-200 dark:border-[#272732] shadow-2xl p-4 sm:p-6 my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#ea6c52] text-white flex items-center justify-center shadow-xs">
              <Crown className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                Claim Your Spot on the Board
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Instant ranking activation starting at <span className="font-bold text-[#ea6c52]">$1 USD</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-300 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmitDodoBid} className="mt-3.5 space-y-3.5 overflow-y-auto pr-1 flex-1 pb-2">
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          {/* URL Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Website URL or X @handle <span className="text-[#ea6c52]">*</span>
              </label>
              {isFetchingAvatar && (
                <span className="text-[10px] text-amber-500 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> Fetching live logo...
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-zinc-50 dark:bg-[#181822] border border-zinc-200 dark:border-[#272732] shadow-xs focus-within:border-[#ea6c52] transition-colors">
              {avatarUrl ? (
                <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={avatarUrl}
                    alt="Logo"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={() => setAvatarUrl(null)}
                  />
                </div>
              ) : (
                <Globe className="w-4 h-4 text-zinc-400 flex-shrink-0" />
              )}
              <input
                type="text"
                required
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  fetchAvatarAndMeta(e.target.value);
                }}
                placeholder="e.g. https://myproduct.com or @shipxankit"
                className="w-full bg-transparent text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none font-medium"
              />
            </div>
          </div>

          {/* Logo Preview & 3D Side Upload Button */}
          <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-[#181822] border border-zinc-200 dark:border-[#272732] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-black/40 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                {avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={avatarUrl} alt="Logo" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-zinc-400" />
                )}
              </div>
              <div className="text-left min-w-0">
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">
                  {isCustomLogo ? 'Custom Logo Uploaded' : avatarUrl ? 'Live Profile Logo' : 'Logo / Favicon'}
                </p>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                  {avatarUrl ? 'Ready for leaderboard display' : 'Automatically extracted from link'}
                </p>
              </div>
            </div>

            {/* 3D Side Upload Button */}
            <label className="px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-b from-[#ff7a59] via-[#ea6c52] to-[#d95b41] hover:brightness-105 border-t border-[#ff9e80] text-white font-black text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-[0_3px_0_0_#b8432a] active:shadow-[0_1px_0_0_#b8432a] active:translate-y-[1.5px] shrink-0 select-none">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          {/* Product Title / Display Name */}
          <div>
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
              Display Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Product or brand name (optional)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-[#181822] border border-zinc-200 dark:border-[#272732] text-xs font-semibold text-zinc-900 dark:text-white focus:outline-none focus:border-[#ea6c52]"
            />
          </div>

          {/* Category Dropdown with Unified CategoryIcon */}
          <div>
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
              Category <span className="text-[#ea6c52]">*</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 pointer-events-none z-10">
                <CategoryIcon slug={category || 'ai-agents-infrastructure'} size="xs" />
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full py-2.5 pl-10 pr-9 rounded-2xl bg-zinc-50 dark:bg-[#181822] border border-zinc-200 dark:border-[#272732] text-xs font-semibold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[#ea6c52] cursor-pointer appearance-none"
              >
                {CATEGORIES.filter((c) => c.slug !== 'all').map((c) => (
                  <option key={c.slug} value={c.slug} className="dark:bg-[#121217] text-zinc-900 dark:text-zinc-200">
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          {/* Amount Customizer & "Take #1" Action */}
          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-[#181822] border border-zinc-200 dark:border-[#272732] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Your Bid Amount (USD)
              </span>
              <button
                type="button"
                onClick={handleSetTakeNumberOne}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ea6c52]/15 text-[#ea6c52] dark:text-[#f87171] border border-[#ea6c52]/30 text-[11px] font-black hover:bg-[#ea6c52]/25 transition-all cursor-pointer"
              >
                <Crown className="w-3 h-3 fill-current" />
                <span>Take #1 Spot (${takeNumberOneAmount.toLocaleString()})</span>
              </button>
            </div>

            {/* Direct Editable Currency Input */}
            <div className="relative flex items-center px-3.5 py-2 rounded-xl bg-white dark:bg-[#121217] border border-zinc-300 dark:border-zinc-700 shadow-inner">
              <span className="text-xl font-black text-zinc-400 mr-2 font-mono">$</span>
              <input
                type="number"
                min={1}
                max={999999}
                value={bidAmount || ''}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setBidAmount(isNaN(val) ? 1 : Math.max(1, val));
                }}
                placeholder="1"
                className="w-full bg-transparent text-2xl font-mono font-black text-zinc-900 dark:text-white outline-none"
              />
            </div>

            {/* Quick Add Increment Pills */}
            <div className="flex items-center justify-between gap-1.5 pt-0.5">
              <span className="text-[11px] text-zinc-400 font-medium">Quick add:</span>
              <div className="flex items-center gap-1.5">
                {[1, 5, 25, 100, 500].map((inc) => (
                  <button
                    key={inc}
                    type="button"
                    onClick={() => addAmount(inc)}
                    className="px-2.5 py-1 rounded-xl bg-white dark:bg-[#121217] border border-zinc-200 dark:border-zinc-700 text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer active:scale-95 shadow-2xs"
                  >
                    +${inc}
                  </button>
                ))}
              </div>
            </div>

            {/* Real-time Rank Forecast */}
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium pt-1 flex items-center gap-1.5 border-t border-zinc-200/60 dark:border-zinc-800">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ea6c52]" />
              {bidAmount >= takeNumberOneAmount ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  👑 Puts you at RANK #1 on the board!
                </span>
              ) : (
                <span>
                  Your bid of <span className="font-bold text-zinc-900 dark:text-white font-mono">${bidAmount}</span> puts you on the live leaderboard.
                </span>
              )}
            </div>
          </div>

          {/* Highlighted Dodo Payments Option Badge */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-[#ea6c52]/10 via-[#f97316]/10 to-transparent border border-[#ea6c52]/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#ea6c52] text-white flex items-center justify-center shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-zinc-900 dark:text-white">
                    Dodo Payments Secure Checkout
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                  Credit Card · Apple Pay · Google Pay · 100% Secure
                </p>
              </div>
            </div>
            <span className="text-[9px] font-mono font-black px-2 py-0.5 rounded-full bg-[#ea6c52] text-white tracking-wider">
              LIVE
            </span>
          </div>

          {/* 3D Tactile Big Confirm Button */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={isLoading || !url.trim() || bidAmount < 1}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-b from-[#ff7a59] via-[#ea6c52] to-[#d95b41] hover:brightness-105 border-t border-[#ff9e80] text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer select-none transition-all shadow-[0_4px_0_0_#b8432a,0_8px_18px_rgba(234,108,82,0.4)] active:shadow-[0_1px_0_0_#b8432a] active:translate-y-[3px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
                    Claim Rank for ${bidAmount.toLocaleString()} USD
                  </span>
                </>
              )}
            </button>
          </div>

          <p className="text-center text-[10px] text-zinc-400 pb-1">
            Official Dodo Payments checkout · Instant live activation
          </p>
        </form>
      </div>
    </div>
  );
}
