"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";
import { LinkButton } from "@/components/ui/Button";

export default function CartPage() {
  const { lines, removeLine, updateQuantity, subtotal } = useCartStore();
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState<string | null>(null);
  const [zip, setZip] = useState("");
  const [shipping, setShipping] = useState<number | null>(null);

  const discount = applied === "COOMOOD15" ? subtotal() * 0.15 : 0;
  const total = subtotal() - discount + (shipping ?? 0);

  return (
    <>
      <PageHero eyebrow="Your Bag" title="Shopping Cart" />
      <div className="container-fluid grid grid-cols-1 gap-12 pb-24 lg:grid-cols-[1fr_380px]">
        <div>
          {lines.length === 0 ? (
            <div className="flex flex-col items-center gap-6 rounded-[2rem] bg-white py-24 text-center">
              <p className="font-display text-2xl text-ink/50">Your bag is empty.</p>
              <LinkButton href="/shop">Shop Collection</LinkButton>
            </div>
          ) : (
            <ul className="divide-y divide-ink/10 rounded-[2rem] bg-white px-6">
              {lines.map((line) => (
                <li key={line.id} className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center">
                  <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-cream">
                    <Image src={line.image} alt={line.name} fill className="object-cover" sizes="96px" />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <p className="font-display text-lg">{line.name}</p>
                    <p className="font-sans text-xs text-ink/50">{line.size}</p>
                    {line.custom && (
                      <span className="w-fit rounded-full bg-gold/20 px-2 py-0.5 font-sans text-[10px] uppercase tracking-wide text-gold-dark">
                        Custom
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 rounded-full border border-ink/10 px-3 py-2">
                    <button onClick={() => updateQuantity(line.id, line.quantity - 1)} aria-label="Decrease">
                      <Minus size={13} />
                    </button>
                    <span className="w-5 text-center font-sans text-sm">{line.quantity}</span>
                    <button onClick={() => updateQuantity(line.id, line.quantity + 1)} aria-label="Increase">
                      <Plus size={13} />
                    </button>
                  </div>
                  <span className="w-24 text-right font-sans text-sm">
                    {formatPrice(line.price * line.quantity)}
                  </span>
                  <button
                    onClick={() => removeLine(line.id)}
                    aria-label="Remove"
                    className="text-ink/30 hover:text-cherry"
                  >
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <aside className="h-fit space-y-6 rounded-[2rem] bg-ink p-8 text-cream">
            <h2 className="font-display text-2xl">Order Summary</h2>

            <div className="space-y-3 font-sans text-sm">
              <div className="flex justify-between text-cream/70">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal())}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-gold-light">
                  <span>Discount ({applied})</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-cream/70">
                <span>Shipping</span>
                <span>{shipping === null ? "Calculated below" : formatPrice(shipping)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="ZIP / postal code"
                className="w-full rounded-full border border-cream/20 bg-cream/10 px-4 py-2.5 font-sans text-xs placeholder:text-cream/40 focus:outline-none"
              />
              <button
                onClick={() => setShipping(zip ? (subtotal() > 150 ? 0 : 9.5) : null)}
                className="shrink-0 rounded-full bg-cream/10 px-4 py-2.5 font-sans text-xs uppercase tracking-wide hover:bg-cream/20"
              >
                Estimate
              </button>
            </div>

            <div className="flex gap-2">
              <input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Coupon code"
                className="w-full rounded-full border border-cream/20 bg-cream/10 px-4 py-2.5 font-sans text-xs placeholder:text-cream/40 focus:outline-none"
              />
              <button
                onClick={() => setApplied(coupon.toUpperCase())}
                className="shrink-0 rounded-full bg-gold px-4 py-2.5 font-sans text-xs uppercase tracking-wide text-ink hover:bg-gold-dark hover:text-cream"
              >
                Apply
              </button>
            </div>
            <p className="font-sans text-[11px] text-cream/40">Try COOMOOD15 for 15% off.</p>

            <div className="flex justify-between border-t border-cream/15 pt-4 font-display text-xl">
              <span>Total</span>
              <span>{formatPrice(Math.max(total, 0))}</span>
            </div>

            <Link
              href="/checkout"
              className="block w-full rounded-full bg-cherry py-4 text-center font-sans text-xs uppercase tracking-[0.15em] text-cream transition-all hover:scale-[1.02] hover:bg-cherry-light"
            >
              Proceed to Checkout
            </Link>
          </aside>
        )}
      </div>
    </>
  );
}
