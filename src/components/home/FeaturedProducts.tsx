import { getFeaturedProducts } from "@/lib/supabase/queries";
import ProductCard from "@/components/ui/ProductCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { LinkButton } from "@/components/ui/Button";

export default async function FeaturedProducts() {
  const featured = await getFeaturedProducts(4);

  return (
    <section className="bg-white py-28">
      <div className="container-fluid">
        <SectionHeading
          eyebrow="Bestsellers"
          title="Featured Fragrances"
          description="The signatures our community reaches for again and again."
        />
        <div className="mt-16 grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
          {featured.map((product, i) => (
            <ProductCard key={product.slug} product={product} index={i} />
          ))}
        </div>
        <div className="mt-14 flex justify-center">
          <LinkButton href="/shop" variant="secondary">
            View All Fragrances
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
