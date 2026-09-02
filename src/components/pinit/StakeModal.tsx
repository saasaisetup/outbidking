'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CountryInfo, COUNTRIES_DATA, CATEGORIES_LIST, getProductFavicon } from '@/lib/pinitData';

interface StakeModalProps {
  country: CountryInfo | null;
  onClose: () => void;
  onSuccess: (countrySlug: string, placement: any) => void;
}

export function StakeModal({ country, onClose, onSuccess }: StakeModalProps) {
  const targetCountry = country || COUNTRIES_DATA['united-states-of-america'];
  const minStake = targetCountry.currentLeader ? (targetCountry.currentLeader.stake + 1) : 1;

  const [claimType, setClaimType] = useState<'product' | 'social'>('product');
  const [step, setStep] = useState<1 | 2>(1);
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState('Marketing');
  const [stakeAmount, setStakeAmount] = useState<number>(minStake);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-derived logo
  const logoPreview = getProductFavicon(url);

  // Handle URL Continue
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

  // Handle Final Stake Submission
  const handleConfirmStake = async () => {
    setIsSubmitting(true);

    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
      });

      const newPlacement = {
        id: `stake-${Date.now()}`,
        name: name || (claimType === 'social' ? '@founder' : 'My Startup'),
        tagline: tagline || 'Building in public',
        url: url.startsWith('http') ? url : `https://${url}`,
        logo: logoPreview,
        stake: stakeAmount,
        category,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-pin-lg border border-[#1e293b] bg-[#0b0f19] p-6 shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-4 top-4 rounded-full p-1.5 text-[#94a3b8] hover:bg-[#1e293b] hover:text-white transition-colors cursor-pointer"
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
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#94a3b8]">
            {targetCountry.code}
          </span>
          <span className="text-xl">{targetCountry.flag}</span>
          <h2 className="text-lg font-extrabold text-white">
            Claim {targetCountry.name}
          </h2>
        </div>
        <p className="mt-1 text-xs text-[#94a3b8]">
          Compete for the #1 throne for 24 hours
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
                      : 'border-[#1e293b] bg-[#06090e] text-white hover:border-[#334155]'
                  }`}
                >
                  Social profile
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
                  className="mt-1.5 w-full rounded-pin-md border border-[#1e293b] bg-[#06090e] px-3.5 py-2 text-xs text-white placeholder:text-[#64748b] focus:border-[#ff5722] focus:outline-none"
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
                  className="mt-1 w-full rounded-pin-md border border-[#1e293b] bg-[#06090e] px-3.5 py-2 text-xs text-white placeholder:text-[#64748b] focus:border-[#ff5722] focus:outline-none"
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
          <div className="mt-5 space-y-3.5 animate-in fade-in duration-150">
            {/* Logo Preview + Product Name */}
            <div className="flex items-center gap-3 p-3 rounded-pin-md border border-[#1e293b] bg-[#06090e]">
              <img
                src={logoPreview}
                alt="Logo preview"
                className="h-10 w-10 rounded-full object-cover bg-white border border-[#1e293b] shadow-xs shrink-0"
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
                  className="w-full font-bold text-xs text-white bg-transparent border-b border-dashed border-[#334155] focus:border-[#ff5722] focus:outline-none py-0.5"
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
                className="w-full rounded-pin-md border border-[#1e293b] bg-[#06090e] px-3.5 py-1.5 text-xs text-white focus:border-[#ff5722] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-pin-md border border-[#1e293b] bg-[#06090e] px-3 py-1.5 text-xs text-white outline-none"
              >
                {CATEGORIES_LIST.filter((c) => c.value).map((c) => (
                  <option key={c.value} value={c.label}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Stake Amount Selector */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#94a3b8]">
                  24h Stake Amount
                </label>
                <span className="text-[11px] font-bold text-[#fbbf24]">
                  Min: ${minStake}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {[minStake, minStake + 1, minStake + 4, minStake + 9].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setStakeAmount(amt)}
                    className={`flex-1 rounded-pin-md border py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                      stakeAmount === amt
                        ? 'border-[#ff5722] bg-[#ff5722] text-white shadow-pin-coral'
                        : 'border-[#1e293b] bg-[#06090e] text-white hover:border-[#334155]'
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Confirm & Stake Button */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-full border border-[#1e293b] px-4 py-2 text-xs font-semibold text-[#94a3b8] hover:text-white cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleConfirmStake}
                disabled={isSubmitting}
                className="flex-1 rounded-full bg-[#ff5722] hover:bg-[#ff7043] py-2.5 text-center text-xs font-extrabold text-white shadow-pin-coral transition-transform hover:scale-[1.02] cursor-pointer"
              >
                {isSubmitting ? 'Claiming...' : `Claim for $${stakeAmount} on ${targetCountry.name}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
