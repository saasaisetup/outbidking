import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { store } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-signature');
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

    if (secret && signature) {
      const hmac = crypto.createHmac('sha256', secret);
      const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
      const signatureBuffer = Buffer.from(signature, 'utf8');

      if (!crypto.timingSafeEqual(digest, signatureBuffer)) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta?.event_name;

    if (eventName === 'order_created') {
      const custom = payload.meta?.custom_data || {};
      const attributes = payload.data?.attributes;

      const url = custom.url;
      const title = custom.title;
      const category = custom.category || 'ai-agents-infrastructure';
      const bidAmount = parseFloat(custom.bidAmount) || (attributes?.total / 100);
      const ownerEmail = attributes?.user_email;
      const twitterHandle = custom.twitterHandle;

      if (url && bidAmount > 0) {
        store.placeBid({
          url,
          title,
          category,
          bidAmount,
          ownerEmail,
          twitterHandle,
          paymentProvider: 'lemonsqueezy',
          paymentIntentId: String(payload.data?.id),
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Webhook error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
