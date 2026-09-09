"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const { lines, isOpen, close, removeLine, updateQuantity, subtotal } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[70] bg-ink/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 300 }}
            className="fixed right-0 top-0 z-[80] flex h-full w-full max-w-md flex-col bg-cream shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-6">
              <h2 className="font-display text-2xl">Your Bag ({lines.length})</h2>
              <button
                onClick={close}
                aria-label="Close cart"
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-ink/5"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <p className="font-display text-xl text-ink/50">Your bag is empty.</p>
                  <Link
                    href="/shop"
                    onClick={close}
                    className="rounded-full bg-cherry px-6 py-3 font-sans text-xs uppercase tracking-wide text-cream transition-colors hover:bg-cherry-light"
                  >
                    Shop Collection
                  </Link>
                </div>
              ) : (
                <ul className="space-y-6">
                  {lines.map((line) => (
                    <li key={line.id} className="flex gap-4">
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-white">
                        <Image src={line.image} alt={line.name} fill className="object-cover" sizes="80px" />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-display text-base leading-tight">{line.name}</p>
                            <p className="mt-0.5 font-sans text-xs text-ink/50">{line.size}</p>
                            {line.custom && (
                              <span className="mt-1 inline-block rounded-full bg-gold/20 px-2 py-0.5 font-sans text-[10px] uppercase tracking-wide text-gold-dark">
                                Custom
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => removeLine(line.id)}
                            aria-label="Remove item"
                            className="text-ink/40 hover:text-cherry"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 rounded-full border border-ink/10 px-2 py-1">
                            <button
                              onClick={() => updateQuantity(line.id, line.quantity - 1)}
                              aria-label="Decrease quantity"
                              className="flex h-5 w-5 items-center justify-center"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-4 text-center font-sans text-xs">{line.quantity}</span>
                            <button
                              onClick={() => updateQuantity(line.id, line.quantity + 1)}
                              aria-label="Increase quantity"
                              className="flex h-5 w-5 items-center justify-center"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="font-sans text-sm">
                            {formatPrice(line.price * line.quantity)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-ink/10 px-6 py-6">
                <div className="mb-4 flex items-center justify-between font-sans text-sm">
                  <span className="text-ink/60">Subtotal</span>
                  <span className="text-lg">{formatPrice(subtotal())}</span>
                </div>
                <p className="mb-4 font-sans text-xs text-ink/40">
                  Shipping, taxes, and gift wrap calculated at checkout.
                </p>
                <Link
                  href="/checkout"
                  onClick={close}
                  className="block w-full rounded-full bg-cherry py-4 text-center font-sans text-xs uppercase tracking-[0.15em] text-cream transition-all hover:scale-[1.02] hover:bg-cherry-light"
                >
                  Checkout
                </Link>
                <Link
                  href="/cart"
                  onClick={close}
                  className="mt-3 block w-full rounded-full border border-ink/15 py-4 text-center font-sans text-xs uppercase tracking-[0.15em] text-ink transition-colors hover:bg-ink/5"
                >
                  View Bag
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
