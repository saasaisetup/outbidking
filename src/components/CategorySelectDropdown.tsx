'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import { CATEGORIES } from '@/lib/categories';
import { CategoryIcon } from './CategoryIcon';

interface CategorySelectDropdownProps {
  value: string;
  onChange: (slug: string) => void;
  className?: string;
}

export function CategorySelectDropdown({
  value,
  onChange,
  className = '',
}: CategorySelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const availableCategories = CATEGORIES.filter((c) => c.slug !== 'all');
  const selectedCategory = availableCategories.find((c) => c.slug === value) || availableCategories[0];

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (slug: string) => {
    onChange(slug);
    setIsOpen(false);
  };

  const handleScrollUp = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ top: -120, behavior: 'smooth' });
    }
  };

  const handleScrollDown = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ top: 120, behavior: 'smooth' });
    }
  };

  return (
    <div ref={dropdownRef} className={`relative w-full sm:w-72 select-none ${className}`}>
      {/* Pill Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-3 sm:py-3.5 pl-4 pr-4 rounded-full bg-white dark:bg-[#121217] border border-zinc-200 dark:border-[#272732] hover:border-[#ea6c52] dark:hover:border-[#ea6c52]/60 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 font-bold flex items-center justify-between gap-2.5 transition-all shadow-xs cursor-pointer focus:outline-none"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <CategoryIcon slug={selectedCategory.slug} size="xs" />
          <span className="truncate">{selectedCategory.name}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#ea6c52]' : ''
          }`}
        />
      </button>

      {/* Popover Dropdown (Matches Reference Image) */}
      {isOpen && (
        <div className="absolute left-0 right-0 bottom-full mb-2 sm:bottom-auto sm:top-full sm:mt-2 z-50 rounded-2xl bg-white dark:bg-[#121217] border border-zinc-200 dark:border-[#272732] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Top scroll arrow */}
          <button
            type="button"
            onClick={handleScrollUp}
            className="w-full py-1 bg-zinc-50 dark:bg-[#15151c] hover:bg-zinc-100 dark:hover:bg-[#1a1a24] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 flex items-center justify-center transition-colors border-b border-zinc-100 dark:border-zinc-800/80 cursor-pointer"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>

          {/* Scrollable list of categories with icons */}
          <div
            ref={scrollContainerRef}
            className="max-h-64 sm:max-h-72 overflow-y-auto no-scrollbar py-1 divide-y divide-zinc-100/60 dark:divide-zinc-800/40"
          >
            {availableCategories.map((cat) => {
              const isSelected = cat.slug === selectedCategory.slug;

              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => handleSelect(cat.slug)}
                  className={`w-full px-3.5 py-2.5 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#ea6c52]/10 dark:bg-[#ea6c52]/15 text-[#ea6c52] font-extrabold'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-[#181822] font-semibold text-xs sm:text-sm'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CategoryIcon slug={cat.slug} size="xs" />
                    <span className="truncate text-xs sm:text-sm">{cat.name}</span>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-[#ea6c52] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom scroll arrow */}
          <button
            type="button"
            onClick={handleScrollDown}
            className="w-full py-1 bg-zinc-50 dark:bg-[#15151c] hover:bg-zinc-100 dark:hover:bg-[#1a1a24] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 flex items-center justify-center transition-colors border-t border-zinc-100 dark:border-zinc-800/80 cursor-pointer"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
