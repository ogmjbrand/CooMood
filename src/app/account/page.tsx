import { redirect } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import AccountDashboard from "@/components/account/AccountDashboard";
import DataUnavailable from "@/components/ui/DataUnavailable";
import { createClient } from "@/lib/supabase/server";
import { getAddresses, getCustomer, getOrders, getProducts } from "@/lib/supabase/queries";
import { withTimeout } from "@/lib/safeFetch";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const auth = await (async () => {
    try {
      const supabase = await createClient();
      const { data } = await withTimeout(supabase.auth.getUser());
      return { ok: true as const, user: data.user };
    } catch (error) {
      console.error("[AccountPage] failed to verify session:", error);
      return { ok: false as const };
    }
  })();

  if (!auth.ok) {
    return (
      <>
        <PageHero eyebrow="My Account" title="Welcome Back" />
        <div className="container-fluid pb-24">
          <DataUnavailable message="We couldn't verify your session right now. Please try again shortly." />
        </div>
      </>
    );
  }

  if (!auth.user) redirect("/login");
  const user = auth.user;

  try {
    const [customer, addresses, orders, products] = await withTimeout(
      Promise.all([
        getCustomer(user.id, user.email ?? ""),
        getAddresses(user.id),
        getOrders(user.id),
        getProducts(),
      ])
    );

    return (
      <>
        <PageHero eyebrow="My Account" title="Welcome Back" />
        <AccountDashboard customer={customer} addresses={addresses} orders={orders} products={products} />
      </>
    );
  } catch (error) {
    console.error("[AccountPage] failed to load account data:", error);
    return (
      <>
        <PageHero eyebrow="My Account" title="Welcome Back" />
        <div className="container-fluid pb-24">
          <DataUnavailable message="Your account is temporarily unavailable. Please check back shortly." />
        </div>
      </>
    );
  }
}
