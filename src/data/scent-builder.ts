export interface BuilderOption {
  id: string;
  name: string;
  price: number;
  color?: string;
  description?: string;
}

export const bottleOptions: BuilderOption[] = [
  { id: "dome", name: "Dome Classic", price: 0, description: "Rounded silhouette, gold sphere cap" },
  { id: "angular", name: "Angular Noir", price: 12, description: "Sharp faceted glass, matte finish" },
  { id: "flask", name: "Heritage Flask", price: 18, description: "Vintage apothecary flask shape" },
];

export const capOptions: BuilderOption[] = [
  { id: "gold-dome", name: "Gold Dome", price: 0, color: "#c8a96a" },
  { id: "black-matte", name: "Black Matte", price: 8, color: "#111111" },
  { id: "cherry-lacquer", name: "Cherry Lacquer", price: 10, color: "#8b1120" },
];

export const glassColorOptions: BuilderOption[] = [
  { id: "clear", name: "Clear", price: 0, color: "rgba(248,245,239,0.35)" },
  { id: "amber", name: "Amber", price: 6, color: "rgba(200,140,40,0.55)" },
  { id: "cherry", name: "Cherry Smoke", price: 6, color: "rgba(139,17,32,0.55)" },
  { id: "onyx", name: "Onyx", price: 10, color: "rgba(17,17,17,0.75)" },
];

export const topNotes: BuilderOption[] = [
  { id: "bergamot", name: "Bergamot", price: 0 },
  { id: "pink-pepper", name: "Pink Pepper", price: 0 },
  { id: "grapefruit", name: "Grapefruit", price: 0 },
  { id: "saffron", name: "Saffron", price: 4 },
  { id: "green-tea", name: "Green Tea", price: 0 },
];

export const middleNotes: BuilderOption[] = [
  { id: "jasmine", name: "Jasmine", price: 0 },
  { id: "rose", name: "Rose Absolute", price: 4 },
  { id: "oud-heart", name: "Oud Heart", price: 8 },
  { id: "iris", name: "Iris", price: 0 },
  { id: "tobacco-flower", name: "Tobacco Flower", price: 4 },
];

export const baseNotes: BuilderOption[] = [
  { id: "amber", name: "Amber", price: 0 },
  { id: "sandalwood", name: "Sandalwood", price: 4 },
  { id: "musk", name: "White Musk", price: 0 },
  { id: "vetiver", name: "Vetiver", price: 0 },
  { id: "oud-base", name: "Oud", price: 10 },
];

export const packagingOptions: BuilderOption[] = [
  { id: "standard", name: "Standard Box", price: 0 },
  { id: "gift-box", name: "Velvet Gift Box", price: 15 },
  { id: "wax-seal", name: "Gift Box + Wax Seal Ribbon", price: 22 },
];

export const BASE_PRICE = 145;
export const SIZE_OPTIONS = [
  { id: "30ml", name: "30ml", multiplier: 0.55 },
  { id: "50ml", name: "50ml", multiplier: 0.8 },
  { id: "100ml", name: "100ml", multiplier: 1 },
];
