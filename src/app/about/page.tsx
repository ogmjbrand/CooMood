import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "About",
  description: "About CooMood — founder Damien Cooper and the CooMood fragrance house.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About CooMood" title="Fragrance and More." />
      <section className="container-fluid grid grid-cols-1 gap-14 pb-24 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-[2.5rem]">
          <Image src="/images/logo-medallion.png" alt="CooMood emblem" fill sizes="(min-width: 1024px) 45vw, 90vw" className="object-cover" />
        </div>
        <div className="flex flex-col justify-center">
          <p className="font-sans text-sm leading-relaxed text-ink/65">
            CooMood is a fragrance house designing eau de parfum, cologne, body mist, perfume oils,
            reed diffusers, room sprays, candles, wax melts, car diffusers, gift sets, and fully
            custom fragrances. Customers can shop our signature collections or build their own
            fragrance with the CooMood Custom Scent Builder.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-6 border-t border-ink/10 pt-8">
            <div>
              <p className="font-sans text-xs uppercase tracking-wide text-ink/40">Founder</p>
              <p className="mt-1 font-display text-xl">Damien Cooper</p>
            </div>
            <div>
              <p className="font-sans text-xs uppercase tracking-wide text-ink/40">Contact</p>
              <p className="mt-1 font-display text-xl">+1 (773) 621-0630</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
