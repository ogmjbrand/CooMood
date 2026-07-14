"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { collections } from "@/data/collections";
import SectionHeading from "@/components/ui/SectionHeading";

export default function FeaturedCollections() {
  return (
    <section className="bg-cream py-28">
      <div className="container-fluid">
        <SectionHeading
          eyebrow="Aroma Kind"
          title="Find Your Signature Mood"
          description="Four collections, each built around a feeling — plus a fifth you design yourself."
        />

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((c, i) => (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={i === 0 || i === 3 ? "lg:mt-10" : ""}
            >
              <Link
                href={c.slug === "custom" ? "/custom-scent-builder" : `/collections/${c.slug}`}
                className="group relative block aspect-[3/4.2] overflow-hidden rounded-[2rem] bg-ink"
              >
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover opacity-80 transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-gold-light">
                    {c.tagline}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <h3 className="font-display text-3xl text-cream">{c.name}</h3>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/30 text-cream transition-all group-hover:bg-gold group-hover:text-ink">
                      <ArrowUpRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
