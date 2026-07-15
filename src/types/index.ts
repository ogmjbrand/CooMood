export type ProductCategory =
  | "eau-de-parfum"
  | "extrait-de-parfum"
  | "cologne"
  | "body-mist"
  | "perfume-oil"
  | "reed-diffuser"
  | "room-spray"
  | "candle"
  | "wax-melt"
  | "car-diffuser"
  | "gift-set";

export type MoodTag =
  | "soft"
  | "peaceful"
  | "grounding"
  | "energetic"
  | "fresh"
  | "bright"
  | "uplifting"
  | "attractive"
  | "warm"
  | "magnetic"
  | "sensual"
  | "bold"
  | "powerful"
  | "luxury"
  | "confident";

export type Gender = "unisex" | "feminine" | "masculine";
export type Season = "spring" | "summer" | "autumn" | "winter" | "all-season";
export type Longevity = "light" | "moderate" | "long-lasting" | "eternal";

export interface ProductNotes {
  top: string[];
  middle: string[];
  base: string[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  date: string;
  video?: boolean;
}

export interface Product {
  slug: string;
  name: string;
  category: ProductCategory;
  collection: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  gallery: string[];
  description: string;
  story: string;
  notes: ProductNotes;
  mood: MoodTag[];
  gender: Gender;
  season: Season[];
  longevity: Longevity;
  occasion: string[];
  size: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  featured?: boolean;
  new?: boolean;
  bestseller?: boolean;
}

export interface Collection {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  mood: MoodTag[];
}

export interface JournalPost {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  readTime: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export interface CartLine {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  size: string;
  quantity: number;
  custom?: boolean;
}
