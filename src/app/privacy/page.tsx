'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Shield, Eye, Lock, FileText, ArrowRight, Trophy } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-zinc-900 dark:text-[#f4f4f5] font-sans flex flex-col justify-between transition-colors duration-200">
      <div>
        <Header />

        <main className="w-full max-w-2xl mx-auto px-4 pt-8 pb-16 flex flex-col items-start">
          <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
                Privacy Policy
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
                <Eye className="w-4 h-4 text-[#ea6c52]" />
                1. Information We Collect
              </h2>
              <p>
                When you participate in Outbidking.lol, we collect the public information you submit: your product/project URL, public handle, brand display title, category, and bid amount. If provided, we collect your email address purely for sending official payment and ranking receipts.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-bold text-zinc-900 dark:text-white text-base flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#ea6c52]" />
                2. Payment & Financial Data
              </h2>
              <p>
                All payments are handled securely through our official merchant processor, <strong className="text-zinc-900 dark:text-white">Dodo Payments</strong>. We do not store, process, or have access to your raw credit card numbers or banking credentials.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-bold text-zinc-900 dark:text-white text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#ea6c52]" />
                3. Analytics & Real-Time Tracking
              </h2>
              <p>
                We measure aggregate site visits and live online presence anonymously using Supabase Realtime without tracking individual personal identities across external web properties.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-bold text-zinc-900 dark:text-white text-base">
                4. Contact & Removal
              </h2>
              <p>
                For inquiries regarding data privacy or listing removal requests, contact <strong className="text-[#ea6c52]">@shipxankit on 𝕏</strong>.
              </p>
            </section>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
