import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { InquiryForm } from "@/components/site/InquiryForm";
import { siteConfig } from "@/lib/site";
import type { Metadata } from "next";

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
    <main className="relative min-h-screen overflow-hidden bg-[#050000] text-[#f8efe3]">
      {/* Page background */}
      <div className="absolute inset-0 page-bg-luxury" />
      <div className="absolute inset-0 page-bg-texture" />
      <div className="absolute inset-0 bg-black/25" />

      <section className="relative z-10 mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-36 lg:grid-cols-[0.95fr_1.05fr]">
        {/* Left image */}
        <div className="lg:sticky lg:top-32 lg:h-fit">
          <div className="relative aspect-square overflow-hidden border border-[#f5cd7a]/20 bg-black/35 shadow-[0_40px_120px_rgba(0,0,0,0.6)] backdrop-blur-md">
            <div className="absolute inset-0 z-10 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.04),rgba(0,0,0,0.42))]" />
            <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.48))]" />

            <Image
              src={product.image ?? "/images/cigar-placeholder-image.png"}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-1600 hover:scale-105"
            />
          </div>
        </div>

        {/* Right content */}
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.5em] text-[#f5cd7a]">
            {product.origin ?? "Origin not listed"}
          </p>

          <h1 className="mt-5 font-serif text-5xl font-semibold leading-tight tracking-[0.04em] text-[#f8efe3] sm:text-6xl">
            {product.name}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[#b8a99a]">
            {product.description}
          </p>

          <div className="mt-8 border border-[#f5cd7a]/20 bg-black/30 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-md">
            <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              <Detail label="Strength" value={product.strength} />
              <Detail label="Size" value={product.size} />
              <Detail label="Wrapper" value={product.wrapper} />
              <Detail label="Binder" value={product.binder} />
              <Detail label="Filler" value={product.filler} />
              <Detail label="Available Stock" value={`${product.stock}`} />
            </div>
          </div>

          <div className="mt-8 border border-[#f5cd7a]/20 bg-black/30 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-md">
            <p className="text-sm font-semibold text-[#f8efe3]">Availability</p>

            {product.stock === 0 ? (
              <p className="mt-2 text-sm leading-6 text-red-300">
                This cigar is currently out of stock. You can still send an
                inquiry to ask about future availability.
              </p>
            ) : product.stock <= 10 ? (
              <p className="mt-2 text-sm leading-6 text-[#b8a99a]">
                Limited availability. Send an inquiry to confirm current stock.
              </p>
            ) : (
              <p className="mt-2 text-sm leading-6 text-[#b8a99a]">
                Available for inquiry. Send a request to confirm quantity and
                availability.
              </p>
            )}
          </div>

          <div className="mt-8 border border-[#f5cd7a]/20 bg-black/30 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-md">
            <InquiryForm product={product} />
          </div>
        </div>
      </section>
    </main>
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
      <p className="text-sm leading-6 text-[#b8a99a]">{label}</p>
      <p className="mt-1 font-medium text-[#f8efe3]">{value ?? "Not listed"}</p>
    </div>
  );
}
