import { NextResponse } from "next/server";
import { z } from "zod";
import { getStripe } from "@/lib/stripe";

const lineSchema = z.object({
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  image: z.string().optional(),
});

const bodySchema = z.object({
  lines: z.array(lineSchema).min(1),
  email: z.string().email().optional(),
});

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = bodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid cart payload." }, { status: 400 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      {
        error:
          "Stripe is not configured for this environment. Set STRIPE_SECRET_KEY to enable live checkout.",
      },
      { status: 501 }
    );
  }

  const origin = request.headers.get("origin") ?? "https://coomood.com";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: parsed.data.email,
    line_items: parsed.data.lines.map((line) => ({
      quantity: line.quantity,
      price_data: {
        currency: "usd",
        unit_amount: Math.round(line.price * 100),
        product_data: {
          name: line.name,
          images: line.image ? [line.image] : undefined,
        },
      },
    })),
    shipping_address_collection: { allowed_countries: ["US", "CA", "GB", "AU"] },
    success_url: `${origin}/order-tracking?success=1`,
    cancel_url: `${origin}/checkout`,
  });

  return NextResponse.json({ url: session.url });
}
