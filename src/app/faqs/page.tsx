import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import FAQAccordion from "@/components/faqs/FAQAccordion";
import { faqs } from "@/data/faqs";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Answers to common questions about CooMood orders, shipping, custom fragrances, and returns.",
};

export default function FAQsPage() {
  return (
    <>
      <PageHero eyebrow="Support" title="Frequently Asked Questions" />
      <div className="container-fluid max-w-3xl pb-24">
        <FAQAccordion items={faqs} />
      </div>
    </>
  );
}
