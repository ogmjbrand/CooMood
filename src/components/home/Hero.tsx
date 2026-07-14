"use client";

import { motion } from "framer-motion";
import ParticleField from "@/components/effects/ParticleField";
import TiltImage from "@/components/effects/TiltImage";
import { LinkButton } from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-cream pt-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 55% at 30% 35%, rgba(200,169,106,0.22) 0%, rgba(248,245,239,0) 70%), radial-gradient(50% 50% at 80% 70%, rgba(139,17,32,0.10) 0%, rgba(248,245,239,0) 70%)",
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-1/4 top-0 h-[140%] w-[80%] opacity-40"
        style={{
          background:
            "conic-gradient(from 90deg at 50% 50%, transparent 0deg, rgba(200,169,106,0.35) 25deg, transparent 60deg, transparent 300deg, rgba(200,169,106,0.25) 335deg, transparent 360deg)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />
      <ParticleField color="200, 169, 106" density={70} />

      <div className="container-fluid relative grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="relative z-10 order-2 lg:order-1">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mb-5 inline-block font-sans text-xs uppercase tracking-[0.35em] text-gold-dark"
          >
            Fragrance and more.
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-6xl leading-[0.98] text-ink sm:text-7xl md:text-8xl"
          >
            Craft Your
            <br />
            <span className="text-gradient-gold">Mood.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.8 }}
            className="mt-7 max-w-md font-sans text-base leading-relaxed text-ink/60 sm:text-lg"
          >
            Luxury fragrances designed to calm your mind, elevate your confidence, and leave a
            lasting impression.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.8 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <LinkButton href="/shop" variant="primary">
              Shop Collection
            </LinkButton>
            <LinkButton href="/custom-scent-builder" variant="secondary">
              Build Your Own Fragrance
            </LinkButton>
          </motion.div>
        </div>

        <div className="relative order-1 z-10 h-[50vh] lg:order-2 lg:h-[75vh]">
          <TiltImage
            src="/images/bottle-hero-marble.png"
            alt="CooMood signature eau de parfum bottle"
            className="h-full w-full"
            priority
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 font-sans text-[10px] uppercase tracking-[0.3em] text-ink/40"
      >
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="block"
        >
          Scroll
        </motion.span>
      </motion.div>
    </section>
  );
}
