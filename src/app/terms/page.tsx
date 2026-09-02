'use client';

import React from 'react';
import Link from 'next/link';

export default function TermsOfServicePage() {
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
              Terms of Service
            </h1>
            <p className="mt-2 text-xs text-[#94a3b8] font-mono">
              Last updated: September 2, 2026 · Effective Immediately
            </p>
          </div>

          <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-6">
            <section>
              <h2 className="text-lg font-bold text-white mb-2">1. Agreement to Terms</h2>
              <p>
                By accessing or staking on <strong>worldpinit.lol</strong>, you agree to be bound by these Terms of Service. If you do not agree to all terms and conditions, you may not access the platform or claim any territories.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">2. Map Placement & Outbid Mechanics</h2>
              <ul className="list-disc pl-5 space-y-2 text-slate-300">
                <li><strong>Sovereign Throne Rule:</strong> Exactly 1 product or profile can hold the sovereign throne of any given territory at a time.</li>
                <li><strong>24-Hour Reign:</strong> Successful staking grants you 24 hours of uninterrupted or contestable reign over that territory.</li>
                <li><strong>Outbid / Invasion:</strong> Other users may outbid your current stake by paying a higher amount (minimum +$1 or according to the formula). When outbid, your product enters the permanent Hall of Fame history with all verified analytics intact.</li>
                <li><strong>Maritime Trade Routes & Portals:</strong> Ocean zones (e.g., South Atlantic Patrol, Indian Ocean Route) have a base price of $10 and follow standard sovereign claim mechanics.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">3. Acceptable Content & Moderation</h2>
              <p>
                You represent and warrant that your product URL, company name, and taglines do not contain malicious code, phishing links, illegal narcotics, adult content, hate speech, or defamatory material. We reserve the absolute right to remove any violating listing without refund.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">4. Payment, Fees, & Non-Refundability</h2>
              <p>
                Due to the immediate delivery of digital advertising, real-time live map rendering, and permanent SEO indexing, all completed stakes are final and non-refundable.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">5. Disclaimer of Warranties</h2>
              <p>
                worldpinit.lol is provided &ldquo;as is&rdquo; without warranties of any kind. While we strive for 99.9% uptime and active viral distribution, we do not guarantee specific conversion rates or revenue outcomes from traffic delivered.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-white mb-2">6. Governing Law & Inquiries</h2>
              <p>
                For support, partnerships, or enterprise sponsorships, reach out on X at <a href="https://x.com/shipxankit" target="_blank" rel="noopener noreferrer" className="text-[#ff7043] font-bold hover:underline">@shipxankit</a> or email <strong>support@worldpinit.lol</strong>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
