"use client";

import Link from "next/link";
import { useState } from "react";
import { Send } from "lucide-react";
import { InstagramIcon, TikTokIcon } from "@/components/icons/BrandIcons";
import { subscribeToNewsletter } from "@/lib/newsletter";

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All Fragrances" },
      { href: "/collections", label: "Collections" },
      { href: "/custom-scent-builder", label: "Custom Scent Builder" },
      { href: "/home-fragrance", label: "Home Fragrance" },
      { href: "/gift-sets", label: "Gift Sets" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/our-story", label: "Our Story" },
      { href: "/about", label: "About" },
      { href: "/journal", label: "Journal" },
      { href: "/corporate-gifts", label: "Corporate Gifts" },
      { href: "/stores", label: "Stores" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/faqs", label: "FAQs" },
      { href: "/contact", label: "Contact" },
      { href: "/order-tracking", label: "Order Tracking" },
      { href: "/returns", label: "Returns" },
      { href: "/search", label: "Search" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/returns", label: "Returns Policy" },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <footer className="relative overflow-hidden bg-ink text-cream">
      <div className="container-fluid grid grid-cols-1 gap-14 py-20 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <span className="font-display text-3xl tracking-wide">
            Coo<span className="text-gold">M</span>ood
          </span>
          <p className="mt-2 font-sans text-xs uppercase tracking-[0.3em] text-cream/50">
            Fragrance and more.
          </p>
          <p className="mt-6 max-w-sm font-sans text-sm leading-relaxed text-cream/60">
            Luxury fragrances for your body and the spaces you live in. Scent should feel like
            power, not perfume.
          </p>

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await subscribeToNewsletter(email);
                setSubmitted(true);
              } catch {
                setSubmitted(false);
              }
            }}
            className="mt-8 flex max-w-sm items-center gap-2 rounded-full border border-cream/20 bg-cream/5 p-1.5 pl-5"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="w-full bg-transparent font-sans text-sm text-cream placeholder:text-cream/40 focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold text-ink transition-transform hover:scale-105"
            >
              <Send size={15} />
            </button>
          </form>
          {submitted && (
            <p className="mt-3 font-sans text-xs text-gold">
              You&apos;re on the list. Welcome to CooMood.
            </p>
          )}

          <div className="mt-8 flex gap-3">
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 transition-colors hover:border-gold hover:text-gold"
            >
              <InstagramIcon size={16} />
            </a>
            <a
              href="#"
              aria-label="TikTok"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 transition-colors hover:border-gold hover:text-gold"
            >
              <TikTokIcon size={16} />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-gold">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm text-cream/60 transition-colors hover:text-cream"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-fluid flex flex-col items-center justify-between gap-3 py-6 font-sans text-xs text-cream/40 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} CooMood. All rights reserved.</p>
          <p>Founded by Damien Cooper &middot; +1 (773) 621-0630</p>
        </div>
      </div>
    </footer>
  );
}
