import { listCustomers } from "@/lib/admin/queries";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const customers = await listCustomers();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-ink">Customers</h1>

      <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-ink/40">
              <th className="px-5 py-3 font-normal">Email</th>
              <th className="px-5 py-3 font-normal">Name</th>
              <th className="px-5 py-3 font-normal">Phone</th>
              <th className="px-5 py-3 font-normal">Orders</th>
              <th className="px-5 py-3 font-normal">Total Spent</th>
              <th className="px-5 py-3 font-normal">Rewards</th>
              <th className="px-5 py-3 font-normal">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-ink/40">
                  No customers yet.
                </td>
              </tr>
            )}
            {customers.map((c) => (
              <tr key={c.id} className="border-t border-ink/5 hover:bg-cream/60">
                <td className="px-5 py-3">{c.email}</td>
                <td className="px-5 py-3 text-ink/70">{c.fullName || "—"}</td>
                <td className="px-5 py-3 text-ink/50">{c.phone || "—"}</td>
                <td className="px-5 py-3">{c.orderCount}</td>
                <td className="px-5 py-3">{formatPrice(c.totalSpent)}</td>
                <td className="px-5 py-3 text-ink/50">{c.rewardsPoints}</td>
                <td className="px-5 py-3 text-ink/50">{new Date(c.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
