"use client";

import type { Product } from "@/types";
import ProductCard from "@/components/ui/ProductCard";
import { LinkButton } from "@/components/ui/Button";
import { useWishlistStore } from "@/lib/store/wishlist";

export default function WishlistGrid({ products }: { products: Product[] }) {
  const slugs = useWishlistStore((s) => s.slugs);
  const wishlisted = products.filter((p) => slugs.includes(p.slug));

  if (wishlisted.length === 0) {
    return (
      <div className="flex flex-col items-center gap-6 rounded-[2rem] bg-white py-24 text-center">
        <p className="font-display text-2xl text-ink/50">Nothing saved yet.</p>
        <LinkButton href="/shop">Discover Fragrances</LinkButton>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
      {wishlisted.map((p, i) => (
        <ProductCard key={p.slug} product={p} index={i} />
      ))}
    </div>
  );
}
