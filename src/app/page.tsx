import Hero from "@/components/home/Hero";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import WhyCoomood from "@/components/home/WhyCoomood";
import ScentBuilderTeaser from "@/components/home/ScentBuilderTeaser";
import PackagingShowcase from "@/components/home/PackagingShowcase";
import Reviews from "@/components/home/Reviews";
import InstagramFeed from "@/components/home/InstagramFeed";
import Newsletter from "@/components/home/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedCollections />
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
