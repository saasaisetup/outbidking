import { supabase } from './supabase';

const VISITED_KEY = 'outbid_visited_site_v3';
const BASELINE_DEFAULT = 135;

/**
 * Records or retrieves cumulative unique site visitors from Supabase.
 * Increments each unique visit from baseline 135 (135, 136, 137, 138...).
 */
export async function recordVisitor(): Promise<number> {
  if (typeof window === 'undefined') {
    return BASELINE_DEFAULT;
  }

  try {
    const hasVisited = localStorage.getItem(VISITED_KEY);

    if (!hasVisited) {
      // 1. Atomically increment visitor count in Supabase
      const { data, error } = await supabase.rpc('increment_visitor_count');

      // 2. Flag in localStorage to prevent duplicate increments for the same browser session
      try {
        localStorage.setItem(VISITED_KEY, 'true');
      } catch {
        // storage quota safe
      }

      if (!error && data) {
        const count = typeof data === 'number' ? data : Number(data);
        return count >= 135 ? count : BASELINE_DEFAULT;
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
