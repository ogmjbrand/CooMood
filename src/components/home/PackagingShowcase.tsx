"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";

const items = [
  { image: "/images/gift-set-box.png", title: "Velvet Gift Boxes", copy: "Lined interiors, magnetic closures." },
  { image: "/images/packaging-showcase.png", title: "Ribbon & Wax Seal", copy: "Every order finished by hand." },
  { image: "/images/bottle-box-limited.png", title: "Limited Editions", copy: "Numbered, medallion-sealed keepsakes." },
];

export default function PackagingShowcase() {
  return (
    <section className="bg-white py-28">
      <div className="container-fluid">
        <SectionHeading
          eyebrow="The Experience"
          title="Packaging Worth Keeping"
          description="Every CooMood order arrives as an occasion — velvet, ribbon, and a wax seal included."
        />
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-cream"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(min-width: 768px) 33vw, 90vw"
                className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-display text-2xl text-cream">{item.title}</h3>
                <p className="mt-1 font-sans text-xs text-cream/70">{item.copy}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
