import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    console.error("[stripe webhook] Stripe is not configured (missing keys or webhook secret).");
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 501 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header." }, { status: 400 });
  }

  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error("[stripe webhook] signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  try {
    await recordOrder(stripe, session);
  } catch (error) {
    console.error(`[stripe webhook] failed to record order for session ${session.id}:`, error);
    // Non-2xx tells Stripe to retry the delivery.
    return NextResponse.json({ error: "Failed to record order." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function recordOrder(stripe: Stripe, session: Stripe.Checkout.Session) {
  const supabase = createAdminClient();

  const { data: existingOrder, error: lookupError } = await supabase
    .from("orders")
    .select("id")
    .eq("stripe_checkout_session_id", session.id)
    .maybeSingle();

  if (lookupError) throw lookupError;
  if (existingOrder) return; // already recorded — Stripe retried or delivered the event twice.

  const email = session.customer_details?.email ?? session.customer_email;
  if (!email) throw new Error(`Checkout session ${session.id} has no email on file.`);

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    expand: ["data.price.product"],
    limit: 100,
  });

  const shipping = session.collected_information?.shipping_details;
  const customerId = session.metadata?.customer_id || null;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_id: customerId,
      email,
      status: "processing",
      stripe_checkout_session_id: session.id,
      subtotal: (session.amount_subtotal ?? 0) / 100,
      shipping: (session.total_details?.amount_shipping ?? 0) / 100,
      tax: (session.total_details?.amount_tax ?? 0) / 100,
      discount: (session.total_details?.amount_discount ?? 0) / 100,
      total: (session.amount_total ?? 0) / 100,
      shipping_address: shipping
        ? {
            name: shipping.name,
            line1: shipping.address.line1,
            line2: shipping.address.line2 ?? null,
            city: shipping.address.city ?? null,
            state: shipping.address.state ?? null,
            postal_code: shipping.address.postal_code ?? null,
            country: shipping.address.country,
          }
        : null,
    })
    .select("id")
    .single();

  if (orderError) throw orderError;
  if (!order) throw new Error(`Insert into orders returned no row for session ${session.id}.`);

  const items = lineItems.data.map((item) => {
    const product = item.price?.product;
    const metadata =
      product && typeof product === "object" && "metadata" in product ? product.metadata : null;

    return {
      order_id: order.id,
      product_slug: metadata?.slug || null,
      name: item.description ?? "Item",
      unit_price: (item.price?.unit_amount ?? 0) / 100,
      quantity: item.quantity ?? 1,
      size: metadata?.size || null,
    };
  });

  if (items.length > 0) {
    const { error: itemsError } = await supabase.from("order_items").insert(items);
    if (itemsError) throw itemsError;
  }
}
