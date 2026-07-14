import PageHero from "@/components/ui/PageHero";
import AccountDashboard from "@/components/account/AccountDashboard";
import { getProducts } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const products = await getProducts();

  return (
    <>
      <PageHero eyebrow="My Account" title="Welcome Back" />
      <AccountDashboard products={products} />
    </>
  );
}
