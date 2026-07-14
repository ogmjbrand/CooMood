import type { Metadata } from "next";
import { MapPin, Phone } from "lucide-react";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Stores",
  description: "Visit a CooMood boutique in person.",
};

const stores = [
  { city: "Chicago Flagship", address: "212 N Michigan Ave, Chicago, IL 60601", phone: "+1 (773) 621-0630" },
  { city: "New York", address: "45 Spring St, New York, NY 10012", phone: "+1 (212) 555-0148" },
  { city: "Los Angeles", address: "8500 Melrose Ave, West Hollywood, CA 90069", phone: "+1 (310) 555-0172" },
];

export default function StoresPage() {
  return (
    <>
      <PageHero eyebrow="Visit Us" title="Stores" description="Experience the full collection in person at a CooMood boutique." />
      <div className="container-fluid grid grid-cols-1 gap-14 pb-24 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          {stores.map((s) => (
            <div key={s.city} className="rounded-[2rem] bg-white p-8">
              <h2 className="font-display text-2xl">{s.city}</h2>
              <p className="mt-3 flex items-start gap-2 font-sans text-sm text-ink/60">
                <MapPin size={16} className="mt-0.5 shrink-0 text-gold-dark" /> {s.address}
              </p>
              <p className="mt-2 flex items-center gap-2 font-sans text-sm text-ink/60">
                <Phone size={16} className="text-gold-dark" /> {s.phone}
              </p>
            </div>
          ))}
        </div>
        <div className="min-h-[420px] overflow-hidden rounded-[2rem] bg-grey">
          <iframe
            title="CooMood store locations map"
            className="h-full w-full min-h-[420px] border-0"
            loading="lazy"
            src="https://www.google.com/maps?q=Chicago,IL&output=embed"
          />
        </div>
      </div>
    </>
  );
}
