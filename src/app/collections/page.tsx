import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import { collections, aromaKindTags } from "@/data/collections";

export const metadata: Metadata = {
  title: "Collections",
  description: "Explore CooMood's Aroma Kind collections — Energetic, Attractive, Bold, and Custom.",
};

export default function CollectionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Aroma Kind"
        title="Collections"
        description="Every CooMood fragrance belongs to a mood. Find yours, or build one from scratch."
      />

      <section className="container-fluid pb-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {collections.map((c) => (
            <Link
              key={c.slug}
              href={c.slug === "custom" ? "/custom-scent-builder" : `/collections/${c.slug}`}
              className="group relative block aspect-[16/11] overflow-hidden rounded-[2rem] bg-ink"
            >
              <Image
                src={c.image}
                alt={c.name}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover opacity-80 transition-transform duration-[1200ms] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8">
                <p className="font-sans text-xs uppercase tracking-[0.25em] text-gold-light">
                  {c.tagline}
                </p>
                <h2 className="mt-2 font-display text-4xl text-cream">{c.name}</h2>
                <p className="mt-3 max-w-sm font-sans text-sm text-cream/70">{c.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-fluid">
          <h2 className="font-display text-3xl">Browse by Mood</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            {aromaKindTags.map((tag) => (
              <Link
                key={tag}
                href={`/shop?mood=${tag}`}
                className="rounded-full border border-ink/15 px-5 py-2.5 font-sans text-xs capitalize tracking-wide text-ink/70 transition-colors hover:border-gold hover:text-ink"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
