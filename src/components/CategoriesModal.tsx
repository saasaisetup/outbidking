'use client';

import React from 'react';
import { X, Layers } from 'lucide-react';
import { CATEGORIES } from '@/lib/categories';
import { CategorySlug } from '@/lib/types';

interface CategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (slug: CategorySlug) => void;
}

export function CategoriesModal({ isOpen, onClose, onSelectCategory }: CategoriesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-7 shadow-xl max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-[#e05d44]" />
          <h2 className="text-xl font-black text-zinc-900 dark:text-white">Explore Categories</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => {
                onSelectCategory(cat.slug);
                onClose();
              }}
              className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-[#e05d44] dark:hover:border-[#e05d44] text-left transition-colors flex items-start gap-2.5 group bg-zinc-50/50 dark:bg-zinc-900/50"
            >
              <span className="text-lg group-hover:scale-110 transition-transform">{cat.icon}</span>
              <div>
                <div className="text-xs font-bold text-zinc-900 dark:text-white group-hover:text-[#e05d44] transition-colors">
                  {cat.name}
                </div>
                <div className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">
                  {cat.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
