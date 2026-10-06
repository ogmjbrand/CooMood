import Link from "next/link";
import { listOrders } from "@/lib/admin/queries";
import { formatPrice } from "@/lib/utils";
import StatusPill from "@/components/admin/StatusPill";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await listOrders();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-ink">Orders</h1>

      <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-ink/40">
              <th className="px-5 py-3 font-normal">Order</th>
              <th className="px-5 py-3 font-normal">Email</th>
              <th className="px-5 py-3 font-normal">Items</th>
              <th className="px-5 py-3 font-normal">Status</th>
              <th className="px-5 py-3 font-normal">Total</th>
              <th className="px-5 py-3 font-normal">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-ink/40">
                  No orders yet.
                </td>
              </tr>
            )}
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-ink/5 hover:bg-cream/60">
                <td className="px-5 py-3">
                  <Link href={`/admin/orders/${order.id}`} className="text-cherry hover:underline">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-5 py-3 text-ink/70">{order.email}</td>
                <td className="px-5 py-3 text-ink/50">{order.items.length}</td>
                <td className="px-5 py-3">
                  <StatusPill status={order.status} />
                </td>
                <td className="px-5 py-3">{formatPrice(order.total)}</td>
                <td className="px-5 py-3 text-ink/50">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
