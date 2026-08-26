'use client';

import React, { useState } from 'react';
import { Project } from '@/lib/types';
import { CATEGORIES } from '@/lib/categories';
import { ProductLogo } from './ProductLogo';
import { CategoryIcon } from './CategoryIcon';
import { formatProjectTitle } from './TopThreeCards';
import { RefreshCw, ChevronRight, ChevronLeft, ExternalLink, Info, Flame } from 'lucide-react';
import { RealisticCrown } from './RealisticCrown';

interface RankedListProps {
  projects: Project[];
  onSelectProject: (project: Project, nextPrice: number) => void;
  onViewDetails?: (project: Project) => void;
  onRefresh: () => void;
}

export function RankedList({ projects, onSelectProject, onViewDetails, onRefresh }: RankedListProps) {
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
        <div className="p-8 sm:p-12 rounded-3xl border border-dashed border-zinc-300 dark:border-[#272732] bg-zinc-50/50 dark:bg-[#121217]/50 text-center flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 shadow-sm">
            <RealisticCrown size="xl" variant="gold" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight mb-2">
            The Throne is Open
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mb-5 leading-relaxed">
            No products or creators have claimed the leaderboard yet. Be the founding King and lock in your rank for just $1.
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#ea6c52] to-[#f97316] hover:from-[#d95b41] hover:to-[#ea580c] text-white font-mono font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_4px_16px_rgba(234,108,82,0.4)] hover:shadow-[0_6px_22px_rgba(234,108,82,0.55)] transition-all cursor-pointer active:scale-95 flex items-center gap-2"
          >
            <RealisticCrown size="sm" variant="gold" glow={false} />
            <span>Claim #1 Throne via Dodo Payments ($1)</span>
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
        const nextPrice = project.totalBid + 1;
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
                <div className="px-3.5 py-0.5 sm:py-1 rounded-full bg-zinc-100 dark:bg-[#181822] border border-zinc-200 dark:border-[#272732] text-[10px] sm:text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                  ── TOP 10 ──
                </div>
              </div>
            )}

            {showTop20Divider && (
              <div className="py-3 sm:py-4 flex items-center justify-center">
                <div className="px-3.5 py-0.5 sm:py-1 rounded-full bg-zinc-100 dark:bg-[#181822] border border-zinc-200 dark:border-[#272732] text-[10px] sm:text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                  ── TOP 20 ──
                </div>
              </div>
            )}

            {showTop50Divider && (
              <div className="py-3 sm:py-4 flex items-center justify-center">
                <div className="px-3.5 py-0.5 sm:py-1 rounded-full bg-zinc-100 dark:bg-[#181822] border border-zinc-200 dark:border-[#272732] text-[10px] sm:text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
                  ── TOP 50 ──
                </div>
              </div>
            )}

            {/* Standard Card Row */}
            <div
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative w-full rounded-2xl border border-zinc-200/90 dark:border-[#272732] bg-white dark:bg-[#121217] p-3.5 sm:p-4 transition-all duration-150 hover:border-[#ea6c52]/50 dark:hover:border-zinc-600 hover:shadow-xs"
            >
              <div className="flex items-center justify-between gap-3 sm:gap-4">
                {/* Left Side: Rank Number + ProductLogo + Details */}
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  {/* Rank Number */}
                  <div className="w-7 sm:w-9 font-mono text-zinc-400 dark:text-zinc-500 font-bold text-sm sm:text-lg shrink-0">
                    #{displayRank}
                  </div>

                  {/* ProductLogo */}
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
                        className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white hover:underline flex items-center gap-1.5 transition-colors truncate group-hover:text-[#ea6c52]"
                        title="Visit destination site"
                      >
                        <span className="truncate">{displayTitle}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-zinc-400 opacity-60 hover:opacity-100 shrink-0" />
                      </a>
                    </div>

                    {project.description && (
                      <p className="mt-0.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 line-clamp-1 leading-snug">
                        {project.description}
                      </p>
                    )}

                    {/* Metadata line with UNIFIED CategoryIcon & View Details */}
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                      {/* Unified Category Icon & Name */}
                      <span className="text-zinc-600 dark:text-zinc-300 font-semibold flex items-center gap-1.5 truncate max-w-[150px] sm:max-w-none">
                        <CategoryIcon slug={project.category} size="xs" />
                        <span>{catInfo ? catInfo.name : project.category}</span>
                      </span>

                      <span>·</span>

                      {/* Clicks */}
                      <span className="font-semibold text-[#ea6c52] flex items-center gap-1 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ea6c52]" />
                        {(project.clicks || 0).toLocaleString()} clicks
                      </span>

                      <span>·</span>

                      {/* View Details Trigger */}
                      <button
                        type="button"
                        onClick={() => {
                          if (onViewDetails) onViewDetails(project);
                        }}
                        className="inline-flex items-center gap-1 text-[#ea6c52] hover:text-[#d95b41] hover:underline font-bold cursor-pointer transition-colors"
                      >
                        <Info className="w-3 h-3" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Side: Total Bid + 3D Outbid Button */}
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-sm sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                      ${project.totalBid.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      invested
                    </div>
                  </div>

                  {/* Outbid Action Button */}
                  <button
                    type="button"
                    onClick={() => onSelectProject(project, nextPrice)}
                    className="px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-gradient-to-b from-[#ff7a59] via-[#ea6c52] to-[#d95b41] hover:brightness-105 border-t border-[#ff9e80] text-white font-black text-xs tracking-tight shadow-[0_2.5px_0_0_#b8432a,0_3px_8px_rgba(234,108,82,0.3)] active:shadow-[0_1px_0_0_#b8432a] active:translate-y-[1.5px] transition-all cursor-pointer flex items-center gap-1 shrink-0 select-none"
                  >
                    <Flame className="w-3 h-3 text-amber-200" />
                    <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
                      Outbid ${nextPrice.toLocaleString()}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}

      {/* Pagination Controls & Live Refresh Button */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4 border-t border-zinc-200 dark:border-[#272732] text-xs text-zinc-500">
        <button
          onClick={handleRefreshClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-[#121217] border border-zinc-200 dark:border-[#272732] text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#ea6c52]' : ''}`} />
          <span>Refresh List</span>
        </button>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => handlePageSelect(currentPage - 1)}
              className="p-1.5 rounded-lg border border-zinc-200 dark:border-[#272732] disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-[#181822] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => handlePageSelect(currentPage + 1)}
              className="p-1.5 rounded-lg border border-zinc-200 dark:border-[#272732] disabled:opacity-40 hover:bg-zinc-100 dark:hover:bg-[#181822] cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
