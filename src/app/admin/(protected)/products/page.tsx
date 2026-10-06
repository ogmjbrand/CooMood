import Link from "next/link";
import { getProducts } from "@/lib/supabase/queries";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-cherry px-5 py-2.5 text-xs uppercase tracking-[0.15em] text-cream hover:bg-cherry-light"
        >
          New Product
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-ink/40">
              <th className="px-5 py-3 font-normal">Name</th>
              <th className="px-5 py-3 font-normal">Category</th>
              <th className="px-5 py-3 font-normal">Price</th>
              <th className="px-5 py-3 font-normal">Stock</th>
              <th className="px-5 py-3 font-normal">Flags</th>
              <th className="px-5 py-3 font-normal" />
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-ink/40">
                  No products yet.
                </td>
              </tr>
            )}
            {products.map((product) => (
              <tr key={product.slug} className="border-t border-ink/5 hover:bg-cream/60">
                <td className="px-5 py-3">
                  <span className="font-medium text-ink">{product.name}</span>
                  <span className="ml-2 text-ink/35">{product.slug}</span>
                </td>
                <td className="px-5 py-3 text-ink/60">{product.category}</td>
                <td className="px-5 py-3">{formatPrice(product.price)}</td>
                <td className="px-5 py-3">
                  {product.inStock ? (
                    <span className="text-green-700">In Stock</span>
                  ) : (
                    <span className="text-cherry">Out of Stock</span>
                  )}
                </td>
                <td className="px-5 py-3 text-xs text-ink/40">
                  {[product.featured && "Featured", product.new && "New", product.bestseller && "Bestseller"]
                    .filter(Boolean)
                    .join(" · ")}
                </td>
                <td className="px-5 py-3 text-right">
                  <Link href={`/admin/products/${product.slug}`} className="text-cherry hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
