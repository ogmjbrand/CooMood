import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ShopExplorer from "@/components/shop/ShopExplorer";
import DataUnavailable from "@/components/ui/DataUnavailable";
import { getCollections, getProductsByCategories } from "@/lib/supabase/queries";
import { safeFetch } from "@/lib/safeFetch";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Home Fragrance",
  description: "Candles, reed diffusers, room sprays, wax melts, and car diffusers from CooMood.",
};

const HOME_CATEGORIES = ["candle", "reed-diffuser", "room-spray", "wax-melt", "car-diffuser"];

export default async function HomeFragrancePage() {
  const { data, ok } = await safeFetch(
    () => Promise.all([getProductsByCategories(HOME_CATEGORIES), getCollections()]),
    [[], []] as [
      Awaited<ReturnType<typeof getProductsByCategories>>,
      Awaited<ReturnType<typeof getCollections>>,
    ]
  );
  const [homeProducts, collections] = data;

  return (
    <>
      <PageHero
        eyebrow="For Your Space"
        title="Home Fragrance"
        description="Luxury shouldn't stop at your skin. Bring your signature scent into every room you live in."
      />
      {ok ? (
        <ShopExplorer products={homeProducts} collections={collections} title="Home Fragrance" />
      ) : (
        <div className="container-fluid pb-24">
          <DataUnavailable message="Home fragrance is temporarily unavailable. Please check back shortly." />
        </div>
      )}
    </>
  );
}
