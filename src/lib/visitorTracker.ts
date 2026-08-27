import { supabase } from './supabase';

const CACHE_KEY = 'outbid_last_visitor_count';
const BASELINE_DEFAULT = 154;

/**
 * Gets the best initial visitor count without flashing 135 on client refresh.
 */
export function getInitialVisitorCount(): number {
  if (typeof window === 'undefined') {
    return BASELINE_DEFAULT;
  }
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const val = parseInt(cached, 10);
      if (!isNaN(val) && val >= 135) return val;
    }
  } catch {
    // ignore
  }
  return BASELINE_DEFAULT;
}

/**
 * Records a page visit on EVERY page load / refresh and returns the live incremented count.
 * Increments each visit atomically in Supabase (e.g. 154 -> 155 -> 156...).
 */
export async function recordVisitor(): Promise<number> {
  if (typeof window === 'undefined') {
    return BASELINE_DEFAULT;
  }

  let newCount = BASELINE_DEFAULT;

  try {
    // 1. Call server-side track-visit API for guaranteed atomic increment
    const res = await fetch('/api/track-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.totalVisitors && typeof data.totalVisitors === 'number') {
        newCount = data.totalVisitors;
      }
    }
  } catch (err) {
    console.warn('[VisitorTracker] POST /api/track-visit failed, falling back to direct RPC:', err);
    // 2. Direct Supabase RPC fallback
    try {
      const { data, error } = await supabase.rpc('increment_visitor_count');
      if (!error && data) {
        newCount = Number(data);
      }
    } catch {
      // ignore
    }
  }

  // Save to cache so next refresh renders instantly
  try {
    if (newCount >= 135) {
      localStorage.setItem(CACHE_KEY, newCount.toString());
    }
  } catch {
    // ignore
  }

  return newCount >= 135 ? newCount : BASELINE_DEFAULT;
}

/**
 * Reads the latest cumulative visitor count from the site_stats table.
 */
export async function fetchCurrentVisitorCount(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('site_stats')
      .select('total_visitors')
      .eq('id', 'global')
      .single();

    if (error || !data) {
      return getInitialVisitorCount();
    }

    const count = Number(data.total_visitors);
    if (count >= 135) {
      try {
        localStorage.setItem(CACHE_KEY, count.toString());
      } catch {
        // ignore
      }
      return count;
    }
    return getInitialVisitorCount();
  } catch {
    return getInitialVisitorCount();
  }
}
