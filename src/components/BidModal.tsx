'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, ShieldCheck, Zap, CreditCard, Wallet, Globe, Crown, Sparkles } from 'lucide-react';
import { PlatformStats } from '@/lib/types';
import { CATEGORIES } from '@/lib/categories';
import confetti from 'canvas-confetti';
import { soundManager } from '@/lib/sound';

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
  initialBidAmount = 6,
  initialCategory = 'ai-agents-infrastructure',
  stats,
  onBidSuccess,
}: BidModalProps) {
  const [url, setUrl] = useState(initialUrl);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [bidAmount, setBidAmount] = useState(initialBidAmount);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
  const [isXHandle, setIsXHandle] = useState(false);
  const [isInstagram, setIsInstagram] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'sandbox' | 'crypto' | 'lemonsqueezy' | 'stripe'>('sandbox');

  const [isLoading, setIsLoading] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Top price to grab rank #1
  const kingBid = stats?.currentKing?.totalBid || 14043;
  const takeNumberOneAmount = kingBid + 5;

  const detectAndScrapeUrl = async (inputUrl: string) => {
    const trimmed = inputUrl.trim();
    if (!trimmed) {
      setFaviconUrl(null);
      setIsXHandle(false);
      setIsInstagram(false);
      setTitle('');
      return;
    }

    // 1. Social Handle Detection
    if (trimmed.startsWith('@') || trimmed.includes('x.com/') || trimmed.includes('twitter.com/')) {
      setIsXHandle(true);
      setIsInstagram(false);
      const cleanHandle = trimmed.replace(/^@/, '').replace(/^(https?:\/\/)?(www\.)?(x\.com|twitter\.com)\//, '').split('/')[0].split('?')[0];
      setTitle(`@${cleanHandle}`);
      setFaviconUrl(`https://unavatar.io/twitter/${cleanHandle}`);
      return;
    }

    if (trimmed.includes('instagram.com/')) {
      setIsInstagram(true);
      setIsXHandle(false);
      const cleanHandle = trimmed.replace(/^(https?:\/\/)?(www\.)?instagram\.com\//, '').split('/')[0].split('?')[0].replace(/^@/, '');
      setTitle(`@${cleanHandle}`);
      setFaviconUrl('https://www.google.com/s2/favicons?domain=instagram.com&sz=128');
      return;
    }

    setIsXHandle(false);
    setIsInstagram(false);

    // 2. Standard Website URL Detection
    const domain = trimmed.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    setTitle(domain);
    setFaviconUrl(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);

    // 3. Auto-scrape high-res metadata
    if (trimmed.includes('.')) {
      try {
        setIsScraping(true);
        const res = await fetch('/api/scrape-meta', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: trimmed }),
        });
        if (res.ok) {
          const meta = await res.json();
          if (meta.title) setTitle(meta.title);
          if (meta.description) setDescription(meta.description);
          if (meta.logoUrl) setFaviconUrl(meta.logoUrl);
        }
      } catch {
        // keep fallback
      } finally {
        setIsScraping(false);
      }
    }
  };

  useEffect(() => {
    if (initialUrl) {
      setUrl(initialUrl);
      detectAndScrapeUrl(initialUrl);
    }
    if (initialBidAmount) {
      setBidAmount(initialBidAmount);
    }
    if (initialCategory) {
      setCategory(initialCategory);
    }
  }, [initialUrl, initialBidAmount, initialCategory]);

  const handleUrlChange = (val: string) => {
    setUrl(val);
    const trimmed = val.trim();
    if (trimmed.startsWith('@') || trimmed.includes('x.com/') || trimmed.includes('twitter.com/')) {
      setIsXHandle(true);
      setIsInstagram(false);
      const cleanHandle = trimmed.replace(/^@/, '').replace(/^(https?:\/\/)?(www\.)?(x\.com|twitter\.com)\//, '').split('/')[0];
      setTitle(`@${cleanHandle}`);
      setFaviconUrl(`https://unavatar.io/twitter/${cleanHandle}`);
    } else if (trimmed.includes('instagram.com/')) {
      setIsInstagram(true);
      setIsXHandle(false);
      const cleanHandle = trimmed.replace(/^(https?:\/\/)?(www\.)?instagram\.com\//, '').split('/')[0].split('?')[0].replace(/^@/, '');
      setTitle(`@${cleanHandle}`);
    } else if (trimmed.includes('.')) {
      setIsXHandle(false);
      setIsInstagram(false);
      const domain = trimmed.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
      setTitle(domain);
      setFaviconUrl(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
    } else {
      setFaviconUrl(null);
      setIsXHandle(false);
      setIsInstagram(false);
    }
  };

  const addAmount = (increment: number) => {
    setBidAmount((prev) => prev + increment);
  };

  const handleSetTakeNumberOne = () => {
    setBidAmount(takeNumberOneAmount);
  };

  const handleSubmitBid = async (selectedMethod: 'sandbox' | 'crypto' | 'lemonsqueezy' | 'stripe') => {
    if (!url.trim()) {
      setErrorMessage('Please provide a valid website URL or @handle');
      return;
    }
    if (bidAmount < 5) {
      setErrorMessage('Minimum bid is $5');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');

      let finalTitle = title.trim();
      if (!finalTitle) {
        finalTitle = isXHandle || isInstagram ? url.trim() : url.trim().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
      }

      // If Stripe
      if (selectedMethod === 'stripe') {
        const res = await fetch('/api/stripe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: url.trim(),
            title: finalTitle,
            description,
            category,
            bidAmount,
            logoUrl: faviconUrl,
          }),
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
          return;
        } else {
          setErrorMessage(data.error || 'Stripe keys not configured. Use Instant Test or Crypto payment.');
          setIsLoading(false);
          return;
        }
      }

      // If Sandbox or Crypto or LemonSqueezy Demo
      const res = await fetch('/api/bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url.trim(),
          title: finalTitle,
          description,
          category,
          bidAmount,
          logoUrl: faviconUrl,
          paymentProvider: selectedMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Failed to place bid');
        setIsLoading(false);
        return;
      }

      // Success
      if (data.isNewKing) {
        soundManager.playKingGong();
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.4 } });
      } else {
        soundManager.playCashChing();
        confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
      }

      onBidSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while submitting');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#181613] border border-zinc-200 dark:border-[#2e2a24] shadow-2xl p-6 sm:p-7 text-zinc-900 dark:text-white font-sans animate-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header with Outbid Brand Logo Badge */}
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-2xl bg-[#ea6c52] text-white flex flex-col justify-center items-center gap-1 p-2 shadow-xs flex-shrink-0">
            <div className="w-4 h-1 rounded-full bg-white/90" />
            <div className="w-5 h-1 rounded-full bg-white" />
            <div className="w-3.5 h-1 rounded-full bg-white/90" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Claim Your Spot on the Board
          </h2>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
          Non-consumable bid. Enter any website URL or social handle to claim your live rank.
        </p>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleSubmitBid(paymentMethod); }} className="space-y-4">
          {/* URL / Handle Input with Live Detection */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Website URL or X @handle <span className="text-[#ea6c52]">*</span>
              </label>
              {isScraping && (
                <span className="text-[10px] text-amber-500 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> Detecting site...
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-zinc-50 dark:bg-[#12100e] border border-zinc-200 dark:border-[#2e2a24] shadow-xs focus-within:border-[#4ade80] transition-colors">
              {isXHandle ? (
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black flex-shrink-0">
                  𝕏
                </div>
              ) : isInstagram ? (
                <div className="w-6 h-6 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
                    <defs>
                      <radialGradient id="ig-modal-grad-2" cx="25%" cy="110%" r="130%">
                        <stop offset="0%" stopColor="#fdf497" />
                        <stop offset="10%" stopColor="#fdf497" />
                        <stop offset="45%" stopColor="#fd5949" />
                        <stop offset="65%" stopColor="#d6249f" />
                        <stop offset="95%" stopColor="#285AEB" />
                      </radialGradient>
                    </defs>
                    <rect width="24" height="24" rx="5" fill="url(#ig-modal-grad-2)" />
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
                  className="w-6 h-6 rounded-md object-contain flex-shrink-0 bg-white p-0.5"
                  onError={() => setFaviconUrl(null)}
                />
              ) : (
                <Globe className="w-5 h-5 text-zinc-400 flex-shrink-0" />
              )}
              <input
                type="text"
                required
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                onBlur={() => detectAndScrapeUrl(url)}
                placeholder="e.g. https://myproduct.com or @handle"
                className="w-full bg-transparent text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none font-medium"
              />
            </div>
          </div>

          {/* Product Title / Display Name */}
          {title && (
            <div>
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                Display Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Product or brand name"
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-[#12100e] border border-zinc-200 dark:border-[#2e2a24] text-xs font-semibold text-zinc-900 dark:text-white focus:outline-none focus:border-[#ea6c52]"
              />
            </div>
          )}

          {/* Category Dropdown */}
          <div>
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
              Category <span className="text-[#ea6c52]">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-zinc-50 dark:bg-[#12100e] border border-zinc-200 dark:border-[#2e2a24] text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-[#ea6c52] cursor-pointer"
            >
              {CATEGORIES.filter((c) => c.slug !== 'all').map((c) => (
                <option key={c.slug} value={c.slug} className="dark:bg-[#181613]">
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Direct Amount Customizer & "Take #1" Action */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#12100e] border border-zinc-200 dark:border-[#2e2a24] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Bid Amount
              </span>
              <button
                type="button"
                onClick={handleSetTakeNumberOne}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ea6c52]/15 text-[#ea6c52] dark:text-[#f87171] border border-[#ea6c52]/30 text-[11px] font-black hover:bg-[#ea6c52]/25 transition-all cursor-pointer"
              >
                <Crown className="w-3 h-3 fill-current" />
                <span>Take #1 Spot (${takeNumberOneAmount.toLocaleString()})</span>
              </button>
            </div>

            {/* Direct Editable Currency Input */}
            <div className="relative flex items-center px-4 py-2.5 rounded-xl bg-white dark:bg-[#181613] border border-zinc-300 dark:border-zinc-700 shadow-inner">
              <span className="text-xl font-black text-zinc-400 mr-2 font-mono">$</span>
              <input
                type="number"
                min={5}
                max={999999}
                value={bidAmount || ''}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setBidAmount(isNaN(val) ? 0 : val);
                }}
                placeholder="Enter any amount"
                className="w-full bg-transparent text-2xl font-mono font-black text-zinc-900 dark:text-white outline-none"
              />
            </div>

            {/* Quick Add Increment Pills */}
            <div className="flex items-center justify-between gap-1.5 pt-1">
              <span className="text-[11px] text-zinc-400 font-medium">Quick add:</span>
              <div className="flex items-center gap-1.5">
                {[5, 25, 100, 500, 1000].map((inc) => (
                  <button
                    key={inc}
                    type="button"
                    onClick={() => addAmount(inc)}
                    className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#181613] border border-zinc-200 dark:border-zinc-700 text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer active:scale-95 shadow-2xs"
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

          {/* Payment Method Selector */}
          <div>
            <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1.5">
              Select Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('sandbox')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  paymentMethod === 'sandbox'
                    ? 'border-[#ea6c52] bg-[#ea6c52]/10 text-zinc-900 dark:text-white shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-400'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-500 fill-current" />
                <span>Instant Test</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('crypto')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  paymentMethod === 'crypto'
                    ? 'border-[#ea6c52] bg-[#ea6c52]/10 text-zinc-900 dark:text-white shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-400'
                }`}
              >
                <Wallet className="w-4 h-4 text-purple-400" />
                <span>Crypto (USDT)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('lemonsqueezy')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  paymentMethod === 'lemonsqueezy'
                    ? 'border-[#ea6c52] bg-[#ea6c52]/10 text-zinc-900 dark:text-white shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-400'
                }`}
              >
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>Card / Apple Pay</span>
              </button>
            </div>
          </div>

          {/* Tactile Big Confirm Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !url.trim() || bidAmount < 5}
              className="w-full py-3.5 rounded-2xl bg-[#52d489] hover:bg-[#45c77c] border border-[#3cb56e] shadow-[0_4px_0_0_#2b8a53] active:translate-y-[2px] active:shadow-[0_2px_0_0_#2b8a53] text-black font-black text-sm flex items-center justify-center gap-2 cursor-pointer select-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirm Bid & Pay ${bidAmount.toLocaleString()}</span>
                </>
              )}
            </button>
          </div>

          <p className="text-center text-[10px] text-zinc-400">
            Encrypted payment · No subscription · Live on board instantly
          </p>
        </form>
      </div>
    </div>
  );
}
