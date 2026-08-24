import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const eventType = payload.type || payload.event_type || payload.event;
    const data = payload.data || payload;

    console.log(`[Dodo Webhook] Received event: ${eventType}`);

    // Handle successful payment
    if (
      eventType === 'payment.succeeded' ||
      eventType === 'payment_succeeded' ||
      eventType === 'checkout.session.completed' ||
      data.status === 'succeeded'
    ) {
      const metadata = data.metadata || {};
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
      } = metadata;

      const numericBid = Number(bidAmount) || (data.total_amount ? data.total_amount / 100 : 5);

      if (isTerritory === 'true' && countryCode) {
        // Fulfill Territory Conquest
        const result = await store.conquerTerritoryAsync({
          countryCode,
          title: title || url,
          url,
          warCry,
          customColor,
          bidAmount: numericBid,
          logoUrl,
          category,
          paymentProvider: 'dodo',
        });

        // Broadcast realtime update
        if (supabase) {
          try {
            await supabase.channel('world-war-realtime').send({
              type: 'broadcast',
              event: 'TERRITORY_CONQUERED',
              payload: { territory: result.territory },
            });
          } catch (e) {
            console.error('[Dodo Webhook] Failed to broadcast territory update:', e);
          }
        }

        console.log(`[Dodo Webhook] Territory ${countryCode} successfully conquered by ${title}!`);
      } else if (url) {
        // Fulfill Leaderboard Bid
        const result = await store.placeBidAsync({
          url,
          title: title || url,
          description: description || '',
          category: category || 'ai-agents-infrastructure',
          bidAmount: numericBid,
          logoUrl,
          paymentProvider: 'dodo',
          paymentIntentId: data.payment_id || data.id,
        });

        // Broadcast realtime update
        if (supabase) {
          try {
            await supabase.channel('outbid-realtime').send({
              type: 'broadcast',
              event: 'NEW_BID',
              payload: result,
            });
          } catch (e) {
            console.error('[Dodo Webhook] Failed to broadcast leaderboard update:', e);
          }
        }

        console.log(`[Dodo Webhook] Bid of $${numericBid} placed for ${url}!`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('[Dodo Webhook] Error processing webhook:', error);
    return NextResponse.json({ error: error.message || 'Webhook error' }, { status: 500 });
  }
}
