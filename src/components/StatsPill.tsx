'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useOnlinePresence } from '@/hooks/useOnlinePresence';
import { recordVisitor, getInitialVisitorCount } from '@/lib/visitorTracker';
import { supabase } from '@/lib/supabase';

interface StatsPillProps {
  onOpenStats?: () => void;
  className?: string;
  showStatsLink?: boolean;
}

export function StatsPill({
  className = '',
  showStatsLink = true,
}: StatsPillProps) {
  const { onlineCount } = useOnlinePresence();
  const [totalVisitors, setTotalVisitors] = useState<number>(154);

  useEffect(() => {
    let active = true;

    // Set immediate cached count on client mount
    setTotalVisitors(getInitialVisitorCount());

    // Record visitor on every visit/refresh and update state
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
            const raw = Number(payload.new.total_visitors);
            if (raw >= 135) {
              setTotalVisitors(raw);
            }
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
    <Link
      href="/stats"
      className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-zinc-100 dark:bg-[#121217] border border-zinc-200 dark:border-[#272732] text-[11px] sm:text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:border-[#ea6c52]/40 hover:text-zinc-900 dark:hover:text-white transition-colors shadow-2xs cursor-pointer select-none max-w-full group ${className}`}
    >
      {/* Pulsing Green Live Dot */}
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>

      {/* Real-time Online Count */}
      <span className="font-bold text-zinc-800 dark:text-zinc-200">
        {onlineCount.toLocaleString()} online
      </span>

      <span className="text-zinc-400 dark:text-zinc-600">·</span>

      {/* Real-time Cumulative Unique Visitors */}
      <span className="font-medium text-zinc-600 dark:text-zinc-400">
        {totalVisitors.toLocaleString()} visitors
      </span>

      {showStatsLink && (
        <>
          <span className="text-zinc-400 dark:text-zinc-600">·</span>
          <span className="text-[#ea6c52] font-semibold flex items-center group-hover:translate-x-0.5 transition-transform">
            stats <span className="ml-0.5">→</span>
          </span>
        </>
      )}
    </Link>
  );
}
