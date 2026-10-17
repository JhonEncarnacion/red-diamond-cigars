import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { requireAdmin } from "@/lib/admin-auth";
import {
  AdminButtonLink,
  AdminCard,
  AdminShell,
} from "@/components/admin/AdminShell";

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [
    totalInquiries,
    newInquiries,
    contactedInquiries,
    completedInquiries,
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
      description="Track cigar inquiries, customer interest, and follow-up."
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

      <div className="mt-6">
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
