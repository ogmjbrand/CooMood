import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ShopExplorer from "@/components/shop/ShopExplorer";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Gift Sets",
  description: "Curated CooMood gift sets in velvet-lined boxes with wax-sealed ribbon.",
};

export default function GiftSetsPage() {
  const giftProducts = products.filter(
    (p) => p.category === "gift-set" || p.occasion.includes("Gifting")
  );

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
