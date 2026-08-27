import DodoPayments from 'dodopayments';

const rawApiKey = process.env.DODO_PAYMENTS_API_KEY || 'RbIcmEh5DE8947hN.aUM8mEqcI34KVEw_xMO-19Zqh1xkSYZ05IldzJXKqAnauzFd';

// Automatically detect live mode vs test mode
function resolveEnvironment(): 'test_mode' | 'live_mode' {
  if (process.env.DODO_PAYMENTS_ENVIRONMENT === 'live_mode' || process.env.DODO_PAYMENTS_ENVIRONMENT === 'live') {
    return 'live_mode';
  }
  if (process.env.DODO_PAYMENTS_ENVIRONMENT === 'test_mode' || process.env.DODO_PAYMENTS_ENVIRONMENT === 'test') {
    return 'test_mode';
  }
  if (rawApiKey.startsWith('live_') || rawApiKey.includes('live')) {
    return 'live_mode';
  }
  return 'test_mode';
}

const environment = resolveEnvironment();

export const dodo = new DodoPayments({
  bearerToken: rawApiKey,
  environment,
});

// Dynamic bidding product cache
let cachedProductId: string | null = environment === 'live_mode' ? null : 'pdt_0NmFFINaNKCg0hGTN6H1x';

/**
 * Ensures a reusable dynamic-amount product ($1 USD minimum) exists in Dodo Payments.
 */
export async function getOrCreateBiddingProduct(): Promise<string> {
  if (cachedProductId) return cachedProductId;

  try {
    const list = await dodo.products.list();
    const existing = list.items?.find((p) => p.name?.includes('Outbid King') || p.name?.includes('Dynamic Rank Bid'));
    if (existing) {
      cachedProductId = existing.product_id;
      return cachedProductId;
    }

    const created = await dodo.products.create({
      name: 'Outbid King Dynamic Rank Bid',
      description: 'Dynamic rank bid on outbidking.lol starting at $1 USD',
      price: {
        currency: 'USD',
        price: 100, // 100 cents = $1.00 USD minimum
        discount: 0,
        purchasing_power_parity: false,
        type: 'one_time_price',
        pay_what_you_want: true,
      },
      tax_category: 'digital_products',
    });

    cachedProductId = created.product_id;
    return cachedProductId;
  } catch (err: any) {
    console.error('[Dodo] Error getting/creating product:', err);
    // Fallback to verified test product ID if in test mode
    return cachedProductId || 'pdt_0NmFFINaNKCg0hGTN6H1x';
  }
}

export interface CreateCheckoutParams {
  url: string;
  title: string;
  description?: string;
  category?: string;
  bidAmount: number; // in USD dollars
  logoUrl?: string;
  isTerritory?: boolean;
  countryCode?: string;
  warCry?: string;
  customColor?: string;
  customerEmail?: string;
  customerName?: string;
  returnUrl?: string;
  origin?: string;
}

/**
 * Resolves a safe public production or origin URL (never falls back to private protected Vercel previews).
 */
export function resolveSafeAppUrl(origin?: string): string {
  // 1. Explicitly configured public URL
  if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes('localhost')) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  }

  // 2. Client-provided window.location.origin
  if (origin && !origin.includes('localhost')) {
    return origin.replace(/\/$/, '');
  }

  // 3. If running on localhost development
  if (origin && origin.includes('localhost')) {
    return origin.replace(/\/$/, '');
  }

  // 4. Safe public production domain default
  return 'https://outbidking.lol';
}

/**
 * Creates a Dodo Payments hosted checkout session for any amount starting at $1 USD.
 */
export async function createDodoCheckoutSession(params: CreateCheckoutParams) {
  const productId = await getOrCreateBiddingProduct();
  const amountInCents = Math.round(Math.max(1, params.bidAmount) * 100);

  const baseAppUrl = resolveSafeAppUrl(params.origin);
  const returnUrl = params.returnUrl || `${baseAppUrl}/payment/success`;

  const payment = await dodo.payments.create({
    billing: {
      country: 'US',
    },
    customer: {
      email: params.customerEmail || 'bidder@outbidking.lol',
      name: params.customerName || params.title || 'Outbid King Bidder',
    },
    product_cart: [
      {
        product_id: productId,
        quantity: 1,
        amount: amountInCents,
      },
    ],
    metadata: {
      url: params.url,
      title: params.title,
      description: params.description || '',
      category: params.category || 'ai-agents-infrastructure',
      bidAmount: String(params.bidAmount),
      logoUrl: params.logoUrl || '',
      isTerritory: params.isTerritory ? 'true' : 'false',
      countryCode: params.countryCode || '',
      warCry: params.warCry || '',
      customColor: params.customColor || '',
    },
    payment_link: true,
    return_url: returnUrl,
  });

  return payment;
}
