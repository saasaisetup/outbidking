'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FileCode, CheckCircle2, AlertTriangle, Shield, ArrowRight, Trophy, DollarSign, Scale } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-zinc-900 dark:text-[#f4f4f5] font-sans flex flex-col justify-between transition-colors duration-200">
      <div>
        <Header />

        <main className="w-full max-w-4xl mx-auto px-4 pt-8 pb-20 flex flex-col items-start">
          {/* Header Title & 3D CTA */}
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
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-b from-[#ff7a59] via-[#ea6c52] to-[#d95b41] hover:brightness-105 border-t border-[#ff9e80] text-white font-black text-xs sm:text-sm tracking-tight shadow-[0_4px_0_0_#b8432a,0_6px_14px_rgba(234,108,82,0.4)] active:shadow-[0_1px_0_0_#b8432a] active:translate-y-[2px] transition-all cursor-pointer shrink-0"
            >
              <Trophy className="w-4 h-4 text-amber-200" />
              <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">Claim #1 Throne</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="mt-8 space-y-8 w-full text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
            <section className="space-y-2 p-5 rounded-2xl bg-zinc-50 dark:bg-[#121217] border border-zinc-200 dark:border-[#272732]">
              <h2 className="font-bold text-zinc-900 dark:text-white text-base flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                1. The Pay-to-Rank Game Rules
              </h2>
              <p>
                Outbidking.lol provides a live, transparent billboard where spots are ranked by the total dollar bid. Anyone can place a bid starting at $1 USD or raise an existing bid to claim the #1 King throne.
              </p>
            </section>

            <section className="space-y-2 p-5 rounded-2xl bg-zinc-50 dark:bg-[#121217] border border-zinc-200 dark:border-[#272732]">
              <h2 className="font-bold text-zinc-900 dark:text-white text-base flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#ea6c52]" />
                2. Non-Refundable Advertising Fees
              </h2>
              <p>
                All bids and payments placed on Outbidking.lol via Dodo Payments are final and non-refundable digital advertising transactions. When a competitor outbids your listing, your position shifts to the next corresponding rank without refund.
              </p>
            </section>

            <section className="space-y-2 p-5 rounded-2xl bg-zinc-50 dark:bg-[#121217] border border-zinc-200 dark:border-[#272732]">
              <h2 className="font-bold text-zinc-900 dark:text-white text-base flex items-center gap-2">
                <Shield className="w-4 h-4 text-red-500" />
                3. Prohibited Content
              </h2>
              <p>
                We do not permit links to illegal materials, malware, phishing sites, or hate speech. Any submission violating these conditions will be removed immediately without refund or notice.
              </p>
            </section>

            <section className="space-y-2 p-5 rounded-2xl bg-zinc-50 dark:bg-[#121217] border border-zinc-200 dark:border-[#272732]">
              <h2 className="font-bold text-zinc-900 dark:text-white text-base flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#ea6c52]" />
                4. Service Availability & Modifications
              </h2>
              <p>
                We strive for 99.9% uptime. We reserve the right to modify game rules, ranking mechanics, or UI layouts to enhance the community experience.
              </p>
            </section>
          </div>

          {/* Bottom 3D CTA */}
          <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#ea6c52]/10 via-[#f97316]/5 to-transparent border border-[#ea6c52]/30 w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <h3 className="font-black text-lg sm:text-xl text-zinc-900 dark:text-white">
                Ready to take your spot?
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                Join the live competition starting at $1 USD.
              </p>
            </div>
            <Link
              href="/"
              className="px-6 py-3 rounded-full bg-gradient-to-b from-[#ff7a59] via-[#ea6c52] to-[#d95b41] hover:brightness-105 border-t border-[#ff9e80] text-white font-black text-xs sm:text-sm tracking-tight shadow-[0_4px_0_0_#b8432a,0_6px_14px_rgba(234,108,82,0.4)] active:shadow-[0_1px_0_0_#b8432a] active:translate-y-[2px] transition-all cursor-pointer shrink-0"
            >
              <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">Grab #1 Throne</span>
            </Link>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
