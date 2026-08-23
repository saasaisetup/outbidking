import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { store } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;

    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    const event = JSON.parse(rawBody);

    // When payment is captured / authorized
    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      const payment = event.payload.payment.entity;
      const notes = payment.notes || {};

      const url = notes.url;
      const title = notes.title;
      const category = notes.category || 'ai-agents-infrastructure';
      const bidAmount = parseFloat(notes.bidAmount) || payment.amount / 100;
      const ownerEmail = notes.ownerEmail || payment.email;
      const twitterHandle = notes.twitterHandle;

      if (url && bidAmount > 0) {
        store.placeBid({
          url,
          title,
          category,
          bidAmount,
          ownerEmail,
          twitterHandle,
          paymentProvider: 'crypto', // or 'razorpay'
          paymentIntentId: payment.id,
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Webhook error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
