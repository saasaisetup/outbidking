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
              onClick={() => onSelectCategory(cat.slug as CategorySlug)}
              className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-150 flex-shrink-0 cursor-pointer active:scale-95 ${
                isSelected
                  ? 'bg-[#ea6c52] text-white shadow-xs'
                  : 'bg-zinc-100 dark:bg-[#181613] text-zinc-700 dark:text-zinc-400 border border-zinc-200/80 dark:border-[#2e2a24] hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-950 dark:hover:text-zinc-200'
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
