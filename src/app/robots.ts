import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/account", "/checkout", "/cart", "/api/"],
      },
    ],
    sitemap: "https://coomood.com/sitemap.xml",
  };
}
