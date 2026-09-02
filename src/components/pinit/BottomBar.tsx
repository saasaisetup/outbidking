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
    <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-1.5 px-3 pb-2.5">
      {/* Map Interaction Hint */}
      <div className="text-[10px] font-mono font-bold tracking-widest text-[#64748b] uppercase hidden sm:flex items-center gap-2">
        <span className="text-[#10b981]">●</span>
        <span>DRAG TO SPIN / PAN</span>
        <span className="text-[#334155]">·</span>
        <span>SCROLL TO ZOOM</span>
        <span className="text-[#334155]">·</span>
        <span className="text-[#fbbf24]">TAP A COUNTRY</span>
      </div>

      {/* Centered Pill Bar */}
      <div className="pointer-events-auto flex items-center gap-2 whitespace-nowrap rounded-full border border-[#1e293b] bg-[#0b0f19]/90 px-3.5 py-1 text-xs text-[#94a3b8] shadow-pin-sm backdrop-blur-md">
        <a
          href="https://indietools.app"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[#ff7043] hover:underline"
        >
          IndieTools
        </a>

        <span aria-hidden="true" className="text-[#334155]">·</span>

        <a
          href="https://x.com/shipxankit"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Creator on X"
          className="flex items-center text-[#94a3b8] transition-colors hover:text-white"
        >
          <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>

        <span aria-hidden="true" className="text-[#334155]">·</span>

        <Link
          href="/hall-of-fame"
          className="font-medium text-white hover:underline"
        >
          Hall of Fame
        </Link>

        <span aria-hidden="true" className="text-[#334155]">·</span>

        {/* More Dropdown */}
        <div ref={moreRef} className="relative">
          <button
            type="button"
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className="cursor-pointer font-medium hover:text-white"
          >
            More
          </button>

          {isMoreOpen && (
            <div className="absolute bottom-full left-1/2 mb-2 w-36 -translate-x-1/2 rounded-pin-md border border-[#1e293b] bg-[#0b0f19] p-1.5 text-left shadow-2xl z-30">
              <nav aria-label="Site" className="space-y-0.5">
                <Link
                  href="/faq"
                  onClick={() => setIsMoreOpen(false)}
                  className="block rounded-pin-sm px-2.5 py-1.5 text-xs text-white hover:bg-[#1e293b] transition-colors"
                >
                  FAQ
                </Link>
                <Link
                  href="/rules"
                  onClick={() => setIsMoreOpen(false)}
                  className="block rounded-pin-sm px-2.5 py-1.5 text-xs text-white hover:bg-[#1e293b] transition-colors"
                >
                  Rules
                </Link>
                <Link
                  href="/privacy"
                  onClick={() => setIsMoreOpen(false)}
                  className="block rounded-pin-sm px-2.5 py-1.5 text-xs text-white hover:bg-[#1e293b] transition-colors"
                >
                  Privacy
                </Link>
                <Link
                  href="/terms"
                  onClick={() => setIsMoreOpen(false)}
                  className="block rounded-pin-sm px-2.5 py-1.5 text-xs text-white hover:bg-[#1e293b] transition-colors"
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
