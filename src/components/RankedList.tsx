'use client';

import React, { useState } from 'react';
import { Project } from '@/lib/types';
import { CATEGORIES } from '@/lib/categories';
import { ProductLogo } from './ProductLogo';
import { formatProjectTitle } from './TopThreeCards';
import { RefreshCw, ChevronRight, ChevronLeft } from 'lucide-react';

interface RankedListProps {
  projects: Project[];
  onSelectProject: (project: Project, nextPrice: number) => void;
  onRefresh: () => void;
}

export function RankedList({ projects, onSelectProject, onRefresh }: RankedListProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  const getCategory = (catSlug: string) => {
    return CATEGORIES.find((c) => c.slug === catSlug);
  };

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // On page 1, skip top 3 because they are rendered in TopThreeCards
  const isFirstPage = currentPage === 1;
  const startIndex = isFirstPage ? 3 : (currentPage - 1) * pageSize;
  const endIndex = currentPage * pageSize;
  const pageItems = projects.slice(startIndex, endIndex);

  const totalPages = Math.max(1, Math.ceil(projects.length / pageSize));

  const handlePageSelect = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  if (projects.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-6">
        <div className="p-8 sm:p-12 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50/50 dark:bg-[#141210]/50 text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-3xl bg-[#ea6c52]/10 border border-[#ea6c52]/30 flex items-center justify-center text-3xl mb-3.5 shadow-sm">
            👑
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight mb-2">
            The Throne is Open
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mb-5 leading-relaxed">
            No products or creators have claimed the leaderboard yet. Be the founding King and lock in your rank for just $5.
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-6 py-3 rounded-2xl bg-[#ea6c52] hover:bg-[#d95b41] text-white font-mono font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_4px_15px_rgba(234,108,82,0.35)] transition-all cursor-pointer active:scale-95 flex items-center gap-2"
          >
            <span>👑 Claim #1 Throne via Dodo Payments ($5)</span>
          </button>
        </div>
      </div>
    );
  }

  if (pageItems.length === 0 && projects.length <= 3) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 flex flex-col gap-2.5 sm:gap-3 py-1.5">
      {pageItems.map((project, idx) => {
        const displayRank = startIndex + idx + 1;
        const nextPrice = project.totalBid + 5;
        const isHovered = hoveredId === project.id;
        const catInfo = getCategory(project.category);
        const displayTitle = formatProjectTitle(project);
        const showTop10Divider = isFirstPage && displayRank === 11;
        const showTop20Divider = isFirstPage && displayRank === 21;
        const showTop50Divider = isFirstPage && displayRank === 51;

        return (
          <React.Fragment key={project.id}>
            {/* Divider Badges */}
            {showTop10Divider && (
              <div className="py-3 sm:py-4 flex items-center justify-center">
                <div className="px-3.5 py-0.5 sm:py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] sm:text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                  ── TOP 10 ──
                </div>
              </div>
            )}

            {showTop20Divider && (
              <div className="py-3 sm:py-4 flex items-center justify-center">
                <div className="px-3.5 py-0.5 sm:py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] sm:text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                  ── TOP 20 ──
                </div>
              </div>
            )}

            {showTop50Divider && (
              <div className="py-3 sm:py-4 flex items-center justify-center">
                <div className="px-3.5 py-0.5 sm:py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] sm:text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                  ── TOP 50 ──
                </div>
              </div>
            )}

            {/* Standard Card Row */}
            <div
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onSelectProject(project, nextPrice)}
              className="group relative w-full rounded-2xl border border-zinc-200/90 dark:border-[#2b2721] bg-white dark:bg-[#181613] p-3.5 sm:p-4 transition-all duration-150 hover:border-[#e05d44]/50 dark:hover:border-zinc-600 hover:shadow-xs cursor-pointer"
            >
              {/* Compact Muted "claim this rank for $XX" floating pill */}
              {isHovered && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-in fade-in zoom-in-95 duration-100">
                  <span className="px-3.5 py-0.5 rounded-full bg-[#ea6c52] dark:bg-[#e05d44] text-white text-[11px] sm:text-xs font-bold tracking-tight shadow-md flex items-center justify-center whitespace-nowrap">
                    claim this rank for ${nextPrice.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 sm:gap-4">
                {/* Left Side: Rank Number + BIGGER Icon + Details */}
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  {/* Rank Number */}
                  <div className="w-7 sm:w-9 font-mono text-zinc-400 dark:text-zinc-500 font-bold text-sm sm:text-lg flex-shrink-0">
                    #{displayRank}
                  </div>

                  {/* BIGGER & SHARPER ProductLogo (48px - 56px) */}
                  <ProductLogo
                    url={project.url}
                    normalizedUrl={project.normalizedUrl}
                    title={displayTitle}
                    logoUrl={project.logoUrl}
                    size="lg"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <a
                        href={`/r/${project.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white group-hover:text-[#ea6c52] transition-colors truncate"
                      >
                        {displayTitle}
                      </a>
                    </div>

                    {project.description && (
                      <p className="mt-0.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 sm:line-clamp-1 leading-snug sm:leading-relaxed">
                        {project.description}
                      </p>
                    )}

                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] sm:text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                      <span>yesterday</span>
                      <span>·</span>
                      <span className="text-zinc-600 dark:text-zinc-300 font-medium flex items-center gap-1 truncate max-w-[130px] sm:max-w-none">
                        {catInfo?.icon && <span>{catInfo.icon}</span>}
                        <span>{catInfo ? catInfo.name : project.category}</span>
                      </span>
                      <span>·</span>
                      <span className="font-semibold text-[#e05d44] flex items-center gap-1 flex-shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#e05d44]" />
                        {(project.clicks || 0).toLocaleString()} clicks
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Terracotta Bold Price */}
                <div className="text-right flex-shrink-0">
                  <div className="text-sm sm:text-lg font-bold text-[#e05d44] font-mono">
                    ${project.totalBid.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}

      {/* Interactive 50-Item Pagination Bar */}
      <div className="mt-6 sm:mt-8 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          {currentPage > 1 && (
            <button
              onClick={() => handlePageSelect(currentPage - 1)}
              className="w-8 h-8 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => handlePageSelect(p)}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all active:scale-90 cursor-pointer ${
                currentPage === p
                  ? 'bg-[#ea6c52] text-white shadow-xs'
                  : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              {p}
            </button>
          ))}

          {currentPage < totalPages && (
            <button
              onClick={() => handlePageSelect(currentPage + 1)}
              className="w-8 h-8 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="text-[11px] sm:text-xs text-zinc-400 font-medium">
          Showing {startIndex + 1} - {Math.min(endIndex, projects.length)} of {projects.length} listings
        </div>

        {/* Refresh Button */}
        <button
          onClick={handleRefreshClick}
          className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer active:scale-95"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Live Bids</span>
        </button>
      </div>
    </div>
  );
}
