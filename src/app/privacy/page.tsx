'use client';

import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#06090e] text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-[#1e293b]">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#ff7043] hover:underline"
          >
            ← Back to Map
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-extrabold text-white"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-[7px] bg-[#ff5722] text-white">
              <svg viewBox="0 0 100 100" width="12" height="12" fill="currentColor">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8"/>
                <ellipse cx="50" cy="50" rx="45" ry="20" fill="none" stroke="currentColor" strokeWidth="8"/>
                <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="8"/>
              </svg>
            </span>
            <span>worldpinit.lol</span>
          </Link>
        </div>

        {/* Content */}
        <div className="mt-8 rounded-pin-lg border border-[#1e293b] bg-[#0b0f19] p-6 sm:p-10 shadow-2xl space-y-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">
              Privacy Policy
            </h1>
            <p className="mt-2 text-xs text-[#94a3b8] font-mono">
              Last updated: September 2, 2026 · Effective Immediately
            </p>
          </div>

          <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-6">
            <section>
              <h2 className="text-lg font-bold text-white mb-2">1. Overview & Commitment</h2>
              <p>
                Welcome to <strong>worldpinit.lol</strong> (&ldquo;worldpinit&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;). We respect your privacy and are committed to protecting the personal information and transactional data you share while using our interactive 3D globe and 2D world map advertising platform.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">2. Information We Collect</h2>
              <div className="space-y-2">
                <p><strong>A. Public Listing Data:</strong> When you claim or outbid a territory, we publicly display your Company/Empire name, public URL, logo/favicon, war cry/tagline, country choice, and stake amount on the live map and leaderboards.</p>
                <p><strong>B. Transaction & Payment Information:</strong> Payment processing is managed securely by our payment partners (including Dodo Payments and Stripe). We do not store raw credit card numbers or sensitive banking credentials on our servers.</p>
                <p><strong>C. Usage & Telemetry Data:</strong> We collect aggregate click-through metrics, referrers, browser type, device information, and country analytics to provide live traffic telemetry to territory owners.</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">3. How We Use Your Information</h2>
              <ul className="list-disc pl-5 space-y-1 text-slate-300">
                <li>To render and display your product pin and customized territory colors in real-time.</li>
                <li>To track and deliver verified direct referral clicks to your destination URL.</li>
                <li>To maintain the immutable Hall of Fame directory and country ownership records.</li>
                <li>To send critical outbid notifications and proof-of-placement receipts if an email is provided.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">4. Dofollow Backlinks & Public SEO Attribution</h2>
              <p>
                By staking a territory on worldpinit.lol, you receive public exposure, permanent directory listing in the Hall of Fame, and high-authority dofollow referral backlinks. You acknowledge that all submitted brand names, logos, and links are made available publicly worldwide.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">5. Data Retention & Security</h2>
              <p>
                We implement industry-standard encryption protocols (TLS/SSL) to safeguard all data transmission. Listing records and click analytics are retained to ensure transparent historical tracking in the Hall of Fame.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">6. Contact & Data Inquiries</h2>
              <p>
                For questions or requests regarding your data, reach out to our team on X at <a href="https://x.com/shipxankit" target="_blank" rel="noopener noreferrer" className="text-[#ff7043] font-bold hover:underline">@shipxankit</a> or via email at <strong>support@worldpinit.lol</strong>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
