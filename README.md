# ⚡ outbidrank.lol — Viral Pay-to-Rank SaaS Platform

> **Built by [@shipxcode](https://x.com/shipxcode) · [shipxcode.dev](https://shipxcode.dev)**

A complete, production-grade 1:1 SaaS clone of the viral pay-to-rank public auction directory where rankings are determined strictly by cumulative non-consumable bids.

---

## 💎 Features & Highlights

1. **Exact 1:1 Visual & Interactive Design**:
   - Header with `outbidrank.lol` logo, `/categories`, `/about`, `/rules`, and working light/dark theme switch.
   - `Grab [ #1 ] for ( − $X + ) ?` interactive hero section with 3D badges, numeric stepper, live tab favicon auto-extraction, category selector, and vibrant green `Pay $X` button.
   - Top 3 luxury tinted prestige cards with **hover-only "Claim This Rank"** action pills.
   - `🔴 Latest activity` live bid ticker.
   - Table rows with `TOP 10` and `TOP 20` section dividers.
   - Giant monospace bottom revenue milestone counter.

2. **Real Data Extraction & Creative Suite**:
   - **🌐 Tab Favicon Grabber**: Automatically extracts high-resolution favicons from any typed URL.
   - **✍️ Interactive Handwriting Canvas**: Draw custom logos, signatures, or doodles in HTML5 canvas.
   - **📷 Live Webcam Photo Capture**: Snap instant selfie/avatar directly from the browser camera.
   - **🖼️ Custom File Uploader**: Upload custom PNG/SVG logos.
   - **💰 Interactive Money Selector**: Preset boost chips (`+$5`, `+$25`, `+$100`, `+$500`, `+$1,000`, `Take #1`) with real-time rank position prediction.

3. **Backend & Real-Time Engine**:
   - Server-Sent Events (SSE) broadcasting `NEW_KING`, `NEW_BID`, and `RANK_SHIFT` in real-time.
   - Atomic bid increment and delta top-up calculations.
   - Automated URL metadata scraper (`cheerio`).
   - Click tracking via fast `/r/[id]` redirects.
   - Embeddable vector SVG badges (`/api/badge/[id]`).
   - Dynamic OpenGraph social preview images (`/api/og`).
   - Web Audio API synthesizer for *Cha-Ching* and *King Gong* sounds.

---

## 💳 How to Receive Real Payments (Stripe Setup)

To receive real payments directly to your bank account:

1. Create a free account at **[stripe.com](https://stripe.com)**.
2. Get your API keys from **Stripe Dashboard > Developers > API Keys**.
3. Create a `.env.local` file in the project root:
   ```env
   # Stripe Credentials
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...

   # App URL
   NEXT_PUBLIC_APP_URL=https://outbidrank.lol
   ```
4. Set up the Webhook endpoint in **Stripe Dashboard > Developers > Webhooks**:
   - Endpoint URL: `https://outbidrank.lol/api/webhooks/stripe`
   - Events to listen for: `checkout.session.completed`
5. Deploy to Vercel and all payments will flow directly to your Stripe balance!

---

## 🎨 Tokenized Design System

| Token | Light Mode | Dark Mode | Usage |
| :--- | :--- | :--- | :--- |
| **Background** | `#ffffff` | `#0e0d0b` | Page root background |
| **Foreground** | `#18181b` | `#f4f3ef` | Primary typography |
| **Card Surface** | `#ffffff` | `#181613` | Leaderboard rows & containers |
| **Borders** | `#e4e4e7` | `#2b2721` | Hairline dividers & borders |
| **Terracotta Accent** | `#e05d44` | `#e05d44` | Rank badges, primary buttons |
| **Emerald Green** | `#4ade80` | `#4ade80` | Checkout & payment CTA buttons |
| **Champion Gold** | `#facc15` | `#facc15` | King crown & celebration accents |

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
