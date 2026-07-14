import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ScentBuilder from "@/components/scent-builder/ScentBuilder";

export const metadata: Metadata = {
  title: "Custom Scent Builder",
  description:
    "Design your own signature fragrance — choose your bottle, cap, and notes, then preview it live before checkout.",
};

export default function CustomScentBuilderPage() {
  return (
    <>
      <PageHero
        eyebrow="One of One"
        title="Custom Scent Builder"
        description="Every note, every bottle, every label — yours to design. Build a fragrance that exists nowhere else."
      />
      <ScentBuilder />
    </>
  );
}
