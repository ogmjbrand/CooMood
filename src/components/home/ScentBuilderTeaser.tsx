"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { LinkButton } from "@/components/ui/Button";
import ParticleField from "@/components/effects/ParticleField";

const steps = ["Choose Bottle & Cap", "Layer Top, Middle & Base Notes", "Preview Live & Checkout"];

export default function ScentBuilderTeaser() {
  return (
    <section className="relative overflow-hidden bg-cream py-28">
      <ParticleField color="139, 17, 32" density={30} />
      <div className="container-fluid grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div className="relative order-2 aspect-square overflow-hidden rounded-[2.5rem] lg:order-1">
          <Image
            src="/images/gift-set-box.png"
            alt="Custom scent builder bottle preview"
            fill
            sizes="(min-width: 1024px) 45vw, 90vw"
            className="object-cover"
          />
        </div>
        <div className="order-1 lg:order-2">
          <span className="mb-4 inline-block font-sans text-xs uppercase tracking-[0.3em] text-cherry">
            Custom Scent Builder
          </span>
          <h2 className="font-display text-5xl leading-[1.02] text-ink sm:text-6xl">
            Design a Fragrance <br className="hidden sm:block" /> That&apos;s Entirely Yours.
          </h2>
          <p className="mt-6 max-w-md font-sans text-base leading-relaxed text-ink/60">
            Choose your bottle, cap, and label. Layer top, middle, and base notes. Watch your
            fragrance take shape in real time, then have it hand-blended and shipped to your door.
          </p>

          <ul className="mt-8 space-y-4">
            {steps.map((step, i) => (
              <motion.li
                key={step}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="flex items-center gap-4 font-sans text-sm text-ink/70"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/50 font-display text-sm text-gold-dark">
                  {i + 1}
                </span>
                {step}
              </motion.li>
            ))}
          </ul>

          <div className="mt-10">
            <LinkButton href="/custom-scent-builder" variant="gold">
              Start Building
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
