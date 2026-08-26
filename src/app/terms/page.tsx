'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FileCode, CheckCircle2, AlertTriangle, Shield, ArrowRight, Trophy } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-zinc-900 dark:text-[#f4f4f5] font-sans flex flex-col justify-between transition-colors duration-200">
      <div>
        <Header />

        <main className="w-full max-w-2xl mx-auto px-4 pt-8 pb-16 flex flex-col items-start">
          <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
                Terms of Service
              </h1>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Last updated: August 2026 · Outbidking.lol
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#ea6c52] to-[#f97316] hover:from-[#e05d44] hover:to-[#ea580c] text-white font-black text-xs sm:text-sm tracking-tight shadow-md shadow-[#ea6c52]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
            >
              <Trophy className="w-4 h-4 text-amber-200" />
              <span>Claim #1 Throne</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="mt-8 space-y-6 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
            <section className="space-y-2">
              <h2 className="font-bold text-zinc-900 dark:text-white text-base flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                1. The Pay-to-Rank Mechanic
              </h2>
              <p>
                Outbidking.lol operates a live competitive billboard game. Anyone can claim a position or outbid an existing position by paying the required bid amount via Dodo Payments.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-bold text-zinc-900 dark:text-white text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                2. Outbidding & Non-Refundability
              </h2>
              <p>
                When your project is outbid by a competitor, your link will move to the next corresponding rank on the leaderboard. All payments placed on the leaderboard are final, non-refundable advertising fees.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-bold text-zinc-900 dark:text-white text-base flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#ea6c52]" />
                3. Content Standards
              </h2>
              <p>
                Submissions containing illegal materials, malware, phishing attempts, or hateful speech will be immediately purged without refund.
              </p>
            </section>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
