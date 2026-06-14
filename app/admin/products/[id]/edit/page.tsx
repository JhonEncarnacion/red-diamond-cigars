import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/admin-auth";

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  await requireAdmin();

  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <Button asChild variant="outline">
          <Link href="/admin/products">Back to products</Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
            <Image
              src={product.image ?? "/images/cigar-placeholder.png"}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 280px"
              className="object-cover"
            />
          </div>

          <Button asChild variant="outline" className="mt-4 w-full">
            <Link href={`/cigars/${product.slug}`}>View public page</Link>
          </Button>
        </div>

        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Edit Product
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            {product.name}
          </h1>

          <p className="mt-4 text-muted-foreground">{product.description}</p>

          <div className="mt-8">
            <ProductForm product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
