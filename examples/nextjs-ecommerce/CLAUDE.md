# shoply

E-commerce storefront: Next.js 15 (App Router) + TypeScript + Tailwind,
Prisma/Postgres, Stripe Checkout, Auth.js. Single app.

## Commands

- `npm run dev` — needs Postgres up first: `docker compose up -d db`
- `npm test` — Vitest, unit only, no DB needed
- `npm run lint`
- `npm run build`
- `npx prisma migrate dev` — local DB migrations
- `npm run db:seed` # not verified — destructive, truncates all tables

## Gotchas

- Money is integer cents (`priceCents`) end-to-end; floats never touch
  amounts. Formatting happens only in `src/lib/money.ts` at render time.
- Stripe webhooks can't reach localhost: run `npm run stripe:listen` next to
  `dev`, or checkouts complete in Stripe but orders stay `PENDING` forever.
- Order status changes ONLY in the webhook handler — a checkout can finish
  after the user closed the tab, so client code never flips an order to paid.
- Checkout builds line items from DB prices, never from the client payload.
- Product images are Cloudinary IDs (`imageId`); there is no local image
  storage in production.

## Hard constraints

- Never commit real Stripe or database credentials; `.env.example` carries
  placeholders only.
- `db:seed` truncates every table — never point it at a non-localhost
  `DATABASE_URL`.

## Map

- Money formatting boundary: `src/lib/money.ts`
- Payment flow: `src/app/api/checkout/` (create) → `src/app/api/webhooks/stripe/` (confirm)
