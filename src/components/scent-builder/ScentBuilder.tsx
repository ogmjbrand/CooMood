"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, ShoppingBag } from "lucide-react";
import {
  BASE_PRICE,
  SIZE_OPTIONS,
  baseNotes,
  bottleOptions,
  capOptions,
  glassColorOptions,
  middleNotes,
  packagingOptions,
  topNotes,
  type BuilderOption,
} from "@/data/scent-builder";
import { cn, formatPrice } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import ParticleField from "@/components/effects/ParticleField";
import BottlePreview from "./BottlePreview";

const MAX_NOTES_PER_LAYER = 2;

function useToggleSet(max: number) {
  const [selected, setSelected] = useState<string[]>([]);
  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      if (prev.length >= max) return [...prev.slice(1), id];
      return [...prev, id];
    });
  }
  return [selected, toggle] as const;
}

export default function ScentBuilder() {
  const [bottle, setBottle] = useState(bottleOptions[0].id);
  const [cap, setCap] = useState(capOptions[0].id);
  const [glass, setGlass] = useState(glassColorOptions[0].id);
  const [size, setSize] = useState(SIZE_OPTIONS[2].id);
  const [packaging, setPackaging] = useState(packagingOptions[0].id);
  const [name, setName] = useState("");
  const [giftMessage, setGiftMessage] = useState("");
  const [added, setAdded] = useState(false);
  const [topSelected, toggleTop] = useToggleSet(MAX_NOTES_PER_LAYER);
  const [midSelected, toggleMid] = useToggleSet(MAX_NOTES_PER_LAYER);
  const [baseSelected, toggleBase] = useToggleSet(MAX_NOTES_PER_LAYER);
  const addLine = useCartStore((s) => s.addLine);

  const sizeOption = SIZE_OPTIONS.find((s) => s.id === size)!;
  const capOption = capOptions.find((c) => c.id === cap)!;
  const glassOption = glassColorOptions.find((g) => g.id === glass)!;
  const bottleOption = bottleOptions.find((b) => b.id === bottle)!;
  const packagingOption = packagingOptions.find((p) => p.id === packaging)!;

  const notePriceSum = useMemo(() => {
    function optionSum(ids: string[], list: BuilderOption[]) {
      return ids.reduce((sum, id) => sum + (list.find((o) => o.id === id)?.price ?? 0), 0);
    }
    return (
      optionSum(topSelected, topNotes) +
      optionSum(midSelected, middleNotes) +
      optionSum(baseSelected, baseNotes)
    );
  }, [topSelected, midSelected, baseSelected]);

  const price = useMemo(() => {
    const base = BASE_PRICE * sizeOption.multiplier;
    const additions =
      bottleOption.price + capOption.price + glassOption.price + packagingOption.price + notePriceSum;
    return Math.round(base + additions);
  }, [sizeOption, bottleOption, capOption, glassOption, packagingOption, notePriceSum]);

  function handleAddToCart() {
    addLine({
      slug: `custom-${bottle}-${cap}-${glass}-${Date.now()}`,
      name: name ? `Custom Fragrance — ${name}` : "Custom Fragrance",
      image: "/images/gift-set-box.png",
      price,
      size: `${sizeOption.name} · Custom Blend`,
      quantity: 1,
      custom: true,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div className="relative pt-28">
      <ParticleField color="200, 169, 106" density={40} />
      <div className="container-fluid grid grid-cols-1 gap-16 py-10 lg:grid-cols-[1fr_1.3fr]">
        <div className="lg:sticky lg:top-28 lg:h-fit">
          <div className="rounded-[2.5rem] bg-white p-10 shadow-[0_30px_80px_rgba(17,17,17,0.08)]">
            <BottlePreview
              bottle={bottle}
              capColor={capOption.color ?? "#c8a96a"}
              glassColor={glassOption.color ?? "rgba(248,245,239,0.35)"}
              label={name}
            />
          </div>
          <div className="mt-6 flex items-center justify-between rounded-2xl bg-ink px-6 py-5 text-cream">
            <div>
              <p className="font-sans text-xs uppercase tracking-wide text-cream/60">
                Estimated Price
              </p>
              <p className="font-display text-3xl">{formatPrice(price)}</p>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 font-sans text-xs uppercase tracking-wide text-ink transition-transform hover:scale-105"
            >
              {added ? <Check size={15} /> : <ShoppingBag size={15} />}
              {added ? "Added" : "Add to Cart"}
            </button>
          </div>
        </div>

        <div className="space-y-14">
          <Step title="1. Choose Your Bottle">
            <OptionGrid options={bottleOptions} selected={bottle} onSelect={setBottle} />
          </Step>

          <Step title="2. Choose Your Cap">
            <SwatchGrid options={capOptions} selected={cap} onSelect={setCap} />
          </Step>

          <Step title="3. Choose Your Glass Color">
            <SwatchGrid options={glassColorOptions} selected={glass} onSelect={setGlass} />
          </Step>

          <Step title="4. Layer Your Notes" subtitle={`Choose up to ${MAX_NOTES_PER_LAYER} per layer`}>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <NoteColumn label="Top Notes" options={topNotes} selected={topSelected} onToggle={toggleTop} />
              <NoteColumn label="Middle Notes" options={middleNotes} selected={midSelected} onToggle={toggleMid} />
              <NoteColumn label="Base Notes" options={baseNotes} selected={baseSelected} onToggle={toggleBase} />
            </div>
          </Step>

          <Step title="5. Size">
            <div className="flex gap-3">
              {SIZE_OPTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSize(s.id)}
                  className={cn(
                    "rounded-full border px-6 py-3 font-sans text-sm transition-colors",
                    size === s.id ? "border-ink bg-ink text-cream" : "border-ink/15 text-ink/70"
                  )}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </Step>

          <Step title="6. Packaging">
            <OptionGrid options={packagingOptions} selected={packaging} onSelect={setPackaging} />
          </Step>

          <Step title="7. Name Your Fragrance" subtitle="Optional — appears on your custom label">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={24}
              placeholder="e.g. Midnight in Marrakech"
              className="w-full rounded-2xl border border-ink/15 bg-white px-5 py-4 font-sans text-sm focus:border-gold focus:outline-none"
            />
            <textarea
              value={giftMessage}
              onChange={(e) => setGiftMessage(e.target.value)}
              maxLength={200}
              placeholder="Add a gift message (optional)"
              rows={3}
              className="mt-4 w-full rounded-2xl border border-ink/15 bg-white px-5 py-4 font-sans text-sm focus:border-gold focus:outline-none"
            />
          </Step>
        </div>
      </div>
    </div>
  );
}

function Step({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="font-display text-2xl">{title}</h2>
      {subtitle && <p className="mt-1 font-sans text-xs text-ink/45">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </motion.div>
  );
}

function OptionGrid({
  options,
  selected,
  onSelect,
}: {
  options: BuilderOption[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onSelect(o.id)}
          className={cn(
            "rounded-2xl border p-4 text-left transition-colors",
            selected === o.id ? "border-gold bg-gold/10" : "border-ink/10 hover:border-ink/30"
          )}
        >
          <p className="font-sans text-sm font-medium text-ink">{o.name}</p>
          {o.description && <p className="mt-1 font-sans text-xs text-ink/50">{o.description}</p>}
          <p className="mt-2 font-sans text-xs text-gold-dark">
            {o.price > 0 ? `+${formatPrice(o.price)}` : "Included"}
          </p>
        </button>
      ))}
    </div>
  );
}

function SwatchGrid({
  options,
  selected,
  onSelect,
}: {
  options: BuilderOption[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-4">
      {options.map((o) => (
        <button key={o.id} onClick={() => onSelect(o.id)} className="flex flex-col items-center gap-2">
          <span
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all",
              selected === o.id ? "border-gold scale-110" : "border-transparent"
            )}
            style={{ backgroundColor: o.color }}
          >
            {selected === o.id && <Check size={16} className="text-white mix-blend-difference" />}
          </span>
          <span className="font-sans text-[11px] text-ink/60">{o.name}</span>
        </button>
      ))}
    </div>
  );
}

function NoteColumn({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: BuilderOption[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div>
      <p className="mb-3 font-sans text-xs uppercase tracking-[0.2em] text-gold-dark">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => onToggle(o.id)}
            className={cn(
              "rounded-full border px-3.5 py-2 font-sans text-xs transition-colors",
              selected.includes(o.id)
                ? "border-ink bg-ink text-cream"
                : "border-ink/15 text-ink/70 hover:border-ink/40"
            )}
          >
            {o.name}
          </button>
        ))}
      </div>
    </div>
  );
}
