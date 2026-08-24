import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const territories = await store.getTerritoriesAsync();
    const powers = store.getWorldPowers();
    const warEvents = store.getWarEvents(30);
    const stats = store.getMapStats();

    return NextResponse.json({
      success: true,
      territories,
      powers,
      warEvents,
      stats,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { countryCode, title, url, warCry, customColor, bidAmount, logoUrl, category, paymentProvider = 'dodo' } = body;

    if (!countryCode || typeof countryCode !== 'string') {
      return NextResponse.json({ error: 'Country code is required' }, { status: 400 });
    }

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Valid URL or handle is required' }, { status: 400 });
    }

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount < 1) {
      return NextResponse.json({ error: 'Bid amount must be at least $1' }, { status: 400 });
    }

    const result = await store.conquerTerritoryAsync({
      countryCode,
      title: title || url,
      url,
      warCry,
      customColor,
      bidAmount: amount,
      logoUrl,
      category,
      paymentProvider,
    });

    return NextResponse.json({
      success: true,
      territory: result.territory,
      warEvent: result.warEvent,
      powers: result.powers,
      stats: result.stats,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
