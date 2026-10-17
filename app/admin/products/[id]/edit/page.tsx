import Image from "next/image";
import { getProductImage } from "@/lib/product-images";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/admin-auth";
import {
  AdminButtonLink,
  AdminCard,
  AdminShell,
} from "@/components/admin/AdminShell";

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
    <AdminShell
      title={product.name}
      eyebrow="Edit Product"
      description={product.description}
      actions={
        <>
          <AdminButtonLink href="/admin/products">
            Back to Products
          </AdminButtonLink>

          <AdminButtonLink href={`/cigars/${product.slug}`}>
            View Public Page
          </AdminButtonLink>
        </>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <AdminCard>
            <div className="relative aspect-square overflow-hidden border border-[#f5cd7a]/15 bg-black/40">
              <div className="absolute inset-0 z-10 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.02),rgba(0,0,0,0.38))]" />
              <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_42%,rgba(0,0,0,0.48))]" />

              <Image
                src={getProductImage(product)}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 320px"
                className="object-cover transition-transform duration-1600 hover:scale-105"
              />
            </div>

            <div className="mt-5 border-t border-[#f5cd7a]/15 pt-5">
              <p className="text-xs font-medium uppercase tracking-[0.32em] text-[#f5cd7a]">
                Current Product
              </p>

              <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[0.04em] text-[#f8efe3]">
                {product.name}
              </h2>

              <div className="mt-5 grid gap-4 text-sm">
                <ProductPreviewDetail
                  label="Origin"
                  value={product.origin ?? "Not listed"}
                />

                <ProductPreviewDetail
                  label="Strength"
                  value={product.strength}
                />

                <ProductPreviewDetail
                  label="Size"
                  value={product.size ?? "Not listed"}
                />


                <ProductPreviewDetail
                  label="Status"
                  value={product.isActive ? "Active" : "Inactive"}
                />
              </div>

              <Link
                href={`/cigars/${product.slug}`}
                className="mt-6 inline-flex h-11 w-full items-center justify-center border border-[#f5cd7a]/30 bg-black/25 px-5 text-xs font-medium uppercase tracking-[0.22em] text-[#f8efe3] transition-all duration-500 hover:border-[#f5cd7a] hover:bg-[#f5cd7a] hover:text-black"
              >
                View Public Page
              </Link>
            </div>
          </AdminCard>
        </aside>

        <AdminCard>
          <div className="mb-8 border-b border-[#f5cd7a]/15 pb-6">
            <p className="text-xs font-medium uppercase tracking-[0.38em] text-[#f5cd7a]">
              Product Details
            </p>

            <h2 className="mt-4 text-2xl font-semibold text-[#f8efe3]">
              Edit Product
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#b8a99a]">
              Update the cigar information shown in the public catalog and
              product inquiry pages.
            </p>
          </div>

          <ProductForm product={product} />
        </AdminCard>
      </div>
    </AdminShell>
  );
}

function ProductPreviewDetail({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="border-b border-[#f5cd7a]/10 pb-3 last:border-b-0 last:pb-0">
      <p className="text-xs uppercase tracking-[0.24em] text-[#8f8174]">
        {label}
      </p>

      <p className="mt-1 font-medium text-[#f8efe3]">{value}</p>
    </div>
  );
}
