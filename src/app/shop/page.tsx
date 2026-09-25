import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ShopExplorer from "@/components/shop/ShopExplorer";
import FeaturedCarousel from "@/components/shop/FeaturedCarousel";
import DataUnavailable from "@/components/ui/DataUnavailable";
import { getCollections, getProducts } from "@/lib/supabase/queries";
import { safeFetch } from "@/lib/safeFetch";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop All Fragrances",
  description:
    "Browse the full CooMood collection — eau de parfum, cologne, body mist, and home fragrance.",
};

export default async function ShopPage() {
  const { data, ok } = await safeFetch(
    () => Promise.all([getProducts(), getCollections()]),
    [[], []] as [Awaited<ReturnType<typeof getProducts>>, Awaited<ReturnType<typeof getCollections>>]
  );
  const [products, collections] = data;

  const featured = products.filter((p) => p.featured || p.bestseller).slice(0, 8);
  const carouselProducts = featured.length >= 3 ? featured : products.slice(0, 8);

  return (
    <>
      <PageHero
        eyebrow="Shop"
        title="All Fragrances"
        description="Every scent CooMood makes, from signature eau de parfum to home fragrance, in one place."
      />
      {ok ? (
        <>
          <FeaturedCarousel products={carouselProducts} />
          <ShopExplorer products={products} collections={collections} title="All Fragrances" />
        </>
      ) : (
        <div className="container-fluid pb-24">
          <DataUnavailable message="The shop is temporarily unavailable. Please check back shortly." />
        </div>
      )}
    </>
  );
}
