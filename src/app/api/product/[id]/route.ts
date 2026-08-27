import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { Project } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const decodedId = decodeURIComponent(id).trim();

    const projects = await store.getProjectsAsync();
    let project: Project | undefined = projects.find(
      (p) =>
        p.id.toLowerCase() === decodedId.toLowerCase() ||
        p.normalizedUrl.toLowerCase() === decodedId.toLowerCase() ||
        p.url.toLowerCase() === decodedId.toLowerCase() ||
        p.title.toLowerCase() === decodedId.toLowerCase()
    );

    if (!project) {
      // Direct query in Supabase
      const { data } = await supabase
        .from('projects')
        .select('*')
        .or(`id.eq.${decodedId},normalized_url.eq.${decodedId}`)
        .maybeSingle();

      if (data) {
        project = {
          id: data.id,
          url: data.url,
          normalizedUrl: data.normalized_url,
          title: data.title,
          description: data.description,
          category: data.category,
          logoUrl: data.logo_url,
          totalBid: data.total_bid,
          initialBid: data.initial_bid,
          clicks: data.clicks,
          rank: data.rank,
          isVerified: data.is_verified,
          totalKingDurationSeconds: data.total_king_duration_seconds || 0,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    }

    if (!project) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const rank = projects.findIndex((p) => p.id === project!.id) + 1 || project.rank || 1;
    const categoryProjects = projects.filter((p) => p.category === project!.category);
    const categoryRank = categoryProjects.findIndex((p) => p.id === project!.id) + 1 || 1;

    return NextResponse.json({
      success: true,
      product: {
        ...project,
        rank,
      },
      project: {
        ...project,
        rank,
      },
      categoryRank,
      minOutbidPrice: project.totalBid + 1,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch product';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
