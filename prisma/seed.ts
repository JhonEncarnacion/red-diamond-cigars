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
    where: { slug: "toro-habano-corojo-red" },
    update: {
      name: "Toro Habano Corojo Red",
      image: "/images/products/toro-habano-corojo-red.webp",
    },
    create: {
      name: "Toro Habano Corojo Red",
      slug: "toro-habano-corojo-red",
      description:
        "This is a limited edition version of the world's greatest cigar collection.",
      wrapper: "Gold",
      binder: "Translucent",
      filler: "Mystery",
      origin: "Dominican Republic",
      size: "Medium",
      strength: "Powerful",
      stock: 4,
      image: "/images/products/toro-habano-corojo-red.webp",
    },
  });

  await prisma.product.upsert({
    where: { slug: "toro-habano-ecuador-black" },
    update: {
      name: "Toro Habano Ecuador Black",
      image: "/images/products/toro-habano-ecuador-black.webp",
    },
    create: {
      name: "Toro Habano Ecuador Black",
      slug: "toro-habano-ecuador-black",
      description:
        "An intense version of the normal red diamond cigars for an extra kick!",
      wrapper: "Stealth",
      binder: "Dark",
      filler: "Mist",
      origin: "New York",
      size: "Massive",
      strength: "Intense",
      stock: 0,
      image: "/images/products/toro-habano-ecuador-black.webp",
    },
  });

  await prisma.product.upsert({
    where: { slug: "maduro-san-andres-gold" },
    update: {
      name: "Maduro San Andres Gold",
      image: "/images/products/maduro-san-andres-gold.webp",
    },
    create: {
      name: "Maduro San Andres Gold",
      slug: "maduro-san-andres-gold",
      description:
        "The most premium cigar on the market. Exclusive to only the rich.",
      wrapper: "Habano",
      binder: "Criollo",
      filler: "Volado",
      origin: "Dominican Republic",
      size: "Robusto",
      strength: "Medium",
      stock: 17,
      image: "/images/products/maduro-san-andres-gold.webp",
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
