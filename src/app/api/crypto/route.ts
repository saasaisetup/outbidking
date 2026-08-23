import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, title, description, category, logoUrl, bidAmount, txHash, network = 'USDT_TRC20', ownerEmail, twitterHandle } = body;

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount < 1) {
      return NextResponse.json({ error: 'Invalid bid amount' }, { status: 400 });
    }

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Valid URL is required' }, { status: 400 });
    }

    // Register bid
    const result = store.placeBid({
      url: url.trim(),
      title: title?.trim() || undefined,
      description: description?.trim() || undefined,
      category: category || 'crypto-web3-investing',
      logoUrl: logoUrl || undefined,
      ownerEmail: ownerEmail || undefined,
      twitterHandle: twitterHandle || undefined,
      bidAmount: amount,
      paymentProvider: 'crypto',
      paymentIntentId: txHash || `tx_crypto_${Date.now()}`,
    });

    return NextResponse.json({
      success: true,
      project: result.project,
      transaction: result.transaction,
      isNewKing: result.isNewKing,
      stats: result.stats,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
