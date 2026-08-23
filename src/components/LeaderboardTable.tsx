'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Medal, ExternalLink, Zap, Share2, Code, MousePointerClick, ArrowUp } from 'lucide-react';
import { Project } from '@/lib/types';

interface LeaderboardTableProps {
  projects: Project[];
  onOutbid: (project: Project, minAmount: number) => void;
  onShare: (project: Project) => void;
  onEmbedBadge: (project: Project) => void;
}

export function LeaderboardTable({
  projects,
  onOutbid,
  onShare,
  onEmbedBadge,
}: LeaderboardTableProps) {
  if (!projects || projects.length === 0) {
    return (
      <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/50 p-12 text-center">
        <p className="text-zinc-400 font-medium">No projects found in this category.</p>
      </div>
    );
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 text-black flex items-center justify-center font-black text-base shadow-lg shadow-amber-500/30 flex-shrink-0">
          <Crown className="w-5 h-5 fill-current" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-200 to-zinc-400 text-black flex items-center justify-center font-black text-base shadow-md flex-shrink-0">
          <Medal className="w-5 h-5 fill-current text-slate-800" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-amber-800 text-white flex items-center justify-center font-black text-base shadow-md flex-shrink-0">
          <Medal className="w-5 h-5 fill-current text-amber-200" />
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center justify-center font-mono font-bold text-sm flex-shrink-0">
        #{rank}
      </div>
    );
  };

  const getCardBorder = (rank: number) => {
    if (rank === 1) return 'border-amber-400/80 bg-gradient-to-r from-amber-950/20 via-zinc-950 to-zinc-950 shadow-lg shadow-amber-500/10';
    if (rank === 2) return 'border-zinc-500/60 bg-zinc-950/90';
    if (rank === 3) return 'border-amber-700/60 bg-zinc-950/90';
    return 'border-zinc-800/80 bg-zinc-950/60 hover:border-zinc-700';
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <AnimatePresence mode="popLayout">
        {projects.map((project) => {
          const nextOutbid = project.totalBid + 5;
          return (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className={`w-full rounded-2xl border p-4 sm:p-5 transition-all duration-200 ${getCardBorder(
                project.rank
              )}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left Rank & Project Details */}
                <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
                  {/* Rank Badge */}
                  {getRankBadge(project.rank)}

                  {/* Logo */}
                  <div className="w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden flex-shrink-0 flex items-center justify-center p-1.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.logoUrl || `https://www.google.com/s2/favicons?domain=${project.normalizedUrl}&sz=128`}
                      alt={project.title}
                      className="w-full h-full object-contain rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={`/r/${project.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-base sm:text-lg text-white hover:text-amber-400 transition-colors flex items-center gap-1.5 truncate"
                      >
                        <span className="truncate">{project.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                      </a>

                      {project.twitterHandle && (
                        <a
                          href={`https://x.com/${project.twitterHandle}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-zinc-400 hover:text-white transition-colors"
                        >
                          @{project.twitterHandle}
                        </a>
                      )}
                    </div>

                    <p className="mt-1 text-xs sm:text-sm text-zinc-400 line-clamp-1">
                      {project.description}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 font-medium text-[11px]">
                        {project.category}
                      </span>
                      <span className="text-zinc-500 font-mono text-[11px]">
                        {project.normalizedUrl}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Actions & Bid Metric */}
                <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-900">
                  {/* Clicks metric */}
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1 sm:justify-end">
                      <MousePointerClick className="w-3 h-3 text-zinc-500" /> Clicks
                    </div>
                    <div className="text-sm font-bold text-zinc-300 font-mono">
                      {project.clicks.toLocaleString()}
                    </div>
                  </div>

                  {/* Bid metric */}
                  <div className="text-left sm:text-right min-w-[90px]">
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Lifetime Bid
                    </div>
                    <div className="text-lg sm:text-xl font-black text-amber-400 font-mono">
                      ${project.totalBid.toLocaleString()}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1.5">
                    {/* Outbid Button */}
                    <button
                      onClick={() => onOutbid(project, nextOutbid)}
                      className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-amber-400 text-amber-400 hover:text-black font-extrabold text-xs border border-amber-400/40 hover:border-amber-400 transition-all duration-150 active:scale-95 shadow-sm"
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>Outbid</span>
                    </button>

                    {/* Share Button */}
                    <button
                      onClick={() => onShare(project)}
                      title="Share project on X"
                      className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Embed Badge */}
                    <button
                      onClick={() => onEmbedBadge(project)}
                      title="Embed Live SVG Badge"
                      className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                    >
                      <Code className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
