import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Creates a Stripe Checkout Session from the cart and records a PENDING
// order keyed by the session id. The webhook flips it to PAID.
export async function POST(req: Request) {
  const { items } = await req.json();
  // ... build line_items from DB prices (never trust client prices)
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [],
    success_url: `${process.env.NEXT_PUBLIC_URL}/orders/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
  });
  return NextResponse.json({ url: session.url });
}
