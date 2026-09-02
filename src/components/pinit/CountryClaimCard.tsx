'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { CountryInfo, COUNTRY_COLOR_PALETTE, getProductFavicon } from '@/lib/pinitData';

interface CountryClaimCardProps {
  country: CountryInfo;
  onClose: () => void;
  onClaimSuccess: (countrySlug: string, placement: any, newColor?: string) => void;
  isLightMode?: boolean;
}

export function CountryClaimCard({
  country,
  onClose,
  onClaimSuccess,
  isLightMode = false,
}: CountryClaimCardProps) {
  const isClaimed = !!country.currentLeader;
  const minPrice = country.minPrice || (isClaimed ? country.currentLeader!.stake + 1 : 1);

  // Form states
  const [bidAmount, setBidAmount] = useState<number>(minPrice);
  const [companyName, setCompanyName] = useState('');
  const [url, setUrl] = useState('');
  const [warCry, setWarCry] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>(
    country.currentLeader?.customColor || country.color || '#ff5722'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Wall cost calculation (1.5x formula)
  const wallCost = Math.ceil(bidAmount * 1.5);

  const handleQuickMultiplier = (mult: number) => {
    setBidAmount(Math.max(minPrice, minPrice * mult));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    const derivedLogo = getProductFavicon(url);
    const newPlacement = {
      id: `ruler-${Date.now()}`,
      name: companyName.trim() || 'My Startup',
      tagline: warCry.trim() || 'Claim your spot on the world map.',
      url: url.startsWith('http') ? url : `https://${url || 'worldpinit.lol'}`,
      logo: derivedLogo,
      stake: bidAmount,
      category: 'SaaS',
      claimedAt: 'Just now',
      expiresIn: '24h 00m',
      clicks: 0,
      customColor: selectedColor,
    };

    onClaimSuccess(country.slug, newPlacement, selectedColor);
    setIsSubmitting(false);
  };

  return (
    <div className="pointer-events-auto absolute inset-x-2.5 bottom-12 z-40 sm:inset-x-auto sm:right-5 sm:bottom-12 w-auto sm:w-96 max-h-[85vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className={`rounded-pin-lg border p-4 shadow-2xl backdrop-blur-md ${
        isLightMode
          ? 'border-slate-300 bg-white/95 text-slate-900'
          : 'border-[#1e293b] bg-[#0b0f19]/95 text-white'
      }`}>
        {/* Header: Flag + Code + Name + Tier Badge + Close Button */}
        <div className="flex items-center justify-between border-b pb-2.5 border-inherit">
          <div className="flex items-center gap-2">
            <span className="text-xl">{country.flag}</span>
            <span className="font-mono text-xs font-bold text-[#94a3b8] uppercase">
              {country.code}
            </span>
            <h3 className="font-extrabold text-base tracking-tight">
              {country.name}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded bg-[#1e293b] px-2 py-0.5 text-[10px] font-mono font-bold text-[#94a3b8] border border-[#334155]">
              {country.tier || 'TIER A'}
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close command drawer"
              className="rounded-full p-1 text-[#94a3b8] hover:bg-slate-700/30 hover:text-white transition-colors cursor-pointer"
            >
              <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Current Sovereign Ruler Box */}
        {isClaimed ? (
          <div className={`mt-3 rounded-pin-md border p-3 ${
            isLightMode ? 'border-slate-200 bg-slate-100' : 'border-[#1e293b] bg-[#06090e]'
          }`}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <img
                  src={country.currentLeader!.logo}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover bg-white border border-[#1e293b] shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/globe.svg';
                  }}
                />
                <div className="min-w-0">
                  <Link
                    href={`/p/${country.currentLeader!.id}`}
                    className="font-extrabold text-sm hover:underline hover:text-[#ff7043] truncate block leading-tight"
                  >
                    {country.currentLeader!.name}
                  </Link>
                  <p className="text-[11px] text-[#94a3b8] truncate">
                    {country.currentLeader!.tagline}
                  </p>
                  <div className="text-[10px] text-[#94a3b8] font-mono mt-0.5">
                    paid ${country.currentLeader!.stake} · {country.currentLeader!.clicks} clicks
                  </div>
                </div>
              </div>

              {/* Prominent VISIT Button */}
              <a
                href={country.currentLeader!.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full bg-[#ff5722] hover:bg-[#ff7043] text-white px-3 py-1.5 text-xs font-extrabold shadow-pin-coral transition-transform hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
              >
                <span>VISIT</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        ) : (
          <div className={`mt-3 rounded-pin-md border p-2.5 text-center ${
            isLightMode ? 'border-slate-200 bg-slate-100' : 'border-[#1e293b] bg-[#06090e]'
          }`}>
            <p className="text-xs text-[#94a3b8]">Unclaimed sovereign territory.</p>
            <p className="text-xs font-bold text-amber-500 mt-0.5">
              Starting bid: ${minPrice}
            </p>
          </div>
        )}

        {/* Claim / Outbid Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {/* YOUR BID - MINIMUM $X with [MIN] [2x] [5x] */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#94a3b8]">
                YOUR BID — MINIMUM ${minPrice}
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setBidAmount(minPrice)}
                  className={`rounded border px-2 py-0.5 text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                    bidAmount === minPrice
                      ? 'border-[#ff5722] bg-[#ff5722] text-white'
                      : 'border-[#334155] bg-[#06090e] text-[#94a3b8] hover:text-white'
                  }`}
                >
                  MIN
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickMultiplier(2)}
                  className={`rounded border px-2 py-0.5 text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                    bidAmount === minPrice * 2
                      ? 'border-[#ff5722] bg-[#ff5722] text-white'
                      : 'border-[#334155] bg-[#06090e] text-[#94a3b8] hover:text-white'
                  }`}
                >
                  2x
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickMultiplier(5)}
                  className={`rounded border px-2 py-0.5 text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                    bidAmount === minPrice * 5
                      ? 'border-[#ff5722] bg-[#ff5722] text-white'
                      : 'border-[#334155] bg-[#06090e] text-[#94a3b8] hover:text-white'
                  }`}
                >
                  5x
                </button>
              </div>
            </div>

            {/* Custom Bid Input */}
            <div className={`flex items-center rounded-pin-md border px-3 py-1.5 focus-within:border-[#ff5722] ${
              isLightMode ? 'border-slate-300 bg-white' : 'border-[#1e293b] bg-[#06090e]'
            }`}>
              <span className="font-mono text-base font-extrabold text-[#ff7043] mr-2">
                $
              </span>
              <input
                type="number"
                min={minPrice}
                value={bidAmount}
                onChange={(e) => setBidAmount(Math.max(minPrice, parseInt(e.target.value) || minPrice))}
                className="w-full bg-transparent font-mono text-base font-extrabold focus:outline-none"
              />
            </div>

            {/* Wall Formula Text */}
            <p className="mt-1 font-mono text-[10px] text-[#94a3b8]">
              bid high to build a wall: taking {country.name} from you will cost <strong className="text-amber-400 font-bold">${wallCost}</strong>
            </p>
          </div>

          {/* Company / Empire Name */}
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#94a3b8] mb-1">
              COMPANY / EMPIRE NAME
            </label>
            <input
              type="text"
              required
              placeholder="Acme Inc."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className={`w-full rounded-pin-md border px-3 py-1.5 text-xs focus:border-[#ff5722] focus:outline-none ${
                isLightMode ? 'border-slate-300 bg-white text-slate-900' : 'border-[#1e293b] bg-[#06090e] text-white'
              }`}
            />
          </div>

          {/* URL + Logo preview */}
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#94a3b8] mb-1">
              YOUR URL — LOGO ON MAP + CLICK-TRACKED LINK
            </label>
            <input
              type="text"
              required
              placeholder="acme.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={`w-full rounded-pin-md border px-3 py-1.5 text-xs focus:border-[#ff5722] focus:outline-none ${
                isLightMode ? 'border-slate-300 bg-white text-slate-900' : 'border-[#1e293b] bg-[#06090e] text-white'
              }`}
            />
          </div>

          {/* War Cry / Tagline */}
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#94a3b8] mb-1">
              WAR CRY (OPTIONAL)
            </label>
            <input
              type="text"
              placeholder="ship faster with acme"
              value={warCry}
              onChange={(e) => setWarCry(e.target.value)}
              className={`w-full rounded-pin-md border px-3 py-1.5 text-xs focus:border-[#ff5722] focus:outline-none ${
                isLightMode ? 'border-slate-300 bg-white text-slate-900' : 'border-[#1e293b] bg-[#06090e] text-white'
              }`}
            />
          </div>

          {/* YOUR COLORS (11 Palette Swatches) */}
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#94a3b8] mb-1.5">
              YOUR COLORS (CHANGES COUNTRY COLOR ON MAP)
            </label>
            <div className="grid grid-cols-6 gap-1.5">
              {COUNTRY_COLOR_PALETTE.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => setSelectedColor(hex)}
                  style={{ backgroundColor: hex }}
                  className={`h-7 rounded-md transition-transform hover:scale-110 active:scale-95 cursor-pointer relative ${
                    selectedColor === hex
                      ? 'ring-2 ring-white shadow-lg scale-105'
                      : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  {selectedColor === hex && (
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Big Action CTA Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-pin-md bg-[#ff5722] hover:bg-[#ff7043] py-2.5 text-center font-mono text-sm font-extrabold text-white shadow-pin-coral transition-transform hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
          >
            {isClaimed
              ? `INVADE FOR $${bidAmount}`
              : `CLAIM FOR $${bidAmount}`}
          </button>

          {/* Disclaimer */}
          <p className="text-[10px] text-[#94a3b8] leading-tight text-center">
            Secure checkout. Your territory goes live the moment payment lands — favicon on the map, click-tracked link, and a permanent place in this country&apos;s history.
          </p>
        </form>
      </div>
    </div>
  );
}
