import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/admin-auth";

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
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Admin
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight">Dashboard</h1>

          <p className="mt-4 text-muted-foreground">
            Track cigar inquiries, customer interest, and product availability.
          </p>
        </div>

        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/admin/products">View products</Link>
          </Button>

          <Button asChild>
            <Link href="/admin/inquiries">View all inquiries</Link>
          </Button>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total inquiries" value={totalInquiries} />
        <StatCard title="New inquiries" value={newInquiries} />
        <StatCard title="Contacted" value={contactedInquiries} />
        <StatCard title="Completed" value={completedInquiries} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Most requested cigar</CardTitle>
          </CardHeader>

          <CardContent>
            {mostRequestedProduct ? (
              <div>
                <p className="text-2xl font-bold">
                  {mostRequestedProduct.name}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {mostRequestedCount}{" "}
                  {mostRequestedCount === 1 ? "inquiry" : "inquiries"}{" "}
                  submitted.
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No product inquiries yet.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Low Stock</CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">
                Cigars with 10 or fewer units remaining.
              </p>
            </div>

            <Link
              href="/admin/products?stock=LOW_STOCK"
              className="whitespace-nowrap text-sm font-medium underline underline-offset-4"
            >
              View products
            </Link>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {lowStockProducts.length > 0 ? (
                lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between gap-4 border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.stock} left ·{" "}
                        {product.origin ?? "Unknown origin"}
                      </p>
                    </div>

                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-sm font-medium underline underline-offset-4"
                    >
                      Edit
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No cigars are currently low on stock.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Out of Stock</CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">
                Cigars that currently have no stock.
              </p>
            </div>

            <Link
              href="/admin/products?stock=LOW_STOCK"
              className="whitespace-nowrap text-sm font-medium underline underline-offset-4"
            >
              View products
            </Link>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {outOfStockProducts.length > 0 ? (
                outOfStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between gap-4 border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.origin ?? "Unknown origin"} ·{" "}
                        {product.size ?? "Unknown size"}
                      </p>
                    </div>

                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-sm font-medium underline underline-offset-4"
                    >
                      Edit
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No cigars are currently out of stock.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent inquiries</CardTitle>
        </CardHeader>

        <CardContent>
          {recentInquiries.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No recent inquiries.
            </p>
          ) : (
            <div className="grid gap-4">
              {recentInquiries.map((inquiry) => (
                <Link
                  key={inquiry.id}
                  href={`/admin/inquiries/${inquiry.id}`}
                  className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium">{inquiry.fullName}</p>
                      <p className="text-sm text-muted-foreground">
                        {inquiry.product.name} · {inquiry.quantity} requested
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{inquiry.status}</Badge>
                      <p className="text-sm text-muted-foreground">
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
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
