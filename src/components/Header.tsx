'use client';

import React from 'react';
import Link from 'next/link';
import { Moon, Sun, Globe } from 'lucide-react';
import { useTheme } from '@/lib/theme';

interface HeaderProps {
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  onOpenRules?: () => void;
  onOpenAbout?: () => void;
  onOpenCategories?: () => void;
}

export function Header({
  darkMode: propDarkMode,
  onToggleDarkMode: propToggleTheme,
}: HeaderProps) {
  const { darkMode: hookDarkMode, toggleTheme: hookToggleTheme } = useTheme();
  const darkMode = propDarkMode !== undefined ? propDarkMode : hookDarkMode;
  const toggleTheme = propToggleTheme || hookToggleTheme;

  return (
    <header className="w-full max-w-4xl mx-auto px-3 sm:px-4 pt-2.5 sm:pt-6 pb-2 flex items-center justify-between gap-2">
      {/* Brand Logo with 3 stacked lines */}
      <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group shrink-0">
        <div className="w-4 sm:w-6 h-3 sm:h-5 flex flex-col justify-between py-0.5">
          <div className="w-2.5 sm:w-3.5 h-0.5 sm:h-1 rounded-full bg-[#ea6c52]" />
          <div className="w-4 sm:w-6 h-0.5 sm:h-1 rounded-full bg-zinc-900 dark:bg-white" />
          <div className="w-3 sm:w-4.5 h-0.5 sm:h-1 rounded-full bg-zinc-900 dark:bg-white" />
        </div>
        <span className="font-black text-sm sm:text-xl tracking-tight text-zinc-900 dark:text-white">
          outbidking<span className="text-[#ea6c52]">.lol</span>
        </span>
      </Link>

      {/* Nav Links (Leaderboard removed per user request) */}
      <nav className="flex items-center gap-1.5 sm:gap-4 text-[11px] sm:text-sm font-semibold text-zinc-600 dark:text-zinc-400 shrink-0">
        <Link
          href="/map"
          className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full bg-[#ea6c52]/10 text-[#ea6c52] border border-[#ea6c52]/30 hover:bg-[#ea6c52]/20 font-bold transition-all text-[10px] sm:text-xs"
        >
          <span>🗺️</span>
          <span>World Map</span>
        </Link>

        <Link
          href="/categories"
          className="hover:text-zinc-950 dark:hover:text-white transition-colors text-[10px] sm:text-xs hidden sm:inline"
        >
          Categories
        </Link>
        <Link
          href="/about"
          className="hover:text-zinc-950 dark:hover:text-white transition-colors text-[10px] sm:text-xs font-semibold"
        >
          About
        </Link>
        <Link
          href="/rules"
          className="hover:text-zinc-950 dark:hover:text-white transition-colors text-[10px] sm:text-xs font-semibold"
        >
          Rules
        </Link>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          className="p-1 sm:p-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer shrink-0"
        >
          {darkMode ? (
            <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
          ) : (
            <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-zinc-700" />
          )}
        </button>
      </nav>
    </header>
  );
}
