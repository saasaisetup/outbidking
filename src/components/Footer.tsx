'use client';

import React from 'react';
import Link from 'next/link';

interface FooterProps {
  onOpenRules?: () => void;
  onOpenStats?: () => void;
  onOpenAbout?: () => void;
}

export function Footer({ onOpenStats }: FooterProps) {
  return (
    <footer className="w-full max-w-4xl mx-auto px-4 mt-16 pt-8 pb-12 border-t border-zinc-200 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1">
        <span>Built by</span>
        <a
          href="https://x.com/shipxankit"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-zinc-800 dark:text-zinc-200 hover:text-[#ea6c52] dark:hover:text-[#ea6c52] transition-colors"
        >
          @shipxankit
        </a>
        <span>·</span>
        <span>Brought to you by</span>
        <a
          href="https://x.com/shipxankit"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-[#ea6c52] hover:underline"
        >
          @shipxankit on 𝕏
        </a>
      </div>

      {/* Dedicated full-width page navigation links (No modals) */}
      <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-5">
        <Link
          href="/about"
          className="hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          About
        </Link>
        <Link
          href="/rules"
          className="hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          Rules
        </Link>
        <Link
          href="/privacy"
          className="hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          Privacy Policy
        </Link>
        <Link
          href="/terms"
          className="hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          Terms of Service
        </Link>
        {onOpenStats && (
          <button
            type="button"
            onClick={onOpenStats}
            className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            Live stats
          </button>
        )}
      </div>
    </footer>
  );
}
