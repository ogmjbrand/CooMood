import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Service" />
      <div className="container-fluid max-w-3xl space-y-6 pb-24 font-sans text-sm leading-relaxed text-ink/70">
        <p>Last updated: July 2026</p>
        <h2 className="font-display text-2xl text-ink">Orders & Payment</h2>
        <p>
          All prices are listed in USD. Orders are confirmed once payment is successfully processed.
          CooMood reserves the right to cancel or refuse any order at our discretion.
        </p>
        <h2 className="font-display text-2xl text-ink">Custom Fragrances</h2>
        <p>
          Custom Scent Builder orders are made to order and, once production begins, cannot be
          cancelled or modified. See our Returns policy for details on custom fragrance exchanges.
        </p>
        <h2 className="font-display text-2xl text-ink">Intellectual Property</h2>
        <p>
          All content on this site — including the CooMood name, logo, formulas, and photography — is
          the property of CooMood and may not be reproduced without written permission.
        </p>
        <h2 className="font-display text-2xl text-ink">Limitation of Liability</h2>
        <p>
          CooMood products are for external use only. Discontinue use if irritation occurs. We are
          not liable for allergic reactions; ingredient lists are provided on every product page.
        </p>
      </div>
    </>
  );
}
