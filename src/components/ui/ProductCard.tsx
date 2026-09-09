"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/types";
import { cn, formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import StarRating from "./StarRating";

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const addLine = useCartStore((s) => s.addLine);
  const wishlisted = useWishlistStore((s) => s.has(product.slug));
  const toggleWishlist = useWishlistStore((s) => s.toggle);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex flex-col"
    >
      <Link
        href={`/shop/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden rounded-3xl bg-white"
      >
        <Image
          src={product.gallery[1] ?? product.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className={cn(
            "object-cover transition-all duration-700",
            hovered ? "scale-105 opacity-100" : "scale-100 opacity-0"
          )}
        />
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className={cn(
            "object-cover transition-all duration-700",
            hovered ? "scale-110 opacity-0" : "scale-100 opacity-100"
          )}
        />

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.new && (
            <span className="rounded-full bg-cherry px-3 py-1 font-sans text-[10px] uppercase tracking-wide text-cream">
              New
            </span>
          )}
          {product.bestseller && (
            <span className="rounded-full bg-gold px-3 py-1 font-sans text-[10px] uppercase tracking-wide text-ink">
              Bestseller
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.slug);
          }}
          aria-label="Toggle wishlist"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-ink backdrop-blur transition-transform hover:scale-110"
        >
          <Heart size={15} className={wishlisted ? "fill-cherry text-cherry" : ""} />
        </button>

        <div
          className={cn(
            "absolute inset-x-3 bottom-3 transition-all duration-300",
            hovered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          )}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              if (added) return;
              addLine({
                slug: product.slug,
                name: product.name,
                image: product.image,
                price: product.price,
                size: product.size,
                quantity: 1,
              });
              setAdded(true);
              setTimeout(() => setAdded(false), 1800);
            }}
            className={cn(
              "flex w-full items-center justify-center gap-2 overflow-hidden rounded-full py-3 font-sans text-[11px] uppercase tracking-wide backdrop-blur transition-colors duration-300",
              added ? "bg-emerald-600 text-white" : "bg-cherry/95 text-cream hover:bg-cherry"
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.span
                  key="added"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <Check size={13} /> Added
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <ShoppingBag size={13} /> Quick Add
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </Link>

      <Link href={`/shop/${product.slug}`} className="mt-4 flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg leading-tight">{product.name}</h3>
          <span className="whitespace-nowrap font-sans text-sm text-ink/80">
            {formatPrice(product.price)}
          </span>
        </div>
        <p className="font-sans text-xs uppercase tracking-wide text-ink/40">
          {product.collection} &middot; {product.size}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <StarRating rating={product.rating} size={12} />
          <span className="font-sans text-[11px] text-ink/40">({product.reviewCount})</span>
        </div>
      </Link>
    </motion.div>
  );
}
