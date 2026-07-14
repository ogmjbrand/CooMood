import type { JournalPost } from "@/types";

export const journalPosts: JournalPost[] = [
  {
    slug: "art-of-layering-fragrance",
    title: "The Art of Layering Fragrance",
    excerpt:
      "How to combine an eau de parfum, a body mist, and a home scent so your signature follows you into every room.",
    image: "/images/bottle-hero-marble.png",
    date: "2026-06-12",
    category: "Guides",
    readTime: "5 min read",
  },
  {
    slug: "inside-the-custom-scent-builder",
    title: "Inside the Custom Scent Builder",
    excerpt:
      "A look at how we translate three note families and a bottle silhouette into a fragrance that's entirely yours.",
    image: "/images/gift-set-box.png",
    date: "2026-05-28",
    category: "Behind the Brand",
    readTime: "7 min read",
  },
  {
    slug: "why-longevity-matters",
    title: "Why Longevity Matters More Than Sillage",
    excerpt:
      "Long-lasting doesn't mean loud. Here's how we engineer fragrances that last without overwhelming a room.",
    image: "/images/bottle-hero-smoke.png",
    date: "2026-05-03",
    category: "Education",
    readTime: "4 min read",
  },
  {
    slug: "gifting-guide-for-every-mood",
    title: "A Gifting Guide for Every Mood",
    excerpt:
      "From Energetic to Bold, a note-by-note guide to choosing a CooMood gift for the person on your list.",
    image: "/images/packaging-showcase.png",
    date: "2026-04-09",
    category: "Gifting",
    readTime: "6 min read",
  },
];

export function getJournalPostBySlug(slug: string) {
  return journalPosts.find((p) => p.slug === slug);
}
