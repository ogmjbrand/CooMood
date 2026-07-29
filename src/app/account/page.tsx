import { redirect } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import AccountDashboard from "@/components/account/AccountDashboard";
import { createClient } from "@/lib/supabase/server";
import { getAddresses, getCustomer, getOrders, getProducts } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [customer, addresses, orders, products] = await Promise.all([
    getCustomer(user.id, user.email ?? ""),
    getAddresses(user.id),
    getOrders(user.id),
    getProducts(),
  ]);

  return (
    <>
      <PageHero eyebrow="My Account" title="Welcome Back" />
      <AccountDashboard customer={customer} addresses={addresses} orders={orders} products={products} />
    </>
  );
}
