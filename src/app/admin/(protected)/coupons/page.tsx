import { listCoupons } from "@/lib/admin/queries";
import { saveCouponAction, deleteCouponAction } from "@/lib/admin/actions";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

const inputClass =
  "w-full rounded-xl border border-ink/15 px-3 py-2 text-sm focus:border-gold focus:outline-none";

export default async function AdminCouponsPage() {
  const coupons = await listCoupons();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-ink">Coupons</h1>

      <details className="rounded-2xl border border-ink/10 bg-white p-5">
        <summary className="cursor-pointer font-display text-lg text-ink">New Coupon</summary>
        <form action={saveCouponAction} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
          <input type="hidden" name="mode" value="create" />
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wide text-ink/50">Code</span>
            <input type="text" name="code" required placeholder="WELCOME15" className={inputClass} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wide text-ink/50">Percent Off</span>
            <input type="number" step="0.01" min="0" max="100" name="percent_off" className={inputClass} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wide text-ink/50">Amount Off ($)</span>
            <input type="number" step="0.01" min="0" name="amount_off" className={inputClass} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wide text-ink/50">Expires</span>
            <input type="date" name="expires_at" className={inputClass} />
          </label>
          <label className="flex items-center gap-2 text-sm text-ink/70 sm:col-span-4">
            <input type="checkbox" name="active" defaultChecked className="h-4 w-4 accent-gold" />
            Active
          </label>
          <button
            type="submit"
            className="sm:col-span-4 w-fit rounded-full bg-cherry px-6 py-2.5 text-xs uppercase tracking-[0.15em] text-cream hover:bg-cherry-light"
          >
            Create
          </button>
        </form>
      </details>

      <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-ink/40">
              <th className="px-5 py-3 font-normal">Code</th>
              <th className="px-5 py-3 font-normal">Discount</th>
              <th className="px-5 py-3 font-normal">Active</th>
              <th className="px-5 py-3 font-normal">Expires</th>
              <th className="px-5 py-3 font-normal" />
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-ink/40">
                  No coupons yet.
                </td>
              </tr>
            )}
            {coupons.map((coupon) => (
              <tr key={coupon.code} className="border-t border-ink/5 hover:bg-cream/60">
                <td className="px-5 py-3 font-medium">{coupon.code}</td>
                <td className="px-5 py-3 text-ink/70">
                  {coupon.percentOff != null ? `${coupon.percentOff}%` : coupon.amountOff != null ? `$${coupon.amountOff}` : "—"}
                </td>
                <td className="px-5 py-3">{coupon.active ? "Yes" : "No"}</td>
                <td className="px-5 py-3 text-ink/50">
                  {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : "Never"}
                </td>
                <td className="px-5 py-3">
                  <details>
                    <summary className="cursor-pointer text-xs uppercase tracking-wide text-cherry">Edit</summary>
                    <form action={saveCouponAction} className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
                      <input type="hidden" name="mode" value="edit" />
                      <input type="hidden" name="originalCode" value={coupon.code} />
                      <input type="text" name="code" defaultValue={coupon.code} className={inputClass} />
                      <input
                        type="number"
                        step="0.01"
                        name="percent_off"
                        defaultValue={coupon.percentOff ?? ""}
                        placeholder="% off"
                        className={inputClass}
                      />
                      <input
                        type="number"
                        step="0.01"
                        name="amount_off"
                        defaultValue={coupon.amountOff ?? ""}
                        placeholder="$ off"
                        className={inputClass}
                      />
                      <input
                        type="date"
                        name="expires_at"
                        defaultValue={coupon.expiresAt?.slice(0, 10) ?? ""}
                        className={inputClass}
                      />
                      <label className="flex items-center gap-2 text-sm text-ink/70">
                        <input type="checkbox" name="active" defaultChecked={coupon.active} className="h-4 w-4 accent-gold" />
                        Active
                      </label>
                      <div className="col-span-2 flex items-center gap-4 sm:col-span-5">
                        <button type="submit" className="rounded-full bg-ink px-5 py-2 text-xs uppercase tracking-wide text-cream">
                          Save
                        </button>
                        <DeleteButton
                          action={deleteCouponAction}
                          fields={{ code: coupon.code }}
                          confirmMessage={`Delete coupon "${coupon.code}"?`}
                        />
                      </div>
                    </form>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
