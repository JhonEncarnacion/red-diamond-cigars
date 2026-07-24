import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CigarCollectionExperience } from "@/components/site/CigarCollectionExperience";

export const metadata: Metadata = {
  title: "Cigar Collection",
  description:
    "Explore the Red Diamond Cigars collection and submit cigar inquiries for availability.",
};

export default async function CigarsPage() {
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
    image: product.image ?? "/images/cigar-placeholder-image.png",
    origin: product.origin,
    wrapper: product.wrapper,
    strength: product.strength,
  }));

  return <CigarCollectionExperience cigars={cigars} />;
}
