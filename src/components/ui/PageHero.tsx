"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function PageHero({
  eyebrow,
  title,
  description,
  dark = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "flex min-h-[42vh] items-center pb-16 pt-36",
        dark ? "bg-ink text-cream" : "bg-cream text-ink",
        className
      )}
    >
      <div className="container-fluid">
        {eyebrow && (
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "mb-4 block font-sans text-xs uppercase tracking-[0.3em]",
              dark ? "text-gold-light" : "text-gold-dark"
            )}
          >
            {eyebrow}
          </motion.span>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-5xl leading-[1.02] sm:text-6xl md:text-7xl"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={cn(
              "mt-6 max-w-xl font-sans text-base leading-relaxed",
              dark ? "text-cream/65" : "text-ink/60"
            )}
          >
            {description}
          </motion.p>
        )}
      </div>
    </section>
  );
}
