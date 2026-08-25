import { NextRequest, NextResponse } from 'next/server';
import { dodo } from '@/lib/dodo';
import { store } from '@/lib/store';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get('payment_id') || searchParams.get('paymentId');

    if (!paymentId) {
      return NextResponse.json({ success: false, error: 'payment_id parameter is required' }, { status: 400 });
    }

    // Retrieve payment details from Dodo Payments
    const payment: any = await dodo.payments.retrieve(paymentId);
    if (!payment) {
      return NextResponse.json({ success: false, error: 'Payment not found in Dodo Payments' }, { status: 404 });
    }

    const isSuccessful = payment.status === 'succeeded' || payment.status === 'completed';
    const metadata = payment.metadata || {};
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

    const numericBid = Number(bidAmount) || (payment.total_amount ? payment.total_amount / 100 : 5);

    if (isSuccessful) {
      if (isTerritory === 'true' && countryCode) {
        // Fulfill territory conquest
        const result = await store.conquerTerritoryAsync({
          countryCode,
          title: title || url,
          url: url || 'https://outbidking.lol',
          warCry,
          customColor,
          bidAmount: numericBid,
          logoUrl,
          category,
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
            console.error('[Dodo Verify] Realtime broadcast error:', e);
          }
        }

        return NextResponse.json({
          success: true,
          status: payment.status,
          isTerritory: true,
          countryCode,
          territory: result.territory,
        });
      } else if (url) {
        // Fulfill leaderboard bid
        const result = await store.placeBidAsync({
          url,
          title: title || url,
          description: description || '',
          category: category || 'ai-agents-infrastructure',
          bidAmount: numericBid,
          logoUrl,
          paymentProvider: 'dodo',
          paymentIntentId: payment.payment_id || paymentId,
        });

        if (supabase) {
          try {
            await supabase.channel('outbid-realtime').send({
              type: 'broadcast',
              event: 'NEW_BID',
              payload: result,
            });
          } catch (e) {
            console.error('[Dodo Verify] Realtime broadcast error:', e);
          }
        }

        return NextResponse.json({
          success: true,
          status: payment.status,
          isTerritory: false,
          project: result.project,
        });
      }
    }

    return NextResponse.json({
      success: isSuccessful,
      status: payment.status,
      metadata,
    });
  } catch (error: any) {
    console.error('[API /api/dodo/verify] Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Verification failed' }, { status: 500 });
  }
}
