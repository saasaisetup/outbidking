import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { CATEGORIES } from '@/lib/categories';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const projects = await store.getProjectsAsync();
    const baseStats = store.getStats();
    const recentBids = store.getRecentBids(30);

    const totalVolume = projects.reduce((sum, p) => sum + (p.totalBid || 0), 0);
    const totalClicksDelivered = projects.reduce((sum, p) => sum + (p.clicks || 0), 0);
    const highestSingleBid = projects.reduce((max, p) => Math.max(max, p.totalBid || 0), 0);
    const currentKing = projects.length > 0 ? projects[0] : null;

    // Calculate Category Breakdown
    const categoryBreakdown = CATEGORIES.filter(c => c.slug !== 'all').map(cat => {
      const catProjects = projects.filter(p => p.category === cat.slug);
      const catVolume = catProjects.reduce((sum, p) => sum + (p.totalBid || 0), 0);
      const catClicks = catProjects.reduce((sum, p) => sum + (p.clicks || 0), 0);
      return {
        slug: cat.slug,
        name: cat.name,
        count: catProjects.length,
        volume: catVolume,
        clicks: catClicks,
        percentage: totalVolume > 0 ? Math.round((catVolume / totalVolume) * 100) : 0,
      };
    }).sort((a, b) => b.volume - a.volume);

    // Generate Chart History (mock timeline synced with real transactions)
    const now = Date.now();
    const days = 14;
    const volumeHistory = Array.from({ length: days }).map((_, i) => {
      const d = new Date(now - (days - 1 - i) * 86400000);
      const dateLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      // Progressive curve leading up to current total volume
      const factor = (i + 1) / days;
      const vol = Math.round(totalVolume * (0.3 + 0.7 * Math.pow(factor, 1.4)));
      const clicks = Math.round(totalClicksDelivered * (0.2 + 0.8 * factor));
      return {
        date: dateLabel,
        volume: vol,
        clicks: clicks,
        bids: Math.max(1, Math.round(projects.length * factor)),
      };
    });

    const stats = {
      ...baseStats,
      totalVolume: Math.max(baseStats.totalVolume, totalVolume),
      totalClicksDelivered: Math.max(baseStats.totalClicksDelivered, totalClicksDelivered),
      totalProjectsCount: projects.length,
      highestSingleBid: Math.max(baseStats.highestSingleBid, highestSingleBid),
      currentKing,
    };

    return NextResponse.json({
      success: true,
      stats,
      categoryBreakdown,
      volumeHistory,
      recentBids,
      topProjects: projects.slice(0, 10),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
