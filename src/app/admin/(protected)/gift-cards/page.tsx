import { listGiftCards } from "@/lib/admin/queries";
import { saveGiftCardAction, deleteGiftCardAction } from "@/lib/admin/actions";
import { formatPrice } from "@/lib/utils";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

const inputClass =
  "w-full rounded-xl border border-ink/15 px-3 py-2 text-sm focus:border-gold focus:outline-none";

export default async function AdminGiftCardsPage() {
  const giftCards = await listGiftCards();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-ink">Gift Cards</h1>

      <details className="rounded-2xl border border-ink/10 bg-white p-5">
        <summary className="cursor-pointer font-display text-lg text-ink">New Gift Card</summary>
        <form action={saveGiftCardAction} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <input type="hidden" name="mode" value="create" />
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wide text-ink/50">Code</span>
            <input type="text" name="code" required placeholder="GIFT50-ABCD" className={inputClass} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wide text-ink/50">Balance ($)</span>
            <input type="number" step="0.01" min="0" name="balance" required className={inputClass} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-wide text-ink/50">Issued To (email)</span>
            <input type="email" name="issued_to_email" className={inputClass} />
          </label>
          <button
            type="submit"
            className="sm:col-span-3 w-fit rounded-full bg-cherry px-6 py-2.5 text-xs uppercase tracking-[0.15em] text-cream hover:bg-cherry-light"
          >
            Create
          </button>
        </form>
      </details>

      <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-ink/40">
              <th className="px-5 py-3 font-normal">Code</th>
              <th className="px-5 py-3 font-normal">Balance</th>
              <th className="px-5 py-3 font-normal">Issued To</th>
              <th className="px-5 py-3 font-normal">Created</th>
              <th className="px-5 py-3 font-normal" />
            </tr>
          </thead>
          <tbody>
            {giftCards.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-ink/40">
                  No gift cards yet.
                </td>
              </tr>
            )}
            {giftCards.map((gc) => (
              <tr key={gc.code} className="border-t border-ink/5 hover:bg-cream/60">
                <td className="px-5 py-3 font-medium">{gc.code}</td>
                <td className="px-5 py-3">{formatPrice(gc.balance)}</td>
                <td className="px-5 py-3 text-ink/70">{gc.issuedToEmail || "—"}</td>
                <td className="px-5 py-3 text-ink/50">{new Date(gc.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-3">
                  <details>
                    <summary className="cursor-pointer text-xs uppercase tracking-wide text-cherry">Edit</summary>
                    <form action={saveGiftCardAction} className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <input type="hidden" name="mode" value="edit" />
                      <input type="hidden" name="originalCode" value={gc.code} />
                      <input type="text" name="code" defaultValue={gc.code} className={inputClass} />
                      <input
                        type="number"
                        step="0.01"
                        name="balance"
                        defaultValue={gc.balance}
                        className={inputClass}
                      />
                      <input
                        type="email"
                        name="issued_to_email"
                        defaultValue={gc.issuedToEmail ?? ""}
                        className={inputClass}
                      />
                      <div className="flex items-center gap-4">
                        <button type="submit" className="rounded-full bg-ink px-5 py-2 text-xs uppercase tracking-wide text-cream">
                          Save
                        </button>
                        <DeleteButton
                          action={deleteGiftCardAction}
                          fields={{ code: gc.code }}
                          confirmMessage={`Delete gift card "${gc.code}"?`}
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
