"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Minus, Plus, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import type { Product } from "@/types";
import { products as allProducts } from "@/data/products";
import { formatPrice, cn } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { useRecentlyViewedStore } from "@/lib/store/recentlyViewed";
import ProductGallery from "./ProductGallery";
import StarRating from "@/components/ui/StarRating";
import ProductCard from "@/components/ui/ProductCard";

const TABS = ["Description", "Notes", "Ingredients & Longevity", "Reviews"] as const;

export default function ProductDetail({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Description");
  const [showSticky, setShowSticky] = useState(false);
  const addLine = useCartStore((s) => s.addLine);
  const wishlisted = useWishlistStore((s) => s.has(product.slug));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const addRecentlyViewed = useRecentlyViewedStore((s) => s.add);
  const recentSlugs = useRecentlyViewedStore((s) => s.slugs);
  const recentlyViewedProducts = recentSlugs
    .filter((slug) => slug !== product.slug)
    .map((slug) => allProducts.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p))
    .slice(0, 4);

  useEffect(() => {
    addRecentlyViewed(product.slug);
  }, [product.slug, addRecentlyViewed]);

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 640);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleAddToCart() {
    addLine({
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: product.price,
      size: product.size,
      quantity,
    });
  }

  return (
    <div className="pt-28">
      <div className="container-fluid grid grid-cols-1 gap-14 py-10 lg:grid-cols-2">
        <ProductGallery images={product.gallery.length ? product.gallery : [product.image]} name={product.name} />

        <div>
          <p className="font-sans text-xs uppercase tracking-[0.25em] text-gold-dark">
            {product.collection} Collection
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            <StarRating rating={product.rating} />
            <span className="font-sans text-sm text-ink/50">{product.reviewCount} reviews</span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-3xl">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="font-sans text-lg text-ink/35 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            <span className="font-sans text-xs uppercase tracking-wide text-ink/40">{product.size}</span>
          </div>

          <p className="mt-6 max-w-lg font-sans text-sm leading-relaxed text-ink/65">
            {product.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {product.mood.map((m) => (
              <span
                key={m}
                className="rounded-full border border-gold/40 px-3 py-1 font-sans text-[11px] capitalize text-gold-dark"
              >
                {m}
              </span>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center gap-4 rounded-full border border-ink/15 px-4 py-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="w-4 text-center font-sans text-sm">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} aria-label="Increase quantity">
                <Plus size={14} />
              </button>
            </div>
            <button
              onClick={() => toggleWishlist(product.slug)}
              aria-label="Toggle wishlist"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/15 hover:border-cherry hover:text-cherry"
            >
              <Heart size={18} className={wishlisted ? "fill-cherry text-cherry" : ""} />
            </button>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleAddToCart}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ink py-4 font-sans text-xs uppercase tracking-[0.15em] text-cream transition-transform hover:scale-[1.01]"
            >
              <ShoppingBag size={15} /> Add to Cart
            </button>
            <Link
              href="/checkout"
              onClick={handleAddToCart}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gold py-4 font-sans text-xs uppercase tracking-[0.15em] text-ink transition-transform hover:scale-[1.01]"
            >
              Buy Now
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-ink/10 pt-6 font-sans text-xs text-ink/60">
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-gold-dark" /> Free shipping over $150
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-gold-dark" /> 30-day returns
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid py-10">
        <div className="flex flex-wrap gap-2 border-b border-ink/10">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "-mb-px border-b-2 px-4 py-3 font-sans text-xs uppercase tracking-wide transition-colors",
                tab === t ? "border-gold text-ink" : "border-transparent text-ink/40 hover:text-ink/70"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl py-10 font-sans text-sm leading-relaxed text-ink/70"
        >
          {tab === "Description" && <p>{product.story}</p>}
          {tab === "Notes" && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <NoteBlock label="Top" notes={product.notes.top} />
              <NoteBlock label="Middle" notes={product.notes.middle} />
              <NoteBlock label="Base" notes={product.notes.base} />
            </div>
          )}
          {tab === "Ingredients & Longevity" && (
            <ul className="space-y-2">
              <li>
                <strong className="text-ink">Longevity:</strong> {product.longevity}
              </li>
              <li>
                <strong className="text-ink">Gender:</strong> {product.gender}
              </li>
              <li>
                <strong className="text-ink">Best season:</strong> {product.season.join(", ")}
              </li>
              <li>
                <strong className="text-ink">Occasion:</strong> {product.occasion.join(", ")}
              </li>
              <li>
                <strong className="text-ink">Ingredients:</strong> Alcohol Denat., Parfum (Fragrance),
                Aqua, Limonene, Linalool. Formulated without phthalates or parabens.
              </li>
            </ul>
          )}
          {tab === "Reviews" && (
            <p>
              {product.reviewCount} verified buyers rated this fragrance an average of{" "}
              {product.rating.toFixed(1)} / 5. Full review moderation available in the CooMood CMS.
            </p>
          )}
        </motion.div>
      </div>

      {related.length > 0 && (
        <div className="container-fluid py-16">
          <h2 className="mb-10 font-display text-3xl">You May Also Love</h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        </div>
      )}

      {recentlyViewedProducts.length > 0 && (
        <div className="container-fluid pb-24">
          <h2 className="mb-10 font-display text-3xl">Recently Viewed</h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {recentlyViewedProducts.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        </div>
      )}

      <motion.div
        initial={{ y: 100 }}
        animate={{ y: showSticky ? 0 : 100 }}
        transition={{ type: "spring", damping: 26, stiffness: 260 }}
        className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-cream/95 backdrop-blur"
      >
        <div className="container-fluid flex items-center justify-between gap-4 py-4">
          <div>
            <p className="font-display text-lg">{product.name}</p>
            <p className="font-sans text-sm text-ink/60">{formatPrice(product.price)}</p>
          </div>
          <button
            onClick={handleAddToCart}
            className="rounded-full bg-ink px-8 py-3.5 font-sans text-xs uppercase tracking-wide text-cream"
          >
            Add to Cart
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function NoteBlock({ label, notes }: { label: string; notes: string[] }) {
  return (
    <div>
      <p className="mb-2 font-sans text-xs uppercase tracking-[0.2em] text-gold-dark">{label} Notes</p>
      <ul className="space-y-1">
        {notes.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </div>
  );
}
