import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ShopExplorer from "@/components/shop/ShopExplorer";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Shop All Fragrances",
  description:
    "Browse the full CooMood collection — eau de parfum, cologne, body mist, and home fragrance.",
};

export default function ShopPage() {
  return (
    <>
      <PageHero
        eyebrow="Shop"
        title="All Fragrances"
        description="Every scent CooMood makes, from signature eau de parfum to home fragrance, in one place."
      />
      <ShopExplorer products={products} title="All Fragrances" />
    </>
  );
}
