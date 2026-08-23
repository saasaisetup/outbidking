'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { CATEGORIES } from '@/lib/categories';
import { CategorySlug } from '@/lib/types';

interface CategoryPillsProps {
  selectedCategory: string;
  onSelectCategory: (slug: CategorySlug) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function CategoryPills({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}: CategoryPillsProps) {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 w-full">
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <button
              key={cat.slug}
              onClick={() => onSelectCategory(cat.slug)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 active:scale-95 ${
                isSelected
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-500/20'
                  : 'bg-zinc-900/90 text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-700'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="relative min-w-[240px] md:w-72">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search projects, @handles..."
          className="w-full pl-9.5 pr-8 py-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/80 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-zinc-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
