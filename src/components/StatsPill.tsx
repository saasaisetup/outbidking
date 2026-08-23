'use client';

import React, { useState, useEffect } from 'react';
import { useOnlinePresence } from '@/hooks/useOnlinePresence';
import { recordVisitor } from '@/lib/visitorTracker';
import { supabase } from '@/lib/supabase';

interface StatsPillProps {
  onOpenStats?: () => void;
  className?: string;
  showStatsLink?: boolean;
}

export function StatsPill({
  onOpenStats,
  className = '',
  showStatsLink = true,
}: StatsPillProps) {
  const { onlineCount } = useOnlinePresence();
  const [totalVisitors, setTotalVisitors] = useState<number>(142732);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    let active = true;

    // Record unique visitor & fetch latest count from Supabase
    recordVisitor().then((count) => {
      if (active && count) {
        setTotalVisitors(count);
      }
    });

    // Real-time Postgres changes listener on site_stats table
    const channel = supabase
      .channel('realtime-site-stats-pill')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_stats' },
        (payload: any) => {
          if (payload.new && payload.new.total_visitors) {
            setTotalVisitors(Number(payload.new.total_visitors));
          }
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={onOpenStats}
      className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] sm:text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-2xs cursor-pointer select-none max-w-full group ${className}`}
    >
      {/* Pulsing Green Live Dot */}
      <span className="relative flex h-2 w-2 flex-shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>

      {/* Online Count */}
      <span className="font-semibold text-zinc-800 dark:text-zinc-200">
        {onlineCount.toLocaleString()} online
      </span>

      <span className="text-zinc-400 dark:text-zinc-600">·</span>

      {/* Cumulative Visitors */}
      <span className="font-medium text-zinc-600 dark:text-zinc-400">
        {totalVisitors.toLocaleString()} visitors
      </span>

      {showStatsLink && onOpenStats && (
        <>
          <span className="text-zinc-400 dark:text-zinc-600">·</span>
          <span className="text-[#ea6c52] font-semibold flex items-center group-hover:translate-x-0.5 transition-transform">
            stats <span className="ml-0.5">→</span>
          </span>
        </>
      )}
    </button>
  );
}
