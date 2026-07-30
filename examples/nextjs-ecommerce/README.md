# shoply

Demo e-commerce storefront built with Next.js 15, Prisma/Postgres and Stripe
Checkout.

## Quick start

```bash
cp .env.example .env   # fill in Stripe test keys
docker compose up -d db
npx prisma migrate dev
npm run dev
```

Webhooks in dev need the Stripe CLI: `npm run stripe:listen`.
