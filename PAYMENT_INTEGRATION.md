# 💳 Dodo Payments + Supabase Real-Time Payment System

Complete production guide and configuration instructions for the Dodo Payments integration on `outbidking.lol`.

---

## 🏛️ Architecture Overview

```text
┌────────────────────────────────────────────────────────┐
│               Frontend (React / Next.js)               │
│  User selects bid amount ($1 min) & enters URL/handle  │
└──────────────────────────┬─────────────────────────────┘
                           │ 1. POST /api/dodo/checkout
                           ▼
┌────────────────────────────────────────────────────────┐
│            Secure Server Checkout Endpoint             │
│  Validates amount, metadata, fetches live logo/avatar  │
│  Calls Dodo Payments API with DODO_PAYMENTS_API_KEY    │
└──────────────────────────┬─────────────────────────────┘
                           │ 2. Returns payment_link
                           ▼
┌────────────────────────────────────────────────────────┐
│           Dodo Payments Hosted Checkout                │
│  Customer pays via Credit Card, Apple Pay, Google Pay  │
└──────────────────────────┬─────────────────────────────┘
                           │ 3. Dispatches Webhook
                           ▼
┌────────────────────────────────────────────────────────┐
│        Dodo Webhook (/api/webhooks/dodo)               │
│  1. Verifies signature using DODO_PAYMENTS_WEBHOOK_KEY │
│  2. Prevents duplicate event processing (idempotency)  │
│  3. Atomically updates Supabase `projects` table       │
│  4. Inserts into Supabase `bid_transactions` table     │
│  5. Broadcasts via Supabase Realtime `outbid-realtime` │
└──────────────────────────┬─────────────────────────────┘
                           │ 4. Instant WebSocket broadcast
                           ▼
┌────────────────────────────────────────────────────────┐
│       All Live Connected Clients Update Instantly      │
│  #1 Throne & Leaderboard ranks reorder in real time!   │
└────────────────────────────────────────────────────────┘
```

---

## 🔑 Required Environment Variables

Add the following environment variables to your `.env.local` (for local development) and your deployment hosting settings (e.g. Vercel / Supabase):

```env
# Dodo Payments API Key (Live or Test mode key)
DODO_PAYMENTS_API_KEY=RbIcmEh5DE8947hN.aUM8mEqcI34KVEw_xMO-19Zqh1xkSYZ05IldzJXKqAnauzFd

# Dodo Payments Webhook Secret (Copy from Dodo Dashboard -> Developer -> Webhooks)
DODO_PAYMENTS_WEBHOOK_KEY=whsec_your_webhook_signing_secret_here

# Dodo Environment ('test_mode' or 'live_mode')
DODO_PAYMENTS_ENVIRONMENT=test_mode

# Public Application URL
NEXT_PUBLIC_APP_URL=https://outbidking.lol

# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL=https://uoxwylqjepuhhaxfkyqq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
```

---

## 📋 Checklist for Dodo Payments Dashboard Setup

Follow these exact steps in your [Dodo Payments Dashboard](https://app.dodopayments.com/):

### 1. API Keys
1. Go to **Developer Settings** → **API Keys**.
2. Create a new API Key (named `Outbid King Production`).
3. Copy the key and set it as `DODO_PAYMENTS_API_KEY` in your environment.

### 2. Configure Webhook
1. Go to **Developer Settings** → **Webhooks** → **Add Webhook Endpoint**.
2. **Webhook URL**:
   ```text
   https://outbidking.lol/api/webhooks/dodo
   ```
   *(For local testing with ngrok/cloudflared tunnel: `https://your-tunnel.ngrok-free.app/api/webhooks/dodo`)*
3. **Select Events**:
   - `payment.succeeded`
   - `checkout.session.completed`
   - `payment.failed`
4. Click **Save Endpoint**.
5. Copy the **Webhook Signing Secret** (starts with `whsec_...`) and set it as `DODO_PAYMENTS_WEBHOOK_KEY` in your environment.

---

## 🗄️ Database Tables (Supabase)

The integration interacts with the following tables in Supabase:

1. **`projects`**:
   - `id`: text (normalized URL or handle)
   - `url`: text
   - `title`: text
   - `category`: text
   - `total_bid`: numeric
   - `logo_url`: text
   - `clicks`: integer
   - `updated_at`: timestamp

2. **`bid_transactions`**:
   - `id`: text
   - `project_id`: text
   - `amount`: numeric
   - `payment_provider`: 'dodo'
   - `payment_intent_id`: text
   - `created_at`: timestamp

3. **`webhook_events`**:
   - `id`: uuid
   - `webhook_id`: text
   - `event_type`: text
   - `payment_id`: text
   - `payload`: jsonb
   - `status`: text
   - `processed_at`: timestamp

4. **`site_stats`**:
   - `id`: 'global'
   - `total_visitors`: bigint (incremented atomically via `increment_visitor_count()`)

---

## 🧪 Testing the Payment Flow

1. On `https://outbidking.lol`, enter `@shipxankit` or your product URL.
2. Watch the live profile photo / favicon automatically appear in the input box.
3. Click the 3D **Rankbid** button.
4. Customize your bid amount (e.g. `$1` or `$5`).
5. Click **Claim Rank for $X USD** → You will be redirected to the official Dodo Payments checkout.
6. Enter test card details on Dodo Payments and complete checkout.
7. Dodo Payments dispatches `payment.succeeded` webhook to `https://outbidking.lol/api/webhooks/dodo`.
8. Your product immediately appears at its verified rank on the live leaderboard!
