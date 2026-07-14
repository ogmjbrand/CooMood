import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ShopExplorer from "@/components/shop/ShopExplorer";
import { getCollections, getProductsByCategories } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Home Fragrance",
  description: "Candles, reed diffusers, room sprays, wax melts, and car diffusers from CooMood.",
};

const HOME_CATEGORIES = ["candle", "reed-diffuser", "room-spray", "wax-melt", "car-diffuser"];

export default async function HomeFragrancePage() {
  const [homeProducts, collections] = await Promise.all([
    getProductsByCategories(HOME_CATEGORIES),
    getCollections(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="For Your Space"
        title="Home Fragrance"
        description="Luxury shouldn't stop at your skin. Bring your signature scent into every room you live in."
      />
      <ShopExplorer products={homeProducts} collections={collections} title="Home Fragrance" />
    </>
  );
}
