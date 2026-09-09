"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Longevity, Product } from "@/types";
import { cn, formatPrice } from "@/lib/utils";

const INTENSITY_POSITION: Record<Longevity, number> = {
  light: 0.08,
  moderate: 0.38,
  "long-lasting": 0.68,
  eternal: 0.94,
};

const INTENSITY_LABEL: Record<Longevity, string> = {
  light: "Light",
  moderate: "Light – Moderate",
  "long-lasting": "Moderate – Intense",
  eternal: "Intense – Eternal",
};

function wrappedOffset(i: number, index: number, n: number) {
  let offset = i - index;
  if (offset > n / 2) offset -= n;
  if (offset < -n / 2) offset += n;
  return offset;
}

const SLOTS: Record<number, { x: number; scale: number; opacity: number; z: number }> = {
  0: { x: 0, scale: 1, opacity: 1, z: 30 },
  1: { x: 150, scale: 0.72, opacity: 0.55, z: 20 },
  [-1]: { x: -150, scale: 0.72, opacity: 0.55, z: 20 },
  2: { x: 270, scale: 0.5, opacity: 0.2, z: 10 },
  [-2]: { x: -270, scale: 0.5, opacity: 0.2, z: 10 },
};

function slotFor(offset: number) {
  if (SLOTS[offset]) return SLOTS[offset];
  return { x: offset > 0 ? 380 : -380, scale: 0.4, opacity: 0, z: 0 };
}

export default function FeaturedCarousel({ products }: { products: Product[] }) {
  const [index, setIndex] = useState(Math.min(2, Math.floor(products.length / 2)));

  if (products.length === 0) return null;

  const n = products.length;
  const active = products[index];
  const pos = INTENSITY_POSITION[active.longevity];

  function go(delta: number) {
    setIndex((i) => (i + delta + n) % n);
  }

  return (
    <section className="container-fluid pb-6 pt-2">
      <motion.div
        animate={{
          background: `radial-gradient(120% 140% at 50% 15%, rgba(200,169,106,${(0.12 + pos * 0.08).toFixed(3)}) 0%, rgba(139,17,32,${(0.05 + pos * 0.22).toFixed(3)}) 55%, rgba(248,245,239,1) 100%)`,
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[2.5rem] px-6 pb-10 pt-12 sm:px-12"
      >
        <p className="mb-8 text-center font-sans text-xs uppercase tracking-[0.3em] text-gold-dark">
          Featured Picks
        </p>

        <div className="relative flex h-[220px] items-center justify-center overflow-hidden sm:h-[260px]">
          {products.map((p, i) => {
            const offset = wrappedOffset(i, index, n);
            const slot = slotFor(offset);
            return (
              <motion.button
                key={p.slug}
                onClick={() => setIndex(i)}
                animate={{ x: slot.x, scale: slot.scale, opacity: slot.opacity, zIndex: slot.z }}
                transition={{ type: "spring", stiffness: 240, damping: 28 }}
                className="absolute flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-white to-cream shadow-[0_20px_50px_rgba(17,17,17,0.12)] sm:h-40 sm:w-40"
                style={{ pointerEvents: offset === 0 ? "none" : "auto" }}
                aria-label={p.name}
              >
                <div className="relative h-24 w-24 sm:h-32 sm:w-32">
                  <Image src={p.image} alt={p.name} fill sizes="160px" className="object-contain" />
                </div>
              </motion.button>
            );
          })}
        </div>

        <div className="mx-auto mt-4 max-w-md text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <p className="font-sans text-xs uppercase tracking-[0.2em] text-ink/40">
                {active.collection || active.category}
              </p>
              <Link href={`/shop/${active.slug}`} className="mt-1 block font-display text-2xl hover:text-cherry">
                {active.name}
              </Link>
              {active.notes.top.length > 0 && (
                <p className="mt-1 font-sans text-sm text-ink/50">{active.notes.top.slice(0, 3).join(", ")}</p>
              )}
              <p className="mt-2 font-display text-lg text-cherry">{formatPrice(active.price)}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mx-auto mt-8 flex max-w-md items-center gap-4">
          <button
            onClick={() => go(-1)}
            aria-label="Previous"
            className="flex shrink-0 items-center gap-1 font-sans text-[10px] uppercase tracking-[0.2em] text-ink/50 hover:text-cherry"
          >
            <ChevronLeft size={14} /> Prev
          </button>

          <div className="relative h-1.5 w-full rounded-full bg-gradient-to-r from-gold to-cherry">
            <AnimatePresence mode="wait">
              <motion.span
                key={active.slug}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute -top-6 -translate-x-1/2 whitespace-nowrap font-sans text-[9px] uppercase tracking-[0.15em] text-ink/40"
                style={{ left: `${pos * 100}%` }}
              >
                {INTENSITY_LABEL[active.longevity]}
              </motion.span>
            </AnimatePresence>
            <motion.span
              animate={{ left: `${pos * 100}%` }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-cherry shadow-[0_2px_8px_rgba(139,17,32,0.4)]"
            />
          </div>

          <button
            onClick={() => go(1)}
            aria-label="Next"
            className="flex shrink-0 items-center gap-1 font-sans text-[10px] uppercase tracking-[0.2em] text-ink/50 hover:text-cherry"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </motion.div>
    </section>
  );
}
