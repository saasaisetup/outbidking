'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Project } from '@/lib/types';
import { CATEGORIES } from '@/lib/categories';
import { ProductLogo } from './ProductLogo';
import { CategoryIcon } from './CategoryIcon';
import { formatProjectTitle, getCleanDomain } from './TopThreeCards';
import { formatJoinedTime } from '@/lib/format';
import { RefreshCw, ChevronRight, ChevronLeft, ExternalLink } from 'lucide-react';
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
        const cleanDomain = getCleanDomain(project.url || project.normalizedUrl);
        const joinedTime = formatJoinedTime(project.createdAt);
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

            {/* Standard Card Row with Outbid.lol Hover state */}
            <div
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onSelectProject(project, nextPrice)}
              className="group relative w-full rounded-2xl border border-zinc-200/90 dark:border-[#272732] bg-white dark:bg-[#121217] p-3.5 sm:p-4 transition-all duration-150 hover:border-[#ea6c52]/60 hover:shadow-xs cursor-pointer"
            >
              {/* Outbid.lol Floating Hover Pill */}
              {isHovered && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-in fade-in zoom-in-95 duration-100">
                  <span className="px-4 py-1 rounded-full bg-[#ea6c52] text-white text-[11px] sm:text-xs font-black tracking-tight shadow-md flex items-center justify-center whitespace-nowrap">
                    claim this spot for ${nextPrice.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between gap-3 sm:gap-6">
                {/* Left Side: Rank Number + Product Logo */}
                <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                  {/* Rank Number with Sleek Sans Typography */}
                  <div className="w-6 sm:w-8 font-sans text-zinc-400 dark:text-zinc-500 font-extrabold text-sm sm:text-base shrink-0 mt-1">
                    #{displayRank}
                  </div>

                  {/* Product Logo */}
                  <div className="mt-0.5">
                    <ProductLogo
                      url={project.url}
                      normalizedUrl={project.normalizedUrl}
                      title={displayTitle}
                      logoUrl={project.logoUrl}
                      size="lg"
                    />
                  </div>

                  {/* Content: Title, Description, and Rich Metadata */}
                  <div className="flex-1 min-w-0">
                    {/* Top Line: Title */}
                    <div className="flex items-center gap-2">
                      <a
                        href={`/r/${project.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white hover:underline flex items-center gap-1.5 transition-colors truncate group-hover:text-[#ea6c52] tracking-tight"
                        title="Visit destination site"
                      >
                        <span className="truncate">{displayTitle}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-zinc-400 opacity-60 hover:opacity-100 shrink-0" />
                      </a>
                    </div>

                    {/* Middle Line: 1-2 Lines of Summary */}
                    <p className="mt-0.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {project.description ||
                        `Discover ${displayTitle} — ranked #${displayRank} on the live leaderboard.`}
                    </p>

                    {/* Bottom Line: #rank in [Category] · [Time Joined] · [Domain Link] · [Clicks] · see details */}
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                      {/* Orange Category Badge with Icon */}
                      <span className="font-bold text-[#ea6c52] flex items-center gap-1">
                        <CategoryIcon slug={project.category} size="xs" />
                        <span>
                          #{displayRank} in {catInfo ? catInfo.name.split(' ')[0] : project.category}
                        </span>
                      </span>

                      <span>·</span>

                      {/* Joined Date */}
                      <span>{joinedTime}</span>

                      <span>·</span>

                      {/* Website URL Link */}
                      <a
                        href={`/r/${project.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="font-semibold text-zinc-600 dark:text-zinc-300 hover:underline hover:text-[#ea6c52] truncate max-w-[120px] sm:max-w-[160px]"
                      >
                        {cleanDomain}
                      </a>

                      <span>·</span>

                      {/* Total Clicks */}
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">
                        {(project.clicks || 0).toLocaleString()} clicks
                      </span>

                      <span>·</span>

                      {/* "see details" link to full screen route */}
                      <Link
                        href={`/project/${project.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-zinc-400 hover:text-[#ea6c52] hover:underline font-semibold cursor-pointer transition-colors"
                      >
                        see details
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Right Side: Clean Price */}
                <div className="text-right shrink-0 pt-0.5 pr-1 sm:pr-2">
                  <div className="text-base sm:text-xl font-extrabold text-[#ea6c52] font-sans group-hover:brightness-110 transition-colors tracking-tight">
                    ${project.totalBid.toLocaleString()}
                  </div>
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
