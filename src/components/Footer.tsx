'use client';

import React from 'react';
import Link from 'next/link';

interface FooterProps {
  onOpenRules: () => void;
  onOpenStats: () => void;
}

export function Footer({ onOpenRules, onOpenStats }: FooterProps) {
  return (
    <footer className="w-full max-w-4xl mx-auto px-4 mt-16 pt-8 pb-12 border-t border-zinc-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1">
        <span>Built by</span>
        <a
          href="https://x.com/shipxcode"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-zinc-800 dark:text-zinc-200 hover:text-[#e05d44] dark:hover:text-[#e05d44] transition-colors"
        >
          @shipxcode
        </a>
        <span>·</span>
        <span>Brought to you by</span>
        <a
          href="https://shipxcode.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-[#e05d44] hover:underline"
        >
          shipxcode.dev
        </a>
      </div>

      <div className="flex items-center gap-4 font-medium">
        <Link
          href="/rules"
          className="hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          Rules
        </Link>
        <button
          onClick={onOpenStats}
          className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          Live stats
        </button>
      </div>
    </footer>
  );
}
