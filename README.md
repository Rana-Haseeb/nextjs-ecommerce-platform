<div align="center">

# Maison&nbsp;&amp;&nbsp;Co.

### A full-stack e-commerce platform — considered goods, built end to end.

*Product catalog · authentication · cart · Stripe checkout · admin dashboard — all wired to a real database, not a demo shell.*

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Stripe](https://img.shields.io/badge/Stripe-Checkout-635BFF?style=flat-square&logo=stripe&logoColor=white)](https://stripe.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Auth.js](https://img.shields.io/badge/Auth.js-v5-000000?style=flat-square)](https://authjs.dev)

**[Live demo →](#)** <sub>_(add your deployed URL here once it's live)_</sub>

</div>

<br />

## What this is

Maison & Co. is a complete, production-shaped storefront — not a template with the hard parts left out. Every layer that matters in a real e-commerce app is implemented and wired together:

- Prices are **re-verified server-side at checkout**, never trusted from the client.
- Stock is **decremented atomically** from a signed, verified Stripe webhook — not optimistically on the client.
- Admin routes are gated **twice**: once at the edge (middleware) and once inside every Server Action, since actions are directly callable and bypass page-level checks.
- The cart survives reloads via `localStorage`, correctly handles the hydration race that happens when Stripe redirects the browser back post-payment, and blocks add-to-cart once stock is exhausted.

## Features

<table>
<tr><td valign="top" width="50%">

**Storefront**
- Server-rendered product grid with category filtering and price sorting via URL query params
- Dynamic product detail pages with image galleries
- Stock-aware UI (in stock / low stock / sold out)
- Editorial-style design system — custom color tokens, Fraunces + Manrope type pairing

**Accounts**
- Credentials auth (email + password) via Auth.js v5
- Passwords hashed with bcrypt
- Role-based sessions (`customer` / `admin`) baked into the JWT

</td><td valign="top" width="50%">

**Cart & Checkout**
- Global cart via React Context + `localStorage`, with a slide-out drawer and a full `/cart` page
- Stripe Checkout Sessions, created server-side with prices re-fetched from MongoDB
- Webhook-driven order fulfillment: `checkout.session.completed` marks the order paid and decrements product stock, idempotently

**Admin Dashboard**
- Server-verified role gate on every admin route *and* every mutating action
- Live metrics: revenue, order count, out-of-stock items
- Full product CRUD via Server Actions, validated with Zod, with instant storefront revalidation

</td></tr>
</table>

## Tech stack

| Layer | Choice |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Server Actions, Turbopack) |
| Language | TypeScript |
| Database | [MongoDB Atlas](https://www.mongodb.com/atlas) via [Mongoose](https://mongoosejs.com) |
| Auth | [Auth.js v5](https://authjs.dev) (Credentials provider, JWT sessions) |
| Payments | [Stripe Checkout](https://stripe.com/docs/payments/checkout) + webhooks |
| Validation | [Zod](https://zod.dev) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |

## Getting started

### Prerequisites

- Node.js 20+
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (the free M0 tier is enough)
- A [Stripe](https://dashboard.stripe.com/register) account — **test mode only**, no live/business details needed

### 1. Install

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your own values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `AUTH_SECRET` | Random secret for signing sessions — generate with `openssl rand -base64 32` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe **test mode** publishable key (`pk_test_...`) |
| `STRIPE_SECRET_KEY` | Stripe **test mode** secret key (`sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for the webhook endpoint (see below) |
| `NEXT_PUBLIC_APP_URL` | Base URL of the app (`http://localhost:3000` locally) |

### 3. Seed the database

```bash
npm run seed
```

Populates 12 demo products across six categories. Safe to re-run — it only replaces the `products` collection.

### 4. Run it

```bash
npm run dev
```

Visit **http://localhost:3000**.

### 5. Test Stripe payments locally

Stripe Checkout works immediately, but for the **webhook** (which marks orders paid and decrements stock) to reach your machine, forward events with the [Stripe CLI](https://docs.stripe.com/stripe-cli):

```bash
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

Use Stripe's test card `4242 4242 4242 4242`, any future expiry, any CVC.

### 6. Create an admin account

Sign up normally through the app, then flip that user's `role` field to `"admin"` directly in MongoDB Atlas. Sign out and back in so the session picks up the new role, then visit `/admin`.

## Project structure

```
src/
├── actions/          Server Actions (auth, product CRUD)
├── app/
│   ├── admin/         Admin dashboard + product CRUD pages
│   ├── api/            Route handlers (NextAuth, Stripe checkout, Stripe webhook)
│   ├── cart/           Full cart page
│   ├── checkout/        Checkout + success pages
│   └── product/[id]/    Product detail page
├── components/ui/    UI components
├── hooks/            Client-side cart Context (useCart)
├── lib/
│   ├── db/            Mongoose models, connection, seed script, queries
│   └── stripe.ts       Server-side Stripe SDK instance
└── proxy.ts           Edge-level route protection (formerly "middleware")
```

## Deploying (free)

This project deploys cleanly to [Vercel](https://vercel.com)'s free tier:

1. Push this repo to GitHub.
2. Import it in the [Vercel dashboard](https://vercel.com/new).
3. Add the same environment variables from `.env.local`, but set `NEXT_PUBLIC_APP_URL` to your Vercel URL.
4. In MongoDB Atlas → Network Access, allow `0.0.0.0/0` (Vercel's serverless IPs are dynamic).
5. In the Stripe Dashboard (**stay in Test mode**) → Developers → Webhooks, add an endpoint at `https://<your-domain>/api/webhook/stripe`, listening for `checkout.session.completed`. Copy its signing secret into `STRIPE_WEBHOOK_SECRET` on Vercel — it's different from the one the CLI gives you locally.

## Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (also type-checks) |
| `npm start` | Run the production build |
| `npm run lint` | Lint the codebase |
| `npm run seed` | Reset and reseed the product catalog |

---

<div align="center">
<sub>Built as a full-stack internship project — NexSoft Solutions.</sub>
</div>
