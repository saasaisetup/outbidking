'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CountryInfo, COUNTRIES_DATA, CATEGORIES_LIST } from '@/lib/pinitData';

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
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState('Marketing');
  const [stakeAmount, setStakeAmount] = useState<number>(minStake);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle URL Continue
  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    // Auto-derive clean name from URL if empty
    try {
      const clean = url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
      if (!name) setName(clean);
      if (!tagline) setTagline(claimType === 'social' ? 'Social Profile' : 'High-growth indie product');
    } catch {
      if (!name) setName('My Product');
    }
    setStep(2);
  };

  // Handle Final Stake Submission
  const handleConfirmStake = async () => {
    setIsSubmitting(true);

    try {
      // Trigger confetti celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      const newPlacement = {
        id: `stake-${Date.now()}`,
        name: name || 'My Startup',
        tagline: tagline || 'Building in public',
        url: url.startsWith('http') ? url : `https://${url}`,
        logo: '/globe.svg',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-pin-lg border border-[var(--pin-border)] bg-[var(--pin-card)] p-6 shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-4 top-4 rounded-full p-1.5 text-[var(--pin-muted)] hover:bg-[var(--pin-paper)] hover:text-[var(--pin-ink)] transition-colors cursor-pointer"
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
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--pin-muted)]">
            {targetCountry.code}
          </span>
          <span className="text-xl">{targetCountry.flag}</span>
          <h2 className="text-lg font-extrabold text-[var(--pin-ink)]">
            Stake on {targetCountry.name}
          </h2>
        </div>
        <p className="mt-1 text-xs text-[var(--pin-muted)]">
          Compete for a top rank for 24 hours
        </p>

        {step === 1 ? (
          <div className="mt-5 space-y-4">
            {/* Section 1: Claiming Type Tabs */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--pin-muted)] mb-2">
                What are you claiming with?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setClaimType('product')}
                  className={`rounded-pin-md border py-2.5 text-center text-xs font-bold transition-all cursor-pointer ${
                    claimType === 'product'
                      ? 'border-[var(--pin-coral)] bg-[var(--pin-coral-soft)] text-[var(--pin-coral-ink)]'
                      : 'border-[var(--pin-border)] bg-white text-[var(--pin-ink)] hover:border-[var(--pin-border-strong)]'
                  }`}
                >
                  Product URL
                </button>
                <button
                  type="button"
                  onClick={() => setClaimType('social')}
                  className={`rounded-pin-md border py-2.5 text-center text-xs font-bold transition-all cursor-pointer ${
                    claimType === 'social'
                      ? 'border-[var(--pin-coral)] bg-[var(--pin-coral-soft)] text-[var(--pin-coral-ink)]'
                      : 'border-[var(--pin-border)] bg-white text-[var(--pin-ink)] hover:border-[var(--pin-border-strong)]'
                  }`}
                >
                  Social profile
                </button>
              </div>
            </div>

            {/* Section 2: URL Input Form */}
            <form onSubmit={handleContinue} className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--pin-muted)]">
                {claimType === 'product' ? 'Product URL' : 'Social Profile URL / Handle'}
              </label>
              <p className="text-[11px] text-[var(--pin-muted)] leading-tight">
                {claimType === 'product'
                  ? 'The site people land on: your homepage, app, or landing page.'
                  : 'Your X/Twitter, LinkedIn, GitHub, or YouTube profile link.'}
              </p>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  required
                  placeholder={claimType === 'product' ? 'https://yourstartup.com' : 'https://x.com/yourhandle'}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 rounded-pin-md border border-[var(--pin-border-strong)] bg-white px-3.5 py-2.5 text-xs text-[var(--pin-ink)] placeholder:text-[var(--pin-muted)] focus:border-[var(--pin-coral)] focus:outline-none focus:ring-1 focus:ring-[var(--pin-coral)]"
                />
                <button
                  type="submit"
                  className="rounded-pin-md bg-[var(--pin-coral)] px-5 py-2.5 text-xs font-bold text-white shadow-pin-coral hover:bg-[var(--pin-coral-ink)] transition-colors cursor-pointer"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="mt-5 space-y-4 animate-in fade-in duration-150">
            {/* Step 2: Product Name & Category */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--pin-muted)] mb-1">
                Product Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Product or Brand Name"
                className="w-full rounded-pin-md border border-[var(--pin-border-strong)] bg-white px-3.5 py-2 text-xs text-[var(--pin-ink)] focus:border-[var(--pin-coral)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--pin-muted)] mb-1">
                Tagline / Pitch
              </label>
              <input
                type="text"
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="One sentence description"
                className="w-full rounded-pin-md border border-[var(--pin-border-strong)] bg-white px-3.5 py-2 text-xs text-[var(--pin-ink)] focus:border-[var(--pin-coral)] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--pin-muted)] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-pin-md border border-[var(--pin-border-strong)] bg-white px-3 py-2 text-xs text-[var(--pin-ink)] outline-none"
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--pin-muted)]">
                  Your 24h Stake Amount
                </label>
                <span className="text-[11px] font-bold text-[var(--pin-coral-ink)]">
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
                        ? 'border-[var(--pin-coral)] bg-[var(--pin-coral)] text-white shadow-pin-coral'
                        : 'border-[var(--pin-border)] bg-white text-[var(--pin-ink)] hover:border-[var(--pin-border-strong)]'
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
                className="rounded-full border border-[var(--pin-border)] px-4 py-2 text-xs font-semibold text-[var(--pin-muted)] hover:text-[var(--pin-ink)] cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleConfirmStake}
                disabled={isSubmitting}
                className="flex-1 rounded-full bg-[var(--pin-coral)] py-2.5 text-center text-xs font-bold text-white shadow-pin-coral hover:bg-[var(--pin-coral-ink)] transition-transform hover:scale-[1.02] cursor-pointer"
              >
                {isSubmitting ? 'Staking...' : `Confirm & Stake on ${targetCountry.name} ($${stakeAmount})`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
