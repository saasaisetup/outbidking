'use client';

import React, { useState } from 'react';
import { Project } from '@/lib/types';
import { CATEGORIES } from '@/lib/categories';
import { ProductLogo } from './ProductLogo';
import { RealisticCrown } from './RealisticCrown';
import { CategoryIcon } from './CategoryIcon';
import { ExternalLink, Info } from 'lucide-react';

interface TopThreeCardsProps {
  topProjects: Project[];
  onSelectProject: (project: Project, nextPrice: number) => void;
  onViewDetails?: (project: Project) => void;
}

export function formatProjectTitle(project: { title?: string; url?: string; normalizedUrl?: string }): string {
  const url = (project.url || project.normalizedUrl || '').toLowerCase();
  if (url.includes('x.com/') || url.includes('twitter.com/') || url.startsWith('@')) {
    const handle = url.replace(/^(https?:\/\/)?(www\.)?(x\.com|twitter\.com)\//, '').split('/')[0].split('?')[0].replace(/^@/, '');
    if (handle && handle !== 'x.com' && handle !== 'twitter.com') {
      return `@${handle}`;
    }
  }
  if (url.includes('instagram.com/')) {
    const handle = url.replace(/^(https?:\/\/)?(www\.)?instagram\.com\//, '').split('/')[0].split('?')[0].replace(/^@/, '');
    if (handle && handle !== 'instagram.com') {
      return `@${handle}`;
    }
  }
  if (url.includes('github.com/')) {
    const handle = url.replace(/^(https?:\/\/)?(www\.)?github\.com\//, '').split('/')[0].split('?')[0].replace(/^@/, '');
    if (handle && handle !== 'github.com') {
      return `@${handle}`;
    }
  }
  if (project.title && project.title !== 'x.com' && project.title !== 'instagram.com' && project.title !== 'twitter.com') {
    return project.title;
  }
  return project.normalizedUrl || project.url || 'Untitled';
}

export function TopThreeCards({ topProjects, onSelectProject, onViewDetails }: TopThreeCardsProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (!topProjects || topProjects.length === 0) return null;

  const getCategory = (catSlug: string) => {
    return CATEGORIES.find((c) => c.slug === catSlug);
  };

  const getRankCrown = (rank: number) => {
    if (rank === 1) return <RealisticCrown size="sm" variant="gold" />;
    if (rank === 2) return <RealisticCrown size="sm" variant="silver" />;
    if (rank === 3) return <RealisticCrown size="sm" variant="bronze" />;
    return null;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 flex flex-col gap-3 py-1.5">
      {topProjects.slice(0, 3).map((project, idx) => {
        const displayRank = idx + 1;
        const nextPrice = project.totalBid + 1;
        const isHovered = hoveredId === project.id;
        const catInfo = getCategory(project.category);
        const displayTitle = formatProjectTitle(project);

        return (
          <div
            key={project.id}
            onMouseEnter={() => setHoveredId(project.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => onSelectProject(project, nextPrice)}
            className="group relative w-full rounded-[24px] sm:rounded-[28px] border-[1.5px] border-[#fca5a5] dark:border-[#e05d44]/40 bg-[#fdeee9] dark:bg-[#1c1210] p-4 sm:p-5 transition-all duration-150 hover:shadow-md hover:border-[#ea6c52] cursor-pointer"
          >
            {/* Outbid.lol Floating Hover Pill */}
            {isHovered && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-in fade-in zoom-in-95 duration-100">
                <span className="px-4 py-1 rounded-full bg-[#ea6c52] text-white text-[11px] sm:text-xs font-black tracking-tight shadow-lg flex items-center justify-center whitespace-nowrap">
                  claim this spot for ${nextPrice.toLocaleString()}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 sm:gap-6">
              {/* Left Side: Rank Badge + Crown + Logo + Details */}
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                {/* Round Solid Terracotta Rank Badge with Realistic Gold / Silver / Bronze Crown */}
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#e05d44] text-white flex items-center justify-center font-black text-xs sm:text-base shadow-xs">
                    #{displayRank}
                  </div>
                  {displayRank <= 3 && (
                    <div className="absolute -top-3.5 -left-1.5 pointer-events-none">
                      {getRankCrown(displayRank)}
                    </div>
                  )}
                </div>

                {/* Product Logo */}
                <ProductLogo
                  url={project.url}
                  normalizedUrl={project.normalizedUrl}
                  title={displayTitle}
                  logoUrl={project.logoUrl}
                  size="xl"
                />

                {/* Project Details */}
                <div className="flex-1 min-w-0">
                  {/* Title as direct link with hover underline */}
                  <div className="flex items-center gap-2">
                    <a
                      href={`/r/${project.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="font-extrabold text-base sm:text-xl text-zinc-900 dark:text-white hover:underline flex items-center gap-1.5 transition-colors truncate group-hover:text-[#ea6c52]"
                      title="Visit destination site"
                    >
                      <span className="truncate">{displayTitle}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-400 opacity-60 hover:opacity-100 shrink-0" />
                    </a>
                  </div>

                  {/* Description / About snippet */}
                  {project.description && (
                    <p className="mt-0.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 line-clamp-1 leading-snug">
                      {project.description}
                    </p>
                  )}

                  {/* Metadata line with UNIFIED CategoryIcon & View Details */}
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                    {/* Unified Category Icon & Name */}
                    <span className="text-zinc-700 dark:text-zinc-300 font-semibold flex items-center gap-1.5 truncate max-w-[170px] sm:max-w-none">
                      <CategoryIcon slug={project.category} size="xs" />
                      <span>{catInfo ? catInfo.name : project.category}</span>
                    </span>

                    <span>·</span>

                    {/* Clicks */}
                    <span className="font-bold text-[#e05d44] flex items-center gap-1 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#e05d44]" />
                      {(project.clicks || 0).toLocaleString()} clicks
                    </span>

                    <span>·</span>

                    {/* View Details Trigger */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
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

              {/* Right Side: Clean, Spacious Price */}
              <div className="text-right flex-shrink-0 pr-1 sm:pr-2">
                <div className="text-base sm:text-2xl font-black text-zinc-900 dark:text-white font-mono tracking-tight group-hover:text-[#ea6c52] transition-colors">
                  ${project.totalBid.toLocaleString()}
                </div>
                <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                  invested
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
