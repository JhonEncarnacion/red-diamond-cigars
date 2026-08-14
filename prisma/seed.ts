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
    where: { slug: "red-diamond-red-label" },
    update: {
      image: "/images/products/red-label.webp",
    },
    create: {
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
  });

  await prisma.product.upsert({
    where: { slug: "red-diamond-blue-label" },
    update: {
      image: "/images/products/blue-label.webp",
    },
    create: {
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
  });

  await prisma.product.upsert({
    where: { slug: "red-diamond-gold-label" },
    update: {
      image: "/images/products/gold-label.webp",
    },
    create: {
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
