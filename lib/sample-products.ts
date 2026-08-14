export const sampleProducts = [
  {
    id: "1",
    name: "Red Label",
    slug: "red-diamond-red-label",
    description:
      "This is a limited edition version of the world's greatest cigar collection.",
    wrapper: "Gold",
    binder: "Translucent",
    filler: "Mystery",
    origin: "Dominican Republic",
    size: "Medium",
    strength: "Powerful",
    stock: 4,
    image: "/images/products/red-label.webp",
  },
  {
    id: "2",
    name: "Blue Label",
    slug: "red-diamond-blue-label",
    description:
      "An intense version of the normal red diamond cigars for an extra kick!",
    wrapper: "Stealth",
    binder: "Dark",
    filler: "Mist",
    origin: "New York",
    size: "Massive",
    strength: "Intense",
    stock: 0,
    image: "/images/products/blue-label.webp",
  },
  {
    id: "3",
    name: "Gold Label",
    slug: "red-diamond-gold-label",
    description:
      "The most premium cigar on the market. Exclusive to only the rich.",
    wrapper: "Habano",
    binder: "Criollo",
    filler: "Volado",
    origin: "Dominican Republic",
    size: "Robusto",
    strength: "Medium",
    stock: 17,
    image: "/images/products/gold-label.webp",
  },
];

export type Product = (typeof sampleProducts)[number];
