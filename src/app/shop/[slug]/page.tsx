import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getProducts,
  getRelatedProducts,
  getReviewsForProduct,
} from "@/lib/supabase/queries";
import ProductDetail from "@/components/shop/ProductDetail";
import PageHero from "@/components/ui/PageHero";
import DataUnavailable from "@/components/ui/DataUnavailable";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getProductBySlug(slug);
    if (!product) return {};
    return {
      title: product.name,
      description: product.description,
      alternates: { canonical: `/shop/${product.slug}` },
      openGraph: {
        title: `${product.name} | CooMood`,
        description: product.description,
        images: [{ url: product.image, width: 1200, height: 1200 }],
      },
    };
  } catch {
    return {};
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const product = await getProductBySlug(slug);
    if (!product) notFound();

    const [related, allProducts, reviews] = await Promise.all([
      getRelatedProducts(product),
      getProducts(),
      getReviewsForProduct(product.slug),
    ]);

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      image: product.image,
      sku: product.slug,
      brand: { "@type": "Brand", name: "CooMood" },
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        price: product.price,
        availability: product.inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviewCount,
      },
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ProductDetail product={product} related={related} allProducts={allProducts} reviews={reviews} />
      </>
    );
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error && error.digest === "NEXT_NOT_FOUND") {
      throw error;
    }
    console.error("[ProductPage] failed to load:", error);
    return (
      <>
        <PageHero eyebrow="Shop" title="Fragrance" />
        <div className="container-fluid pb-24">
          <DataUnavailable message="This product is temporarily unavailable. Please check back shortly." />
        </div>
      </>
    );
  }
}
