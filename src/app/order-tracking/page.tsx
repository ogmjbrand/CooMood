"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Package, Truck, Home as HomeIcon } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Order Placed", icon: Check },
  { label: "Processing", icon: Package },
  { label: "Shipped", icon: Truck },
  { label: "Delivered", icon: HomeIcon },
];

function OrderTrackingContent() {
  const params = useSearchParams();
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<number | null>(params.get("success") ? 1 : null);

  function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    setResult(orderNumber.trim() ? 2 : 0);
  }

  return (
    <>
      <PageHero eyebrow="Order Status" title="Track Your Order" />
      <div className="container-fluid max-w-2xl pb-24">
        {params.get("success") && (
          <p className="mb-8 rounded-2xl bg-gold/10 p-5 font-sans text-sm text-gold-dark">
            Thank you — your order has been placed successfully.
          </p>
        )}
        <form onSubmit={handleTrack} className="flex flex-col gap-4 sm:flex-row">
          <input
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Order number (e.g. CM-10432)"
            className="w-full rounded-full border border-ink/15 px-5 py-3.5 font-sans text-sm focus:border-gold focus:outline-none"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            type="email"
            className="w-full rounded-full border border-ink/15 px-5 py-3.5 font-sans text-sm focus:border-gold focus:outline-none"
          />
          <button className="shrink-0 rounded-full bg-ink px-8 py-3.5 font-sans text-xs uppercase tracking-wide text-cream">
            Track
          </button>
        </form>

        {result !== null && (
          <div className="mt-14">
            {result === 0 ? (
              <p className="font-sans text-sm text-cherry">
                We couldn&apos;t find that order. Double check the order number and email.
              </p>
            ) : (
              <div className="flex items-center justify-between">
                {STEPS.map((step, i) => (
                  <div key={step.label} className="flex flex-1 flex-col items-center text-center">
                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-full border-2",
                        i <= result ? "border-gold bg-gold text-ink" : "border-ink/15 text-ink/30"
                      )}
                    >
                      <step.icon size={18} />
                    </div>
                    <p className="mt-3 font-sans text-xs text-ink/60">{step.label}</p>
                    {i < STEPS.length - 1 && (
                      <div
                        className={cn(
                          "absolute mt-6 h-[2px] w-full translate-x-1/2",
                          i < result ? "bg-gold" : "bg-ink/10"
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={null}>
      <OrderTrackingContent />
    </Suspense>
  );
}
