'use client';

import React from 'react';
import { X, ShieldAlert, Globe, Swords } from 'lucide-react';

interface HowWarWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowWarWorksModal({ isOpen, onClose }: HowWarWorksModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0e0e13] border border-zinc-800 shadow-2xl p-6 sm:p-7 text-white font-mono text-xs sm:text-sm animate-in zoom-in-95 duration-150 space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
          <span className="w-2 h-2 rounded-full bg-[#ea6c52] animate-ping" />
          <h2 className="text-base sm:text-lg font-black tracking-widest uppercase text-white font-mono">
            HOW WAR WORKS
          </h2>
        </div>

        {/* Rule 1 */}
        <p className="text-zinc-300 leading-relaxed">
          Tap any country and bid any amount at or above its minimum. Pay, and your logo + link rule that territory on the map — every click on it goes to your site, and you keep a permanent linked place in its war history.
        </p>

        {/* Rule 2: 1.5x Wall */}
        <p className="text-zinc-300 leading-relaxed">
          Anyone can take your country, but they must pay <span className="text-white font-black">1.5× your bid</span> — so bid big to build a wall. <span className="text-[#ea6c52] font-black">No refunds when you fall. That&apos;s war.</span>
        </p>

        {/* Rule 3: Conquer The World */}
        <div className="p-3.5 rounded-2xl bg-[#14141b] border border-amber-500/30 text-amber-200/90 leading-relaxed">
          <p>
            🌏 The impatient can buy <strong className="text-amber-300">the entire world</strong> — every country falls at once, every minimum ratchets 1.5×, and the world&apos;s own price doubles for the next conqueror. Antarctica joins only if the Eternal Throne is unclaimed. Everything stays stealable, country by country.
          </p>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-zinc-800/80 text-[10px] text-zinc-500 text-center tracking-tight">
          SECURE CHECKOUT · OUTBID MID-PAYMENT = AUTO-REFUND · OFFENSIVE EMPIRES REMOVED WITHOUT REFUND
        </div>
      </div>
    </div>
  );
}
