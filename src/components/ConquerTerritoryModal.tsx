'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, ShieldCheck, Globe, Swords, Lock, ExternalLink } from 'lucide-react';
import { TerritoryState } from '@/lib/types';
import { CATEGORIES } from '@/lib/categories';

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
  const [customerEmail, setCustomerEmail] = useState('');

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

      const res = await fetch('/api/dodo/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isTerritory: true,
          countryCode: territory.countryCode,
          title: finalTitle,
          url: url.trim(),
          category,
          bidAmount,
          logoUrl: faviconUrl,
          email: customerEmail.trim() || undefined,
          returnUrl: `${window.location.origin}/map`,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.paymentLink) {
        setErrorMessage(data.error || 'Failed to create Dodo Payments checkout');
        setIsLoading(false);
        return;
      }

      // Redirect to Dodo checkout
      window.location.href = data.paymentLink;
    } catch (err: any) {
      setErrorMessage(err.message || 'Error processing conquest');
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
              {territory.tier} · Population: {territory.population}
            </p>
          </div>
        </div>

        {/* Current Ruler Status */}
        {territory.currentRuler ? (
          <div className="my-4 p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="w-4 h-4 rounded-full border border-white/20"
                style={{ backgroundColor: territory.currentRuler.color }}
              />
              <div>
                <p className="text-xs font-mono font-bold text-zinc-200">
                  Ruled by: <span className="text-amber-400">{territory.currentRuler.title}</span>
                </p>
                <p className="text-[10px] font-mono text-zinc-500">
                  Bid: ${territory.currentBid} · Clicks: {territory.clicks}
                </p>
              </div>
            </div>
            <span className="px-2 py-1 rounded-lg text-[10px] font-mono font-black bg-red-500/10 text-red-400 border border-red-500/20">
              UNDER OCCUPATION
            </span>
          </div>
        ) : (
          <div className="my-4 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-mono font-bold text-emerald-300">
                {territory.isOceanFleet ? 'Strategic Naval Corridor' : 'Unclaimed Sovereign Land'}
              </span>
            </div>
            <span className="text-xs font-mono font-black text-emerald-400">
              Starting ${minPrice}
            </span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleConquer} className="space-y-4">
          {/* Empire Name / Title */}
          <div>
            <label className="text-xs font-mono font-bold text-zinc-400 block mb-1">
              EMPIRE NAME <span className="text-[#ea6c52]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. OpenAI or @sama"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090c] border border-zinc-800 focus:border-[#ea6c52] text-sm text-white placeholder-zinc-600 outline-none font-medium"
            />
          </div>

          {/* URL / Handle Input */}
          <div>
            <label className="text-xs font-mono font-bold text-zinc-400 block mb-1">
              DOMAIN URL OR @HANDLE <span className="text-[#ea6c52]">*</span>
            </label>
            <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#09090c] border border-zinc-800 focus-within:border-[#ea6c52]">
              {isXHandle ? (
                <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black flex-shrink-0">
                  𝕏
                </div>
              ) : faviconUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={faviconUrl}
                  alt=""
                  className="w-5 h-5 rounded object-contain flex-shrink-0 bg-white p-0.5"
                  onError={() => setFaviconUrl(null)}
                />
              ) : (
                <Globe className="w-4 h-4 text-zinc-600 flex-shrink-0" />
              )}
              <input
                type="text"
                required
                placeholder="e.g. https://myproject.com or @handle"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-zinc-600 outline-none font-medium"
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="text-xs font-mono font-bold text-zinc-400 block mb-1">
              SECTOR / CATEGORY
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090c] border border-zinc-800 focus:border-[#ea6c52] text-xs text-zinc-200 outline-none cursor-pointer"
            >
              {CATEGORIES.filter((c) => c.slug !== 'all').map((c) => (
                <option key={c.slug} value={c.slug} className="bg-[#111116]">
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Bid Customizer */}
          <div className="p-3.5 rounded-2xl bg-[#09090c] border border-zinc-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-zinc-400">
                CONQUEST BID (MIN ${minPrice})
              </span>
              <span className="text-xs font-mono text-[#ea6c52]">
                Min outbid: ${minPrice}
              </span>
            </div>

            <div className="relative flex items-center px-4 py-2 rounded-xl bg-[#111116] border border-zinc-700">
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
              <span className="text-[11px] font-mono text-zinc-500">Quick add:</span>
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

          {/* Dodo Payments Badge */}
          <div className="p-3 rounded-xl bg-[#ea6c52]/10 border border-[#ea6c52]/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#ea6c52]" />
              <span className="text-xs font-mono font-bold text-zinc-200">
                Dodo Payments Checkout
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#ea6c52] text-white">
              TEST MODE
            </span>
          </div>

          {/* Confirm Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !url.trim() || bidAmount < minPrice}
              className="w-full py-3.5 rounded-2xl bg-[#ea6c52] hover:bg-[#d95b41] text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer select-none transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(234,108,82,0.35)]"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Swords className="w-4 h-4" />
                  <span>Conquer {territory.countryName} for ${bidAmount.toLocaleString()}</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                </>
              )}
            </button>
          </div>

          <p className="text-center text-[10px] font-mono text-zinc-500">
            Secure checkout via Dodo Payments. Paints {territory.flag} {territory.countryName} instantly.
          </p>
        </form>
      </div>
    </div>
  );
}
