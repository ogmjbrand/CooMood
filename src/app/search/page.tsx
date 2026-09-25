import PageHero from "@/components/ui/PageHero";
import SearchExplorer from "@/components/search/SearchExplorer";
import DataUnavailable from "@/components/ui/DataUnavailable";
import { getProducts } from "@/lib/supabase/queries";
import { safeFetch } from "@/lib/safeFetch";

export const dynamic = "force-dynamic";

export default async function SearchPage() {
  const { data: products, ok } = await safeFetch(() => getProducts(), []);

  return (
    <>
      <PageHero eyebrow="Search" title="Find Your Fragrance" />
      {ok ? (
        <SearchExplorer products={products} />
      ) : (
        <div className="container-fluid pb-24">
          <DataUnavailable message="Search is temporarily unavailable. Please check back shortly." />
        </div>
      )}
    </>
  );
}
