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
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight">Cigar Collection</h1>
        <p className="mt-4 text-muted-foreground">
          Browse available cigars and request availability. Online payments are
          not processed through this website.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
