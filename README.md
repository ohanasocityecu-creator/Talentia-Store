# TALENTIA — E-commerce Platform

Production-oriented Next.js + Supabase foundation for TALENTIA, a premium stainless-steel accessories brand.

## Stack
- Next.js App Router + TypeScript
- Tailwind CSS
- Supabase PostgreSQL / Auth / Storage
- Zod-ready validation layer
- Framer Motion-ready UI architecture

## Critical image architecture
This project intentionally does **not** use `next/image` or Vercel Image Optimization. All storefront images are regular `<img>` elements and are expected to use public Supabase Storage URLs. No `/_next/image`, `remotePatterns`, image proxy, or Vercel transformation endpoint is used.

## Setup
1. Create a Supabase project.
2. Copy `.env.example` to `.env.local`.
3. Fill `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Run the SQL files in `supabase/migrations/` in numeric order in Supabase SQL Editor.
5. Create an admin user through Supabase Auth, then set that user's `profiles.role` to `admin` using the Supabase dashboard SQL editor.
6. Install dependencies with `npm install` and run `npm run dev`.

## Important production notes
- Do not expose a Supabase service-role key.
- The secure order RPC re-reads product prices, checks stock with row locks, calculates discount/shipping server-side, creates order snapshots, and decrements stock atomically.
- Before accepting live orders, wire the checkout form to the secure RPC and authenticated Supabase session.
- Add real products, categories, pricing rules, shipping zones, and CMS content through Supabase; product images should use Supabase Storage URLs.
- Configure domain, social URLs, legal pages, transactional email, monitoring, and payment provider before public launch.

## Storefront languages
- English is the default language; Arabic is available at `/ar` and English at `/en`.
- The locale proxy rewrites localized URLs onto the existing App Router pages and redirects legacy unprefixed URLs to the selected locale.
- Locale choice is stored in the `talentia-locale` cookie so server-rendered HTML, `lang`, and text direction agree on first render.
- UI messages are centralized in `messages/en.json` and `messages/ar.json`. Existing product and category records are not modified; optional localized product fields are used when present and otherwise fall back to their current English content.
- No Supabase schema changes or migrations are required for localization.

## Route map
Store: `/en` or `/ar`, then `shop`, `category/[slug]`, `product/[slug]`, `cart`, `wishlist`, `checkout`, `track-order`, `account`
Admin: `/admin`, `/admin/products`, `/admin/categories`, `/admin/orders`, `/admin/customers`, `/admin/pricing`, `/admin/shipping`, `/admin/content`

## Image audit
The source must contain no `next/image`, `<Image`, `/_next/image`, `images.remotePatterns`, or `images.domains` usage.
