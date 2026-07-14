import Hero from "@/components/home/Hero";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import WhyCoomood from "@/components/home/WhyCoomood";
import ScentBuilderTeaser from "@/components/home/ScentBuilderTeaser";
import PackagingShowcase from "@/components/home/PackagingShowcase";
import Reviews from "@/components/home/Reviews";
import InstagramFeed from "@/components/home/InstagramFeed";
import Newsletter from "@/components/home/Newsletter";
import { getCollections } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const collections = await getCollections();

  return (
    <>
      <Hero />
      <FeaturedCollections collections={collections} />
      <FeaturedProducts />
      <WhyCoomood />
      <ScentBuilderTeaser />
      <PackagingShowcase />
      <Reviews />
      <InstagramFeed />
      <Newsletter />
    </>
  );
}
