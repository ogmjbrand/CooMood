import Link from "next/link";
import { getDashboardStats } from "@/lib/admin/queries";
import { formatPrice } from "@/lib/utils";
import StatusPill from "@/components/admin/StatusPill";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { label: "Total Orders", value: stats.totalOrders.toLocaleString() },
    { label: "Total Revenue", value: formatPrice(stats.totalRevenue) },
    { label: "Products", value: stats.totalProducts.toLocaleString() },
    { label: "Customers", value: stats.totalCustomers.toLocaleString() },
  ];

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl text-ink">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-ink/10 bg-white p-5">
            <p className="text-xs uppercase tracking-wide text-ink/40">{card.label}</p>
            <p className="mt-2 font-display text-2xl text-ink">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white">
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <h2 className="font-display text-lg text-ink">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs uppercase tracking-wide text-cherry hover:underline">
            View all
          </Link>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-ink/40">
              <th className="px-5 py-3 font-normal">Order</th>
              <th className="px-5 py-3 font-normal">Email</th>
              <th className="px-5 py-3 font-normal">Status</th>
              <th className="px-5 py-3 font-normal">Total</th>
              <th className="px-5 py-3 font-normal">Date</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentOrders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-ink/40">
                  No orders yet.
                </td>
              </tr>
            )}
            {stats.recentOrders.map((order) => (
              <tr key={order.id} className="border-t border-ink/5 hover:bg-cream/60">
                <td className="px-5 py-3">
                  <Link href={`/admin/orders/${order.id}`} className="text-cherry hover:underline">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-5 py-3 text-ink/70">{order.email}</td>
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
