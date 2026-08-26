import { supabase } from './supabase';

const VISITED_KEY = 'outbid_visited_site_v2';
const REALISTIC_BASELINE = 58;

/**
 * Records or retrieves cumulative unique site visitors from Supabase.
 * Uses a realistic baseline (~50-70) and increments atomically.
 */
export async function recordVisitor(): Promise<number> {
  if (typeof window === 'undefined') {
    return REALISTIC_BASELINE;
  }

  try {
    const hasVisited = localStorage.getItem(VISITED_KEY);

    if (!hasVisited) {
      // 1. Atomically increment visitor count in Supabase
      const { data, error } = await supabase.rpc('increment_visitor_count');

      // 2. Flag in localStorage to prevent duplicate increments for the same browser
      try {
        localStorage.setItem(VISITED_KEY, 'true');
      } catch {
        // storage quota safe
      }

      if (!error && data) {
        const count = typeof data === 'number' ? data : Number(data);
        // If Supabase was reset or returned low/unseeded value, normalize to realistic range
        return count >= 1 && count < 10000 ? Math.max(count, REALISTIC_BASELINE) : REALISTIC_BASELINE;
      }

      return await fetchCurrentVisitorCount();
    } else {
      // 3. Returning visitor: fetch current total
      return await fetchCurrentVisitorCount();
    }
  } catch (err) {
    return await fetchCurrentVisitorCount();
  }
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
      return REALISTIC_BASELINE;
    }

    const count = Number(data.total_visitors);
    if (count > 0 && count < 10000) {
      return count;
    }
    return REALISTIC_BASELINE;
  } catch {
    return REALISTIC_BASELINE;
  }
}
