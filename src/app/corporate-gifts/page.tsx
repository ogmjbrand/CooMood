import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Corporate Gifts",
  description: "Bulk and branded CooMood gifting for teams, clients, and events.",
};

export default function CorporateGiftsPage() {
  return (
    <>
      <PageHero
        eyebrow="For Business"
        title="Corporate Gifting"
        description="Bulk-order CooMood gift sets for clients, teams, and events — with custom labeling available for orders of 25+."
        dark
      />

      <section className="container-fluid grid grid-cols-1 items-center gap-14 py-24 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem]">
          <Image src="/images/gift-set-box.png" alt="CooMood corporate gift box" fill sizes="(min-width: 1024px) 45vw, 90vw" className="object-cover" />
        </div>
        <div>
          <SectionHeading eyebrow="Bulk Orders" title="Gifting at Scale, Without Losing the Luxury" align="left" className="items-start text-left" />
          <ul className="mt-6 space-y-3 font-sans text-sm text-ink/65">
            <li>&bull; Volume pricing starting at 25 units</li>
            <li>&bull; Custom label or ribbon branding available</li>
            <li>&bull; Dedicated account manager for orders of 100+</li>
            <li>&bull; Direct-to-recipient shipping for distributed teams</li>
          </ul>
          <a
            href="/contact"
            className="mt-8 inline-block rounded-full bg-gold px-8 py-4 font-sans text-xs uppercase tracking-[0.15em] text-ink transition-transform hover:scale-105"
          >
            Request a Quote
          </a>
        </div>
      </section>
    </>
  );
}
