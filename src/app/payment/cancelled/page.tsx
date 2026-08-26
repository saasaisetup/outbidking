'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { XCircle, ArrowLeft, RotateCcw } from 'lucide-react';

export default function PaymentCancelledPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-zinc-900 dark:text-[#f4f4f5] font-sans flex flex-col justify-between transition-colors duration-200">
      <div>
        <Header />
        <main className="w-full max-w-xl mx-auto px-4 py-16 text-center">
          <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#121217] border border-zinc-200 dark:border-[#272732] shadow-2xl flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mb-4">
              <XCircle className="w-9 h-9 text-zinc-400" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
              Payment Cancelled
            </h1>

            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-md leading-relaxed">
              You were not charged. Your checkout session was cancelled before completion. You can retry claiming your rank anytime.
            </p>

            <div className="mt-8 w-full flex flex-col sm:flex-row gap-3">
              <Link
                href="/"
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-b from-[#ff7a59] via-[#ea6c52] to-[#d95b41] hover:brightness-105 border-t border-[#ff9e80] text-white font-black text-sm flex items-center justify-center gap-2 shadow-[0_4px_0_0_#b8432a,0_8px_18px_rgba(234,108,82,0.4)] active:shadow-[0_1px_0_0_#b8432a] active:translate-y-[2px] transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Try Again</span>
              </Link>
              <Link
                href="/"
                className="py-3.5 px-6 rounded-2xl bg-zinc-100 dark:bg-[#181822] text-zinc-700 dark:text-zinc-300 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
