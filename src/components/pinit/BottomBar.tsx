'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export function BottomBar() {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-2 px-3 pb-3">
      {/* Centered Pill Bar */}
      <div className="pointer-events-auto flex items-center gap-2 whitespace-nowrap rounded-full border border-[var(--pin-border)] bg-[var(--pin-card)]/95 px-3.5 py-1.5 text-xs text-[var(--pin-muted)] shadow-pin-sm backdrop-blur-sm">
        <a
          href="https://indietools.app"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[var(--pin-coral-ink)] hover:underline"
        >
          IndieTools
        </a>

        <span aria-hidden="true" className="text-[var(--pin-border-strong)]">·</span>

        <a
          href="https://x.com/shipxankit"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Creator on X"
          className="flex items-center text-[var(--pin-muted)] transition-colors hover:text-[var(--pin-ink)]"
        >
          {/* X / Twitter Vector Icon */}
          <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>

        <span aria-hidden="true" className="text-[var(--pin-border-strong)]">·</span>

        <Link
          href="/hall-of-fame"
          className="font-medium text-[var(--pin-ink)] hover:underline"
        >
          Hall of Fame
        </Link>

        <span aria-hidden="true" className="text-[var(--pin-border-strong)]">·</span>

        {/* More Dropdown */}
        <div ref={moreRef} className="relative">
          <button
            type="button"
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className="cursor-pointer font-medium hover:text-[var(--pin-ink)]"
          >
            More
          </button>

          {isMoreOpen && (
            <div className="absolute bottom-full left-1/2 mb-2 w-36 -translate-x-1/2 rounded-pin-md border border-[var(--pin-border)] bg-[var(--pin-card)] p-1.5 text-left shadow-pin-lg z-30">
              <nav aria-label="Site" className="space-y-0.5">
                <Link
                  href="/faq"
                  onClick={() => setIsMoreOpen(false)}
                  className="block rounded-pin-sm px-2.5 py-1.5 text-xs text-[var(--pin-ink)] hover:bg-[var(--pin-coral-soft)] transition-colors"
                >
                  FAQ
                </Link>
                <Link
                  href="/rules"
                  onClick={() => setIsMoreOpen(false)}
                  className="block rounded-pin-sm px-2.5 py-1.5 text-xs text-[var(--pin-ink)] hover:bg-[var(--pin-coral-soft)] transition-colors"
                >
                  Rules
                </Link>
                <Link
                  href="/privacy"
                  onClick={() => setIsMoreOpen(false)}
                  className="block rounded-pin-sm px-2.5 py-1.5 text-xs text-[var(--pin-ink)] hover:bg-[var(--pin-coral-soft)] transition-colors"
                >
                  Privacy
                </Link>
                <Link
                  href="/terms"
                  onClick={() => setIsMoreOpen(false)}
                  className="block rounded-pin-sm px-2.5 py-1.5 text-xs text-[var(--pin-ink)] hover:bg-[var(--pin-coral-soft)] transition-colors"
                >
                  Terms
                </Link>
              </nav>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
