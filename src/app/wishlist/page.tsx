import PageHero from "@/components/ui/PageHero";
import WishlistGrid from "@/components/wishlist/WishlistGrid";
import DataUnavailable from "@/components/ui/DataUnavailable";
import { getProducts } from "@/lib/supabase/queries";
import { safeFetch } from "@/lib/safeFetch";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const { data: products, ok } = await safeFetch(() => getProducts(), []);

  return (
    <>
      <PageHero eyebrow="Saved" title="Your Wishlist" />
      <div className="container-fluid pb-24">
        {ok ? (
          <WishlistGrid products={products} />
        ) : (
          <DataUnavailable message="Your wishlist is temporarily unavailable. Please check back shortly." />
        )}
      </div>
    </>
  );
}
