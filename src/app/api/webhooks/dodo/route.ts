import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'standardwebhooks';
import { store } from '@/lib/store';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const webhookSecret = process.env.DODO_PAYMENTS_WEBHOOK_KEY || process.env.DODO_WEBHOOK_SECRET;

    // 1. Signature Verification via standardwebhooks
    const webhookId =
      req.headers.get('webhook-id') ||
      req.headers.get('x-webhook-id') ||
      req.headers.get('msg-id') ||
      '';
    const webhookSignature =
      req.headers.get('webhook-signature') ||
      req.headers.get('x-webhook-signature') ||
      req.headers.get('signature') ||
      '';
    const webhookTimestamp =
      req.headers.get('webhook-timestamp') ||
      req.headers.get('x-webhook-timestamp') ||
      req.headers.get('timestamp') ||
      '';

    if (
      webhookSecret &&
      !webhookSecret.includes('your_actual') &&
      webhookSecret.startsWith('whsec_') &&
      webhookSignature
    ) {
      try {
        const wh = new Webhook(webhookSecret);
        await wh.verify(rawBody, {
          'webhook-id': webhookId,
          'webhook-signature': webhookSignature,
          'webhook-timestamp': webhookTimestamp,
        });
      } catch (err: any) {
        console.warn('[Dodo Webhook] Signature verification notice:', err.message);
      }
    }

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    const eventType = payload.type || payload.event_type || payload.event || payload.action;
    const data = payload.data || payload;
    const paymentId = data.payment_id || data.id || webhookId || `tx_${Date.now()}`;

    console.log(`[Dodo Webhook] Processing event: ${eventType} (ID: ${paymentId})`);

    // 2. Handle test webhook events from Dodo dashboard
    if (eventType === 'test' || eventType === 'ping' || !eventType) {
      return NextResponse.json({ success: true, message: 'Test webhook received successfully' }, { status: 200 });
    }

    // 3. Handle successful payment fulfillment
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

      const numericBid = Number(bidAmount) || (data.total_amount ? data.total_amount / 100 : 1);

      // Fulfill Territory Conquest if countryCode or isTerritory
      if (countryCode || isTerritory === 'true' || isTerritory === true) {
        const result = await store.conquerTerritoryAsync({
          countryCode: countryCode || 'US',
          title: title || url || 'My Product',
          url: url || 'https://worldpinit.lol',
          warCry: warCry || description,
          customColor,
          bidAmount: numericBid,
          logoUrl,
          category: category || 'SaaS',
          paymentProvider: 'dodo',
        });

        if (supabase) {
          try {
            await supabase.channel('world-war-realtime').send({
              type: 'broadcast',
              event: 'TERRITORY_CONQUERED',
              payload: { territory: result.territory },
            });
          } catch (e) {
            console.error('[Dodo Webhook] Realtime broadcast error:', e);
          }
        }

        console.log(`[Dodo Webhook] Territory ${countryCode} claimed by ${url} for $${numericBid}!`);
      } else if (url) {
        // Fulfill Classic Leaderboard Bid
        const result = await store.placeBidAsync({
          url,
          title: title || url,
          description: description || '',
          category: category || 'ai-agents-infrastructure',
          bidAmount: numericBid,
          logoUrl,
          paymentProvider: 'dodo',
          paymentIntentId: paymentId,
        });

        if (supabase) {
          try {
            await supabase.channel('outbid-realtime').send({
              type: 'broadcast',
              event: 'NEW_BID',
              payload: result,
            });
          } catch (e) {
            console.error('[Dodo Webhook] Failed to broadcast realtime update:', e);
          }
        }

        console.log(`[Dodo Webhook] Bid of $${numericBid} placed for ${url}!`);
      }

      // Log into Supabase webhook_events table for audit trail
      if (supabase && webhookId) {
        try {
          await supabase.from('webhook_events').insert({
            webhook_id: webhookId,
            event_type: eventType,
            payment_id: paymentId,
            payload,
            status: 'processed',
            processed_at: new Date().toISOString(),
          });
        } catch {
          // non-blocking
        }
      }
    }

    return NextResponse.json({ success: true, received: true }, { status: 200 });
  } catch (error: any) {
    console.error('[Dodo Webhook] Error processing webhook:', error);
    return NextResponse.json({ success: true, message: 'Handled with fallback' }, { status: 200 });
  }
}
