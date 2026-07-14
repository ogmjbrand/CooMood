import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import { journalPosts } from "@/data/journal";

export const metadata: Metadata = {
  title: "Journal",
  description: "Fragrance guides, layering tips, and stories from behind the CooMood brand.",
};

export default function JournalPage() {
  return (
    <>
      <PageHero eyebrow="Journal" title="Notes on Fragrance" description="Guides, education, and stories from behind the brand." />
      <div className="container-fluid grid grid-cols-1 gap-10 pb-24 sm:grid-cols-2 lg:grid-cols-3">
        {journalPosts.map((post) => (
          <Link key={post.slug} href={`/journal/${post.slug}`} className="group">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-white">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(min-width: 1024px) 33vw, 90vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <p className="mt-4 font-sans text-xs uppercase tracking-wide text-gold-dark">
              {post.category} &middot; {post.readTime}
            </p>
            <h2 className="mt-1 font-display text-2xl leading-snug">{post.title}</h2>
            <p className="mt-2 font-sans text-sm text-ink/60">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
