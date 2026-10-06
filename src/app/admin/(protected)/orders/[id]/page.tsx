import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/admin/queries";
import { updateOrderStatusAction } from "@/lib/admin/actions";
import { formatPrice } from "@/lib/utils";
import StatusPill from "@/components/admin/StatusPill";

export const dynamic = "force-dynamic";

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  const address = order.shippingAddress;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/orders" className="text-xs uppercase tracking-wide text-ink/40 hover:text-ink">
          ← Orders
        </Link>
        <div className="mt-2 flex items-center gap-3">
          <h1 className="font-display text-3xl text-ink">{order.orderNumber}</h1>
          <StatusPill status={order.status} />
        </div>
        <p className="mt-1 text-sm text-ink/50">
          {order.email} · {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-ink/10 bg-white">
            <div className="border-b border-ink/10 px-5 py-4">
              <h2 className="font-display text-lg text-ink">Items</h2>
            </div>
            <table className="w-full text-left text-sm">
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-t border-ink/5 first:border-t-0">
                    <td className="px-5 py-3">
                      {item.productSlug ? (
                        <Link href={`/admin/products/${item.productSlug}`} className="text-cherry hover:underline">
                          {item.name}
                        </Link>
                      ) : (
                        item.name
                      )}
                      {item.size && <span className="ml-2 text-ink/40">({item.size})</span>}
                    </td>
                    <td className="px-5 py-3 text-ink/50">Qty {item.quantity}</td>
                    <td className="px-5 py-3 text-right">{formatPrice(item.unitPrice * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="space-y-1 border-t border-ink/10 px-5 py-4 text-sm">
              <div className="flex justify-between text-ink/60">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-ink/60">
                <span>Shipping</span>
                <span>{formatPrice(order.shipping)}</span>
              </div>
              <div className="flex justify-between text-ink/60">
                <span>Tax</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-ink/60">
                  <span>Discount</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-ink/10 pt-2 font-display text-lg text-ink">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {address && (
            <div className="rounded-2xl border border-ink/10 bg-white p-5">
              <h2 className="font-display text-lg text-ink">Shipping Address</h2>
              <p className="mt-2 text-sm text-ink/70">
                {address.name}
                <br />
                {address.line1}
                {address.line2 ? <>, {address.line2}</> : null}
                <br />
                {address.city}, {address.state} {address.postal_code}
                <br />
                {address.country}
              </p>
            </div>
          )}
        </div>

        <form action={updateOrderStatusAction} className="h-fit space-y-4 rounded-2xl border border-ink/10 bg-white p-5">
          <h2 className="font-display text-lg text-ink">Fulfillment</h2>
          <input type="hidden" name="orderId" value={order.id} />
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wide text-ink/50">Status</span>
            <select
              name="status"
              defaultValue={order.status}
              className="w-full rounded-xl border border-ink/15 px-3 py-2.5 text-sm focus:border-gold focus:outline-none"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s[0].toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wide text-ink/50">Tracking Number</span>
            <input
              type="text"
              name="trackingNumber"
              defaultValue={order.trackingNumber ?? ""}
              placeholder="1Z999AA10123456784"
              className="w-full rounded-xl border border-ink/15 px-3 py-2.5 text-sm focus:border-gold focus:outline-none"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-cherry py-2.5 text-xs uppercase tracking-[0.15em] text-cream transition-colors hover:bg-cherry-light"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
