import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const SAMPLE_PRICE = 10;
const SAMPLE_CATEGORIES = ["eau-de-parfum", "extrait-de-parfum", "cologne", "perfume-oil", "body-mist"];

function checkKey(request: Request): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const url = new URL(request.url);
  const provided = url.searchParams.get("key") ?? request.headers.get("x-admin-password");
  return provided === password;
}

export async function GET(request: Request) {
  if (!checkKey(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const supabase = createAdminClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .in("category", SAMPLE_CATEGORIES)
    .not("slug", "like", "%-sample");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const created: string[] = [];
  const failed: string[] = [];

  for (const product of products ?? []) {
    const sampleSlug = `${product.slug}-sample`;
    const { error: upsertError } = await supabase.from("products").upsert(
      {
        slug: sampleSlug,
        name: `${product.name} — Sample`,
        category: product.category,
        collection_slug: product.collection_slug,
        price: SAMPLE_PRICE,
        compare_at_price: null,
        image_url: product.image_url,
        gallery: product.gallery,
        description: `A 2ml discovery sample of ${product.name} — try it before committing to the full bottle. ${product.description ?? ""}`.trim(),
        story: product.story,
        notes_top: product.notes_top,
        notes_middle: product.notes_middle,
        notes_base: product.notes_base,
        mood: product.mood,
        gender: product.gender,
        season: product.season,
        longevity: product.longevity,
        occasion: product.occasion,
        size: "2ml Sample",
        in_stock: true,
        inventory_count: 500,
        featured: false,
        is_new: false,
        bestseller: false,
        rating: product.rating,
        review_count: product.review_count,
      },
      { onConflict: "slug" }
    );

    if (upsertError) {
      failed.push(`${sampleSlug}: ${upsertError.message}`);
    } else {
      created.push(sampleSlug);
    }
  }

  return NextResponse.json({ sourceProductCount: products?.length ?? 0, created, failed });
}
