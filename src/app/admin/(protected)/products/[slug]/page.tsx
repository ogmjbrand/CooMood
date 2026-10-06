import { notFound } from "next/navigation";
import { getCollections, getProductBySlug } from "@/lib/supabase/queries";
import { deleteProductAction } from "@/lib/admin/actions";
import ProductForm from "@/components/admin/ProductForm";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, collections] = await Promise.all([getProductBySlug(slug), getCollections()]);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">{product.name}</h1>
        <DeleteButton
          action={deleteProductAction}
          fields={{ slug: product.slug }}
          confirmMessage={`Delete "${product.name}"? This cannot be undone.`}
        />
      </div>
      <ProductForm product={product} collections={collections} />
    </div>
  );
}
