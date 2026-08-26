'use client';

import React from 'react';
import { X, FileCode, CheckCircle2, AlertTriangle, Shield } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 rounded-3xl bg-white dark:bg-[#121217] border border-zinc-200 dark:border-[#272732] shadow-2xl p-6 sm:p-8 text-zinc-900 dark:text-[#f4f4f5] font-sans animate-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#ea6c52]/10 text-[#ea6c52] flex items-center justify-center shrink-0 border border-[#ea6c52]/20">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
              Terms of Service
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Last updated: August 2026 · Outbidking.lol
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
          <section className="space-y-1.5">
            <h3 className="font-bold text-zinc-900 dark:text-white text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              1. The Pay-to-Rank Mechanic
            </h3>
            <p>
              Outbidking.lol operates a live competitive billboard game. Anyone can claim a position or outbid an existing position by paying the required bid amount via Dodo Payments.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-bold text-zinc-900 dark:text-white text-sm flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              2. Outbidding & Non-Refundability
            </h3>
            <p>
              When your project is outbid by a competitor, your link will move to the next corresponding rank on the leaderboard. All payments placed on the leaderboard are final, non-refundable advertising fees.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-bold text-zinc-900 dark:text-white text-sm flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-[#ea6c52]" />
              3. Content Standards
            </h3>
            <p>
              Submissions containing illegal materials, malware, phishing attempts, or hateful speech will be immediately purged without refund.
            </p>
          </section>
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-xs cursor-pointer hover:opacity-90 transition-opacity"
          >
            I Understand & Agree
          </button>
        </div>
      </div>
    </div>
  );
}
