import PageHero from "@/components/ui/PageHero";
import SearchExplorer from "@/components/search/SearchExplorer";
import { getProducts } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function SearchPage() {
  const products = await getProducts();

  return (
    <>
      <PageHero eyebrow="Search" title="Find Your Fragrance" />
      <SearchExplorer products={products} />
    </>
  );
}
