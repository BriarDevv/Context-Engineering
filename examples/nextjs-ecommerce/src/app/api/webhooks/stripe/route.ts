import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// The ONLY code path that mutates order status. Signature-verified.
export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")!;
  const event = stripe.webhooks.constructEvent(
    await req.text(),
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!,
  );
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    await db.order.update({
      where: { stripeSessionId: session.id },
      data: { status: "PAID" },
    });
  }
  return NextResponse.json({ received: true });
}
