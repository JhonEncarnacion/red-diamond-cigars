import { ProductCard } from "@/components/site/ProductCard";
import { sampleProducts } from "@/lib/sample-products";

export default function CigarsPage() {
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
        {sampleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
