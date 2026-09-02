import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { store } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    let visitorCount = 2140;

    // 1. Try Supabase increment
    try {
      const { data, error } = await supabase.rpc('increment_visitor_count');
      if (!error && data) {
        visitorCount = Math.max(2140, Number(data));
      } else {
        const { data: updateData, error: updateError } = await supabase
          .from('site_stats')
          .update({ total_visitors: 2141, updated_at: new Date().toISOString() })
          .eq('id', 'global')
          .select('total_visitors')
          .single();

        if (!updateError && updateData) {
          visitorCount = Math.max(2140, Number(updateData.total_visitors));
        }
      }
    } catch {
      // Fallback
    }

    const baseStats = store.getStats();

    return NextResponse.json({
      success: true,
      totalVisitors: visitorCount,
      totalClicks: Math.max(1580, baseStats.totalClicksDelivered || 0),
      totalRaised: Math.max(22, baseStats.totalVolume || 0),
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to track visit';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function GET() {
  try {
    let visitorCount = 2140;

    try {
      const { data, error } = await supabase
        .from('site_stats')
        .select('total_visitors')
        .eq('id', 'global')
        .single();

      if (!error && data) {
        visitorCount = Math.max(2140, Number(data.total_visitors));
      }
    } catch {
      // Fallback
    }

    const baseStats = store.getStats();

    return NextResponse.json({
      success: true,
      totalVisitors: visitorCount,
      totalClicks: Math.max(1580, baseStats.totalClicksDelivered || 0),
      totalRaised: Math.max(22, baseStats.totalVolume || 0),
    });
  } catch {
    return NextResponse.json({
      success: true,
      totalVisitors: 2140,
      totalClicks: 1580,
      totalRaised: 22,
    });
  }
}
