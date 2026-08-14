import Image from "next/image";
import { getProductImage } from "@/lib/product-images";
import Link from "next/link";
import { Eye, Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { ProductArchiveButton } from "@/components/admin/ProductArchiveButton";
import { requireAdmin } from "@/lib/admin-auth";
import { ProductFilters } from "@/components/admin/ProductFilters";
import {
  AdminButtonLink,
  AdminCard,
  AdminShell,
} from "@/components/admin/AdminShell";

type AdminProductsPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;
    stock?: string;
  }>;
};

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
  await requireAdmin();

  const { search, status, stock } = await searchParams;

  const products = await prisma.product.findMany({
    where: {
      ...(status === "ACTIVE"
        ? { isActive: true }
        : status === "INACTIVE"
          ? { isActive: false }
          : {}),

      ...(stock === "LOW_STOCK"
        ? {
            stock: {
              lte: 10,
            },
          }
        : {}),

      ...(search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                origin: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                wrapper: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                size: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                strength: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <AdminShell
      title="Products"
      description="Manage the cigar catalog, stock levels, and product visibility."
      actions={
        <>
          <AdminButtonLink href="/admin">Back to Dashboard</AdminButtonLink>

          <AdminButtonLink href="/admin/products/new" variant="primary">
            Add Product
          </AdminButtonLink>
        </>
      }
    >
      <div className="mb-6">
        <ProductFilters />
      </div>

      <AdminCard>
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-lg font-semibold text-[#f8efe3]">
              Product Catalog
            </p>

            <p className="mt-2 text-sm leading-6 text-[#b8a99a]">
              Showing {products.length}{" "}
              {products.length === 1 ? "product" : "products"}.
            </p>
          </div>

          <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#f5cd7a]">
            Inventory
          </p>
        </div>

        <div className="overflow-hidden border border-[#f5cd7a]/15">
          <div className="overflow-x-auto">
            <table className="w-full min-w-225 border-collapse">
              <thead className="bg-black/35">
                <tr className="border-b border-[#f5cd7a]/15">
                  <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-[0.22em] text-[#f5cd7a]">
                    Cigar
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-[0.22em] text-[#f5cd7a]">
                    Strength
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-[0.22em] text-[#f5cd7a]">
                    Size
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-[0.22em] text-[#f5cd7a]">
                    Stock
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-[0.22em] text-[#f5cd7a]">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-medium uppercase tracking-[0.22em] text-[#f5cd7a]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-sm text-[#b8a99a]"
                    >
                      No products yet.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-[#f5cd7a]/10 transition-colors duration-300 last:border-b-0 hover:bg-[#f5cd7a]/5"
                    >
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-4">
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-[#f5cd7a]/15 bg-black/40">
                            <Image
                              src={getProductImage(product)}
                              alt={product.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>

                          <div>
                            <p className="font-medium text-[#f8efe3]">
                              {product.name}
                            </p>

                            <p className="mt-1 text-sm text-[#b8a99a]">
                              {product.origin ?? "Origin not listed"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-5 text-sm text-[#d9cbbb]">
                        {product.strength}
                      </td>

                      <td className="px-5 py-5 text-sm text-[#d9cbbb]">
                        {product.size ?? "Not listed"}
                      </td>

                      <td className="px-5 py-5">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-[#f8efe3]">
                            {product.stock}
                          </span>

                          {product.stock === 0 ? (
                            <Badge className="rounded-none border border-red-500/40 bg-red-500/10 p-3 text-xs font-medium text-red-300">
                              Out of stock
                            </Badge>
                          ) : product.stock <= 10 ? (
                            <Badge className="rounded-none border border-[#f5cd7a]/35 bg-[#f5cd7a]/10 p-3 text-xs font-medium text-[#f5cd7a]">
                              Low stock
                            </Badge>
                          ) : null}
                        </div>
                      </td>

                      <td className="px-5 py-5">
                        <Badge
                          className={
                            product.isActive
                              ? "rounded-none border border-[#f5cd7a]/30 bg-black/30 p-3 text-xs font-medium uppercase tracking-[0.14em] text-[#f8efe3]"
                              : "rounded-none border border-[#8f8174]/30 bg-[#8f8174]/10 p-3 text-xs font-medium uppercase tracking-[0.14em] text-[#b8a99a]"
                          }
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>

                      <td className="px-5 py-5 text-right">
                        <div className="flex items-center justify-end gap-4">
                          <Link
                            href={`/cigars/${product.slug}`}
                            aria-label={`View ${product.name}`}
                            title={`View ${product.name}`}
                            className="inline-flex h-9 w-9 items-center justify-center border border-[#f5cd7a]/25 bg-black/25 text-[#f8efe3] transition-all duration-300 hover:border-[#f5cd7a] hover:bg-[#f5cd7a] hover:text-black"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>

                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            aria-label={`Edit ${product.name}`}
                            title={`Edit ${product.name}`}
                            className="inline-flex h-9 w-9 items-center justify-center border border-[#f5cd7a]/25 bg-black/25 text-[#f8efe3] transition-all duration-300 hover:border-[#f5cd7a] hover:bg-[#f5cd7a] hover:text-black"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>

                          <ProductArchiveButton
                            productId={product.id}
                            isActive={product.isActive}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </AdminCard>
    </AdminShell>
  );
}
