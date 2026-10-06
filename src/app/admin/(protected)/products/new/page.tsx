import { getCollections } from "@/lib/supabase/queries";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function AdminNewProductPage() {
  const collections = await getCollections();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-ink">New Product</h1>
      <ProductForm collections={collections} />
    </div>
  );
}
