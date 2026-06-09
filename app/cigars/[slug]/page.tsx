import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { sampleProducts } from "@/lib/sample-products";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = sampleProducts.find((product) => product.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
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

        <div className="mt-8 rounded-xl border bg-muted/40 p-6">
          <h2 className="text-xl font-semibold">Request Availability</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Submit an inquiry to let us know you are interested. This is not a
            purchase and no payment is processed online.
          </p>

          <Button className="mt-5 w-full sm:w-auto">I&apos;m Interested</Button>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value || "Not listed"}</p>
    </div>
  );
}
