import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') || undefined;
  const search = searchParams.get('search') || undefined;
  const predictBid = searchParams.get('predictBid');
  const existingProjectId = searchParams.get('existingProjectId') || undefined;

  const projects = await store.getProjectsAsync(category, search);
  const stats = store.getStats();
  const recentBids = store.getRecentBids(20);

  let predictedRank: number | undefined;
  if (predictBid) {
    const num = parseFloat(predictBid);
    if (!isNaN(num) && num > 0) {
      predictedRank = store.getRankForBid(num, existingProjectId);
    }
  }

  return NextResponse.json({
    projects,
    stats,
    recentBids,
    predictedRank,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      url,
      title,
      description,
      category,
      logoUrl,
      ogImage,
      ownerEmail,
      twitterHandle,
      bidAmount,
      paymentProvider = 'sandbox',
      paymentIntentId,
    } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Valid URL is required' }, { status: 400 });
    }

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount < 1) {
      return NextResponse.json({ error: 'Bid amount must be at least $1' }, { status: 400 });
    }

    // Place bid in store and Supabase
    const result = await store.placeBidAsync({
      url,
      title: title || 'Untitled Project',
      description: description || '',
      category: category || 'ai-agents-infrastructure',
      logoUrl,
      ogImage,
      ownerEmail,
      twitterHandle,
      bidAmount: amount,
      paymentProvider,
      paymentIntentId,
    });

    return NextResponse.json({
      success: true,
      project: result.project,
      transaction: result.transaction,
      isNewKing: result.isNewKing,
      stats: result.stats,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to place bid';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
