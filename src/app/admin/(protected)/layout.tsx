import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { logoutAdminAction } from "@/lib/admin/actions-auth";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/coupons", label: "Coupons" },
  { href: "/admin/gift-cards", label: "Gift Cards" },
];

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-cream font-sans text-ink">
      <div className="flex min-h-screen">
        <aside className="hidden w-56 shrink-0 border-r border-ink/10 bg-white p-6 md:block">
          <Link href="/admin" className="font-display text-xl text-ink">
            Coo<span className="text-cherry">M</span>ood
            <span className="ml-1 text-xs font-sans uppercase tracking-widest text-ink/40">Admin</span>
          </Link>
          <nav className="mt-8 flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm text-ink/70 transition-colors hover:bg-cream hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <form action={logoutAdminAction} className="mt-8">
            <button
              type="submit"
              className="rounded-lg px-3 py-2 text-xs uppercase tracking-wide text-ink/40 transition-colors hover:text-cherry"
            >
              Sign Out
            </button>
          </form>
        </aside>

        <div className="flex-1">
          <header className="flex items-center justify-between border-b border-ink/10 bg-white px-6 py-4 md:hidden">
            <Link href="/admin" className="font-display text-lg text-ink">
              CooMood Admin
            </Link>
            <form action={logoutAdminAction}>
              <button type="submit" className="text-xs uppercase tracking-wide text-ink/40">
                Sign Out
              </button>
            </form>
          </header>
          <nav className="flex gap-1 overflow-x-auto border-b border-ink/10 bg-white px-4 py-2 md:hidden">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-full px-3 py-1.5 text-xs text-ink/70 hover:bg-cream"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <main className="p-6 md:p-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
