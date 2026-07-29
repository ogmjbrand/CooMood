"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Gift,
  Heart,
  LogOut,
  MapPin,
  Package,
  Repeat,
  Sparkles,
  User,
} from "lucide-react";
import type { Address, Customer, Order, Product } from "@/types";
import { useWishlistStore } from "@/lib/store/wishlist";
import { createClient } from "@/lib/supabase/client";
import { cn, formatPrice } from "@/lib/utils";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "orders", label: "Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "subscriptions", label: "Subscriptions", icon: Repeat },
  { id: "rewards", label: "Rewards & Referral", icon: Gift },
  { id: "saved", label: "Saved Fragrances", icon: Sparkles },
] as const;

export default function AccountDashboard({
  customer,
  addresses,
  orders,
  products,
}: {
  customer: Customer;
  addresses: Address[];
  orders: Order[];
  products: Product[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("profile");
  const wishlistSlugs = useWishlistStore((s) => s.slugs);
  const wishlistProducts = products.filter((p) => wishlistSlugs.includes(p.slug));

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
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
        <button
          onClick={handleSignOut}
          className="flex shrink-0 items-center gap-3 rounded-2xl px-4 py-3 font-sans text-sm text-cherry transition-colors hover:bg-cherry/5 lg:w-full"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </nav>

      <div className="rounded-[2rem] bg-white p-8">
        {tab === "profile" && <ProfileTab customer={customer} />}
        {tab === "orders" && <OrdersTab orders={orders} />}
        {tab === "wishlist" && <WishlistTab products={wishlistProducts} />}
        {tab === "addresses" && <AddressesTab customerId={customer.id} initialAddresses={addresses} />}

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
              <p className="mt-4 font-display text-4xl text-gold-dark">{customer.rewardsPoints} pts</p>
            </div>
            <div className="border-t border-ink/10 pt-6">
              <h3 className="font-display text-xl">Referral Program</h3>
              <p className="mt-2 font-sans text-sm text-ink/50">
                Share your link — give 15%, get 15%.
              </p>
              <div className="mt-3 flex gap-2">
                <input
                  readOnly
                  value={`coomood.com/r/${customer.referralCode}`}
                  className="w-full rounded-full border border-ink/15 px-4 py-2.5 font-sans text-xs"
                />
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(`coomood.com/r/${customer.referralCode}`)
                  }
                  className="shrink-0 rounded-full bg-gold px-4 py-2.5 font-sans text-xs uppercase tracking-wide text-ink"
                >
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
  );
}

function ProfileTab({ customer }: { customer: Customer }) {
  const [fullName, setFullName] = useState(customer.fullName);
  const [phone, setPhone] = useState(customer.phone);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function handleSave() {
    setStatus("saving");
    const supabase = createClient();
    const { error } = await supabase
      .from("customers")
      .update({ full_name: fullName, phone })
      .eq("id", customer.id);
    setStatus(error ? "error" : "saved");
  }

  return (
    <div className="max-w-md space-y-4">
      <h2 className="font-display text-2xl">Profile</h2>
      <Field label="Full Name" value={fullName} onChange={setFullName} placeholder="Your name" />
      <Field label="Email" value={customer.email} disabled />
      <Field label="Phone" value={phone} onChange={setPhone} placeholder="+1 (___) ___-____" />
      <button
        onClick={handleSave}
        disabled={status === "saving"}
        className="rounded-full bg-ink px-6 py-3 font-sans text-xs uppercase tracking-wide text-cream disabled:opacity-50"
      >
        {status === "saving" ? "Saving…" : "Save Changes"}
      </button>
      {status === "saved" && <p className="font-sans text-xs text-gold-dark">Saved.</p>}
      {status === "error" && <p className="font-sans text-xs text-cherry">Something went wrong.</p>}
    </div>
  );
}

