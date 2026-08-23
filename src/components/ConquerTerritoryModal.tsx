'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, ShieldCheck, Zap, CreditCard, Wallet, Globe, Swords, Crown, Sparkles } from 'lucide-react';
import { TerritoryState } from '@/lib/types';
import { CATEGORIES } from '@/lib/categories';
import confetti from 'canvas-confetti';
import { soundManager } from '@/lib/sound';

interface ConquerTerritoryModalProps {
  territory: TerritoryState | null;
  isOpen: boolean;
  onClose: () => void;
  onConquerSuccess: () => void;
}

export function ConquerTerritoryModal({
  territory,
  isOpen,
  onClose,
  onConquerSuccess,
}: ConquerTerritoryModalProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('ai-agents-infrastructure');
  const [bidAmount, setBidAmount] = useState(4);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
  const [isXHandle, setIsXHandle] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'sandbox' | 'crypto' | 'lemonsqueezy' | 'stripe'>('sandbox');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (territory) {
      const minPrice = territory.currentRuler ? territory.currentBid + 1 : territory.currentBid || 3;
      setBidAmount(minPrice);
      setErrorMessage('');
    }
  }, [territory]);

  if (!isOpen || !territory) return null;

  const handleUrlChange = (val: string) => {
    setUrl(val);
    const trimmed = val.trim();
    if (trimmed.startsWith('@') || trimmed.includes('x.com/') || trimmed.includes('twitter.com/')) {
      setIsXHandle(true);
      const cleanHandle = trimmed.replace(/^@/, '').replace(/^(https?:\/\/)?(www\.)?(x\.com|twitter\.com)\//, '').split('/')[0];
      setTitle(`@${cleanHandle}`);
      setFaviconUrl(`https://unavatar.io/twitter/${cleanHandle}`);
    } else if (trimmed.includes('.')) {
      setIsXHandle(false);
      const domain = trimmed.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
      setTitle(domain);
      setFaviconUrl(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
    } else {
      setFaviconUrl(null);
      setIsXHandle(false);
    }
  };

  const handleConquer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setErrorMessage('Please provide your website URL or @handle');
      return;
    }
    const minPrice = territory.currentRuler ? territory.currentBid + 1 : territory.currentBid || 3;
    if (bidAmount < minPrice) {
      setErrorMessage(`Minimum conquest bid is $${minPrice}`);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');

      let finalTitle = title.trim();
      if (!finalTitle) {
        finalTitle = url.trim().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
      }

      const res = await fetch('/api/territories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          countryCode: territory.countryCode,
          title: finalTitle,
          url: url.trim(),
          bidAmount,
          logoUrl: faviconUrl,
          category,
          paymentProvider: paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Failed to conquer territory');
        setIsLoading(false);
        return;
      }

      soundManager.playKingGong();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.4 } });

      onConquerSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Error processing conquest');
    } finally {
      setIsLoading(false);
    }
  };

  const minPrice = territory.currentRuler ? territory.currentBid + 1 : territory.currentBid || 3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#111116] border border-zinc-800 shadow-2xl p-6 sm:p-7 text-white font-sans animate-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Country Header */}
        <div className="flex items-center gap-3.5 mb-2">
          <span className="text-3xl sm:text-4xl">{territory.flag}</span>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
              <span>Conquer {territory.countryName}</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                {territory.countryCode}
              </span>
            </h2>
            <p className="text-xs font-mono text-zinc-400">
              Population: {territory.population} · Total Plunder: ${territory.totalPlunder.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Territory Status Box */}
        <div className="my-4 p-3.5 rounded-2xl bg-[#17171d] border border-zinc-800/80 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-mono text-zinc-400 uppercase">Current Territory Status</p>
            {territory.currentRuler ? (
              <div className="flex items-center gap-2 mt-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: territory.currentRuler.color }}
                />
                <span className="text-sm font-bold text-zinc-100">{territory.currentRuler.title}</span>
                <span className="text-xs font-mono text-amber-400 font-bold">(${territory.currentBid})</span>
              </div>
            ) : (
              <span className="text-sm font-bold text-emerald-400 mt-1 inline-block">
                🌱 Unclaimed Land (Open for conquest)
              </span>
            )}
          </div>

          <div className="text-right">
            <p className="text-[11px] font-mono text-zinc-400 uppercase">Price to Rule</p>
            <p className="text-xl font-mono font-black text-[#ea6c52] mt-0.5">
              ${minPrice}
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleConquer} className="space-y-4">
          {/* Website / Handle Input */}
          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1">
              Your Product URL or @handle <span className="text-[#ea6c52]">*</span>
            </label>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-[#0d0d11] border border-zinc-800 shadow-inner focus-within:border-[#ea6c52] transition-colors">
              {isXHandle ? (
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black flex-shrink-0">
                  𝕏
                </div>
              ) : faviconUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={faviconUrl}
                  alt=""
                  className="w-5 h-5 rounded-md object-contain flex-shrink-0 bg-white p-0.5"
                  onError={() => setFaviconUrl(null)}
                />
              ) : (
                <Globe className="w-4 h-4 text-zinc-500 flex-shrink-0" />
              )}
              <input
                type="text"
                required
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="e.g. https://myproduct.com or @handle"
                className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none font-medium"
              />
            </div>
          </div>

          {/* Product Title */}
          {title && (
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">
                Display Brand / Name
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#0d0d11] border border-zinc-800 text-xs font-semibold text-white focus:outline-none focus:border-[#ea6c52]"
              />
            </div>
          )}

          {/* Amount Stepper & Custom Price */}
          <div className="p-3.5 rounded-2xl bg-[#17171d] border border-zinc-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-300">Conquest Bid Amount</span>
              <span className="text-[11px] font-mono text-zinc-400">Min ${minPrice}</span>
            </div>

            <div className="relative flex items-center px-4 py-2 rounded-xl bg-[#0d0d11] border border-zinc-800">
              <span className="text-xl font-black text-zinc-500 mr-2 font-mono">$</span>
              <input
                type="number"
                min={minPrice}
                max={999999}
                value={bidAmount || ''}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setBidAmount(isNaN(val) ? 0 : val);
                }}
                className="w-full bg-transparent text-2xl font-mono font-black text-white outline-none"
              />
            </div>

            <div className="flex items-center justify-between gap-1.5 pt-1">
              <span className="text-[11px] text-zinc-500">Quick add:</span>
              <div className="flex items-center gap-1.5">
                {[1, 5, 25, 50, 100].map((inc) => (
                  <button
                    key={inc}
                    type="button"
                    onClick={() => setBidAmount((prev) => prev + inc)}
                    className="px-2.5 py-1 rounded-xl bg-[#0d0d11] border border-zinc-800 hover:border-zinc-700 text-xs font-mono font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  >
                    +${inc}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1.5">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('sandbox')}
                className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  paymentMethod === 'sandbox'
                    ? 'border-[#ea6c52] bg-[#ea6c52]/15 text-white shadow-xs'
                    : 'border-zinc-800 bg-[#0d0d11] text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-current" />
                <span>Instant Test</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('crypto')}
                className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  paymentMethod === 'crypto'
                    ? 'border-[#ea6c52] bg-[#ea6c52]/15 text-white shadow-xs'
                    : 'border-zinc-800 bg-[#0d0d11] text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <Wallet className="w-3.5 h-3.5 text-purple-400" />
                <span>Crypto (USDT)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('lemonsqueezy')}
                className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  paymentMethod === 'lemonsqueezy'
                    ? 'border-[#ea6c52] bg-[#ea6c52]/15 text-white shadow-xs'
                    : 'border-zinc-800 bg-[#0d0d11] text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                <span>Card / Apple Pay</span>
              </button>
            </div>
          </div>

          {/* Confirm Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !url.trim() || bidAmount < minPrice}
              className="w-full py-3.5 rounded-2xl bg-[#ea6c52] hover:bg-[#d95b41] border border-[#d95b41] shadow-[0_4px_0_0_#b8452e] active:translate-y-[2px] active:shadow-[0_2px_0_0_#b8452e] text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer select-none transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Swords className="w-4 h-4" />
                  <span>Conquer {territory.countryName} for ${bidAmount.toLocaleString()}</span>
                </>
              )}
            </button>
          </div>

          <p className="text-center text-[10px] font-mono text-zinc-500">
            Instantly paints {territory.flag} {territory.countryName} with your brand color on the world map.
          </p>
        </form>
      </div>
    </div>
  );
}
