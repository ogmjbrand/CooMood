"use client";

import { motion } from "framer-motion";
import { Clock, Feather, Gem, Heart, Sparkles, Users } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const points = [
  { icon: Clock, title: "Long Lasting", copy: "Engineered to hold its shape for hours, not minutes." },
  { icon: Gem, title: "Premium Ingredients", copy: "Rare absolutes and clean, skin-safe formulas." },
  { icon: Users, title: "Unisex", copy: "Designed to be worn by anyone, in any mood." },
  { icon: Sparkles, title: "Luxury Packaging", copy: "Weighted glass, gold hardware, wax-sealed ribbon." },
  { icon: Feather, title: "Custom Fragrance", copy: "Build a scent that exists nowhere else." },
  { icon: Heart, title: "Made to Calm", copy: "Luxury should feel calm. That's the whole point." },
];

export default function WhyCoomood() {
  return (
    <section className="relative overflow-hidden bg-ink py-28 text-cream">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(50% 60% at 15% 20%, rgba(200,169,106,0.14) 0%, transparent 70%), radial-gradient(45% 50% at 90% 80%, rgba(139,17,32,0.16) 0%, transparent 70%)",
        }}
      />
      <div className="container-fluid relative">
        <SectionHeading
          eyebrow="Why CooMood"
          title="Luxury, Engineered to Last"
          light
          description="Every formula is built around one idea: fragrance should feel like power, not perfume."
        />

        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-[2rem] border border-cream/10 bg-cream/10 sm:grid-cols-2 lg:grid-cols-3">
          {points.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
              className="group bg-ink p-8 transition-colors hover:bg-ink/60 sm:p-10"
            >
              <p.icon size={26} strokeWidth={1.25} className="text-gold transition-transform duration-500 group-hover:-translate-y-1" />
              <h3 className="mt-5 font-display text-2xl">{p.title}</h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-cream/55">{p.copy}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
