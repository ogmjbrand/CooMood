import { saveProductAction } from "@/lib/admin/actions";
import type { Product } from "@/types";
import type { Collection } from "@/types";

const CATEGORIES = [
  "eau-de-parfum",
  "extrait-de-parfum",
  "cologne",
  "body-mist",
  "perfume-oil",
  "reed-diffuser",
  "room-spray",
  "candle",
  "wax-melt",
  "car-diffuser",
  "gift-set",
];

const GENDERS = ["unisex", "feminine", "masculine"];
const LONGEVITIES = ["light", "moderate", "long-lasting", "eternal"];

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wide text-ink/50">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink/35">{hint}</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-ink/15 px-3 py-2.5 text-sm focus:border-gold focus:outline-none";

export default function ProductForm({
  product,
  collections,
}: {
  product?: Product;
  collections: Collection[];
}) {
  const mode = product ? "edit" : "create";

  return (
    <form action={saveProductAction} className="space-y-8">
      <input type="hidden" name="mode" value={mode} />
      {product && <input type="hidden" name="originalSlug" value={product.slug} />}

      <section className="grid grid-cols-1 gap-4 rounded-2xl border border-ink/10 bg-white p-5 sm:grid-cols-2">
        <Field label="Slug" hint={product ? "Cannot be changed after creation." : "URL-safe, unique, e.g. midnight-cedar"}>
          <input
            type="text"
            name="slug"
            defaultValue={product?.slug}
            required
            readOnly={mode === "edit"}
            className={`${inputClass} ${mode === "edit" ? "bg-ink/5 text-ink/50" : ""}`}
          />
        </Field>
        <Field label="Name">
          <input type="text" name="name" defaultValue={product?.name} required className={inputClass} />
        </Field>
        <Field label="Category">
          <select name="category" defaultValue={product?.category} required className={inputClass}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Collection">
          <select name="collection_slug" defaultValue={product?.collection} className={inputClass}>
            <option value="">None</option>
            {collections.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Price (USD)">
          <input
            type="number"
            step="0.01"
            min="0"
            name="price"
            defaultValue={product?.price}
            required
            className={inputClass}
          />
        </Field>
        <Field label="Compare-at Price (optional)">
          <input
            type="number"
            step="0.01"
            min="0"
            name="compare_at_price"
            defaultValue={product?.compareAtPrice}
            className={inputClass}
          />
        </Field>
        <Field label="Size">
          <input type="text" name="size" defaultValue={product?.size} placeholder="50ml" className={inputClass} />
        </Field>
        <Field label="Inventory Count">
          <input
            type="number"
            min="0"
            name="inventory_count"
            defaultValue={product?.inventoryCount ?? 0}
            className={inputClass}
          />
        </Field>
      </section>

      <section className="grid grid-cols-1 gap-4 rounded-2xl border border-ink/10 bg-white p-5 sm:grid-cols-2">
        <Field label="Image URL">
          <input type="text" name="image_url" defaultValue={product?.image} className={inputClass} />
        </Field>
        <Field label="Gallery Image URLs" hint="Comma-separated">
          <input type="text" name="gallery" defaultValue={product?.gallery.join(", ")} className={inputClass} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Description">
            <textarea
              name="description"
              defaultValue={product?.description}
              rows={3}
              className={inputClass}
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Story">
            <textarea name="story" defaultValue={product?.story} rows={3} className={inputClass} />
          </Field>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 rounded-2xl border border-ink/10 bg-white p-5 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Top Notes" hint="Comma-separated">
          <input type="text" name="notes_top" defaultValue={product?.notes.top.join(", ")} className={inputClass} />
        </Field>
        <Field label="Middle Notes" hint="Comma-separated">
          <input
            type="text"
            name="notes_middle"
            defaultValue={product?.notes.middle.join(", ")}
            className={inputClass}
          />
        </Field>
        <Field label="Base Notes" hint="Comma-separated">
          <input type="text" name="notes_base" defaultValue={product?.notes.base.join(", ")} className={inputClass} />
        </Field>
        <Field label="Mood Tags" hint="Comma-separated, e.g. warm, bold">
          <input type="text" name="mood" defaultValue={product?.mood.join(", ")} className={inputClass} />
        </Field>
        <Field label="Season" hint="Comma-separated: spring, summer, autumn, winter, all-season">
          <input type="text" name="season" defaultValue={product?.season.join(", ")} className={inputClass} />
        </Field>
        <Field label="Occasion" hint="Comma-separated">
          <input type="text" name="occasion" defaultValue={product?.occasion.join(", ")} className={inputClass} />
        </Field>
        <Field label="Gender">
          <select name="gender" defaultValue={product?.gender ?? "unisex"} className={inputClass}>
            {GENDERS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Longevity">
          <select name="longevity" defaultValue={product?.longevity ?? "moderate"} className={inputClass}>
            {LONGEVITIES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </Field>
      </section>

      <section className="grid grid-cols-2 gap-4 rounded-2xl border border-ink/10 bg-white p-5 sm:grid-cols-4">
        <Field label="Rating (0-5)">
          <input type="number" step="0.1" min="0" max="5" name="rating" defaultValue={product?.rating ?? 0} className={inputClass} />
        </Field>
        <Field label="Review Count">
          <input type="number" min="0" name="review_count" defaultValue={product?.reviewCount ?? 0} className={inputClass} />
        </Field>
        <div className="col-span-2 flex flex-wrap items-center gap-5 pt-6">
          <label className="flex items-center gap-2 text-sm text-ink/70">
            <input type="checkbox" name="in_stock" defaultChecked={product?.inStock ?? true} className="h-4 w-4 accent-gold" />
            In Stock
          </label>
          <label className="flex items-center gap-2 text-sm text-ink/70">
            <input type="checkbox" name="featured" defaultChecked={product?.featured} className="h-4 w-4 accent-gold" />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm text-ink/70">
            <input type="checkbox" name="is_new" defaultChecked={product?.new} className="h-4 w-4 accent-gold" />
            New
          </label>
          <label className="flex items-center gap-2 text-sm text-ink/70">
            <input type="checkbox" name="bestseller" defaultChecked={product?.bestseller} className="h-4 w-4 accent-gold" />
            Bestseller
          </label>
        </div>
      </section>

      <button
        type="submit"
        className="rounded-full bg-cherry px-8 py-3 text-xs uppercase tracking-[0.15em] text-cream transition-colors hover:bg-cherry-light"
      >
        {mode === "edit" ? "Save Changes" : "Create Product"}
      </button>
    </form>
  );
}
