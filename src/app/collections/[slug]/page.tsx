import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import ShopExplorer from "@/components/shop/ShopExplorer";
import { collections } from "@/data/collections";
import { products } from "@/data/products";

export function generateStaticParams() {
  return collections.filter((c) => c.slug !== "custom").map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = collections.find((c) => c.slug === slug);
  if (!collection) return {};
  return {
    title: `${collection.name} Collection`,
    description: collection.description,
    alternates: { canonical: `/collections/${collection.slug}` },
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = collections.find((c) => c.slug === slug);
  if (!collection) notFound();

  const collectionProducts = products.filter((p) => p.collection === collection.slug);

  return (
    <>
      <PageHero eyebrow={collection.tagline} title={collection.name} description={collection.description} dark />
      <ShopExplorer products={collectionProducts} title={`${collection.name} Fragrances`} hideCollectionFilter />
    </>
  );
}
