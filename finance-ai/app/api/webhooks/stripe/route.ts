import { NextResponse } from "next/server";
import Stripe from "stripe";

export const POST = (request: Request) => {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.error();
  }
  const text = await request.text();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-10-28.acacia",
  });
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.error();
  }
  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET,
  );
  switch (event.type) {
    case "invoice.paid":
      const { custumer, subscription, subscription_details } =
        event.data.object;
        const clearkUserId = subscription_details
  }
};
