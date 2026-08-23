'use client';

import React, { useState, useEffect } from 'react';
import { X, ExternalLink, ShieldCheck, Zap, CreditCard, Wallet, Globe, Swords, Sparkles, Loader2 } from 'lucide-react';
import { TerritoryState } from '@/lib/types';
import { EMPIRE_COLORS, calcMinOutbid } from '@/lib/worldData';
import confetti from 'canvas-confetti';
import { soundManager } from '@/lib/sound';

interface CommandSideDrawerProps {
  territory: TerritoryState | null;
  isOpen: boolean;
  onClose: () => void;
  onConquerSuccess: () => void;
}

export function CommandSideDrawer({
  territory,
  isOpen,
  onClose,
  onConquerSuccess,
}: CommandSideDrawerProps) {
  const [empireName, setEmpireName] = useState('');
  const [url, setUrl] = useState('');
  const [warCry, setWarCry] = useState('');
  const [bidAmount, setBidAmount] = useState(25);
  const [selectedColor, setSelectedColor] = useState(EMPIRE_COLORS[0]);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);
  const [isXHandle, setIsXHandle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const minBid = territory?.minOutbidPrice || (territory?.currentBid ? calcMinOutbid(territory.currentBid) : territory?.isOceanFleet ? 25 : 3);
  const defenseWallCost = Math.ceil(bidAmount * 1.5);

  useEffect(() => {
    if (territory) {
      const calculatedMin = territory.minOutbidPrice || (territory.currentBid ? calcMinOutbid(territory.currentBid) : territory.isOceanFleet ? 25 : 3);
      setBidAmount(calculatedMin);
      setSelectedColor(territory.defaultColor || EMPIRE_COLORS[0]);
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
      if (!empireName) setEmpireName(`@${cleanHandle}`);
      setFaviconUrl(`https://unavatar.io/twitter/${cleanHandle}`);
    } else if (trimmed.includes('.')) {
      setIsXHandle(false);
      const domain = trimmed.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
      if (!empireName) setEmpireName(domain);
      setFaviconUrl(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
    } else {
      setFaviconUrl(null);
      setIsXHandle(false);
    }
  };

  const handleVisitRuler = () => {
    if (territory.currentRuler?.url) {
      window.open(territory.currentRuler.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleInvade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setErrorMessage('Please provide your website URL or @handle');
      return;
    }
    if (bidAmount < minBid) {
      setErrorMessage(`Minimum conquest bid is $${minBid}`);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');

      let finalTitle = empireName.trim();
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
          warCry: warCry.trim() || undefined,
          customColor: selectedColor,
          bidAmount,
          logoUrl: faviconUrl,
          paymentProvider: 'sandbox',
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

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs pointer-events-auto transition-opacity duration-200 animate-in fade-in"
      />

      {/* Slide-in Command Side Drawer matching media_1787488185015.png */}
      <aside aria-label="Territory Command Drawer" className="relative w-full max-w-full sm:max-w-md h-full bg-[#0d0d12] border-l border-[#1f1f28] shadow-2xl p-4 sm:p-6 text-white font-sans overflow-y-auto pointer-events-auto z-10 animate-in slide-in-from-right duration-250 flex flex-col justify-between scrollbar-thin">
        <div>
          {/* Top Command Header */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-4">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#ea6c52] uppercase">
              COMMAND
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sovereign Country Info */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{territory.flag}</span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-100">
                <span className="text-zinc-400 mr-1.5 font-mono">{territory.countryCode}</span>
                <span>{territory.countryName}</span>
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-black bg-zinc-800 text-zinc-300 border border-zinc-700">
              {territory.tier || 'TIER A'}
            </span>
          </div>

          {/* Current Ruler Card with Orange VISIT ↗ Button */}
          {territory.currentRuler ? (
            <div className="p-3.5 rounded-2xl bg-[#14141b] border border-zinc-800 flex items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-3 truncate">
                {/* Logo Squircle */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 p-1 bg-[#09090c] border"
                  style={{ borderColor: territory.currentRuler.color }}
                >
                  {territory.currentRuler.logoUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={territory.currentRuler.logoUrl}
                      alt=""
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <span className="text-xs font-black font-mono text-white">
                      {territory.countryCode}
                    </span>
                  )}
                </div>

                <div className="truncate">
                  <p className="font-mono font-bold text-sm text-zinc-100 truncate">
                    {territory.currentRuler.title}
                  </p>
                  <p className="text-[11px] font-mono text-zinc-400">
                    paid ${territory.currentBid} · {territory.clicks} clicks
                  </p>
                </div>
              </div>

              {/* Orange VISIT Button */}
              <button
                type="button"
                onClick={handleVisitRuler}
                className="px-3.5 py-1.5 rounded-xl bg-[#ea6c52] hover:bg-[#d95b41] text-white font-mono font-black text-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95 flex-shrink-0 shadow-xs"
              >
                <span>VISIT</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-emerald-300">
                  {territory.isOceanFleet ? 'Strategic Naval Corridor' : 'Unclaimed Sovereign Land'}
                </span>
              </div>
              <span className="text-xs font-mono font-black text-emerald-400">
                Starting ${minBid}
              </span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleInvade} className="space-y-4">
            {/* YOUR BID — MINIMUM $XX */}
            <div>
              <label className="text-[11px] font-mono font-bold text-zinc-400 uppercase block mb-1.5">
                YOUR BID — MINIMUM ${minBid}
              </label>

              <div className="flex items-center gap-2">
                {/* Number Input */}
                <div className="relative flex-1 flex items-center px-3.5 py-2.5 rounded-xl bg-[#09090c] border border-zinc-800 focus-within:border-[#ea6c52]">
                  <span className="text-base font-black text-zinc-500 font-mono mr-1.5">$</span>
                  <input
                    type="number"
                    min={minBid}
                    value={bidAmount || ''}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setBidAmount(isNaN(val) ? 0 : val);
                    }}
                    className="w-full bg-transparent text-lg font-mono font-black text-white outline-none"
                  />
                </div>

                {/* Quick Multipliers: MIN, 2x, 5x */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setBidAmount(minBid)}
                    className="px-2.5 py-2.5 rounded-xl bg-[#15151c] border border-zinc-800 hover:border-zinc-700 text-xs font-mono font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  >
                    MIN
                  </button>
                  <button
                    type="button"
                    onClick={() => setBidAmount(minBid * 2)}
                    className="px-2.5 py-2.5 rounded-xl bg-[#15151c] border border-zinc-800 hover:border-zinc-700 text-xs font-mono font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  >
                    2×
                  </button>
                  <button
                    type="button"
                    onClick={() => setBidAmount(minBid * 5)}
                    className="px-2.5 py-2.5 rounded-xl bg-[#15151c] border border-zinc-800 hover:border-zinc-700 text-xs font-mono font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  >
                    5×
                  </button>
                </div>
              </div>

              {/* Dynamic Defensive Wall Formula */}
              <p className="text-[11px] font-mono text-zinc-400 mt-2">
                🛡️ bid high to build a wall: taking {territory.countryName} from you will cost{' '}
                <span className="font-bold text-amber-400 font-mono">${defenseWallCost}</span>
              </p>
            </div>

            {/* COMPANY / EMPIRE NAME */}
            <div>
              <label className="text-[11px] font-mono font-bold text-zinc-400 uppercase block mb-1">
                COMPANY / EMPIRE NAME
              </label>
              <input
                type="text"
                placeholder="Acme Inc."
                value={empireName}
                onChange={(e) => setEmpireName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090c] border border-zinc-800 focus:border-[#ea6c52] text-sm text-white placeholder-zinc-600 outline-none font-medium"
              />
            </div>

            {/* YOUR URL — LOGO ON THE MAP + CLICK-TRACKED LINK */}
            <div>
              <label className="text-[11px] font-mono font-bold text-zinc-400 uppercase block mb-1">
                YOUR URL — LOGO ON THE MAP + CLICK-TRACKED LINK <span className="text-[#ea6c52]">*</span>
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
                    className="w-4 h-4 rounded object-contain flex-shrink-0 bg-white p-0.5"
                    onError={() => setFaviconUrl(null)}
                  />
                ) : (
                  <Globe className="w-4 h-4 text-zinc-600 flex-shrink-0" />
                )}
                <input
                  type="text"
                  required
                  placeholder="acme.com or @handle"
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder-zinc-600 outline-none font-medium"
                />
              </div>
            </div>

            {/* WAR CRY (OPTIONAL) */}
            <div>
              <label className="text-[11px] font-mono font-bold text-zinc-400 uppercase block mb-1">
                WAR CRY (OPTIONAL)
              </label>
              <input
                type="text"
                placeholder="ship faster with acme"
                value={warCry}
                onChange={(e) => setWarCry(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090c] border border-zinc-800 focus:border-[#ea6c52] text-sm text-white placeholder-zinc-600 outline-none font-medium"
              />
            </div>

            {/* YOUR COLORS (11 Selectable Swatches) */}
            <div>
              <label className="text-[11px] font-mono font-bold text-zinc-400 uppercase block mb-2">
                YOUR COLORS
              </label>
              <div className="flex flex-wrap gap-2">
                {EMPIRE_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`w-7 h-7 rounded-lg transition-transform cursor-pointer ${
                      selectedColor === c
                        ? 'ring-2 ring-white scale-110 shadow-lg'
                        : 'hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Big Invade Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isLoading || !url.trim() || bidAmount < minBid}
                className="w-full py-3.5 rounded-2xl bg-[#ea6c52] hover:bg-[#d95b41] text-white font-mono font-black text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(234,108,82,0.35)] transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>INVADE FOR ${bidAmount.toLocaleString()}</span>
                )}
              </button>
            </div>

            <p className="text-center text-[10px] font-mono text-zinc-500">
              Secure checkout. Your territory goes live instantly.
            </p>
          </form>
        </div>
      </aside>
    </div>
  );
}
