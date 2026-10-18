import { getLocale } from "next-intl/server";
import { localizeProduct } from "@/lib/product-localization";
import { getSiteText } from "@/i18n/server";
import { formatProductSize } from "@/lib/product-size";
import type { Metadata } from "next";
import { connection } from "next/server";
import { CigarCollectionExperience } from "@/components/site/CigarCollectionExperience";
import { prisma } from "@/lib/prisma";
import { getProductImage } from "@/lib/product-images";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getSiteText();
  return { title: t("Cigar Collection"), description: t("Explore the Red Diamond Cigars collection and submit cigar inquiries for availability.") };
}

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

  const locale = await getLocale();
  const cigars = products.map(source => ({...localizeProduct(source, locale), formattedSize: formatProductSize(source)})).map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    image: getProductImage(product),
    size: product.formattedSize,
    wrapper: product.wrapper,
    strength: product.strength,
    packQuantity: product.packQuantity,
    boxQuantity: product.boxQuantity,
    singleValue: product.singleValue,
    packValue: product.packValue,
    boxValue: product.boxValue,

  }));

  return <CigarCollectionExperience cigars={cigars} />;
}
