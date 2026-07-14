"use client";

import { useMemo, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import type { Product } from "@/types";
import ProductCard from "@/components/ui/ProductCard";

export default function SearchExplorer({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) =>
      [p.name, p.collection, p.category, ...p.mood, ...p.occasion]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [products, query]);

  return (
    <div className="container-fluid pb-24">
      <div className="relative mx-auto max-w-xl">
        <SearchIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-ink/40" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, mood, or collection..."
          className="w-full rounded-full border border-ink/15 bg-white py-4 pl-14 pr-6 font-sans text-sm focus:border-gold focus:outline-none"
        />
      </div>

      <div className="mt-14">
        {query && results.length === 0 && (
          <p className="text-center font-sans text-sm text-ink/50">No results for &quot;{query}&quot;.</p>
        )}
        {results.length > 0 && (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {results.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
