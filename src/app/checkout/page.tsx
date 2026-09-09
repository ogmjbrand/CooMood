"use client";

import Image from "next/image";
import { useState } from "react";
import { Lock } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";

const PAYMENT_METHODS = ["Card", "Apple Pay", "Google Pay", "PayPal"] as const;

export default function CheckoutPage() {
  const { lines, subtotal } = useCartStore();
  const [payment, setPayment] = useState<(typeof PAYMENT_METHODS)[number]>("Card");
  const [giftWrap, setGiftWrap] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "unavailable">("idle");
  const [message, setMessage] = useState("");

  const shipping = subtotal() > 150 || lines.length === 0 ? 0 : 9.5;
  const giftWrapFee = giftWrap ? 8 : 0;
  const tax = subtotal() * 0.0825;
  const total = subtotal() + shipping + giftWrapFee + tax;

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: lines.map((l) => ({
            name: l.name,
            price: l.price,
            quantity: l.quantity,
            image: l.image,
          })),
        }),
      });
      const data = await res.json();
      if (res.status === 501) {
        setStatus("unavailable");
        setMessage(data.error);
        return;
      }
      if (!res.ok || !data.url) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <>
      <PageHero eyebrow="Secure Checkout" title="Checkout" />
      <div className="container-fluid grid grid-cols-1 gap-12 pb-24 lg:grid-cols-[1.4fr_1fr]">
        <form onSubmit={handlePlaceOrder} className="space-y-10">
          <section>
            <h2 className="mb-4 font-display text-2xl">Contact & Shipping</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Email" type="email" required />
              <Input label="Phone" type="tel" />
              <Input label="First Name" required />
              <Input label="Last Name" required />
              <Input label="Address" className="sm:col-span-2" required />
              <Input label="City" required />
              <Input label="State" required />
              <Input label="ZIP Code" required />
              <Input label="Country" required defaultValue="United States" />
            </div>
          </section>

          <section>
            <h2 className="mb-4 font-display text-2xl">Payment Method</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {PAYMENT_METHODS.map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setPayment(m)}
                  className={`rounded-2xl border px-4 py-4 font-sans text-sm transition-colors ${
                    payment === m ? "border-gold bg-gold/10" : "border-ink/10 hover:border-ink/30"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            {payment === "Card" && (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Card Number" className="sm:col-span-2" placeholder="4242 4242 4242 4242" />
                <Input label="Expiry" placeholder="MM / YY" />
                <Input label="CVC" placeholder="123" />
              </div>
            )}
          </section>

          <label className="flex items-center gap-3 font-sans text-sm text-ink/70">
            <input
              type="checkbox"
              checked={giftWrap}
              onChange={(e) => setGiftWrap(e.target.checked)}
              className="h-4 w-4 accent-gold"
            />
            Add luxury gift wrap + ribbon (+{formatPrice(8)})
          </label>

          <button
            type="submit"
            disabled={lines.length === 0 || status === "loading"}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-cherry py-4 font-sans text-xs uppercase tracking-[0.15em] text-cream transition-all hover:scale-[1.01] hover:bg-cherry-light disabled:opacity-40"
          >
            <Lock size={14} />
            {status === "loading" ? "Processing..." : `Place Order — ${formatPrice(Math.max(total, 0))}`}
          </button>

          {status === "unavailable" && (
            <p className="rounded-2xl bg-gold/10 p-4 font-sans text-xs text-gold-dark">{message}</p>
          )}
          {status === "error" && (
            <p className="rounded-2xl bg-cherry/10 p-4 font-sans text-xs text-cherry">{message}</p>
          )}
        </form>

        <aside className="h-fit space-y-5 rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(17,17,17,0.06)]">
          <h2 className="font-display text-2xl">Your Order</h2>
          <ul className="space-y-4">
            {lines.map((line) => (
              <li key={line.id} className="flex items-center gap-4">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-cream">
                  <Image src={line.image} alt={line.name} fill className="object-cover" sizes="56px" />
                </div>
                <div className="flex-1">
                  <p className="font-sans text-sm">{line.name}</p>
                  <p className="font-sans text-xs text-ink/45">Qty {line.quantity}</p>
                </div>
                <span className="font-sans text-sm">{formatPrice(line.price * line.quantity)}</span>
              </li>
            ))}
            {lines.length === 0 && (
              <p className="font-sans text-sm text-ink/50">Your bag is empty.</p>
            )}
          </ul>
          <div className="space-y-2 border-t border-ink/10 pt-4 font-sans text-sm text-ink/70">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal())}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            {giftWrap && (
              <div className="flex justify-between">
                <span>Gift Wrap</span>
                <span>{formatPrice(giftWrapFee)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Tax</span>
              <span>{formatPrice(tax)}</span>
            </div>
          </div>
          <div className="flex justify-between border-t border-ink/10 pt-4 font-display text-xl">
            <span>Total</span>
            <span>{formatPrice(Math.max(total, 0))}</span>
          </div>
        </aside>
      </div>
    </>
  );
}

function Input({
  label,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-1.5 block font-sans text-xs uppercase tracking-wide text-ink/50">
        {label}
      </span>
      <input
        {...props}
        className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 font-sans text-sm focus:border-gold focus:outline-none"
      />
    </label>
  );
}
