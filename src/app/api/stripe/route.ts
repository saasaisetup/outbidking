import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, title, description, category, logoUrl, ogImage, twitterHandle, ownerEmail, bidAmount } = body;

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount < 1) {
      return NextResponse.json({ error: 'Invalid bid amount' }, { status: 400 });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return NextResponse.json({
        isMock: true,
        message: 'Stripe secret key not configured in environment. Use sandbox mode for instant demo!',
      });
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion,
    });

    const origin = req.headers.get('origin') || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Outbid.lol Placement: ${title || url}`,
              description: `Lifetime leaderboard ranking bid for ${url}`,
              images: logoUrl ? [logoUrl] : undefined,
            },
            unit_amount: Math.round(amount * 100), // cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: ownerEmail || undefined,
      metadata: {
        url,
        title: title || '',
        description: description || '',
        category: category || 'saas-devtools',
        logoUrl: logoUrl || '',
        ogImage: ogImage || '',
        twitterHandle: twitterHandle || '',
        ownerEmail: ownerEmail || '',
        bidAmount: String(amount),
      },
      success_url: `${origin}/?success=true&bid=${amount}&url=${encodeURIComponent(url)}`,
      cancel_url: `${origin}/?canceled=true`,
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to create Stripe session';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
