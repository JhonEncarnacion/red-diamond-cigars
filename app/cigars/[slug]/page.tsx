import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { InquiryForm } from "@/components/site/InquiryForm";
import { siteConfig } from "@/lib/site";
import { Metadata } from "next";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: {
      slug,
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
        <Image
          src={product.image ?? "/images/cigar-placeholder-image.png"}
          alt={product.name}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      <div>
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          {product.origin}
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          {product.name}
        </h1>

        <p className="mt-5 text-lg text-muted-foreground">
          {product.description}
        </p>

        <div className="mt-8 grid gap-4 rounded-xl border p-6 sm:grid-cols-2">
          <Detail label="Strength" value={product.strength} />
          <Detail label="Size" value={product.size} />
          <Detail label="Wrapper" value={product.wrapper} />
          <Detail label="Binder" value={product.binder} />
          <Detail label="Filler" value={product.filler} />
          <Detail label="Available Stock" value={`${product.stock}`} />
        </div>

        <div className="mt-8 rounded-xl border p-4">
          <p className="text-sm font-medium">Availability</p>

          {product.stock === 0 ? (
            <p className="mt-1 text-sm text-destructive">
              This cigar is currently out of stock. You can still send an
              inquiry to ask about future availability.
            </p>
          ) : product.stock <= 10 ? (
            <p className="mt-1 text-sm text-muted-foreground">
              Limited availability. Send an inquiry to confirm current stock.
            </p>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">
              Available for inquiry. Send a request to confirm quantity and
              availability.
            </p>
          )}
        </div>

        <div className="mt-8">
          <InquiryForm product={product} />
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: {
      slug,
    },
  });

  if (!product) {
    return {
      title: "Cigar Not Found",
    };
  }

  return {
    title: product.name,

    description: product.description,

    openGraph: {
      title: `${product.name} | ${siteConfig.name}`,

      description: product.description,

      url: `${siteConfig.url}/cigars/${product.slug}`,

      images: product.image ? [product.image] : undefined,
    },
  };
}

function Detail({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value ?? "Not listed"}</p>
    </div>
  );
}
