import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ShopExplorer from "@/components/shop/ShopExplorer";
import { getGiftProducts } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gift Sets",
  description: "Curated CooMood gift sets in velvet-lined boxes with wax-sealed ribbon.",
};

export default async function GiftSetsPage() {
  const giftProducts = await getGiftProducts();

  return (
    <>
      <PageHero
        eyebrow="Gifting"
        title="Gift Sets"
        description="Every gift arrives as an occasion — velvet box, ribbon, and a wax seal, every time."
        dark
      />
      <ShopExplorer products={giftProducts} title="Gift Sets" hideCollectionFilter />
    </>
  );
}
