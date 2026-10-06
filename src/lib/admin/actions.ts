"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "./auth";

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized.");
  }
}

function parseList(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseOptionalNumber(value: FormDataEntryValue | null): number | null {
  if (value == null || String(value).trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

// ─── Orders ─────────────────────────────────────────────────────────────────

export async function updateOrderStatusAction(formData: FormData) {
  await requireAdmin();

  const orderId = String(formData.get("orderId") ?? "");
  const status = String(formData.get("status") ?? "");
  const trackingNumber = String(formData.get("trackingNumber") ?? "").trim();

  if (!orderId || !status) throw new Error("Missing order id or status.");

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("orders")
    .update({ status, tracking_number: trackingNumber || null })
    .eq("id", orderId);
  if (error) throw error;

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
}

// ─── Products ───────────────────────────────────────────────────────────────

export async function saveProductAction(formData: FormData) {
  await requireAdmin();

  const mode = String(formData.get("mode") ?? "create");
  const originalSlug = String(formData.get("originalSlug") ?? "");
  const slug = String(formData.get("slug") ?? "").trim();

  if (!slug) throw new Error("Slug is required.");

  const payload = {
    slug,
    name: String(formData.get("name") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    collection_slug: String(formData.get("collection_slug") ?? "").trim() || null,
    price: parseOptionalNumber(formData.get("price")) ?? 0,
    compare_at_price: parseOptionalNumber(formData.get("compare_at_price")),
    image_url: String(formData.get("image_url") ?? "").trim() || null,
    gallery: parseList(formData.get("gallery")),
    description: String(formData.get("description") ?? "").trim() || null,
    story: String(formData.get("story") ?? "").trim() || null,
    notes_top: parseList(formData.get("notes_top")),
    notes_middle: parseList(formData.get("notes_middle")),
    notes_base: parseList(formData.get("notes_base")),
    mood: parseList(formData.get("mood")),
    gender: String(formData.get("gender") ?? "unisex"),
    season: parseList(formData.get("season")),
    longevity: String(formData.get("longevity") ?? "moderate"),
    occasion: parseList(formData.get("occasion")),
    size: String(formData.get("size") ?? "").trim() || null,
    in_stock: formData.get("in_stock") === "on",
    inventory_count: parseOptionalNumber(formData.get("inventory_count")) ?? 0,
    featured: formData.get("featured") === "on",
    is_new: formData.get("is_new") === "on",
    bestseller: formData.get("bestseller") === "on",
    rating: parseOptionalNumber(formData.get("rating")) ?? 0,
    review_count: parseOptionalNumber(formData.get("review_count")) ?? 0,
  };

  const supabase = createAdminClient();

  if (mode === "edit") {
    if (!originalSlug) throw new Error("Missing original slug for edit.");
    if (originalSlug !== slug) throw new Error("The product slug cannot be changed after creation.");
    const { error } = await supabase.from("products").update(payload).eq("slug", originalSlug);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("products").insert(payload);
    if (error) throw error;
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();

  const slug = String(formData.get("slug") ?? "");
  if (!slug) throw new Error("Missing product slug.");

  const supabase = createAdminClient();
  const { error } = await supabase.from("products").delete().eq("slug", slug);
  if (error) {
    if (error.code === "23503") {
      throw new Error(
        "Can't delete — this product has order or review history. Mark it out of stock instead."
      );
    }
    throw error;
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

// ─── Coupons ────────────────────────────────────────────────────────────────

export async function saveCouponAction(formData: FormData) {
  await requireAdmin();

  const mode = String(formData.get("mode") ?? "create");
  const originalCode = String(formData.get("originalCode") ?? "");
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  if (!code) throw new Error("Coupon code is required.");

  const payload = {
    code,
    percent_off: parseOptionalNumber(formData.get("percent_off")),
    amount_off: parseOptionalNumber(formData.get("amount_off")),
    active: formData.get("active") === "on",
    expires_at: String(formData.get("expires_at") ?? "").trim() || null,
  };

  const supabase = createAdminClient();

  if (mode === "edit" && originalCode) {
    if (originalCode !== code) {
      const { error: delError } = await supabase.from("coupons").delete().eq("code", originalCode);
      if (delError) throw delError;
      const { error } = await supabase.from("coupons").insert(payload);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("coupons").update(payload).eq("code", code);
      if (error) throw error;
    }
  } else {
    const { error } = await supabase.from("coupons").insert(payload);
    if (error) throw error;
  }

  revalidatePath("/admin/coupons");
}

export async function deleteCouponAction(formData: FormData) {
  await requireAdmin();
  const code = String(formData.get("code") ?? "");
  if (!code) throw new Error("Missing coupon code.");

  const supabase = createAdminClient();
  const { error } = await supabase.from("coupons").delete().eq("code", code);
  if (error) throw error;

  revalidatePath("/admin/coupons");
}

// ─── Gift cards ─────────────────────────────────────────────────────────────

export async function saveGiftCardAction(formData: FormData) {
  await requireAdmin();

  const mode = String(formData.get("mode") ?? "create");
  const originalCode = String(formData.get("originalCode") ?? "");
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  if (!code) throw new Error("Gift card code is required.");

  const payload = {
    code,
    balance: parseOptionalNumber(formData.get("balance")) ?? 0,
    issued_to_email: String(formData.get("issued_to_email") ?? "").trim() || null,
  };

  const supabase = createAdminClient();

  if (mode === "edit" && originalCode) {
    if (originalCode !== code) {
      const { error: delError } = await supabase.from("gift_cards").delete().eq("code", originalCode);
      if (delError) throw delError;
      const { error } = await supabase.from("gift_cards").insert(payload);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("gift_cards").update(payload).eq("code", code);
      if (error) throw error;
    }
  } else {
    const { error } = await supabase.from("gift_cards").insert(payload);
    if (error) throw error;
  }

  revalidatePath("/admin/gift-cards");
}

export async function deleteGiftCardAction(formData: FormData) {
  await requireAdmin();
  const code = String(formData.get("code") ?? "");
  if (!code) throw new Error("Missing gift card code.");

  const supabase = createAdminClient();
  const { error } = await supabase.from("gift_cards").delete().eq("code", code);
  if (error) throw error;

  revalidatePath("/admin/gift-cards");
}
