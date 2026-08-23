import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, title, description, category, logoUrl, bidAmount, ownerEmail, twitterHandle } = body;

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount < 1) {
      return NextResponse.json({ error: 'Invalid bid amount' }, { status: 400 });
    }

    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    const storeId = process.env.LEMONSQUEEZY_STORE_ID;
    const variantId = process.env.LEMONSQUEEZY_VARIANT_ID;

    if (!apiKey || !storeId) {
      return NextResponse.json({
        isSandbox: true,
        url: `/?success=true&bid=${amount}&url=${encodeURIComponent(url)}`,
        message: 'Lemon Squeezy keys not configured. Simulating instant sandbox checkout.',
      });
    }

    const origin = req.headers.get('origin') || 'https://outbidking.lol';

    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            custom_price: Math.round(amount * 100), // custom price in cents
            product_options: {
              name: `Rank Placement: ${title || url}`,
              description: `Lifetime ranking bid for ${url}`,
              redirect_url: `${origin}/?success=true&bid=${amount}&url=${encodeURIComponent(url)}`,
            },
            checkout_data: {
              email: ownerEmail || undefined,
              custom: {
                url,
                title: title || '',
                category: category || 'ai-agents-infrastructure',
                bidAmount: String(amount),
                twitterHandle: twitterHandle || '',
              },
            },
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: String(storeId),
              },
            },
            variant: {
              data: {
                type: 'variants',
                id: String(variantId || '1'),
              },
            },
          },
        },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(
        { error: data.errors?.[0]?.detail || 'Failed to create Lemon Squeezy checkout' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      url: data.data.attributes.url,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
