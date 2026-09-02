'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CountryInfo, COUNTRIES_DATA, CATEGORIES_LIST, COUNTRY_COLOR_PALETTE, getProductFavicon } from '@/lib/pinitData';

interface StakeModalProps {
  country: CountryInfo | null;
  onClose: () => void;
  onSuccess: (countrySlug: string, placement: any) => void;
  isLightMode?: boolean;
}

export function StakeModal({
  country,
  onClose,
  onSuccess,
  isLightMode = false,
}: StakeModalProps) {
  const targetCountry = country || COUNTRIES_DATA['united-states-of-america'];
  const minStake = targetCountry.currentLeader ? (targetCountry.currentLeader.stake + 1) : 1;

  const [claimType, setClaimType] = useState<'product' | 'social'>('product');
  const [step, setStep] = useState<1 | 2>(1);
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState('Marketing');
  const [selectedColor, setSelectedColor] = useState<string>(targetCountry.color || '#ff5722');
  const [stakeAmount, setStakeAmount] = useState<number>(minStake);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state with target country
  useEffect(() => {
    setStakeAmount(minStake);
    if (targetCountry.color) {
      setSelectedColor(targetCountry.color);
    }
  }, [minStake, targetCountry]);

  // Auto-derived logo
  const logoPreview = getProductFavicon(url);

  // 1.5x Wall formula calculation
  const wallCost = Math.ceil(stakeAmount * 1.5);

  const handleQuickMultiplier = (mult: number) => {
    const base = targetCountry.currentLeader ? targetCountry.currentLeader.stake : minStake;
    setStakeAmount(Math.max(minStake, base * mult));
  };

  // Handle URL Step Continue
  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    try {
      if (claimType === 'social') {
        const clean = url.replace(/.*(?:twitter\.com|x\.com)\//, '').replace('@', '').split('/')[0].split('?')[0];
        if (!name) setName(clean.startsWith('@') ? clean : `@${clean}`);
        if (!tagline) setTagline('Founder & Builder on X');
      } else {
        const clean = url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
        if (!name) setName(clean);
        if (!tagline) setTagline('High-growth indie product');
      }
    } catch {
      if (!name) setName('My Product');
    }
    setStep(2);
  };

  // Handle Final Stake Submission / Checkout
  const handleConfirmStake = async () => {
    setIsSubmitting(true);

    const fullUrl = url.startsWith('http') ? url.trim() : `https://${url.trim()}`;
    const cleanTitle = name.trim() || (claimType === 'social' ? '@founder' : 'My Startup');
    const cleanTagline = tagline.trim() || 'Building in public';

    try {
      // 1. Persist directly to backend API (/api/territories) with customColor
      fetch('/api/territories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          countryCode: targetCountry.code,
          title: cleanTitle,
          url: fullUrl,
          warCry: cleanTagline,
          customColor: selectedColor,
          bidAmount: stakeAmount,
          logoUrl: logoPreview,
          category,
          paymentProvider: 'dodo',
        }),
      }).catch((e) => console.warn('Territory API background save:', e));

      // 2. Request Dodo Payments Hosted Checkout Link
      try {
        const res = await fetch('/api/dodo/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: fullUrl,
            title: cleanTitle,
            description: cleanTagline,
            category,
            customColor: selectedColor,
            bidAmount: stakeAmount,
            logoUrl: logoPreview,
            isTerritory: true,
            countryCode: targetCountry.code,
            email: email.trim() || undefined,
            name: cleanTitle,
            origin: typeof window !== 'undefined' ? window.location.origin : undefined,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const checkoutLink = data?.paymentLink || data?.payment_link || data?.url;
          if (checkoutLink) {
            window.location.href = checkoutLink;
            return;
          }
        }
      } catch (e) {
        console.warn('Dodo checkout redirect notice:', e);
      }

      // 3. Instant UI feedback
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
      });

      const newPlacement = {
        id: `stake-${Date.now()}`,
        name: cleanTitle,
        tagline: cleanTagline,
        url: fullUrl,
        logo: logoPreview,
        stake: stakeAmount,
        category,
        customColor: selectedColor,
        claimedAt: 'Just now',
        expiresIn: '24h 00m',
        clicks: 0,
      };

      onSuccess(targetCountry.slug, newPlacement);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`relative w-full max-w-md rounded-pin-lg border p-6 shadow-2xl ${
        isLightMode
          ? 'border-[#e6dfd1] bg-white text-slate-900'
          : 'border-[#1e293b] bg-[#0b0f19] text-white'
      }`}>
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-4 top-4 rounded-full p-1.5 text-[#94a3b8] hover:bg-slate-700/20 hover:text-white transition-colors cursor-pointer"
        >
          <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2">
          <span className="text-xl">{targetCountry.flag}</span>
          <h2 className="text-lg font-extrabold tracking-tight">
            Claim {targetCountry.name}
          </h2>
          <span className={`font-mono text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
            isLightMode ? 'bg-slate-100 text-slate-700' : 'bg-[#1e293b] text-[#94a3b8]'
          }`}>
            {targetCountry.code}
          </span>
        </div>
        <p className="mt-1 text-xs text-[#94a3b8]">
          Compete for the #1 throne on {targetCountry.name} for 24 hours
        </p>

        {step === 1 ? (
          <div className="mt-5 space-y-4">
            {/* Claiming Type Tabs */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] mb-2">
                What are you claiming with?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setClaimType('product')}
                  className={`rounded-pin-md border py-2.5 text-center text-xs font-bold transition-all cursor-pointer ${
                    claimType === 'product'
                      ? 'border-[#ff5722] bg-[#ff5722]/15 text-[#ff7043]'
                      : isLightMode
                      ? 'border-[#e6dfd1] bg-[#faf7f0] text-slate-800'
                      : 'border-[#1e293b] bg-[#06090e] text-white hover:border-[#334155]'
                  }`}
                >
                  Product URL
                </button>
                <button
                  type="button"
                  onClick={() => setClaimType('social')}
                  className={`rounded-pin-md border py-2.5 text-center text-xs font-bold transition-all cursor-pointer ${
                    claimType === 'social'
                      ? 'border-[#ff5722] bg-[#ff5722]/15 text-[#ff7043]'
                      : isLightMode
                      ? 'border-[#e6dfd1] bg-[#faf7f0] text-slate-800'
                      : 'border-[#1e293b] bg-[#06090e] text-white hover:border-[#334155]'
                  }`}
                >
                  Social Profile
                </button>
              </div>
            </div>

            {/* URL & Email Form */}
            <form onSubmit={handleContinue} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
                  {claimType === 'product' ? 'Product URL' : 'Social Profile URL / Handle'}
                </label>
                <p className="text-[11px] text-[#94a3b8] leading-tight mt-0.5">
                  {claimType === 'product'
                    ? 'The destination people land on: your app or landing page.'
                    : 'Your X/Twitter, LinkedIn, GitHub, or YouTube handle.'}
                </p>
                <input
                  type="text"
                  required
                  placeholder={claimType === 'product' ? 'https://yourstartup.com' : 'https://x.com/shipxankit'}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className={`mt-1.5 w-full rounded-pin-md border px-3.5 py-2 text-xs focus:border-[#ff5722] focus:outline-none ${
                    isLightMode
                      ? 'border-[#e6dfd1] bg-[#faf7f0] text-slate-900 placeholder:text-slate-400'
                      : 'border-[#1e293b] bg-[#06090e] text-white placeholder:text-[#64748b]'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
                  Notification Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder="founder@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`mt-1 w-full rounded-pin-md border px-3.5 py-2 text-xs focus:border-[#ff5722] focus:outline-none ${
                    isLightMode
                      ? 'border-[#e6dfd1] bg-[#faf7f0] text-slate-900 placeholder:text-slate-400'
                      : 'border-[#1e293b] bg-[#06090e] text-white placeholder:text-[#64748b]'
                  }`}
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-pin-md bg-[#ff5722] hover:bg-[#ff7043] py-2.5 text-xs font-extrabold text-white shadow-pin-coral transition-colors cursor-pointer"
              >
                Continue →
              </button>
            </form>
          </div>
        ) : (
          <div className="mt-4 space-y-3 animate-in fade-in duration-150">
            {/* Logo Preview + Product Name */}
            <div className={`flex items-center gap-3 p-2.5 rounded-pin-md border ${
              isLightMode ? 'border-[#e6dfd1] bg-[#faf7f0]' : 'border-[#1e293b] bg-[#06090e]'
            }`}>
              <img
                src={logoPreview}
                alt="Logo preview"
                className="h-9 w-9 rounded-full object-cover bg-white border border-[#1e293b] shadow-xs shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/globe.svg';
                }}
              />
              <div className="min-w-0 flex-1">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Product Name or @handle"
                  className={`w-full font-bold text-xs bg-transparent border-b border-dashed focus:border-[#ff5722] focus:outline-none py-0.5 ${
                    isLightMode ? 'text-slate-900 border-slate-300' : 'text-white border-[#334155]'
                  }`}
                />
                <span className="text-[10px] text-[#94a3b8]">Logo automatically detected</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] mb-1">
                Tagline / Pitch
              </label>
              <input
                type="text"
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="One sentence pitch"
                className={`w-full rounded-pin-md border px-3 py-1.5 text-xs focus:border-[#ff5722] focus:outline-none ${
                  isLightMode
                    ? 'border-[#e6dfd1] bg-[#faf7f0] text-slate-900'
                    : 'border-[#1e293b] bg-[#06090e] text-white'
                }`}
              />
            </div>

            {/* Country Territory Color Picker */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
                  Country Color on Globe
                </label>
                <div className="flex items-center gap-1.5">
                  <span
                    className="h-3 w-3 rounded-full border border-white/40 shadow-xs inline-block"
                    style={{ backgroundColor: selectedColor }}
                  />
                  <span className="font-mono text-[9px] font-bold text-[#94a3b8] uppercase">
                    {selectedColor}
                  </span>
                </div>
              </div>
              <div className="flex items-center flex-wrap gap-1.5">
                {COUNTRY_COLOR_PALETTE.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                    className={`h-6 w-6 rounded-full transition-transform cursor-pointer shadow-xs ${
                      selectedColor.toLowerCase() === color.toLowerCase()
                        ? 'ring-2 ring-white scale-110 shadow-md'
                        : 'hover:scale-105 opacity-85 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full rounded-pin-md border px-3 py-1.5 text-xs outline-none ${
                  isLightMode
                    ? 'border-[#e6dfd1] bg-[#faf7f0] text-slate-900'
                    : 'border-[#1e293b] bg-[#06090e] text-white'
                }`}
              >
                {CATEGORIES_LIST.filter((c) => c.value).map((c) => (
                  <option key={c.value} value={c.label}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Stake Amount with [MIN] [2x] [5x] */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
                  YOUR BID — MINIMUM ${minStake}
                </label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setStakeAmount(minStake)}
                    className={`rounded border px-2 py-0.5 text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                      stakeAmount === minStake
                        ? 'border-[#ff5722] bg-[#ff5722] text-white'
                        : isLightMode
                        ? 'border-slate-300 bg-slate-100 text-slate-700'
                        : 'border-[#334155] bg-[#06090e] text-[#94a3b8] hover:text-white'
                    }`}
                  >
                    MIN
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickMultiplier(2)}
                    className={`rounded border px-2 py-0.5 text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                      stakeAmount === (targetCountry.currentLeader ? targetCountry.currentLeader.stake * 2 : minStake * 2)
                        ? 'border-[#ff5722] bg-[#ff5722] text-white'
                        : isLightMode
                        ? 'border-slate-300 bg-slate-100 text-slate-700'
                        : 'border-[#334155] bg-[#06090e] text-[#94a3b8] hover:text-white'
                    }`}
                  >
                    2x
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickMultiplier(5)}
                    className={`rounded border px-2 py-0.5 text-[10px] font-mono font-bold transition-colors cursor-pointer ${
                      stakeAmount === (targetCountry.currentLeader ? targetCountry.currentLeader.stake * 5 : minStake * 5)
                        ? 'border-[#ff5722] bg-[#ff5722] text-white'
                        : isLightMode
                        ? 'border-slate-300 bg-slate-100 text-slate-700'
                        : 'border-[#334155] bg-[#06090e] text-[#94a3b8] hover:text-white'
                    }`}
                  >
                    5x
                  </button>
                </div>
              </div>

              {/* Editable Custom Amount Input */}
              <div className={`flex items-center rounded-pin-md border px-3 py-1.5 focus-within:border-[#ff5722] ${
                isLightMode ? 'border-[#e6dfd1] bg-[#faf7f0]' : 'border-[#1e293b] bg-[#06090e]'
              }`}>
                <span className="font-mono text-base font-extrabold text-[#ff7043] mr-2">
                  $
                </span>
                <input
                  type="number"
                  min={minStake}
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(Math.max(minStake, parseInt(e.target.value) || minStake))}
                  className="w-full bg-transparent font-mono text-base font-extrabold focus:outline-none"
                />
              </div>

              {/* Wall Formula Text */}
              <p className="mt-1 font-mono text-[10px] text-[#94a3b8]">
                bid high to build a wall: taking {targetCountry.name} from you will cost <strong className="text-amber-500 font-bold">${wallCost}</strong>
              </p>
            </div>

            {/* Confirm & Stake Button */}
            <div className="flex items-center gap-2 pt-1.5">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold hover:text-[#ff5722] transition-colors cursor-pointer ${
                  isLightMode ? 'border-[#e6dfd1] text-slate-700' : 'border-[#1e293b] text-[#94a3b8]'
                }`}
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleConfirmStake}
                disabled={isSubmitting}
                className="flex-1 rounded-full bg-[#ff5722] hover:bg-[#ff7043] py-2.5 text-center text-xs font-extrabold text-white shadow-pin-coral transition-transform hover:scale-[1.02] cursor-pointer"
              >
                {isSubmitting
                  ? 'Connecting Checkout...'
                  : `Claim for $${stakeAmount} on ${targetCountry.name}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
