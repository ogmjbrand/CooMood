"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FAQItem } from "@/types";
import { cn } from "@/lib/utils";

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const categories = useMemo(() => Array.from(new Set(items.map((i) => i.category))), [items]);

  return (
    <div className="space-y-12">
      {categories.map((category) => (
        <div key={category}>
          <h2 className="mb-4 font-display text-2xl">{category}</h2>
          <div className="divide-y divide-ink/10 rounded-[2rem] bg-white px-6">
            {items
              .filter((i) => i.category === category)
              .map((item) => {
                const idx = items.indexOf(item);
                const isOpen = open === idx;
                return (
                  <div key={item.question}>
                    <button
                      onClick={() => setOpen(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between gap-4 py-5 text-left font-sans text-sm font-medium"
                    >
                      {item.question}
                      <ChevronDown
                        size={16}
                        className={cn("shrink-0 transition-transform", isOpen && "rotate-180 text-gold-dark")}
                      />
                    </button>
                    <div
                      className={cn(
                        "grid overflow-hidden transition-all duration-300",
                        isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
                      )}
                    >
                      <p className="overflow-hidden font-sans text-sm leading-relaxed text-ink/60">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
