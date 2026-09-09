"use client";

import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { Collection, Product } from "@/types";
import ProductCard from "@/components/ui/ProductCard";
import { cn } from "@/lib/utils";

const GENDERS: Product["gender"][] = ["unisex", "feminine", "masculine"];
const SEASONS: Product["season"][number][] = ["spring", "summer", "autumn", "winter", "all-season"];
const LONGEVITY: Product["longevity"][] = ["light", "moderate", "long-lasting", "eternal"];
const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "rating", label: "Top Rated" },
  { id: "new", label: "Newest" },
] as const;

const PAGE_SIZE = 8;

export default function ShopExplorer({
  products,
  collections = [],
  title = "All Fragrances",
  hideCollectionFilter = false,
}: {
  products: Product[];
  collections?: Collection[];
  title?: string;
  hideCollectionFilter?: boolean;
}) {
  const [collection, setCollection] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [season, setSeason] = useState<string | null>(null);
  const [longevity, setLongevity] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState(400);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>("featured");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.price <= maxPrice);
    if (collection) list = list.filter((p) => p.collection === collection);
    if (gender) list = list.filter((p) => p.gender === gender);
    if (season) list = list.filter((p) => p.season.includes(season as Product["season"][number]));
    if (longevity) list = list.filter((p) => p.longevity === longevity);
    if (inStockOnly) list = list.filter((p) => p.inStock);

    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      case "new":
        list = [...list].sort((a, b) => Number(b.new) - Number(a.new));
        break;
    }
    return list;
  }, [products, collection, gender, season, longevity, maxPrice, inStockOnly, sort]);

  useEffect(() => setVisible(PAGE_SIZE), [collection, gender, season, longevity, maxPrice, inStockOnly, sort]);

  useEffect(() => {
    const sentinel = document.getElementById("shop-infinite-sentinel");
    if (!sentinel) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible((v) => Math.min(v + PAGE_SIZE, filtered.length));
        }
      },
      { rootMargin: "400px" }
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, [filtered.length]);

  function resetFilters() {
    setCollection(null);
    setGender(null);
    setSeason(null);
    setLongevity(null);
    setMaxPrice(400);
    setInStockOnly(false);
  }

  const FilterPanel = (
    <div className="space-y-8">
      {!hideCollectionFilter && (
        <FilterGroup label="Collection">
          {collections
            .filter((c) => c.slug !== "custom")
            .map((c) => (
              <FilterPill
                key={c.slug}
                active={collection === c.slug}
                onClick={() => setCollection(collection === c.slug ? null : c.slug)}
              >
                {c.name}
              </FilterPill>
            ))}
        </FilterGroup>
      )}

      <FilterGroup label="Gender">
        {GENDERS.map((g) => (
          <FilterPill key={g} active={gender === g} onClick={() => setGender(gender === g ? null : g)}>
            {g}
          </FilterPill>
        ))}
      </FilterGroup>

      <FilterGroup label="Season">
        {SEASONS.map((s) => (
          <FilterPill key={s} active={season === s} onClick={() => setSeason(season === s ? null : s)}>
            {s}
          </FilterPill>
        ))}
      </FilterGroup>

      <FilterGroup label="Longevity">
        {LONGEVITY.map((l) => (
          <FilterPill key={l} active={longevity === l} onClick={() => setLongevity(longevity === l ? null : l)}>
            {l}
          </FilterPill>
        ))}
      </FilterGroup>

      <div>
        <p className="mb-3 font-sans text-xs uppercase tracking-[0.2em] text-ink/50">
          Price up to ${maxPrice}
        </p>
        <input
          type="range"
          min={30}
          max={400}
          step={5}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-gold"
        />
      </div>

      <label className="flex items-center gap-3 font-sans text-sm text-ink/70">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => setInStockOnly(e.target.checked)}
          className="h-4 w-4 accent-gold"
        />
        In stock only
      </label>

      <button
        onClick={resetFilters}
        className="font-sans text-xs uppercase tracking-wide text-cherry underline underline-offset-4"
      >
        Clear all filters
      </button>
    </div>
  );

  return (
    <div className="container-fluid grid grid-cols-1 gap-10 py-10 lg:grid-cols-[240px_1fr]">
      <aside className="hidden lg:block">
        <h2 className="mb-6 font-display text-2xl">Filters</h2>
        {FilterPanel}
      </aside>

      <div>
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl">{title}</h1>
            <p className="mt-1 font-sans text-xs text-ink/50">{filtered.length} fragrances</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFiltersOpen(true)}
              className="flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2.5 font-sans text-xs uppercase tracking-wide lg:hidden"
            >
              <SlidersHorizontal size={14} /> Filters
            </button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="rounded-full border border-ink/15 bg-transparent px-4 py-2.5 font-sans text-xs uppercase tracking-wide focus:outline-none"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="py-24 text-center font-sans text-ink/50">
            No fragrances match those filters yet.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:gap-8">
              {filtered.slice(0, visible).map((p, i) => (
                <ProductCard key={p.slug} product={p} index={i} />
              ))}
            </div>
            {visible < filtered.length && <div id="shop-infinite-sentinel" className="h-10" />}
          </>
        )}
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-[90] flex lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setFiltersOpen(false)} />
          <div className="relative ml-auto flex h-full w-[85%] max-w-sm flex-col overflow-y-auto bg-cream p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-2xl">Filters</h2>
              <button onClick={() => setFiltersOpen(false)} className="h-9 w-9">
                <X size={20} />
              </button>
            </div>
            {FilterPanel}
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 font-sans text-xs uppercase tracking-[0.2em] text-ink/50">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 font-sans text-xs capitalize transition-colors",
        active ? "border-cherry bg-cherry text-cream" : "border-ink/15 text-ink/70 hover:border-ink/40"
      )}
    >
      {children}
    </button>
  );
}
