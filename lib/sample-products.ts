export const sampleProducts = [
  {
    id: "1",
    name: "Reserva Especial Robusto",
    slug: "reserva-especial-robusto",
    description:
      "A medium-bodied handmade cigar with smooth notes of cedar, cocoa, and light spice.",
    wrapper: "Habano",
    binder: "Dominican",
    filler: "Dominican",
    origin: "Dominican Republic",
    size: "Robusto",
    strength: "Medium",
    stock: 25,
    image: "/images/cigar-placeholder-image.png",
  },
  {
    id: "2",
    name: "Maduro Toro",
    slug: "maduro-toro",
    description:
      "A full-bodied cigar with rich notes of dark chocolate, espresso, earth, and pepper.",
    wrapper: "Maduro",
    binder: "Dominican",
    filler: "Dominican",
    origin: "Dominican Republic",
    size: "Toro",
    strength: "Full",
    stock: 12,
    image: "/images/cigar-placeholder-image.png",
  },
  {
    id: "3",
    name: "Claro Churchill",
    slug: "claro-churchill",
    description:
      "A mild cigar with a smooth, creamy profile, light cedar, and subtle natural sweetness.",
    wrapper: "Claro",
    binder: "Dominican",
    filler: "Dominican",
    origin: "Dominican Republic",
    size: "Churchill",
    strength: "Mild",
    stock: 18,
    image: "/images/cigar-placeholder-image.png",
  },
];

export type Product = (typeof sampleProducts)[number];
