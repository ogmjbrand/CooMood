"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";
import { testimonials } from "@/data/reviews";
import SectionHeading from "@/components/ui/SectionHeading";
import StarRating from "@/components/ui/StarRating";

export default function Reviews() {
  const trackRef = useRef<HTMLDivElement>(null);

  function scroll(dir: 1 | -1) {
    trackRef.current?.scrollBy({ left: dir * 380, behavior: "smooth" });
  }

  return (
    <section className="bg-cream py-28">
      <div className="container-fluid">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Verified Buyers"
            title="What CooMood Wearers Say"
            align="left"
            className="items-start text-left"
          />
          <div className="flex gap-2">
            <button
              onClick={() => scroll(-1)}
              aria-label="Previous review"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 transition-colors hover:border-cherry hover:bg-cherry hover:text-cream"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll(1)}
              aria-label="Next review"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 transition-colors hover:border-cherry hover:bg-cherry hover:text-cream"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative flex w-[85%] shrink-0 snap-start flex-col rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(17,17,17,0.06)] sm:w-[360px]"
            >
              <div className="flex items-center justify-between">
                <StarRating rating={t.rating} />
                {t.video && <PlayCircle size={20} className="text-cherry" />}
              </div>
              <h3 className="mt-4 font-display text-xl leading-snug">{t.title}</h3>
              <p className="mt-3 flex-1 font-sans text-sm leading-relaxed text-ink/60">{t.body}</p>
              <div className="mt-6 border-t border-ink/10 pt-4">
                <p className="font-sans text-sm font-medium text-ink">{t.author}</p>
                <p className="font-sans text-xs text-ink/40">
                  {t.location} &middot; {t.product}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
