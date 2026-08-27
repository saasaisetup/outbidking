'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductLogo } from '@/components/ProductLogo';
import { RealisticCrown } from '@/components/RealisticCrown';
import { CategoryIcon } from '@/components/CategoryIcon';
import { formatProjectTitle } from '@/components/TopThreeCards';
import { formatJoinedTime } from '@/lib/format';
import { PlatformStats, Project, BidTransaction } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  MousePointer,
  Crown,
  Users,
  ShieldCheck,
  Activity,
  ExternalLink,
  Calendar,
  Sparkles,
  ArrowUpRight,
  BarChart3,
  Flame,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface CategoryShare {
  slug: string;
  name: string;
  count: number;
  volume: number;
  clicks: number;
  percentage: number;
}

interface VolumeHistoryPoint {
  date: string;
  volume: number;
  clicks: number;
  bids: number;
}

export default function StatsPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryShare[]>([]);
  const [volumeHistory, setVolumeHistory] = useState<VolumeHistoryPoint[]>([]);
  const [recentBids, setRecentBids] = useState<BidTransaction[]>([]);
  const [topProjects, setTopProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState<'volume' | 'clicks'>('volume');
  const [hoveredPoint, setHoveredPoint] = useState<VolumeHistoryPoint | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setCategoryBreakdown(data.categoryBreakdown || []);
        setVolumeHistory(data.volumeHistory || []);
        setRecentBids(data.recentBids || []);
        setTopProjects(data.topProjects || []);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Supabase real-time channel for live 0ms updates
    const channel = supabase
      .channel('realtime-stats-dashboard')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects' },
        () => {
          fetchStats();
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bid_transactions' },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    const interval = setInterval(fetchStats, 4000);
    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  const totalVol = stats?.totalVolume || 0;
  const totalClicks = stats?.totalClicksDelivered || 0;
  const totalProjects = stats?.totalProjectsCount || topProjects.length || 0;
  const currentKing = stats?.currentKing;

  // Chart scaling calculations
  const maxVol = Math.max(...volumeHistory.map((p) => p.volume), 100);
  const maxClicks = Math.max(...volumeHistory.map((p) => p.clicks), 10);
  const chartPoints = volumeHistory.map((p, i) => {
    const x = (i / Math.max(1, volumeHistory.length - 1)) * 100;
    const val = activeTab === 'volume' ? p.volume : p.clicks;
    const maxVal = activeTab === 'volume' ? maxVol : maxClicks;
    const y = 100 - (val / (maxVal || 1)) * 80 - 10;
    return { x, y, point: p };
  });

  const svgPath = chartPoints.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const svgAreaPath = chartPoints.length > 0
    ? `${svgPath} L ${chartPoints[chartPoints.length - 1].x} 100 L ${chartPoints[0].x} 100 Z`
    : '';

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-zinc-900 dark:text-[#f4f4f5] selection:bg-[#ea6c52] selection:text-white font-sans transition-colors duration-200">
      <Header />

      <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-20">
        {/* Navigation Breadcrumb & Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200/80 dark:border-[#272732]">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-[#ea6c52] transition-colors mb-2 group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Leaderboard</span>
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                Live Platform Analytics
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                LIVE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Real-time verified on-chain & Dodo Payments volume, click conversions, and throne history.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-400">Timeframe:</span>
            <div className="px-3 py-1 rounded-xl bg-white dark:bg-[#121217] border border-zinc-200 dark:border-[#272732] text-xs font-bold text-zinc-700 dark:text-zinc-300 shadow-2xs">
              All Time (Live)
            </div>
          </div>
        </div>

        {/* Top KPI Metrics Row (TrustMRR Style) */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Total Volume / Spend */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#121217] border border-zinc-200/80 dark:border-[#272732] shadow-xs relative overflow-hidden group hover:border-[#ea6c52]/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Total Plundered Volume
              </span>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#ea6c52]/10 to-[#f97316]/20 text-[#ea6c52] flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-[#ea6c52]">
                ${totalVol.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                USD
              </span>
            </div>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>100% verified via Dodo Payments</span>
            </p>
          </div>

          {/* 2. Direct Clicks Delivered */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#121217] border border-zinc-200/80 dark:border-[#272732] shadow-xs relative overflow-hidden group hover:border-emerald-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Clicks Delivered
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <MousePointer className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-zinc-900 dark:text-white">
                {totalClicks.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-zinc-400">
                redirects
              </span>
            </div>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Direct high-intent buyer traffic</span>
            </p>
          </div>

          {/* 3. Total Ranked Products */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#121217] border border-zinc-200/80 dark:border-[#272732] shadow-xs relative overflow-hidden group hover:border-blue-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Ranked Products
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-zinc-900 dark:text-white">
                {totalProjects}
              </span>
              <span className="text-xs font-bold text-zinc-400">
                listings
              </span>
            </div>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              Across {categoryBreakdown.length} active SaaS categories
            </p>
          </div>

          {/* 4. Current King Banner */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-[#fdeee9] to-[#fff5f2] dark:from-[#1c1210] dark:to-[#121217] border border-[#fca5a5] dark:border-[#ea6c52]/30 shadow-xs relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#ea6c52] uppercase tracking-wider flex items-center gap-1">
                <Crown className="w-3.5 h-3.5 fill-current" />
                Current Throne King
              </span>
              <RealisticCrown size="sm" variant="gold" />
            </div>
            {currentKing ? (
              <div className="mt-2.5 flex items-center gap-3">
                <ProductLogo
                  url={currentKing.url}
                  normalizedUrl={currentKing.normalizedUrl}
                  title={currentKing.title}
                  logoUrl={currentKing.logoUrl}
                  size="md"
                />
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/product/${currentKing.id}`}
                    className="font-extrabold text-sm sm:text-base text-zinc-900 dark:text-white hover:text-[#ea6c52] transition-colors truncate block"
                  >
                    {formatProjectTitle(currentKing)}
                  </Link>
                  <span className="text-xs font-mono font-black text-[#ea6c52]">
                    ${currentKing.totalBid.toLocaleString()} invested
                  </span>
                </div>
              </div>
            ) : (
              <div className="mt-3 text-xs text-zinc-400 font-medium">
                Throne is open for claims ($1)
              </div>
            )}
          </div>
        </div>

        {/* Interactive Growth & Performance Chart */}
        <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121217] border border-zinc-200/80 dark:border-[#272732] shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#ea6c52]" />
                <span>Platform Velocity & Growth Trajectory</span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Cumulative volume ($USD) and click-through momentum over time
              </p>
            </div>

            {/* Chart Toggle Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-zinc-100 dark:bg-[#181822] border border-zinc-200 dark:border-[#272732] self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveTab('volume')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'volume'
                    ? 'bg-white dark:bg-[#121217] text-[#ea6c52] shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                Volume ($ USD)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('clicks')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'clicks'
                    ? 'bg-white dark:bg-[#121217] text-emerald-600 dark:text-emerald-400 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                Clicks Delivered
              </button>
            </div>
          </div>

          {/* SVG Area & Line Chart */}
          <div className="relative mt-6 h-64 sm:h-80 w-full flex flex-col justify-end">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="w-full h-full overflow-visible"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={activeTab === 'volume' ? '#ea6c52' : '#10b981'}
                    stopOpacity="0.28"
                  />
                  <stop
                    offset="100%"
                    stopColor={activeTab === 'volume' ? '#ea6c52' : '#10b981'}
                    stopOpacity="0.0"
                  />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="20" x2="100" y2="20" stroke="currentColor" strokeOpacity="0.06" strokeWidth="0.5" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeOpacity="0.06" strokeWidth="0.5" />
              <line x1="0" y1="80" x2="100" y2="80" stroke="currentColor" strokeOpacity="0.06" strokeWidth="0.5" />

              {/* Area Fill */}
              {svgAreaPath && (
                <path d={svgAreaPath} fill="url(#chartGradient)" />
              )}

              {/* Stroke Line */}
              {svgPath && (
                <path
                  d={svgPath}
                  fill="none"
                  stroke={activeTab === 'volume' ? '#ea6c52' : '#10b981'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              )}

              {/* Data Interactive Dots */}
              {chartPoints.map((pt, i) => (
                <g key={i} className="cursor-pointer">
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredPoint?.date === pt.point.date ? '4' : '2'}
                    className={`transition-all ${
                      activeTab === 'volume' ? 'fill-[#ea6c52]' : 'fill-[#10b981]'
                    }`}
                  />
                </g>
              ))}
            </svg>

            {/* X-Axis Labels */}
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              {volumeHistory.filter((_, i) => i % 3 === 0 || i === volumeHistory.length - 1).map((p, i) => (
                <span key={i}>{p.date}</span>
              ))}
            </div>
          </div>
        </div>

        {/* 2-Column Analytical Breakdown */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Category Market Share */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#121217] border border-zinc-200/80 dark:border-[#272732] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#ea6c52]" />
                  <span>Category Volume Share</span>
                </h3>
                <span className="text-xs text-zinc-400 font-mono">By Invested USD</span>
              </div>

              <div className="space-y-3.5 mt-4">
                {categoryBreakdown.map((cat) => (
                  <div key={cat.slug} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                        <CategoryIcon slug={cat.slug} size="xs" />
                        <span>{cat.name}</span>
                      </span>
                      <span className="font-mono text-zinc-900 dark:text-white font-bold">
                        ${cat.volume.toLocaleString()}{' '}
                        <span className="text-zinc-400 font-normal">({cat.percentage}%)</span>
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-[#181822] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#ea6c52] to-[#f97316] transition-all duration-500"
                        style={{ width: `${Math.max(4, cat.percentage)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
              <span>Total Categories: {categoryBreakdown.length}</span>
              <Link href="/categories" className="text-[#ea6c52] font-bold hover:underline">
                Explore all categories →
              </Link>
            </div>
          </div>

          {/* Right: Top 5 Highest Capitalized Projects */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#121217] border border-zinc-200/80 dark:border-[#272732] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-500" />
                  <span>Top Capitalized Leaders</span>
                </h3>
                <span className="text-xs text-zinc-400 font-mono">Rank 1 – 5</span>
              </div>

              <div className="space-y-3 mt-4">
                {topProjects.slice(0, 5).map((p, idx) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-2xl bg-zinc-50/70 dark:bg-[#181822]/70 border border-zinc-200/60 dark:border-zinc-800 flex items-center justify-between gap-3 hover:border-[#ea6c52]/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-6 font-mono font-bold text-xs text-zinc-400 shrink-0">
                        #{idx + 1}
                      </div>
                      <ProductLogo
                        url={p.url}
                        normalizedUrl={p.normalizedUrl}
                        title={p.title}
                        logoUrl={p.logoUrl}
                        size="sm"
                      />
                      <div className="min-w-0">
                        <Link
                          href={`/product/${p.id}`}
                          className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-white hover:text-[#ea6c52] truncate block"
                        >
                          {formatProjectTitle(p)}
                        </Link>
                        <span className="text-[11px] text-zinc-400">
                          {p.clicks || 0} clicks · {formatJoinedTime(p.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono font-extrabold text-sm text-[#ea6c52]">
                        ${p.totalBid.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
              <span>Updated in real-time</span>
              <Link href="/" className="text-[#ea6c52] font-bold hover:underline">
                View Full Leaderboard →
              </Link>
            </div>
          </div>
        </div>

        {/* Live Transaction Ledger Table (TrustMRR Style) */}
        <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121217] border border-zinc-200/80 dark:border-[#272732] shadow-xs">
          <div className="flex items-center justify-between pb-5 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <h2 className="text-lg font-extrabold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span>Live Transaction Ledger & Verified Outbids</span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Every payment verified directly through Dodo Payments gateway
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-200/60 dark:border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Product / Handle</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Rank Change</th>
                  <th className="py-3 px-3">Gateway</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {recentBids.length > 0 ? (
                  recentBids.slice(0, 15).map((tx) => (
                    <tr key={tx.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                      <td className="py-3 px-3 font-semibold text-zinc-900 dark:text-white max-w-[200px] truncate">
                        <Link href={`/product/${tx.projectId}`} className="hover:text-[#ea6c52] transition-colors">
                          {tx.projectTitle || tx.projectUrl}
                        </Link>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-[#ea6c52]">
                        +${tx.amount.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 font-mono">
                        <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-[#181822] text-zinc-700 dark:text-zinc-300 font-bold">
                          #{tx.newRank}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-zinc-500">
                        <span className="font-medium">Dodo Payments</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-zinc-400 font-mono">
                        {formatJoinedTime(tx.createdAt)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-zinc-400">
                      No transactions recorded yet. Place the first bid to initialize the ledger.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
