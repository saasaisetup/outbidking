import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { store } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, title, description, category, logoUrl, bidAmount, currency = 'USD', ownerEmail, twitterHandle } = body;

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount < 1) {
      return NextResponse.json({ error: 'Invalid bid amount' }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // If Razorpay keys are not provided, provide instant sandbox mode
    if (!keyId || !keySecret) {
      return NextResponse.json({
        isSandbox: true,
        orderId: `order_mock_${Date.now()}`,
        amount: Math.round(amount * 100),
        currency: currency,
        keyId: 'rzp_test_mock',
        message: 'Razorpay keys not configured in environment. Using sandbox simulation mode.',
      });
    }

    // Call Razorpay API to create order
    // Razorpay accepts USD for international payments if International Payments is activated on the account.
    const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    
    // Convert to sub-units (e.g. cents for USD, paise for INR)
    const amountInSubunits = Math.round(amount * 100);

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({
        amount: amountInSubunits,
        currency: currency, // 'USD' or 'INR'
        receipt: `rcpt_${Date.now().toString().slice(-8)}`,
        notes: {
          url: url || '',
          title: title || '',
          category: category || 'ai-agents-infrastructure',
          bidAmount: String(amount),
          ownerEmail: ownerEmail || '',
          twitterHandle: twitterHandle || '',
        },
      }),
    });

    const orderData = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: orderData.error?.description || 'Failed to create Razorpay order' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      orderId: orderData.id,
      amount: orderData.amount,
      currency: orderData.currency,
      keyId: keyId,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
