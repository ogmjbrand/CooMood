import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ShopExplorer from "@/components/shop/ShopExplorer";
import DataUnavailable from "@/components/ui/DataUnavailable";
import { getGiftProducts } from "@/lib/supabase/queries";
import { safeFetch } from "@/lib/safeFetch";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gift Sets",
  description: "Curated CooMood gift sets in velvet-lined boxes with wax-sealed ribbon.",
};

export default async function GiftSetsPage() {
  const { data: giftProducts, ok } = await safeFetch(() => getGiftProducts(), []);

  return (
    <>
      <PageHero
        eyebrow="Gifting"
        title="Gift Sets"
        description="Every gift arrives as an occasion — velvet box, ribbon, and a wax seal, every time."
        dark
      />
      {ok ? (
        <ShopExplorer products={giftProducts} title="Gift Sets" hideCollectionFilter />
      ) : (
        <div className="container-fluid pb-24">
          <DataUnavailable message="Gift sets are temporarily unavailable. Please check back shortly." />
        </div>
      )}
    </>
  );
}
