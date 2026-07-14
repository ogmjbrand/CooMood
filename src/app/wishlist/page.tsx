import PageHero from "@/components/ui/PageHero";
import WishlistGrid from "@/components/wishlist/WishlistGrid";
import { getProducts } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const products = await getProducts();

  return (
    <>
      <PageHero eyebrow="Saved" title="Your Wishlist" />
      <div className="container-fluid pb-24">
        <WishlistGrid products={products} />
      </div>
    </>
  );
}
