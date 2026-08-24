import DodoPayments from 'dodopayments';

const apiKey = process.env.DODO_PAYMENTS_API_KEY || 'RbIcmEh5DE8947hN.aUM8mEqcI34KVEw_xMO-19Zqh1xkSYZ05IldzJXKqAnauzFd';
const environment = (process.env.DODO_PAYMENTS_ENVIRONMENT as 'test_mode' | 'live_mode') || 'test_mode';

export const dodo = new DodoPayments({
  bearerToken: apiKey,
  environment,
});

let cachedProductId: string | null = null;

/**
 * Ensures a reusable dynamic-amount product exists in Dodo Payments.
 */
export async function getOrCreateBiddingProduct(): Promise<string> {
  if (cachedProductId) return cachedProductId;

  try {
    const list = await dodo.products.list();
    const existing = list.items?.find((p) => p.name === 'Outbid King Rank Bid');
    if (existing) {
      cachedProductId = existing.product_id;
      return cachedProductId;
    }

    const created = await dodo.products.create({
      name: 'Outbid King Rank Bid',
      price: {
        currency: 'USD',
        price: 1000,
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
    // Fallback to verified existing product id
    return 'pdt_0Nm3RO6jx7u8pMnv9ncdo';
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
}

/**
 * Creates a Dodo Payments hosted checkout session.
 */
export async function createDodoCheckoutSession(params: CreateCheckoutParams) {
  const productId = await getOrCreateBiddingProduct();
  const amountInCents = Math.round(params.bidAmount * 100);

  const appBaseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  const returnUrl = params.returnUrl || (params.isTerritory ? `${appBaseUrl}/map` : appBaseUrl);

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
