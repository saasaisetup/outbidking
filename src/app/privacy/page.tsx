'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Shield, Eye, Lock, FileText, ArrowRight, Trophy, Database, UserCheck, Bell } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-zinc-900 dark:text-[#f4f4f5] font-sans flex flex-col justify-between transition-colors duration-200">
      <div>
        <Header />

        <main className="w-full max-w-4xl mx-auto px-4 pt-8 pb-20 flex flex-col items-start">
          {/* Header Title & 3D CTA */}
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
                <Eye className="w-4 h-4 text-[#ea6c52]" />
                1. Information We Collect
              </h2>
              <p>
                When you list a project on Outbidking.lol, we store the public information you submit: your product/project URL, public handle (e.g. 𝕏 / GitHub), display title, selected category, and bid amount. If provided, we collect your email address exclusively for payment receipts and ranking notifications.
              </p>
            </section>

            <section className="space-y-2 p-5 rounded-2xl bg-zinc-50 dark:bg-[#121217] border border-zinc-200 dark:border-[#272732]">
              <h2 className="font-bold text-zinc-900 dark:text-white text-base flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#ea6c52]" />
                2. Payment & Financial Data Security
              </h2>
              <p>
                All payment processing is handled exclusively by our merchant partner, <strong className="text-zinc-900 dark:text-white">Dodo Payments</strong>. We do not store, process, or transmit credit card numbers, CVVs, or sensitive banking details on our servers.
              </p>
            </section>

            <section className="space-y-2 p-5 rounded-2xl bg-zinc-50 dark:bg-[#121217] border border-zinc-200 dark:border-[#272732]">
              <h2 className="font-bold text-zinc-900 dark:text-white text-base flex items-center gap-2">
                <Database className="w-4 h-4 text-[#ea6c52]" />
                3. Real-Time Telemetry & Visitor Tracking
              </h2>
              <p>
                We track anonymous aggregate metrics including live connected sessions and total visitors through Supabase Realtime without selling personal identifiers, device telemetry, or third-party behavioral cookies.
              </p>
            </section>

            <section className="space-y-2 p-5 rounded-2xl bg-zinc-50 dark:bg-[#121217] border border-zinc-200 dark:border-[#272732]">
              <h2 className="font-bold text-zinc-900 dark:text-white text-base flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#ea6c52]" />
                4. Data Deletion & Inquiries
              </h2>
              <p>
                If you need your listing modified, transferred, or permanently removed from our public records, contact our team directly at <strong className="text-[#ea6c52]">@shipxankit on 𝕏</strong>.
              </p>
            </section>
          </div>

          {/* Bottom 3D CTA */}
          <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#ea6c52]/10 via-[#f97316]/5 to-transparent border border-[#ea6c52]/30 w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <h3 className="font-black text-lg sm:text-xl text-zinc-900 dark:text-white">
                Take the #1 Spot on the Live Board
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                Outbid the competition starting at just $1 USD.
              </p>
            </div>
            <Link
              href="/"
              className="px-6 py-3 rounded-full bg-gradient-to-b from-[#ff7a59] via-[#ea6c52] to-[#d95b41] hover:brightness-105 border-t border-[#ff9e80] text-white font-black text-xs sm:text-sm tracking-tight shadow-[0_4px_0_0_#b8432a,0_6px_14px_rgba(234,108,82,0.4)] active:shadow-[0_1px_0_0_#b8432a] active:translate-y-[2px] transition-all cursor-pointer shrink-0"
            >
              <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">Claim Throne</span>
            </Link>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
