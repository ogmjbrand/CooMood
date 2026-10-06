import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export interface AdminOrderItem {
  id: string;
  productSlug: string | null;
  name: string;
  unitPrice: number;
  quantity: number;
  size: string | null;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  email: string;
  status: string;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  trackingNumber: string | null;
  shippingAddress: Record<string, string | null> | null;
  customerId: string | null;
  createdAt: string;
  items: AdminOrderItem[];
}

interface OrderRow {
  id: string;
  order_number: string;
  email: string;
  status: string;
  subtotal: number | string;
  shipping: number | string;
  tax: number | string;
  discount: number | string;
  total: number | string;
  tracking_number: string | null;
  shipping_address: Record<string, string | null> | null;
  customer_id: string | null;
  created_at: string;
  order_items: {
    id: string;
    product_slug: string | null;
    name: string;
    unit_price: number | string;
    quantity: number;
    size: string | null;
  }[];
}

const ORDER_COLUMNS =
  "id, order_number, email, status, subtotal, shipping, tax, discount, total, tracking_number, shipping_address, customer_id, created_at, order_items(id, product_slug, name, unit_price, quantity, size)";

function mapOrder(row: OrderRow): AdminOrder {
  return {
    id: row.id,
    orderNumber: row.order_number,
    email: row.email,
    status: row.status,
    subtotal: Number(row.subtotal),
    shipping: Number(row.shipping),
    tax: Number(row.tax),
    discount: Number(row.discount),
    total: Number(row.total),
    trackingNumber: row.tracking_number,
    shippingAddress: row.shipping_address,
    customerId: row.customer_id,
    createdAt: row.created_at,
    items: (row.order_items ?? []).map((it) => ({
      id: it.id,
      productSlug: it.product_slug,
      name: it.name,
      unitPrice: Number(it.unit_price),
      quantity: it.quantity,
      size: it.size,
    })),
  };
}

export async function listOrders(): Promise<AdminOrder[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_COLUMNS)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as unknown as OrderRow[]).map(mapOrder);
}

export async function getOrderById(id: string): Promise<AdminOrder | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapOrder(data as unknown as OrderRow) : null;
}

export interface AdminCustomer {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  rewardsPoints: number;
  createdAt: string;
  orderCount: number;
  totalSpent: number;
}

export async function listCustomers(): Promise<AdminCustomer[]> {
  const supabase = createAdminClient();

  const [{ data: authUsers, error: authError }, { data: profiles, error: profileError }, { data: orderRows, error: orderError }] =
    await Promise.all([
      supabase.auth.admin.listUsers({ page: 1, perPage: 1000 }),
      supabase.from("customers").select("id, full_name, phone, rewards_points"),
      supabase.from("orders").select("customer_id, total"),
    ]);

  if (authError) throw authError;
  if (profileError) throw profileError;
  if (orderError) throw orderError;

  const profileById = new Map(
    (profiles ?? []).map((p) => [
      p.id as string,
      { fullName: (p.full_name as string | null) ?? "", phone: (p.phone as string | null) ?? "", rewardsPoints: (p.rewards_points as number) ?? 0 },
    ])
  );

  const ordersByCustomer = new Map<string, { count: number; total: number }>();
  for (const row of orderRows ?? []) {
    const customerId = row.customer_id as string | null;
    if (!customerId) continue;
    const existing = ordersByCustomer.get(customerId) ?? { count: 0, total: 0 };
    existing.count += 1;
    existing.total += Number(row.total);
    ordersByCustomer.set(customerId, existing);
  }

  return authUsers.users
    .map((user) => {
      const profile = profileById.get(user.id);
      const orderSummary = ordersByCustomer.get(user.id) ?? { count: 0, total: 0 };
      return {
        id: user.id,
        email: user.email ?? "",
        fullName: profile?.fullName ?? "",
        phone: profile?.phone ?? "",
        rewardsPoints: profile?.rewardsPoints ?? 0,
        createdAt: user.created_at,
        orderCount: orderSummary.count,
        totalSpent: orderSummary.total,
      };
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export interface AdminCoupon {
  code: string;
  percentOff: number | null;
  amountOff: number | null;
  active: boolean;
  expiresAt: string | null;
}

export async function listCoupons(): Promise<AdminCoupon[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("coupons")
    .select("code, percent_off, amount_off, active, expires_at")
    .order("code");
  if (error) throw error;
  return (data ?? []).map((row) => ({
    code: row.code as string,
    percentOff: row.percent_off != null ? Number(row.percent_off) : null,
    amountOff: row.amount_off != null ? Number(row.amount_off) : null,
    active: row.active as boolean,
    expiresAt: row.expires_at as string | null,
  }));
}

export interface AdminGiftCard {
  code: string;
  balance: number;
  issuedToEmail: string | null;
  createdAt: string;
}

export async function listGiftCards(): Promise<AdminGiftCard[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("gift_cards")
    .select("code, balance, issued_to_email, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    code: row.code as string,
    balance: Number(row.balance),
    issuedToEmail: row.issued_to_email as string | null,
    createdAt: row.created_at as string,
  }));
}

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  recentOrders: AdminOrder[];
}

export async function getDashboardStats(): Promise<AdminStats> {
  const supabase = createAdminClient();

  const [ordersResult, productCountResult, customerCountResult] = await Promise.all([
    supabase
      .from("orders")
      .select(ORDER_COLUMNS)
      .order("created_at", { ascending: false })
      .limit(500),
    supabase.from("products").select("slug", { count: "exact", head: true }),
    supabase.from("customers").select("id", { count: "exact", head: true }),
  ]);

  if (ordersResult.error) throw ordersResult.error;
  if (productCountResult.error) throw productCountResult.error;
  if (customerCountResult.error) throw customerCountResult.error;

  const orders = ((ordersResult.data ?? []) as unknown as OrderRow[]).map(mapOrder);

  return {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
    totalProducts: productCountResult.count ?? 0,
    totalCustomers: customerCountResult.count ?? 0,
    recentOrders: orders.slice(0, 8),
  };
}
