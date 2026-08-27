'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductLogo } from '@/components/ProductLogo';
import { RealisticCrown } from '@/components/RealisticCrown';
import { CategoryIcon } from '@/components/CategoryIcon';
import { BidModal } from '@/components/BidModal';
import { formatProjectTitle, getCleanDomain } from '@/components/TopThreeCards';
import { formatExactDate, formatJoinedTime } from '@/lib/format';
import { CATEGORIES } from '@/lib/categories';
import { Project, PlatformStats } from '@/lib/types';
import {
  ArrowLeft,
  ExternalLink,
  Crown,
  Trophy,
  MousePointer,
  DollarSign,
  Calendar,
  Copy,
  Check,
  ShieldCheck,
  Flame,
  ArrowRight,
  TrendingUp,
  Share2,
  Sparkles,
} from 'lucide-react';

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [categoryRank, setCategoryRank] = useState<number>(1);
  const [minOutbidPrice, setMinOutbidPrice] = useState<number>(1);
  const [stats, setStats] = useState<PlatformStats>({
    totalVolume: 0,
    totalBidsCount: 0,
    totalProjectsCount: 0,
    totalClicksDelivered: 0,
    currentKing: null,
    highestSingleBid: 0,
    kingHoldDurationSeconds: 0,
  });
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjectDetails = async () => {
    if (!id) return;
    try {
      const res = await fetch(`/api/project/${encodeURIComponent(id)}`);
      const data = await res.json();
      if (data.success && data.project) {
        setProject(data.project);
        setCategoryRank(data.categoryRank || 1);
        setMinOutbidPrice(data.minOutbidPrice || data.project.totalBid + 1);
      }
    } catch (err) {
      console.error('Failed to load project:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const handleCopyLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://outbidking.lol';
    const link = `${origin}/project/${project?.id || id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRankCrown = (rank: number) => {
    if (rank === 1) return <RealisticCrown size="lg" variant="gold" />;
    if (rank === 2) return <RealisticCrown size="lg" variant="silver" />;
    if (rank === 3) return <RealisticCrown size="lg" variant="bronze" />;
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-[#ea6c52] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-zinc-500 font-mono">Loading listing details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md p-8 rounded-3xl bg-white dark:bg-[#121217] border border-zinc-200 dark:border-[#272732] shadow-sm">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Listing Not Found</h2>
            <p className="text-xs text-zinc-500 mt-2 mb-6">
              The project you are looking for has not been claimed yet or the URL is invalid.
            </p>
            <Link
              href="/"
              className="px-6 py-2.5 rounded-full bg-[#ea6c52] text-white text-xs font-bold shadow-md hover:bg-[#d95b41] transition-all"
            >
              Return to Leaderboard
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const catInfo = CATEGORIES.find((c) => c.slug === project.category);
  const displayTitle = formatProjectTitle(project);
  const cleanDomain = getCleanDomain(project.url || project.normalizedUrl);
  const joinedTime = formatJoinedTime(project.createdAt);
  const exactDate = formatExactDate(project.createdAt);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-zinc-900 dark:text-[#f4f4f5] selection:bg-[#ea6c52] selection:text-white font-sans transition-colors duration-200">
      <Header />

      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-24">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-[#ea6c52] transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Leaderboard</span>
          </Link>
        </div>

        {/* Hero Product Header Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121217] border border-zinc-200/80 dark:border-[#272732] shadow-xs relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            {/* Left: Avatar + Title + Bio + Metadata */}
            <div className="flex items-start gap-4 sm:gap-5 flex-1 min-w-0">
              <div className="relative shrink-0">
                <ProductLogo
                  url={project.url}
                  normalizedUrl={project.normalizedUrl}
                  title={displayTitle}
                  logoUrl={project.logoUrl}
                  size="xl"
                />
                {project.rank <= 3 && (
                  <div className="absolute -top-3.5 -right-2.5 pointer-events-none">
                    {getRankCrown(project.rank)}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight truncate">
                    {displayTitle}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Listing</span>
                  </span>
                </div>

                <p className="mt-2 text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
                  {project.description ||
                    `Discover ${displayTitle} — ranked #${project.rank} on the Outbid King leaderboard.`}
                </p>

                {/* Metadata Row */}
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  {/* Category Pill with Icon */}
                  <span className="px-3 py-1 rounded-xl bg-zinc-100 dark:bg-[#181822] text-[#ea6c52] font-bold flex items-center gap-1.5">
                    <CategoryIcon slug={project.category} size="xs" />
                    <span>{catInfo ? catInfo.name : project.category}</span>
                  </span>

                  <span>·</span>

                  {/* Joined Date */}
                  <span className="flex items-center gap-1 text-zinc-500">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Joined {joinedTime} ({exactDate})</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Actions (Visit Website & Copy Share Link) */}
            <div className="flex sm:flex-col items-center sm:items-end gap-2.5 shrink-0 pt-2 sm:pt-0">
              <a
                href={`/r/${project.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <span>Visit {cleanDomain}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full sm:w-auto px-4 py-2 rounded-2xl bg-zinc-100 hover:bg-zinc-200 dark:bg-[#181822] dark:hover:bg-[#20202d] text-zinc-700 dark:text-zinc-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-zinc-200 dark:border-[#272732]"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Share Listing</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 4 Core Financial & Traffic KPI Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Total Spend / Bids */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#121217] border border-zinc-200/80 dark:border-[#272732] shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Total Spend / Bids
              </span>
              <div className="w-7 h-7 rounded-lg bg-[#ea6c52]/10 text-[#ea6c52] flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-3xl font-extrabold font-mono text-[#ea6c52]">
              ${project.totalBid.toLocaleString()}
            </div>
            <span className="text-[11px] text-zinc-400 mt-1 block">Verified via Dodo Payments</span>
          </div>

          {/* 2. Overall Rank */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#121217] border border-zinc-200/80 dark:border-[#272732] shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Overall Global Rank
              </span>
              <Trophy className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-zinc-900 dark:text-white">
                #{project.rank}
              </span>
              <span className="text-xs text-zinc-400">Global Leaderboard</span>
            </div>
            <span className="text-[11px] text-zinc-400 mt-1 block">Out of all active listings</span>
          </div>

          {/* 3. Category Rank */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#121217] border border-zinc-200/80 dark:border-[#272732] shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Category Rank
              </span>
              <CategoryIcon slug={project.category} size="xs" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-zinc-900 dark:text-white">
                #{categoryRank}
              </span>
              <span className="text-xs text-zinc-400 truncate max-w-[120px]">
                {catInfo ? catInfo.name : 'Category'}
              </span>
            </div>
            <span className="text-[11px] text-zinc-400 mt-1 block">Category leaderboard standing</span>
          </div>

          {/* 4. Clicks Delivered */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#121217] border border-zinc-200/80 dark:border-[#272732] shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Clicks Delivered
              </span>
              <MousePointer className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-2 text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
              {(project.clicks || 0).toLocaleString()}
            </div>
            <span className="text-[11px] text-zinc-400 mt-1 block">Tracked direct redirects</span>
          </div>
        </div>

        {/* 1-Click Interactive Outbid Card */}
        <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#fdeee9] via-[#fff5f2] to-white dark:from-[#1c1210] dark:via-[#140e0c] dark:to-[#121217] border-2 border-[#fca5a5] dark:border-[#ea6c52]/40 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#ea6c52]" />
                <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                  Outbid {displayTitle} & Take Rank #{project.rank}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-xl leading-relaxed">
                Current investment is <span className="font-mono font-bold text-zinc-900 dark:text-white">${project.totalBid}</span>.
                Bidding <span className="font-mono font-bold text-[#ea6c52]">${minOutbidPrice}</span> or more will immediately overtake this spot on the live leaderboard.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsBidModalOpen(true)}
              className="px-8 py-4 rounded-2xl bg-gradient-to-b from-[#ff7a59] via-[#ea6c52] to-[#d95b41] hover:brightness-105 border-t border-[#ff9e80] text-white font-black text-base flex items-center justify-center gap-2 shadow-[0_4px_0_0_#b8432a,0_8px_18px_rgba(234,108,82,0.4)] active:shadow-[0_1px_0_0_#b8432a] active:translate-y-[2px] transition-all cursor-pointer shrink-0 select-none"
            >
              <Trophy className="w-4 h-4 text-amber-200" />
              <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
                Claim for ${minOutbidPrice.toLocaleString()} USD
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>

      <Footer />

      {/* Bid Modal */}
      <BidModal
        isOpen={isBidModalOpen}
        onClose={() => setIsBidModalOpen(false)}
        initialUrl={project.url}
        initialTitle={project.title}
        initialDescription={project.description}
        initialBidAmount={minOutbidPrice}
        initialCategory={project.category}
        stats={stats}
        onBidSuccess={() => {
          setIsBidModalOpen(false);
          fetchProjectDetails();
        }}
      />
    </div>
  );
}
