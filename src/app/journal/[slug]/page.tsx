import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { journalPosts, getJournalPostBySlug } from "@/data/journal";

export function generateStaticParams() {
  return journalPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getJournalPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getJournalPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="pt-32 pb-24">
      <div className="container-fluid max-w-3xl">
        <p className="font-sans text-xs uppercase tracking-wide text-gold-dark">
          {post.category} &middot; {post.readTime}
        </p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">{post.title}</h1>
        <p className="mt-4 font-sans text-sm text-ink/45">
          {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-[2rem]">
          <Image src={post.image} alt={post.title} fill sizes="90vw" className="object-cover" />
        </div>

        <div className="prose prose-neutral mt-10 max-w-none font-sans text-base leading-relaxed text-ink/75">
          <p>{post.excerpt}</p>
          <p className="mt-6">
            At CooMood, every fragrance decision traces back to one question: does this make someone
            feel calmer, more confident, more themselves? This piece is part of our ongoing Journal —
            where we share the thinking behind our formulas, our packaging, and the Custom Scent
            Builder experience.
          </p>
          <p className="mt-6">
            Want to put this into practice? Explore the{" "}
            <Link href="/custom-scent-builder" className="text-cherry underline">
              Custom Scent Builder
            </Link>{" "}
            or browse our{" "}
            <Link href="/collections" className="text-cherry underline">
              Aroma Kind collections
            </Link>
            .
          </p>
        </div>
      </div>
    </article>
  );
}
