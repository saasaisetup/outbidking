'use client';

import React, { useState } from 'react';
import { Project } from '@/lib/types';
import { CATEGORIES } from '@/lib/categories';
import { ProductLogo } from './ProductLogo';

interface TopThreeCardsProps {
  topProjects: Project[];
  onSelectProject: (project: Project, nextPrice: number) => void;
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

export function TopThreeCards({ topProjects, onSelectProject }: TopThreeCardsProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (!topProjects || topProjects.length === 0) return null;

  const getCategory = (catSlug: string) => {
    return CATEGORIES.find((c) => c.slug === catSlug);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 flex flex-col gap-3 py-1.5">
      {topProjects.slice(0, 3).map((project, idx) => {
        const displayRank = idx + 1;
        const nextPrice = project.totalBid + 5;
        const isHovered = hoveredId === project.id;
        const catInfo = getCategory(project.category);
        const displayTitle = formatProjectTitle(project);

        return (
          <div
            key={project.id}
            onMouseEnter={() => setHoveredId(project.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => onSelectProject(project, nextPrice)}
            className="group relative w-full rounded-[24px] sm:rounded-[28px] border-[1.5px] border-[#fca5a5] dark:border-[#e05d44]/40 bg-[#fdeee9] dark:bg-[#1c1210] p-4 sm:p-5 transition-all duration-150 hover:shadow-md cursor-pointer"
          >
            {/* Compact Muted "claim this rank for $XX" floating pill */}
            {isHovered && (
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-in fade-in zoom-in-95 duration-100">
                <span className="px-3.5 py-0.5 rounded-full bg-[#ea6c52] dark:bg-[#e05d44] text-white text-[11px] sm:text-xs font-bold tracking-tight shadow-md flex items-center justify-center whitespace-nowrap">
                  claim this rank for ${nextPrice.toLocaleString()}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 sm:gap-5">
              {/* Left Side: Rank Badge + BIGGER Icon + Details */}
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                {/* Round Solid Terracotta Rank Badge */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#e05d44] text-white flex items-center justify-center font-black text-xs sm:text-base flex-shrink-0 shadow-xs">
                  #{displayRank}
                </div>

                {/* BIGGER & SHARPER Icon using ProductLogo (56px - 64px) */}
                <ProductLogo
                  url={project.url}
                  normalizedUrl={project.normalizedUrl}
                  title={displayTitle}
                  logoUrl={project.logoUrl}
                  size="xl"
                />

                {/* Project Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <a
                      href={`/r/${project.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="font-extrabold text-base sm:text-xl text-zinc-900 dark:text-white group-hover:text-[#ea6c52] transition-colors truncate"
                    >
                      {displayTitle}
                    </a>
                  </div>

                  {project.description && (
                    <p className="mt-0.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 line-clamp-2 sm:line-clamp-1 leading-snug sm:leading-relaxed">
                      {project.description}
                    </p>
                  )}

                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                    <span>8 hours ago</span>
                    <span>·</span>
                    <span className="text-zinc-700 dark:text-zinc-300 font-medium flex items-center gap-1 truncate max-w-[140px] sm:max-w-none">
                      {catInfo?.icon && <span>{catInfo.icon}</span>}
                      <span>{catInfo ? catInfo.name : project.category}</span>
                    </span>
                    <span>·</span>
                    <span className="font-bold text-[#e05d44] flex items-center gap-1 flex-shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#e05d44]" />
                      {(project.clicks || 0).toLocaleString()} clicks
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side: Terracotta Bold Price */}
              <div className="text-right flex-shrink-0">
                <div className="text-base sm:text-2xl font-black text-[#e05d44] font-mono">
                  ${project.totalBid.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
