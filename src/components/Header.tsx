'use client';

import React from 'react';
import Link from 'next/link';
import { Moon, Sun, Trophy } from 'lucide-react';
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
    <header className="w-full max-w-4xl mx-auto px-3 sm:px-4 pt-3 sm:pt-6 pb-2 flex items-center justify-between gap-2">
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

      {/* Nav Links + Prominent Leaderboard CTA */}
      <nav className="flex items-center gap-1.5 sm:gap-3 text-[11px] sm:text-sm font-semibold text-zinc-600 dark:text-zinc-400 shrink-0">
        {/* Prominent Leaderboard Button in place of World Map */}
        <Link
          href="/"
          className="group relative inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-full bg-gradient-to-r from-[#ea6c52] to-[#f97316] text-white shadow-md shadow-[#ea6c52]/25 hover:shadow-lg hover:shadow-[#ea6c52]/40 hover:scale-[1.03] active:scale-[0.98] transition-all font-black text-xs sm:text-sm tracking-tight cursor-pointer"
          title="Leaderboard: Outbid competitors and grab #1"
        >
          <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-200" />
          <span>Leaderboard</span>
        </Link>

        {/* 
        PRESERVED FOR FUTURE USE: World War Map Feature
        <Link
          href="/map"
          className="group relative inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full bg-gradient-to-r from-[#ea6c52] to-[#f97316] text-white shadow-md shadow-[#ea6c52]/25 hover:shadow-lg hover:shadow-[#ea6c52]/40 hover:scale-[1.03] active:scale-[0.98] transition-all font-black text-xs sm:text-sm tracking-tight cursor-pointer"
          title="World Map: Claim Your Country and Rule It"
        >
          <span className="text-sm sm:text-base">🗺️</span>
          <span>World Map</span>
          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-black bg-black/30 text-amber-200 border border-white/20 uppercase tracking-widest hidden sm:inline">
            WAR
          </span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
        */}

        <Link
          href="/categories"
          className="hover:text-zinc-950 dark:hover:text-white transition-colors text-xs sm:text-sm hidden md:inline font-medium"
        >
          Categories
        </Link>
        <Link
          href="/about"
          className="hover:text-zinc-950 dark:hover:text-white transition-colors text-xs sm:text-sm font-medium"
        >
          About
        </Link>
        <Link
          href="/rules"
          className="hover:text-zinc-950 dark:hover:text-white transition-colors text-xs sm:text-sm font-medium"
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
