'use client';

import React from 'react';
import { X, ExternalLink, Trophy, TrendingUp, MousePointer, ShieldCheck, ArrowRight } from 'lucide-react';
import { Project } from '@/lib/types';
import { CATEGORIES } from '@/lib/categories';
import { ProductLogo } from './ProductLogo';
import { RealisticCrown } from './RealisticCrown';
import { CategoryIcon } from './CategoryIcon';
import { formatProjectTitle } from './TopThreeCards';

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onOutbid: (project: Project, nextBidAmount: number) => void;
}

export function ProjectDetailsModal({
  isOpen,
  onClose,
  project,
  onOutbid,
}: ProjectDetailsModalProps) {
  if (!isOpen || !project) return null;

  const nextBid = project.totalBid + 1;
  const categoryInfo = CATEGORIES.find((c) => c.slug === project.category);
  const displayTitle = formatProjectTitle(project);

  const getCrown = (rank: number) => {
    if (rank === 1) return <RealisticCrown size="md" variant="gold" />;
    if (rank === 2) return <RealisticCrown size="md" variant="silver" />;
    if (rank === 3) return <RealisticCrown size="md" variant="bronze" />;
    return null;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#121217] border border-zinc-200 dark:border-[#272732] shadow-2xl p-5 sm:p-7 max-h-[92vh] flex flex-col overflow-y-auto animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-3.5 flex-1 min-w-0">
            {/* Logo */}
            <ProductLogo
              url={project.url}
              normalizedUrl={project.normalizedUrl}
              title={displayTitle}
              logoUrl={project.logoUrl}
              size="lg"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <a
                  href={`/r/${project.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg sm:text-xl font-extrabold text-zinc-900 dark:text-white hover:underline flex items-center gap-1.5 truncate group"
                >
                  <span className="truncate">{displayTitle}</span>
                  <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-[#ea6c52] transition-colors shrink-0" />
                </a>
              </div>

              {/* Category */}
              <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                <CategoryIcon slug={project.category} size="xs" />
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {categoryInfo ? categoryInfo.name : project.category}
                </span>
              </div>
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-300 flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Grid: 4 Metric Cards */}
        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3">
          {/* 1. Total Invested */}
          <div className="p-3.5 rounded-2xl bg-[#fbfaf8] dark:bg-[#181822] border border-zinc-200/80 dark:border-zinc-800 flex flex-col">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
              Total Invested
            </span>
            <span className="mt-1 text-xl sm:text-2xl font-black font-mono text-[#ea6c52]">
              ${project.totalBid.toLocaleString()}
            </span>
            <span className="text-[10px] text-zinc-400 mt-0.5">Verified Dodo Payments</span>
          </div>

          {/* 2. Overall Rank */}
          <div className="p-3.5 rounded-2xl bg-[#fbfaf8] dark:bg-[#181822] border border-zinc-200/80 dark:border-zinc-800 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                Overall Rank
              </span>
              {getCrown(project.rank)}
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
                #{project.rank}
              </span>
              <span className="text-[11px] text-zinc-400">Global</span>
            </div>
            <span className="text-[10px] text-zinc-400 mt-0.5">Out of all active listings</span>
          </div>

          {/* 3. Category Rank */}
          <div className="p-3.5 rounded-2xl bg-[#fbfaf8] dark:bg-[#181822] border border-zinc-200/80 dark:border-zinc-800 flex flex-col">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
              Category Rank
            </span>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
                #{project.rank}
              </span>
              <CategoryIcon slug={project.category} size="xs" />
            </div>
            <span className="text-[10px] text-zinc-400 mt-0.5 truncate">
              {categoryInfo ? categoryInfo.name : 'Category'}
            </span>
          </div>

          {/* 4. Minimum Outbid Price */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#ea6c52]/10 via-[#ea6c52]/5 to-transparent border border-[#ea6c52]/30 flex flex-col">
            <span className="text-[11px] font-bold text-[#ea6c52] uppercase tracking-wider">
              Take This Rank
            </span>
            <span className="mt-1 text-xl sm:text-2xl font-black font-mono text-[#ea6c52]">
              ${nextBid.toLocaleString()}
            </span>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              +$1 over current leader
            </span>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-5 p-4 rounded-2xl bg-zinc-50 dark:bg-[#181822] border border-zinc-200/80 dark:border-zinc-800">
          <h4 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
            About Project
          </h4>
          <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">
            {project.description || `${displayTitle} is verified and ranked #${project.rank} on Outbid King.`}
          </p>

          <div className="mt-3 pt-3 border-t border-zinc-200/60 dark:border-zinc-800 flex items-center justify-between text-xs">
            <span className="text-zinc-500">Destination:</span>
            <a
              href={`/r/${project.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ea6c52] font-semibold hover:underline flex items-center gap-1 max-w-[220px] truncate"
            >
              <span className="truncate">{project.url}</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
          </div>
        </div>

        {/* 3D Action Outbid Button */}
        <div className="mt-6 pt-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOutbid(project, nextBid);
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-b from-[#ff7a59] via-[#ea6c52] to-[#d95b41] hover:brightness-105 border-t border-[#ff9e80] text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_4px_0_0_#b8432a,0_8px_18px_rgba(234,108,82,0.4)] active:shadow-[0_1px_0_0_#b8432a] active:translate-y-[2px] transition-all cursor-pointer select-none"
          >
            <Trophy className="w-4 h-4 text-amber-200" />
            <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
              Outbid & Claim #{project.rank} for ${nextBid.toLocaleString()}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
