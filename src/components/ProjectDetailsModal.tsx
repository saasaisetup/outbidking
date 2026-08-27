'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, ExternalLink, Trophy, TrendingUp, MousePointer, ShieldCheck, ArrowRight, Copy, Check, Calendar } from 'lucide-react';
import { Project } from '@/lib/types';
import { CATEGORIES } from '@/lib/categories';
import { ProductLogo } from './ProductLogo';
import { RealisticCrown } from './RealisticCrown';
import { CategoryIcon } from './CategoryIcon';
import { formatProjectTitle, getCleanDomain } from './TopThreeCards';
import { formatExactDate, formatJoinedTime } from '@/lib/format';

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
  const [copied, setCopied] = useState(false);

  if (!isOpen || !project) return null;

  const nextBid = project.totalBid + 1;
  const categoryInfo = CATEGORIES.find((c) => c.slug === project.category);
  const displayTitle = formatProjectTitle(project);
  const cleanDomain = getCleanDomain(project.url || project.normalizedUrl);
  const joinedTime = formatJoinedTime(project.createdAt);
  const exactDate = formatExactDate(project.createdAt);

  const getCrown = (rank: number) => {
    if (rank === 1) return <RealisticCrown size="sm" variant="gold" />;
    if (rank === 2) return <RealisticCrown size="sm" variant="silver" />;
    if (rank === 3) return <RealisticCrown size="sm" variant="bronze" />;
    return null;
  };

  const handleCopyLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://outbidking.lol';
    const link = `${origin}/product/${project.id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#121217] border border-zinc-200 dark:border-[#272732] shadow-2xl p-5 sm:p-7 max-h-[92vh] flex flex-col overflow-y-auto animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div className="flex items-start gap-3.5 flex-1 min-w-0">
            {/* Logo with Tilted Upward Crown */}
            <div className="relative shrink-0 pt-1.5">
              <ProductLogo
                url={project.url}
                normalizedUrl={project.normalizedUrl}
                title={displayTitle}
                logoUrl={project.logoUrl}
                size="lg"
              />
              {project.rank <= 3 && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 -rotate-12 pointer-events-none drop-shadow-md">
                  {getCrown(project.rank)}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Link
                  href={`/product/${project.id}`}
                  className="text-lg sm:text-xl font-extrabold text-zinc-900 dark:text-white hover:underline flex items-center gap-1.5 truncate group"
                >
                  <span className="truncate">{displayTitle}</span>
                  <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-[#ea6c52] transition-colors shrink-0" />
                </Link>
              </div>

              {/* Category & Joined Date */}
              <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 flex-wrap">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                  <CategoryIcon slug={project.category} size="xs" />
                  <span>{categoryInfo ? categoryInfo.name : project.category}</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 text-zinc-400">
                  <Calendar className="w-3 h-3" />
                  <span>Joined {joinedTime}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-300 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Grid: 4 Metric Cards */}
        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:gap-3">
          {/* 1. Total Spend / Bids */}
          <div className="p-3.5 rounded-2xl bg-[#fbfaf8] dark:bg-[#181822] border border-zinc-200/80 dark:border-zinc-800 flex flex-col">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
              Total Spend / Bids
            </span>
            <span className="mt-1 text-xl sm:text-2xl font-extrabold font-sans text-[#ea6c52]">
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
              <span className="text-xl sm:text-2xl font-extrabold font-sans text-zinc-900 dark:text-white">
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
              <span className="text-xl sm:text-2xl font-extrabold font-sans text-zinc-900 dark:text-white">
                #{project.rank}
              </span>
              <CategoryIcon slug={project.category} size="xs" />
            </div>
            <span className="text-[10px] text-zinc-400 mt-0.5 truncate">
              {categoryInfo ? categoryInfo.name : 'Category'}
            </span>
          </div>

          {/* 4. Total Clicks Delivered */}
          <div className="p-3.5 rounded-2xl bg-[#fbfaf8] dark:bg-[#181822] border border-zinc-200/80 dark:border-zinc-800 flex flex-col">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
              Clicks Delivered
            </span>
            <span className="mt-1 text-xl sm:text-2xl font-extrabold font-sans text-emerald-600 dark:text-emerald-400">
              {(project.clicks || 0).toLocaleString()}
            </span>
            <span className="text-[10px] text-zinc-400 mt-0.5">Tracked redirects</span>
          </div>
        </div>

        {/* About & Summary Section */}
        <div className="mt-5 p-4 rounded-2xl bg-zinc-50 dark:bg-[#181822] border border-zinc-200/80 dark:border-zinc-800">
          <h4 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
            About & Summary
          </h4>
          <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-normal">
            {project.description || `${displayTitle} is verified and ranked #${project.rank} on Outbid King.`}
          </p>

          <div className="mt-3 pt-3 border-t border-zinc-200/60 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500">Destination:</span>
              <a
                href={`/r/${project.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ea6c52] font-semibold hover:underline flex items-center gap-1 max-w-[180px] sm:max-w-[220px] truncate"
              >
                <span className="truncate">{cleanDomain}</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
            </div>

            {/* Copy Link Button */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-black/40 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-500" />
                  <span className="text-emerald-500 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-zinc-400" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
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
