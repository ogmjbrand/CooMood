import { createClient } from "./server";
import type { Address, Collection, Customer, Order, Product, Review } from "@/types";

interface ProductRow {
  slug: string;
  name: string;
  category: string;
  collection_slug: string | null;
  price: number | string;
  compare_at_price: number | string | null;
  image_url: string | null;
  gallery: string[] | null;
  description: string | null;
  story: string | null;
  notes_top: string[] | null;
  notes_middle: string[] | null;
  notes_base: string[] | null;
  mood: string[] | null;
  gender: string;
  season: string[] | null;
  longevity: string | null;
  occasion: string[] | null;
  size: string | null;
  in_stock: boolean;
  featured: boolean;
  is_new: boolean;
  bestseller: boolean;
  rating: number | string | null;
  review_count: number | null;
}

interface CollectionRow {
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  image_url: string | null;
  mood: string[] | null;
}

interface ReviewRow {
  id: string;
  product_slug: string;
  author_name: string;
  rating: number;
  title: string | null;
  body: string | null;
  verified: boolean;
  video_url: string | null;
  created_at: string;
}

function mapProduct(row: ProductRow): Product {
  return {
    slug: row.slug,
    name: row.name,
    category: row.category as Product["category"],
    collection: row.collection_slug ?? "",
    price: Number(row.price),
    compareAtPrice: row.compare_at_price != null ? Number(row.compare_at_price) : undefined,
    image: row.image_url ?? "",
    gallery: row.gallery ?? [],
    description: row.description ?? "",
    story: row.story ?? "",
    notes: {
      top: row.notes_top ?? [],
      middle: row.notes_middle ?? [],
      base: row.notes_base ?? [],
    },
    mood: (row.mood ?? []) as Product["mood"],
    gender: row.gender as Product["gender"],
    season: (row.season ?? []) as Product["season"],
    longevity: (row.longevity ?? "moderate") as Product["longevity"],
    occasion: row.occasion ?? [],
    size: row.size ?? "",
    rating: row.rating != null ? Number(row.rating) : 0,
    reviewCount: row.review_count ?? 0,
    inStock: row.in_stock,
    featured: row.featured,
    new: row.is_new,
    bestseller: row.bestseller,
  };
}

function mapCollection(row: CollectionRow): Collection {
  return {
    slug: row.slug,
    name: row.name,
    tagline: row.tagline ?? "",
    description: row.description ?? "",
    image: row.image_url ?? "",
    mood: (row.mood ?? []) as Collection["mood"],
  };
}

const PRODUCT_COLUMNS =
  "slug, name, category, collection_slug, price, compare_at_price, image_url, gallery, description, story, notes_top, notes_middle, notes_base, mood, gender, season, longevity, occasion, size, in_stock, featured, is_new, bestseller, rating, review_count";

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select(PRODUCT_COLUMNS).order("slug");
  if (error) throw error;
  return ((data ?? []) as unknown as ProductRow[]).map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? mapProduct(data as unknown as ProductRow) : null;
}

export async function getRelatedProducts(product: Product, count = 4): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("collection_slug", product.collection)
    .neq("slug", product.slug)
    .limit(count);
  if (error) throw error;
  return ((data ?? []) as unknown as ProductRow[]).map(mapProduct);
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("featured", true)
    .limit(limit);
  if (error) throw error;
  return ((data ?? []) as unknown as ProductRow[]).map(mapProduct);
}

export async function getProductsByCollection(collectionSlug: string): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("collection_slug", collectionSlug)
    .order("slug");
  if (error) throw error;
  return ((data ?? []) as unknown as ProductRow[]).map(mapProduct);
}

export async function getProductsByCategories(categories: string[]): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .in("category", categories)
    .order("slug");
  if (error) throw error;
  return ((data ?? []) as unknown as ProductRow[]).map(mapProduct);
}

export async function getGiftProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .or("category.eq.gift-set,occasion.cs.{Gifting}")
    .order("slug");
  if (error) throw error;
  return ((data ?? []) as unknown as ProductRow[]).map(mapProduct);
}

export async function getCollections(): Promise<Collection[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collections")
    .select("slug, name, tagline, description, image_url, mood")
    .order("slug");
  if (error) throw error;
  return ((data ?? []) as unknown as CollectionRow[]).map(mapCollection);
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("collections")
    .select("slug, name, tagline, description, image_url, mood")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? mapCollection(data as unknown as CollectionRow) : null;
}

interface CustomerRow {
  id: string;
  full_name: string | null;
  phone: string | null;
  rewards_points: number;
  referral_code: string | null;
}

interface AddressRow {
  id: string;
  label: string | null;
  full_name: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  postal_code: string;
  country: string;
  phone: string | null;
  is_default: boolean;
}

interface OrderItemRow {
  id: string;
  name: string;
  unit_price: number | string;
  quantity: number;
  size: string | null;
}

interface OrderRow {
  id: string;
  order_number: string;
  status: string;
  total: number | string;
  created_at: string;
  order_items: OrderItemRow[];
}

export async function getCustomer(userId: string, email: string): Promise<Customer> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("customers")
    .select("id, full_name, phone, rewards_points, referral_code")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  const row = data as unknown as CustomerRow | null;
  return {
    id: userId,
    email,
    fullName: row?.full_name ?? "",
    phone: row?.phone ?? "",
    rewardsPoints: row?.rewards_points ?? 0,
    referralCode: row?.referral_code ?? "",
  };
}

export async function getAddresses(userId: string): Promise<Address[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("addresses")
    .select("id, label, full_name, line1, line2, city, state, postal_code, country, phone, is_default")
    .eq("customer_id", userId)
    .order("created_at");
  if (error) throw error;
  return ((data ?? []) as unknown as AddressRow[]).map((row) => ({
    id: row.id,
    label: row.label ?? "",
    fullName: row.full_name,
    line1: row.line1,
    line2: row.line2 ?? "",
    city: row.city,
    state: row.state ?? "",
    postalCode: row.postal_code,
    country: row.country,
    phone: row.phone ?? "",
    isDefault: row.is_default,
  }));
}

export async function getOrders(userId: string): Promise<Order[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("id, order_number, status, total, created_at, order_items(id, name, unit_price, quantity, size)")
    .eq("customer_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as unknown as OrderRow[]).map((row) => ({
    id: row.id,
    orderNumber: row.order_number,
    status: row.status,
    total: Number(row.total),
    createdAt: row.created_at,
    items: (row.order_items ?? []).map((it) => ({
      id: it.id,
      name: it.name,
      unitPrice: Number(it.unit_price),
      quantity: it.quantity,
      size: it.size ?? "",
    })),
  }));
}

export async function getReviewsForProduct(slug: string): Promise<Review[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("id, product_slug, author_name, rating, title, body, verified, video_url, created_at")
    .eq("product_slug", slug)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as unknown as ReviewRow[]).map((row) => ({
    id: row.id,
    author: row.author_name,
    rating: row.rating,
    title: row.title ?? "",
    body: row.body ?? "",
    verified: row.verified,
    date: row.created_at,
    video: Boolean(row.video_url),
  }));
}
