import DodoPayments from 'dodopayments';

/**
 * Automatically detect live mode vs test mode from env or key prefix.
 */
function resolveEnvironment(apiKey: string): 'test_mode' | 'live_mode' {
  const envVar = (
    process.env.DODO_PAYMENTS_ENVIRONMENT ||
    process.env.NEXT_PUBLIC_DODO_ENVIRONMENT ||
    ''
  ).toLowerCase();

  if (envVar === 'live_mode' || envVar === 'live' || envVar === 'production' || envVar === 'prod') {
    return 'live_mode';
  }
  if (envVar === 'test_mode' || envVar === 'test') {
    return 'test_mode';
  }
  if (apiKey.startsWith('live_') || apiKey.includes('live')) {
    return 'live_mode';
  }
  return 'test_mode';
}

/**
 * Dynamically instantiates the DodoPayments SDK on every request with the freshest runtime environment keys.
 */
export function getDodoClient(): DodoPayments {
  const apiKey =
    process.env.DODO_PAYMENTS_API_KEY ||
    'RbIcmEh5DE8947hN.aUM8mEqcI34KVEw_xMO-19Zqh1xkSYZ05IldzJXKqAnauzFd';
  const environment = resolveEnvironment(apiKey);

  return new DodoPayments({
    bearerToken: apiKey,
    environment,
  });
}

// Fallback export for existing imports
export const dodo = getDodoClient();

// Dynamic bidding product cache per environment
const cachedProductIds: { test_mode?: string; live_mode?: string } = {
  test_mode: 'pdt_0NmFFINaNKCg0hGTN6H1x',
};

/**
 * Ensures a reusable dynamic-amount product ($1 USD minimum) exists in Dodo Payments.
 */
export async function getOrCreateBiddingProduct(): Promise<string> {
  const client = getDodoClient();
  const apiKey =
    process.env.DODO_PAYMENTS_API_KEY ||
    'RbIcmEh5DE8947hN.aUM8mEqcI34KVEw_xMO-19Zqh1xkSYZ05IldzJXKqAnauzFd';
  const env = resolveEnvironment(apiKey);

  if (cachedProductIds[env]) {
    return cachedProductIds[env]!;
  }

  try {
    const list = await client.products.list();
    const existing = list.items?.find(
      (p) => p.name?.includes('Outbid King') || p.name?.includes('Dynamic Rank Bid')
    );
    if (existing) {
      cachedProductIds[env] = existing.product_id;
      return existing.product_id;
    }

    const created = await client.products.create({
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

    cachedProductIds[env] = created.product_id;
    return created.product_id;
  } catch (err: any) {
    console.error('[Dodo] Error getting/creating product in environment:', env, err);
    // Fallback to test product ID if in test mode
    return cachedProductIds.test_mode || 'pdt_0NmFFINaNKCg0hGTN6H1x';
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
  const client = getDodoClient();
  const productId = await getOrCreateBiddingProduct();
  const amountInCents = Math.round(Math.max(1, params.bidAmount) * 100);

  const baseAppUrl = resolveSafeAppUrl(params.origin);
  const returnUrl = params.returnUrl || `${baseAppUrl}/payment/success`;

  const payment = await client.payments.create({
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
