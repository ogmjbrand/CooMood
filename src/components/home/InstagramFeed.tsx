import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import { InstagramIcon } from "@/components/icons/BrandIcons";

const images = [
  "/images/bottle-hero-marble.png",
  "/images/bottle-hero-marble-2.png",
  "/images/bottle-hero-smoke.png",
  "/images/collection-bold-dark.png",
  "/images/product-family-full.png",
  "/images/gift-set-box.png",
];

export default function InstagramFeed() {
  return (
    <section className="bg-white py-28">
      <div className="container-fluid">
        <SectionHeading eyebrow="@coomood" title="Follow the Mood" />
        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {images.map((src, i) => (
            <a
              key={src + i}
              href="#"
              className={`group relative block overflow-hidden rounded-2xl bg-cream ${
                i % 5 === 0 ? "aspect-square sm:col-span-2 sm:row-span-2 sm:aspect-auto" : "aspect-square"
              }`}
            >
              <Image
                src={src}
                alt="CooMood on Instagram"
                fill
                sizes="(min-width: 1024px) 16vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors duration-300 group-hover:bg-ink/40">
                <InstagramIcon
                  size={22}
                  className="text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
