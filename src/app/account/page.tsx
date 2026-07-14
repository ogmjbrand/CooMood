"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Gift,
  Heart,
  MapPin,
  Package,
  Repeat,
  Sparkles,
  User,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import { useWishlistStore } from "@/lib/store/wishlist";
import { products } from "@/data/products";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "orders", label: "Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "subscriptions", label: "Subscriptions", icon: Repeat },
  { id: "rewards", label: "Rewards & Referral", icon: Gift },
  { id: "saved", label: "Saved Fragrances", icon: Sparkles },
] as const;

const mockOrders = [
  { id: "CM-10432", date: "Jun 28, 2026", status: "Delivered", total: "$265.00" },
  { id: "CM-10318", date: "May 14, 2026", status: "Shipped", total: "$120.00" },
  { id: "CM-10201", date: "Apr 02, 2026", status: "Delivered", total: "$320.00" },
];

export default function AccountPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("profile");
  const wishlistSlugs = useWishlistStore((s) => s.slugs);
  const wishlistProducts = products.filter((p) => wishlistSlugs.includes(p.slug));

  return (
    <>
      <PageHero eyebrow="My Account" title="Welcome Back" />
      <div className="container-fluid grid grid-cols-1 gap-10 pb-24 lg:grid-cols-[260px_1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 font-sans text-sm transition-colors lg:w-full",
                tab === t.id ? "bg-ink text-cream" : "text-ink/60 hover:bg-ink/5"
              )}
            >
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </nav>

        <div className="rounded-[2rem] bg-white p-8">
          {tab === "profile" && (
            <div className="max-w-md space-y-4">
              <h2 className="font-display text-2xl">Profile</h2>
              <Field label="Full Name" defaultValue="" placeholder="Your name" />
              <Field label="Email" defaultValue="" placeholder="you@example.com" />
              <Field label="Phone" defaultValue="" placeholder="+1 (___) ___-____" />
              <button className="rounded-full bg-ink px-6 py-3 font-sans text-xs uppercase tracking-wide text-cream">
                Save Changes
              </button>
            </div>
          )}

          {tab === "orders" && (
            <div>
              <h2 className="mb-6 font-display text-2xl">Order History</h2>
              <div className="divide-y divide-ink/10">
                {mockOrders.map((o) => (
                  <div key={o.id} className="flex items-center justify-between py-4 font-sans text-sm">
                    <div>
                      <p className="font-medium text-ink">{o.id}</p>
                      <p className="text-ink/45">{o.date}</p>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs",
                        o.status === "Delivered" ? "bg-gold/15 text-gold-dark" : "bg-cherry/10 text-cherry"
                      )}
                    >
                      {o.status}
                    </span>
                    <span>{o.total}</span>
                    <Link href="/order-tracking" className="text-xs uppercase tracking-wide text-ink/50 underline">
                      Track
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "wishlist" && (
            <div>
              <h2 className="mb-6 font-display text-2xl">Wishlist</h2>
              {wishlistProducts.length === 0 ? (
                <p className="font-sans text-sm text-ink/50">
                  Nothing saved yet. Browse the <Link href="/shop" className="underline">shop</Link>.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                  {wishlistProducts.map((p) => (
                    <Link key={p.slug} href={`/shop/${p.slug}`} className="group">
                      <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream">
                        <Image src={p.image} alt={p.name} fill className="object-cover" sizes="200px" />
                      </div>
                      <p className="mt-2 font-sans text-sm">{p.name}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "addresses" && (
            <div className="max-w-md space-y-4">
              <h2 className="font-display text-2xl">Addresses</h2>
              <p className="font-sans text-sm text-ink/50">No saved addresses yet.</p>
              <button className="rounded-full border border-ink/15 px-6 py-3 font-sans text-xs uppercase tracking-wide">
                Add New Address
              </button>
            </div>
          )}

          {tab === "subscriptions" && (
            <div className="max-w-md space-y-4">
              <h2 className="font-display text-2xl">Subscriptions</h2>
              <p className="font-sans text-sm text-ink/50">
                Subscribe to your favorite fragrance and never run out. No active subscriptions yet.
              </p>
              <Link
                href="/shop"
                className="inline-block rounded-full bg-ink px-6 py-3 font-sans text-xs uppercase tracking-wide text-cream"
              >
                Start a Subscription
              </Link>
            </div>
          )}

          {tab === "rewards" && (
            <div className="max-w-md space-y-6">
              <div>
                <h2 className="font-display text-2xl">Rewards</h2>
                <p className="mt-2 font-sans text-sm text-ink/50">
                  Earn 1 point per $1 spent. 200 points = $10 off.
                </p>
                <p className="mt-4 font-display text-4xl text-gold-dark">0 pts</p>
              </div>
              <div className="border-t border-ink/10 pt-6">
                <h3 className="font-display text-xl">Referral Program</h3>
                <p className="mt-2 font-sans text-sm text-ink/50">
                  Share your link — give 15%, get 15%.
                </p>
                <div className="mt-3 flex gap-2">
                  <input
                    readOnly
                    value="coomood.com/r/yourname"
                    className="w-full rounded-full border border-ink/15 px-4 py-2.5 font-sans text-xs"
                  />
                  <button className="shrink-0 rounded-full bg-gold px-4 py-2.5 font-sans text-xs uppercase tracking-wide text-ink">
                    Copy
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === "saved" && (
            <div>
              <h2 className="mb-3 font-display text-2xl">Saved Fragrances</h2>
              <p className="font-sans text-sm text-ink/50">
                Custom blends you build are saved here for easy reordering.{" "}
                <Link href="/custom-scent-builder" className="underline">
                  Build your first one.
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Field({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-sans text-xs uppercase tracking-wide text-ink/50">
        {label}
      </span>
      <input
        {...props}
        className="w-full rounded-xl border border-ink/15 px-4 py-3 font-sans text-sm focus:border-gold focus:outline-none"
      />
    </label>
  );
}
