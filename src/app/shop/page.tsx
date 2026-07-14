import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ShopExplorer from "@/components/shop/ShopExplorer";
import { getCollections, getProducts } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop All Fragrances",
  description:
    "Browse the full CooMood collection — eau de parfum, cologne, body mist, and home fragrance.",
};

export default async function ShopPage() {
  const [products, collections] = await Promise.all([getProducts(), getCollections()]);

  return (
    <>
      <PageHero
        eyebrow="Shop"
        title="All Fragrances"
        description="Every scent CooMood makes, from signature eau de parfum to home fragrance, in one place."
      />
      <ShopExplorer products={products} collections={collections} title="All Fragrances" />
    </>
  );
}
