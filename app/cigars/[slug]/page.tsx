import { formatProductSize } from "@/lib/product-size";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { InquiryForm } from "@/components/site/InquiryForm";
import { siteConfig } from "@/lib/site";
import { getProductImage } from "@/lib/product-images";
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

  if (!product || !product.isActive) {
    notFound();
  }

  const productImage = getProductImage(product);

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
              src={productImage}
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
            Cigar Details
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
              <Detail label="Size" value={formatProductSize(product)} />
              <Detail label="Wrapper" value={product.wrapper} />
              <Detail label="Binder" value={product.binder} />
              <Detail label="Filler" value={product.filler} />
              <Detail label="Origin" value="Dominican Republic" />
            </div>
          </div>

          <section
            aria-labelledby="packaging-heading"
            className="mt-8"
          >
            <dl className="mt-4 grid grid-cols-3 divide-x divide-[#f5cd7a]/15 border-y border-[#f5cd7a]/25 bg-[#f5cd7a]/[0.05] py-4">
              {[
                { label: "Single", value: product.singleValue },
                { label: `${product.packQuantity}-Pack`, value: product.packValue },
                { label: `Box of ${product.boxQuantity}`, value: product.boxValue },
              ].map(({ label, value }) => (
                <div key={label} className="min-w-0 px-3 py-1 sm:px-4">
                  <dt className="break-words text-[10px] font-medium uppercase tracking-[0.14em] text-[#d3b77f] sm:text-xs sm:tracking-[0.18em]">{label}</dt>
                  <dd className="mt-2 break-words text-lg font-medium leading-tight tabular-nums text-[#f8efe3]">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

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

  if (!product || !product.isActive) {
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
      images: [getProductImage(product)],
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
