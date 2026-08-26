'use client';

import React from 'react';
import { CATEGORIES } from '@/lib/categories';
import { CategorySlug } from '@/lib/types';
import { CategoryIcon } from './CategoryIcon';

interface CategoryFiltersProps {
  selectedCategory: CategorySlug | string;
  onSelectCategory: (category: CategorySlug) => void;
}

export function CategoryFilters({
  selectedCategory,
  onSelectCategory,
}: CategoryFiltersProps) {
  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
      <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.slug;

          return (
            <button
              key={cat.slug}
              type="button"
              onClick={() => onSelectCategory(cat.slug as CategorySlug)}
              className={`inline-flex items-center gap-2 px-3.5 sm:px-4.5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-150 flex-shrink-0 cursor-pointer active:scale-95 ${
                isSelected
                  ? 'bg-gradient-to-r from-[#ea6c52] to-[#f97316] text-white border border-[#d95b41] shadow-md shadow-[#ea6c52]/25'
                  : 'bg-zinc-100 dark:bg-[#121217] text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-[#272732] hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              {/* Category Icon */}
              <CategoryIcon
                slug={cat.slug}
                size="sm"
                className={isSelected ? '!bg-white/20 !text-white' : ''}
              />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
