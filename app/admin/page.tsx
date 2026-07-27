import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { requireAdmin } from "@/lib/admin-auth";
import {
  AdminButtonLink,
  AdminCard,
  AdminShell,
} from "@/components/admin/AdminShell";
import { Pencil } from "lucide-react";

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [
    totalInquiries,
    newInquiries,
    contactedInquiries,
    completedInquiries,
    lowStockProducts,
    outOfStockProducts,
    recentInquiries,
    productInquiryCounts,
  ] = await Promise.all([
    prisma.inquiry.count({
      where: {
        isArchived: false,
      },
    }),

    prisma.inquiry.count({
      where: {
        isArchived: false,
        status: "NEW",
      },
    }),

    prisma.inquiry.count({
      where: {
        isArchived: false,
        status: "CONTACTED",
      },
    }),

    prisma.inquiry.count({
      where: {
        isArchived: false,
        status: "COMPLETED",
      },
    }),

    prisma.product.findMany({
      where: {
        stock: {
          gt: 0,
          lte: 10,
        },
      },
      orderBy: {
        stock: "asc",
      },
      take: 5,
    }),

    prisma.product.findMany({
      where: {
        stock: 0,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 5,
    }),

    prisma.inquiry.findMany({
      where: {
        isArchived: false,
      },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),

    prisma.inquiry.groupBy({
      by: ["productId"],
      where: {
        isArchived: false,
      },
      _count: {
        productId: true,
      },
      orderBy: {
        _count: {
          productId: "desc",
        },
      },
      take: 1,
    }),
  ]);

  const mostRequestedProduct =
    productInquiryCounts.length > 0
      ? await prisma.product.findUnique({
          where: {
            id: productInquiryCounts[0].productId,
          },
        })
      : null;

  const mostRequestedCount =
    productInquiryCounts.length > 0
      ? productInquiryCounts[0]._count.productId
      : 0;

  return (
    <AdminShell
      title="Dashboard"
      description="Track cigar inquiries, customer interest, and product availability."
      actions={
        <>
          <AdminButtonLink href="/admin/products">
            View Products
          </AdminButtonLink>

          <AdminButtonLink href="/admin/inquiries" variant="primary">
            View Inquiries
          </AdminButtonLink>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total inquiries" value={totalInquiries} />
        <StatCard title="New inquiries" value={newInquiries} />
        <StatCard title="Contacted" value={contactedInquiries} />
        <StatCard title="Completed" value={completedInquiries} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <AdminCard>
          <p className="text-lg font-semibold text-[#f8efe3]">
            Most requested cigar
          </p>

          {mostRequestedProduct ? (
            <div className="mt-6">
              <p className="text-4xl font-serif font-semibold tracking-[0.04em] text-[#f8efe3]">
                {mostRequestedProduct.name}
              </p>

              <p className="mt-3 text-sm leading-6 text-[#b8a99a]">
                {mostRequestedCount}{" "}
                {mostRequestedCount === 1
                  ? "customer inquiry"
                  : "customer inquiries"}{" "}
                submitted.
              </p>
            </div>
          ) : (
            <p className="mt-6 text-sm leading-6 text-[#b8a99a]">
              No product inquiries yet.
            </p>
          )}
        </AdminCard>

        <AdminCard>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-lg font-semibold text-[#f8efe3]">Low Stock</p>

              <p className="mt-3 max-w-52 text-sm leading-6 text-[#b8a99a]">
                Cigars with 10 or fewer units remaining.
              </p>
            </div>

            <Link
              href="/admin/products?stock=LOW_STOCK"
              className="whitespace-nowrap text-sm font-medium text-[#f8efe3] underline decoration-[#f5cd7a]/50 underline-offset-4 transition-colors duration-300 hover:text-[#f5cd7a]"
            >
              View products
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-4 border-b border-[#f5cd7a]/10 pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-[#f8efe3]">{product.name}</p>

                    <p className="mt-1 text-sm text-[#b8a99a]">
                      {product.stock} left ·{" "}
                      {product.origin ?? "Unknown origin"}
                    </p>
                  </div>

                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    aria-label={`Edit ${product.name}`}
                    title={`Edit ${product.name}`}
                    className="inline-flex h-9 w-9 items-center justify-center border border-[#f5cd7a]/25 bg-black/25 text-[#f8efe3] transition-all duration-300 hover:border-[#f5cd7a] hover:bg-[#f5cd7a] hover:text-black"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-sm leading-6 text-[#b8a99a]">
                No cigars are currently low on stock.
              </p>
            )}
          </div>
        </AdminCard>

        <AdminCard>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-lg font-semibold text-[#f8efe3]">
                Out of Stock
              </p>

              <p className="mt-3 max-w-52 text-sm leading-6 text-[#b8a99a]">
                Cigars that currently have no stock.
              </p>
            </div>

            <Link
              href="/admin/products?stock=LOW_STOCK"
              className="whitespace-nowrap text-sm font-medium text-[#f8efe3] underline decoration-[#f5cd7a]/50 underline-offset-4 transition-colors duration-300 hover:text-[#f5cd7a]"
            >
              View products
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {outOfStockProducts.length > 0 ? (
              outOfStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between gap-4 border-b border-[#f5cd7a]/10 pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-[#f8efe3]">{product.name}</p>

                    <p className="mt-1 text-sm text-[#b8a99a]">
                      {product.origin ?? "Unknown origin"} ·{" "}
                      {product.size ?? "Unknown size"}
                    </p>
                  </div>

                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    aria-label={`Edit ${product.name}`}
                    title={`Edit ${product.name}`}
                    className="inline-flex h-9 w-9 items-center justify-center border border-[#f5cd7a]/25 bg-black/25 text-[#f8efe3] transition-all duration-300 hover:border-[#f5cd7a] hover:bg-[#f5cd7a] hover:text-black"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-sm leading-6 text-[#b8a99a]">
                No cigars are currently out of stock.
              </p>
            )}
          </div>
        </AdminCard>
      </div>

      <div className="mt-6">
        <AdminCard>
          <p className="text-lg font-semibold text-[#f8efe3]">
            Recent inquiries
          </p>

          {recentInquiries.length === 0 ? (
            <p className="mt-6 text-sm text-[#b8a99a]">No recent inquiries.</p>
          ) : (
            <div className="mt-6 grid gap-4">
              {recentInquiries.map((inquiry) => (
                <Link
                  key={inquiry.id}
                  href={`/admin/inquiries/${inquiry.id}`}
                  className="border border-[#f5cd7a]/15 bg-black/25 p-4 transition-all duration-300 hover:border-[#f5cd7a]/40 hover:bg-[#f5cd7a]/10"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-[#f8efe3]">
                        {inquiry.fullName}
                      </p>

                      <p className="mt-1 text-sm text-[#b8a99a]">
                        {inquiry.product.name} · {inquiry.quantity} requested
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge className="rounded-none border border-[#f5cd7a]/30 bg-black/30 px-2 py-4 text-xs font-medium uppercase tracking-[0.12em] text-[#f8efe3]">
                        {formatStatus(inquiry.status)}
                      </Badge>

                      <p className="text-sm text-[#b8a99a]">
                        {new Intl.DateTimeFormat("en", {
                          month: "short",
                          day: "numeric",
                        }).format(inquiry.createdAt)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </AdminCard>
      </div>
    </AdminShell>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <AdminCard>
      <p className="text-sm font-medium text-[#b8a99a]">{title}</p>

      <p className="mt-6 text-5xl font-semibold tracking-[0.04em] text-[#f8efe3]">
        {value}
      </p>
    </AdminCard>
  );
}

function formatStatus(status: string) {
  return status.replaceAll("_", " ").toLowerCase();
}
