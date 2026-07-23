import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.product.upsert({
    where: { slug: "reserva-especial-robusto" },
    update: {},
    create: {
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
  });

  await prisma.product.upsert({
    where: { slug: "maduro-toro" },
    update: {},
    create: {
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
  });

  await prisma.product.upsert({
    where: { slug: "claro-churchill" },
    update: {},
    create: {
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
  });

  console.log("Seeded products successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
