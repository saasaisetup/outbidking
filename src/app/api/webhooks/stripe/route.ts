import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { store } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey) {
    return NextResponse.json({ error: 'Stripe key not configured' }, { status: 500 });
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion,
  });

  const payload = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
    } else {
      event = JSON.parse(payload) as Stripe.Event;
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Webhook error';
    return NextResponse.json({ error: `Webhook Error: ${msg}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata;

    if (meta && meta.url && meta.bidAmount) {
      const bidAmount = parseFloat(meta.bidAmount);
      if (!isNaN(bidAmount) && bidAmount > 0) {
        store.placeBid({
          url: meta.url,
          title: meta.title || 'Untitled Project',
          description: meta.description || '',
          category: meta.category || 'saas-devtools',
          logoUrl: meta.logoUrl || undefined,
          ogImage: meta.ogImage || undefined,
          ownerEmail: meta.ownerEmail || session.customer_details?.email || undefined,
          twitterHandle: meta.twitterHandle || undefined,
          bidAmount: bidAmount,
          paymentProvider: 'stripe',
          paymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : undefined,
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
