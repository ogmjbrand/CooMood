import type { Collection } from "@/types";

export const collections: Collection[] = [
  {
    slug: "energetic",
    name: "Energetic",
    tagline: "Fresh. Bright. Uplifting.",
    description:
      "Citrus-lit top notes and airy florals for mornings that move fast. Energetic is the collection for clarity — scent that wakes up a room the way light does.",
    image: "/images/bottle-hero-marble.png",
    mood: ["energetic", "fresh", "bright", "uplifting"],
  },
  {
    slug: "attractive",
    name: "Attractive",
    tagline: "Warm. Magnetic. Sensual.",
    description:
      "Skin-warm ambers and soft musks built to linger just close enough. Attractive is presence without effort — the scent people lean in to ask about.",
    image: "/images/bottle-hero-marble-2.png",
    mood: ["attractive", "warm", "magnetic", "sensual"],
  },
  {
    slug: "bold",
    name: "Bold",
    tagline: "Powerful. Luxury. Confident.",
    description:
      "Dark woods, leather, and resin layered for maximum presence. Bold is the signature — worn by those who don't need to raise their voice.",
    image: "/images/collection-bold-dark.png",
    mood: ["bold", "powerful", "luxury", "confident"],
  },
  {
    slug: "custom",
    name: "Custom",
    tagline: "Build your own.",
    description:
      "Every note, every bottle, every label — yours to design. The Custom Scent Builder turns fragrance into a one-of-one signature.",
    image: "/images/gift-set-box.png",
    mood: ["luxury", "confident"],
  },
];

export const aromaKindTags = [
  "soft",
  "peaceful",
  "grounding",
  "energetic",
  "fresh",
  "bright",
  "uplifting",
  "attractive",
  "warm",
  "magnetic",
  "sensual",
  "bold",
  "powerful",
  "luxury",
  "confident",
] as const;
