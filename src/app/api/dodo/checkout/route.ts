import { NextRequest, NextResponse } from 'next/server';
import { createDodoCheckoutSession } from '@/lib/dodo';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      url,
      title,
      description,
      category,
      bidAmount,
      logoUrl,
      isTerritory,
      countryCode,
      warCry,
      customColor,
      email,
      name,
      returnUrl,
    } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });
    }

    const numericBid = Number(bidAmount);
    if (isNaN(numericBid) || numericBid < 1) {
      return NextResponse.json(
        { success: false, error: 'Minimum bid is $1' },
        { status: 400 }
      );
    }

    const payment = await createDodoCheckoutSession({
      url: url.trim(),
      title: (title || url).trim(),
      description: description?.trim(),
      category: category || 'ai-agents-infrastructure',
      bidAmount: numericBid,
      logoUrl: logoUrl || undefined,
      isTerritory: Boolean(isTerritory),
      countryCode: countryCode || undefined,
      warCry: warCry?.trim() || undefined,
      customColor: customColor || undefined,
      customerEmail: email?.trim() || undefined,
      customerName: name?.trim() || undefined,
      returnUrl: returnUrl || undefined,
    });

    if (!payment.payment_link) {
      return NextResponse.json(
        { success: false, error: 'Failed to generate Dodo Payments checkout link' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentId: payment.payment_id,
      paymentLink: payment.payment_link,
      clientSecret: payment.client_secret,
      totalAmount: payment.total_amount,
    });
  } catch (error: any) {
    console.error('[API /api/dodo/checkout] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error creating Dodo Payments checkout',
      },
      { status: 500 }
    );
  }
}
