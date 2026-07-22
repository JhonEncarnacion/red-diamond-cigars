import { ProductCard } from "@/components/site/ProductCard";
import { prisma } from "@/lib/prisma";

export default async function CigarsPage() {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050000] text-[#f8efe3]">
      {/* Page background */}
      <div className="fixed inset-0 page-bg-luxury" />
      <div className="fixed inset-0 page-bg-texture" />
      <div className="fixed inset-0 bg-black/25" />

      {/* Full-screen page content */}
      <section className="relative z-10 flex min-h-screen items-center px-4 py-32">
        <div className="mx-auto w-full max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.55em] text-[#f5cd7a]">
              Collection
            </p>

            <h1 className="mt-6 font-serif text-5xl font-semibold leading-tight tracking-[0.04em] text-[#f8efe3] sm:text-6xl">
              Cigar Collection
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-[#b8a99a]">
              Browse available cigars and request availability.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
