import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = { title: "Returns" };

export default function ReturnsPage() {
  return (
    <>
      <PageHero eyebrow="Support" title="Returns & Exchanges" />
      <div className="container-fluid max-w-3xl space-y-6 pb-24 font-sans text-sm leading-relaxed text-ink/70">
        <h2 className="font-display text-2xl text-ink">30-Day Return Window</h2>
        <p>
          Unopened products may be returned within 30 days of delivery for a full refund. Opened
          fragrances can be exchanged for store credit within 14 days of delivery.
        </p>
        <h2 className="font-display text-2xl text-ink">Custom Fragrances</h2>
        <p>
          Because Custom Scent Builder orders are hand-blended to order, they are final sale. If
          something arrived damaged or incorrect, contact us within 7 days and we will make it right.
        </p>
        <h2 className="font-display text-2xl text-ink">How to Start a Return</h2>
        <p>
          Email hello@coomood.com or call +1 (773) 621-0630 with your order number. We&apos;ll send a
          prepaid return label for eligible items within the US.
        </p>
        <h2 className="font-display text-2xl text-ink">Refund Timing</h2>
        <p>
          Refunds are issued to your original payment method within 5-7 business days of us receiving
          your return.
        </p>
      </div>
    </>
  );
}
