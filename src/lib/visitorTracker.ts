import { supabase } from './supabase';

const VISITED_KEY = 'visited_site';

/**
 * Records or retrieves cumulative unique site visitors from Supabase.
 * - If first visit: calls atomic RPC function increment_visitor_count() and flags localStorage.
 * - If returning visit: queries site_stats table directly for the latest count.
 */
export async function recordVisitor(): Promise<number> {
  if (typeof window === 'undefined') {
    return 1;
  }

  try {
    const hasVisited = localStorage.getItem(VISITED_KEY);

    if (!hasVisited) {
      // 1. Atomically increment visitor count in Supabase
      const { data, error } = await supabase.rpc('increment_visitor_count');

      if (error) {
        return await fetchCurrentVisitorCount();
      }

      // 2. Set visited flag in localStorage to avoid duplicate increments
      try {
        localStorage.setItem(VISITED_KEY, 'true');
      } catch {
        // Handle private browsing storage quotas
      }

      const count = typeof data === 'number' ? data : Number(data) || 1;
      return count;
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
      return 1;
    }

    return Number(data.total_visitors) || 1;
  } catch {
    return 1;
  }
}
