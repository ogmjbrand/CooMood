"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";

export default function CartPill() {
  const lines = useCartStore((s) => s.lines);
  const isOpen = useCartStore((s) => s.isOpen);
  const openCart = useCartStore((s) => s.open);
  const count = lines.reduce((sum, l) => sum + l.quantity, 0);

  const thumbnails = lines
    .slice()
    .reverse()
    .reduce<{ id: string; image: string }[]>((acc, l) => {
      if (acc.length < 3 && !acc.some((t) => t.image === l.image)) {
        acc.push({ id: l.id, image: l.image });
      }
      return acc;
    }, []);

  return (
    <AnimatePresence>
      {count > 0 && !isOpen && (
        <motion.button
          key="cart-pill"
          onClick={openCart}
          initial={{ y: 80, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 22, stiffness: 320 }}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-full bg-cherry py-2 pl-2 pr-4 text-cream shadow-[0_12px_40px_rgba(139,17,32,0.35)] sm:bottom-8 sm:right-8"
        >
          <motion.span
            key={count}
            initial={{ scale: 1.25 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 400 }}
            className="relative flex h-9 items-center"
          >
            {thumbnails.length > 0 ? (
              <span className="flex items-center -space-x-3">
                {thumbnails.map((t) => (
                  <span
                    key={t.id}
                    className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-cherry bg-white"
                  >
                    <Image src={t.image} alt="" fill sizes="36px" className="object-cover" />
                  </span>
                ))}
              </span>
            ) : (
              <ShoppingBag size={16} />
            )}
          </motion.span>

          <span className="flex flex-col items-start leading-tight">
            <span className="font-sans text-xs uppercase tracking-wide">View Cart</span>
            <motion.span
              key={`count-${count}`}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-sans text-[11px] text-cream/60"
            >
              {count} {count === 1 ? "item" : "items"}
            </motion.span>
          </span>

          <ChevronRight size={16} className="text-cream/70" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
