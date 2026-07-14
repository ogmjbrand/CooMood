import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Our Story",
  description: "The story behind CooMood — fragrance built on the belief that scent should feel like power, not perfume.",
};

export default function OurStoryPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title="Scent Should Feel Like Power, Not Perfume."
        description="CooMood is a fragrance house founded on one belief: luxury should feel calm, luxury should last, luxury should be unforgettable."
        dark
      />

      <section className="container-fluid grid grid-cols-1 items-center gap-14 py-24 lg:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem]">
          <Image src="/images/bottle-hero-smoke.png" alt="CooMood founder's signature bottle" fill sizes="(min-width: 1024px) 45vw, 90vw" className="object-cover" />
        </div>
        <div>
          <SectionHeading eyebrow="How We Started" title="Founded on a Feeling" align="left" className="items-start text-left" />
          <p className="mt-6 max-w-lg font-sans text-sm leading-relaxed text-ink/65">
            Damien Cooper started CooMood after a decade spent watching the fragrance industry sell
            noise instead of feeling — heavy sillage marketed as luxury, packaging that fell apart in
            a drawer. He wanted to build something different: fragrances engineered to calm the mind
            first, and impress second.
          </p>
          <p className="mt-4 max-w-lg font-sans text-sm leading-relaxed text-ink/65">
            Today, CooMood creates eau de parfum, cologne, body mist, perfume oils, reed diffusers,
            room sprays, candles, wax melts, car diffusers, gift sets, and fully custom fragrances —
            for your body and the spaces you live in.
          </p>
        </div>
      </section>

      <section className="bg-ink py-24 text-cream">
        <div className="container-fluid grid grid-cols-1 gap-10 sm:grid-cols-3">
          {[
            { title: "Calm", copy: "Every formula starts by asking: does this feel calm on skin, not overwhelming?" },
            { title: "Last", copy: "We engineer for longevity first. A fragrance you love should stay with you." },
            { title: "Unforgettable", copy: "Packaging, scent, and experience designed to be remembered, not just worn." },
          ].map((v) => (
            <div key={v.title} className="rounded-[2rem] border border-cream/10 p-8">
              <h3 className="font-display text-2xl text-gold">{v.title}</h3>
              <p className="mt-3 font-sans text-sm text-cream/60">{v.copy}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
