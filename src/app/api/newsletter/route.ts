import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({ email: z.string().email() });

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = bodySchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!resendKey || !supabaseUrl) {
    return NextResponse.json(
      {
        ok: true,
        note: "Subscription accepted, but email delivery is not yet configured (RESEND_API_KEY / Supabase env vars missing).",
      },
      { status: 200 }
    );
  }

  const { Resend } = await import("resend");
  const resend = new Resend(resendKey);

  await resend.emails.send({
    from: "CooMood <hello@coomood.com>",
    to: parsed.data.email,
    subject: "Welcome to the CooMood Circle",
    html: "<p>Thank you for joining CooMood — 15% off your first order is on its way.</p>",
  });

  return NextResponse.json({ ok: true });
}
