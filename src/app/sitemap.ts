import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { collections } from "@/data/collections";
import { journalPosts } from "@/data/journal";

const BASE_URL = "https://coomood.com";

const STATIC_ROUTES = [
  "",
  "/shop",
  "/collections",
  "/custom-scent-builder",
  "/our-story",
  "/about",
  "/journal",
  "/gift-sets",
  "/corporate-gifts",
  "/home-fragrance",
  "/stores",
  "/faqs",
  "/contact",
  "/wishlist",
  "/cart",
  "/checkout",
  "/account",
  "/order-tracking",
  "/privacy-policy",
  "/terms",
  "/returns",
  "/search",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));

  const productEntries = products.map((p) => ({
    url: `${BASE_URL}/shop/${p.slug}`,
    lastModified: new Date(),
  }));

  const collectionEntries = collections
    .filter((c) => c.slug !== "custom")
    .map((c) => ({
      url: `${BASE_URL}/collections/${c.slug}`,
      lastModified: new Date(),
    }));

  const journalEntries = journalPosts.map((p) => ({
    url: `${BASE_URL}/journal/${p.slug}`,
    lastModified: new Date(p.date),
  }));

  return [...staticEntries, ...productEntries, ...collectionEntries, ...journalEntries];
}
