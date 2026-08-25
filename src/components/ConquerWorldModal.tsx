'use client';

import React, { useState } from 'react';
import { X, Globe, Crown, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import { EMPIRE_COLORS } from '@/lib/worldData';

interface ConquerWorldModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConquerWorldModal({ isOpen, onClose }: ConquerWorldModalProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [warCry, setWarCry] = useState('Total planetary dominion.');
  const [selectedColor, setSelectedColor] = useState(EMPIRE_COLORS[0]);
  const [customerEmail, setCustomerEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleConquerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setErrorMessage('Please provide your Empire URL');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');

      const cleanTitle = title.trim() || url.trim().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];

      const res = await fetch('/api/dodo/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url.trim(),
          title: cleanTitle,
          warCry: warCry.trim(),
          category: 'global-hegemony',
          bidAmount: 5000,
          customColor: selectedColor,
          email: customerEmail.trim() || undefined,
          isTerritory: true,
          countryCode: 'GLOBAL_HEGEMONY',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.paymentLink) {
        setErrorMessage(data.error || 'Failed to initialize Dodo Payments global conquest checkout');
        setIsLoading(false);
        return;
      }

      window.location.href = data.paymentLink;
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred initiating checkout');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0d0d12] border border-amber-500/40 p-6 sm:p-8 text-white shadow-[0_0_50px_rgba(234,179,8,0.15)] font-mono">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-xl hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-4">
          <Globe className="w-3.5 h-3.5" />
          <span>MASTER GLOBAL HEGEMONY</span>
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
          Conquer the Entire World
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mb-6 leading-relaxed">
          Take full dominion over all <strong className="text-amber-300">207 countries, strategic island bastions, and naval corridors</strong> in one single strike for <strong className="text-white">$5,000 USD</strong>.
        </p>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleConquerSubmit} className="space-y-4">
          {/* Company / Empire */}
          <div>
            <label className="text-[11px] font-bold text-zinc-300 block mb-1">
              COMPANY / GLOBAL EMPIRE NAME
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Acme Planetary Holdings"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-700 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* Website URL */}
          <div>
            <label className="text-[11px] font-bold text-zinc-300 block mb-1">
              YOUR PRIMARY WEBSITE URL *
            </label>
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g. acme.com or @handle"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-700 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* War Cry */}
          <div>
            <label className="text-[11px] font-bold text-zinc-300 block mb-1">
              PLANET-WIDE WAR CRY
            </label>
            <input
              type="text"
              value={warCry}
              onChange={(e) => setWarCry(e.target.value)}
              placeholder="e.g. Total Planetary Dominion"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-700 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* Empire Color Palette */}
          <div>
            <label className="text-[11px] font-bold text-zinc-300 block mb-1.5">
              EMPIRE COLOR SCHEME
            </label>
            <div className="flex flex-wrap gap-2">
              {EMPIRE_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`w-7 h-7 rounded-lg transition-transform cursor-pointer ${
                    selectedColor === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-black' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-[11px] font-bold text-zinc-300 block mb-1">
              YOUR EMAIL (FOR OFFICIAL SOVEREIGNTY RECEIPT)
            </label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="commander@acme.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900/90 border border-zinc-700 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-[#ea6c52] hover:opacity-95 text-black font-black text-sm uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>CONNECTING DODO GATEWAY...</span>
              </>
            ) : (
              <>
                <Crown className="w-4 h-4" />
                <span>CONQUER ALL 207 TERRITORIES ($5,000)</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
