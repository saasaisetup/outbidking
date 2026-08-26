'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CATEGORIES } from '@/lib/categories';
import { CategorySlug } from '@/lib/types';
import { ChevronDown, Check } from 'lucide-react';

interface CategoryFiltersProps {
  selectedCategory: CategorySlug | string;
  onSelectCategory: (category: CategorySlug) => void;
}

export function CategoryFilters({
  selectedCategory,
  onSelectCategory,
}: CategoryFiltersProps) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement | null>(null);

  // Top 8 prominent categories matching screenshot
  const mainCategories = CATEGORIES.slice(0, 8);
  const moreCategories = CATEGORIES.slice(8);

  const isMoreSelected = moreCategories.some((c) => c.slug === selectedCategory);
  const selectedMoreCat = moreCategories.find((c) => c.slug === selectedCategory);

  // Close dropdown on outside click
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
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 pt-2 pb-5">
      <div className="flex items-center justify-start md:justify-center gap-2 sm:gap-2.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0">
        {/* Main Categories */}
        {mainCategories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;

          return (
            <button
              key={cat.slug}
              type="button"
              onClick={() => onSelectCategory(cat.slug as CategorySlug)}
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-2xl sm:rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-150 flex-shrink-0 cursor-pointer active:scale-95 ${
                isSelected
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm border border-zinc-900 dark:border-white font-bold'
                  : 'bg-white dark:bg-[#181613] text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-[#2e2a24] hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-950 dark:hover:text-white shadow-2xs'
              }`}
            >
              <span className="text-xs sm:text-sm">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}

        {/* More Dropdown */}
        <div ref={moreRef} className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => setIsMoreOpen(!isMoreOpen)}
            className={`inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-2xl sm:rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer active:scale-95 ${
              isMoreSelected
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm border border-zinc-900 dark:border-white font-bold'
                : 'bg-white dark:bg-[#181613] text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-[#2e2a24] hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-950 dark:hover:text-white shadow-2xs'
            }`}
          >
            <span>{isMoreSelected && selectedMoreCat ? selectedMoreCat.name : 'More'}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isMoreOpen && (
            <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-64 max-h-72 overflow-y-auto p-1.5 rounded-2xl bg-white dark:bg-[#181613] border border-zinc-200 dark:border-[#2e2a24] shadow-2xl z-30 font-sans text-xs sm:text-sm animate-in fade-in slide-in-from-top-2 duration-150 scrollbar-thin">
              {moreCategories.map((cat) => {
                const isSelected = selectedCategory === cat.slug;
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => {
                      onSelectCategory(cat.slug as CategorySlug);
                      setIsMoreOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-100 dark:bg-zinc-800 text-[#ea6c52] font-bold'
                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span>{cat.icon}</span>
                      <span className="truncate">{cat.name}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#ea6c52] shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
