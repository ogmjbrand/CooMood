"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/lib/store/cart";
import { useWishlistStore } from "@/lib/store/wishlist";
import { createClient } from "@/lib/supabase/client";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/custom-scent-builder", label: "Custom Scent Builder" },
  { href: "/home-fragrance", label: "Home Fragrance" },
  { href: "/gift-sets", label: "Gift Sets" },
  { href: "/our-story", label: "Our Story" },
  { href: "/journal", label: "Journal" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const cartCount = useCartStore((s) => s.count());
  const openCart = useCartStore((s) => s.open);
  const wishlistCount = useWishlistStore((s) => s.slugs.length);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setSignedIn(Boolean(data.user)));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session?.user));
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-500",
          scrolled ? "py-3" : "py-6"
        )}
      >
        <div
          className={cn(
            "container-fluid flex items-center justify-between rounded-full glass transition-all duration-500",
            scrolled ? "py-2 shadow-[0_8px_32px_rgba(17,17,17,0.08)]" : "py-2.5"
          )}
        >
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="font-display text-2xl tracking-wide text-ink">
              Coo<span className="text-cherry">M</span>ood
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 font-sans text-[0.72rem] uppercase tracking-[0.12em] text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/search"
              aria-label="Search"
              className="hidden h-10 w-10 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink sm:flex"
            >
              <Search size={18} strokeWidth={1.5} />
            </Link>
            <Link
              href={signedIn ? "/account" : "/login"}
              aria-label={signedIn ? "Account" : "Sign In"}
              className="hidden h-10 w-10 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink sm:flex"
            >
              <User size={18} strokeWidth={1.5} />
            </Link>
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative hidden h-10 w-10 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink sm:flex"
            >
              <Heart size={18} strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-cherry text-[9px] font-semibold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button
              onClick={openCart}
              aria-label="Cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-cherry text-[9px] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink lg:hidden"
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-cream lg:hidden"
          >
            <div className="container-fluid flex items-center justify-between py-6">
              <span className="font-display text-2xl">
                Coo<span className="text-cherry">M</span>ood
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-ink/5"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>
            <nav className="container-fluid mt-8 flex flex-col gap-2">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-display block border-b border-ink/10 py-4 text-3xl"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-6 flex gap-6 font-sans text-sm uppercase tracking-wide text-ink/60">
                <Link href={signedIn ? "/account" : "/login"} onClick={() => setMobileOpen(false)}>
                  {signedIn ? "Account" : "Sign In"}
                </Link>
                <Link href="/wishlist" onClick={() => setMobileOpen(false)}>
                  Wishlist
                </Link>
                <Link href="/contact" onClick={() => setMobileOpen(false)}>
                  Contact
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
