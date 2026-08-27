import { supabase } from './supabase';

const BASELINE_DEFAULT = 135;

/**
 * Records a page visit on EVERY page load / refresh and returns the live incremented count.
 * Increments each visit atomically in Supabase from baseline (e.g. 148 -> 149 -> 150...).
 */
export async function recordVisitor(): Promise<number> {
  if (typeof window === 'undefined') {
    return BASELINE_DEFAULT;
  }

  try {
    // 1. Call server-side track-visit API for guaranteed atomic increment
    const res = await fetch('/api/track-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.totalVisitors && typeof data.totalVisitors === 'number') {
        return data.totalVisitors;
      }
    }
  } catch (err) {
    console.warn('[VisitorTracker] POST /api/track-visit failed, falling back to direct RPC:', err);
  }

  // 2. Direct Supabase RPC fallback
  try {
    const { data, error } = await supabase.rpc('increment_visitor_count');
    if (!error && data) {
      const count = Number(data);
      return count >= 135 ? count : BASELINE_DEFAULT;
    }
  } catch (rpcErr) {
    console.warn('[VisitorTracker] Direct RPC failed:', rpcErr);
  }

  // 3. Read current total fallback
  return await fetchCurrentVisitorCount();
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
      return BASELINE_DEFAULT;
    }

    const count = Number(data.total_visitors);
    if (count >= 135) {
      return count;
    }
    return BASELINE_DEFAULT;
  } catch {
    return BASELINE_DEFAULT;
  }
}
