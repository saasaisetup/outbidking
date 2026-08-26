'use client';

import React from 'react';
import { X, Shield, Lock, Eye, FileText } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
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
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
              Privacy Policy
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Last updated: August 2026 · Outbidking.lol
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
          <section className="space-y-1.5">
            <h3 className="font-bold text-zinc-900 dark:text-white text-sm flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[#ea6c52]" />
              1. Information We Collect
            </h3>
            <p>
              When you participate in Outbidking.lol, we collect the public information you submit: your product/project URL, public handle, brand display title, category, and bid amount. If provided, we collect your email address purely for sending official payment and ranking receipts.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-bold text-zinc-900 dark:text-white text-sm flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#ea6c52]" />
              2. Payment & Financial Data
            </h3>
            <p>
              All payments are handled securely through our official merchant processor, <strong className="text-zinc-900 dark:text-white">Dodo Payments</strong>. We do not store, process, or have access to your raw credit card numbers or banking credentials.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-bold text-zinc-900 dark:text-white text-sm flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#ea6c52]" />
              3. Analytics & Real-Time Tracking
            </h3>
            <p>
              We measure aggregate site visits and live online presence anonymously using Supabase Realtime without tracking individual personal identities across external web properties.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-bold text-zinc-900 dark:text-white text-sm">
              4. Contact
            </h3>
            <p>
              For inquiries regarding data privacy or removal requests, contact <strong className="text-[#ea6c52]">@shipxankit on 𝕏</strong>.
            </p>
          </section>
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-xs cursor-pointer hover:opacity-90 transition-opacity"
          >
            Close Policy
          </button>
        </div>
      </div>
    </div>
  );
}
