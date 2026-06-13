import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardPage() {
  const [
    totalInquiries,
    newInquiries,
    contactedInquiries,
    completedInquiries,
    lowStockProducts,
    recentInquiries,
    productInquiryCounts,
  ] = await Promise.all([
    prisma.inquiry.count(),
    prisma.inquiry.count({
      where: {
        status: "NEW",
      },
    }),
    prisma.inquiry.count({
      where: {
        status: "CONTACTED",
      },
    }),
    prisma.inquiry.count({
      where: {
        status: "COMPLETED",
      },
    }),
    prisma.product.findMany({
      where: {
        stock: {
          lte: 10,
        },
        isActive: true,
      },
      orderBy: {
        stock: "asc",
      },
      take: 5,
    }),
    prisma.inquiry.findMany({
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

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
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
          <CardHeader>
            <CardTitle>Low stock cigars</CardTitle>
          </CardHeader>

          <CardContent>
            {lowStockProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No low stock products.
              </p>
            ) : (
              <div className="grid gap-4">
                {lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.size ?? "Size not listed"}
                      </p>
                    </div>

                    <Badge variant="outline">{product.stock} left</Badge>
                  </div>
                ))}
              </div>
            )}
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
