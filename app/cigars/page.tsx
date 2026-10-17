import { formatProductSize } from "@/lib/product-size";
import type { Metadata } from "next";
import { connection } from "next/server";
import { CigarCollectionExperience } from "@/components/site/CigarCollectionExperience";
import { prisma } from "@/lib/prisma";
import { getProductImage } from "@/lib/product-images";

export const metadata: Metadata = {
  title: "Cigar Collection",
  description:
    "Explore the Red Diamond Cigars collection and submit cigar inquiries for availability.",
};

export default async function CigarsPage() {
  await connection();

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const cigars = products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    image: getProductImage(product),
    size: formatProductSize(product),
    wrapper: product.wrapper,
    strength: product.strength,
  }));

  return <CigarCollectionExperience cigars={cigars} />;
}