function OrdersTab({ orders }: { orders: Order[] }) {
  return (
    <div>
      <h2 className="mb-6 font-display text-2xl">Order History</h2>
      {orders.length === 0 ? (
        <p className="font-sans text-sm text-ink/50">
          No orders yet. Browse the{" "}
          <Link href="/shop" className="underline">
            shop
          </Link>
          .
        </p>
      ) : (
        <div className="divide-y divide-ink/10">
          {orders.map((o) => (
            <div key={o.id} className="flex items-center justify-between py-4 font-sans text-sm">
              <div>
                <p className="font-medium text-ink">{o.orderNumber}</p>
                <p className="text-ink/45">{new Date(o.createdAt).toLocaleDateString()}</p>
              </div>
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-xs capitalize",
                  o.status === "delivered" ? "bg-gold/15 text-gold-dark" : "bg-cherry/10 text-cherry"
                )}
              >
                {o.status}
              </span>
              <span>{formatPrice(o.total)}</span>
              <Link href="/order-tracking" className="text-xs uppercase tracking-wide text-ink/50 underline">
                Track
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function WishlistTab({ products }: { products: Product[] }) {
  return (
    <div>
      <h2 className="mb-6 font-display text-2xl">Wishlist</h2>
      {products.length === 0 ? (
        <p className="font-sans text-sm text-ink/50">
          Nothing saved yet. Browse the{" "}
          <Link href="/shop" className="underline">
            shop
          </Link>
          .
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
          {products.map((p) => (
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
  );
}

function AddressesTab({
  customerId,
  initialAddresses,
}: {
  customerId: string;
  initialAddresses: Address[];
}) {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    line1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
  });

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createClient();
    const { data, error } = await supabase
      .from("addresses")
      .insert({
        customer_id: customerId,
        full_name: form.fullName,
        line1: form.line1,
        city: form.city,
        state: form.state,
        postal_code: form.postalCode,
        country: form.country,
        is_default: addresses.length === 0,
      })
      .select("id, label, full_name, line1, line2, city, state, postal_code, country, phone, is_default")
      .single();
    if (!error && data) {
      setAddresses((prev) => [
        ...prev,
        {
          id: data.id,
          label: data.label ?? "",
          fullName: data.full_name,
          line1: data.line1,
          line2: data.line2 ?? "",
          city: data.city,
          state: data.state ?? "",
          postalCode: data.postal_code,
          country: data.country,
          phone: data.phone ?? "",
          isDefault: data.is_default,
        },
      ]);
      setForm({ fullName: "", line1: "", city: "", state: "", postalCode: "", country: "US" });
      setAdding(false);
    }
  }

  async function handleDelete(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("addresses").delete().eq("id", id);
    if (!error) setAddresses((prev) => prev.filter((a) => a.id !== id));
  }

  return (
    <div className="max-w-md space-y-4">
      <h2 className="font-display text-2xl">Addresses</h2>
      {addresses.length === 0 && !adding && (
        <p className="font-sans text-sm text-ink/50">No saved addresses yet.</p>
      )}
      <div className="space-y-3">
        {addresses.map((a) => (
          <div key={a.id} className="rounded-2xl border border-ink/10 p-4 font-sans text-sm">
            <p className="font-medium text-ink">{a.fullName}</p>
            <p className="text-ink/60">
              {a.line1}, {a.city} {a.state} {a.postalCode}, {a.country}
            </p>
            <button
              onClick={() => handleDelete(a.id)}
              className="mt-2 text-xs uppercase tracking-wide text-cherry underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {adding ? (
        <form onSubmit={handleAdd} className="space-y-3 rounded-2xl border border-ink/10 p-4">
          <Field label="Full Name" value={form.fullName} onChange={(v) => setForm((f) => ({ ...f, fullName: v }))} required />
          <Field label="Address" value={form.line1} onChange={(v) => setForm((f) => ({ ...f, line1: v }))} required />
          <div className="grid grid-cols-2 gap-3">
            <Field label="City" value={form.city} onChange={(v) => setForm((f) => ({ ...f, city: v }))} required />
            <Field label="State" value={form.state} onChange={(v) => setForm((f) => ({ ...f, state: v }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Postal Code"
              value={form.postalCode}
              onChange={(v) => setForm((f) => ({ ...f, postalCode: v }))}
              required
            />
            <Field label="Country" value={form.country} onChange={(v) => setForm((f) => ({ ...f, country: v }))} />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-full bg-ink px-6 py-3 font-sans text-xs uppercase tracking-wide text-cream"
            >
              Save Address
            </button>
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="rounded-full border border-ink/15 px-6 py-3 font-sans text-xs uppercase tracking-wide"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="rounded-full border border-ink/15 px-6 py-3 font-sans text-xs uppercase tracking-wide"
        >
          Add New Address
        </button>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled,
  ...props
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-sans text-xs uppercase tracking-wide text-ink/50">
        {label}
      </span>
      <input
        {...props}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded-xl border border-ink/15 px-4 py-3 font-sans text-sm focus:border-gold focus:outline-none disabled:bg-ink/5 disabled:text-ink/40"
      />
    </label>
  );
}
