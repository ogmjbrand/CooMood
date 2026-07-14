# CooMood — Fragrance and More.

Luxury fragrance & home-scent commerce site for CooMood, built with Next.js 15 (App Router),
React 19, TypeScript, Tailwind CSS v4, and Framer Motion.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What's here

- **Full storefront**: home, shop (filterable/sortable/infinite-scroll grid), product detail,
  collections, gift sets, home fragrance, journal, our story, about, corporate gifts, stores, FAQs,
  contact, search, 404.
- **Custom Scent Builder** (`/custom-scent-builder`): choose bottle, cap, glass color, top/middle/base
  notes, size, and packaging, with a live SVG bottle preview and real-time price calculation.
- **Cart, checkout, and account**: Zustand-backed cart/wishlist/recently-viewed (persisted to
  `localStorage`), a checkout flow that calls `/api/checkout`, and an account dashboard (profile,
  orders, wishlist, addresses, subscriptions, rewards/referral, saved fragrances).
- **SEO**: per-page metadata, Open Graph/Twitter cards, JSON-LD product schema, `sitemap.ts`,
  `robots.ts`, a generated app icon.
- **Design system**: brand colors/fonts wired through Tailwind v4 `@theme` tokens in
  `src/app/globals.css` (cream/gold/cherry/ink palette, Playfair Display + Montserrat), Lenis smooth
  scroll, canvas-based cursor-reactive particle fields, tilt/parallax hero imagery.

Product, collection, review, journal, and FAQ content is static mock data in `src/data/` so the
site runs and looks complete with zero external services configured.

## Connecting real services

The site runs fully styled with no backend configured. To make checkout, accounts, and email live,
copy `.env.example` to `.env.local` and fill in:

| Service | Env vars | Powers |
|---|---|---|
| **Stripe** | `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `/api/checkout` creates a real Checkout Session. Without a key it returns a friendly "not configured" message instead of erroring. |
| **Supabase** | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Run `supabase/schema.sql` against a Supabase project for products, orders, customers, reviews, and custom-scent tables (with row-level security policies). `src/lib/supabase/{client,server}.ts` are ready to use once configured. |
| **Resend** | `RESEND_API_KEY` | `/api/newsletter` sends a welcome email; falls back to "accepted, email not yet configured" otherwise. |
| **Analytics** | `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID` | Loads Google Analytics / Meta Pixel via `src/components/layout/Analytics.tsx` only when set. |
| **Cloudinary** | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Optional — swap in for real product photography hosting. |

## Project structure

```
src/
  app/            routes (App Router), one folder per page + api/ route handlers
  components/     layout, home, shop, scent-builder, effects, ui, icons
  data/           mock catalog: products, collections, reviews, journal, faqs, builder options
  lib/            utils, zustand stores (cart/wishlist/recently-viewed), stripe.ts, supabase/
  types/          shared TypeScript types
supabase/
  schema.sql      full Postgres schema + RLS policies for the commerce data model
```

## Deploy on Vercel

Push to a GitHub repo and import it at [vercel.com/new](https://vercel.com/new), or run
`vercel deploy`. Set the environment variables above in the Vercel project settings before going
live with real payments/accounts.
