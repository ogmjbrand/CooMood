import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import ShopExplorer from "@/components/shop/ShopExplorer";
import DataUnavailable from "@/components/ui/DataUnavailable";
import { getCollectionBySlug, getProductsByCollection } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const collection = await getCollectionBySlug(slug);
    if (!collection) return {};
    return {
      title: `${collection.name} Collection`,
      description: collection.description,
      alternates: { canonical: `/collections/${collection.slug}` },
    };
  } catch {
    return {};
  }
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const collection = await getCollectionBySlug(slug);
    if (!collection) notFound();

    const collectionProducts = await getProductsByCollection(collection.slug);

    return (
      <>
        <PageHero eyebrow={collection.tagline} title={collection.name} description={collection.description} dark />
        <ShopExplorer products={collectionProducts} title={`${collection.name} Fragrances`} hideCollectionFilter />
      </>
    );
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error && error.digest === "NEXT_NOT_FOUND") {
      throw error;
    }
    console.error("[CollectionPage] failed to load:", error);
    return (
      <>
        <PageHero eyebrow="Aroma Kind" title="Collection" />
        <div className="container-fluid pb-24">
          <DataUnavailable message="This collection is temporarily unavailable. Please check back shortly." />
        </div>
      </>
    );
  }
}
