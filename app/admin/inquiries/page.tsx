import Link from "next/link";
import { Eye } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { InquiryFilters } from "@/components/admin/InquiryFilters";
import { InquiryStatusSelect } from "@/components/admin/InquiryStatusSelect";
import { InquiryArchiveButton } from "@/components/admin/InquiryArchiveButton";
import {
  AdminButtonLink,
  AdminCard,
  AdminShell,
} from "@/components/admin/AdminShell";

type AdminInquiriesPageProps = {
  searchParams: Promise<{
    status?: string;
    search?: string;
    archive?: string;
  }>;
};

export default async function AdminInquiriesPage({
  searchParams,
}: AdminInquiriesPageProps) {
  await requireAdmin();

  const { status, search, archive } = await searchParams;

  const [
    activeInquiryCount,
    archivedInquiryCount,
    newInquiryCount,
    contactedInquiryCount,
    completedInquiryCount,
  ] = await Promise.all([
    prisma.inquiry.count({
      where: {
        isArchived: false,
      },
    }),

    prisma.inquiry.count({
      where: {
        isArchived: true,
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
  ]);

  const inquiries = await prisma.inquiry.findMany({
    where: {
      ...(status && status !== "ALL"
        ? {
            status: status as
              | "NEW"
              | "CONTACTED"
              | "INTERESTED"
              | "NOT_INTERESTED"
              | "COMPLETED",
          }
        : {}),

      ...(search
        ? {
            OR: [
              {
                fullName: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                email: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                location: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                product: {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
            ],
          }
        : {}),

      ...(archive === "ARCHIVED"
        ? { isArchived: true }
        : archive === "ALL"
          ? {}
          : { isArchived: false }),
    },

    include: {
      product: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <AdminShell
      title="Inquiries"
      description="View customer interest requests submitted through the cigar catalog."
      actions={
        <AdminButtonLink href="/admin">Back to Dashboard</AdminButtonLink>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Active" value={activeInquiryCount} />
        <StatCard title="Archived" value={archivedInquiryCount} />
        <StatCard title="New" value={newInquiryCount} />
        <StatCard title="Contacted" value={contactedInquiryCount} />
        <StatCard title="Completed" value={completedInquiryCount} />
      </div>

      <div className="mt-6">
        <InquiryFilters />
      </div>

      <AdminCard className="mt-6">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-lg font-semibold text-[#f8efe3]">Inquiry List</p>

            <p className="mt-2 text-sm leading-6 text-[#b8a99a]">
              Showing {inquiries.length}{" "}
              {inquiries.length === 1 ? "inquiry" : "inquiries"}.
            </p>
          </div>

          <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#f5cd7a]">
            Customer Requests
          </p>
        </div>

        <div className="overflow-hidden border border-[#f5cd7a]/15">
          <div className="overflow-x-auto">
            <table className="w-full min-w-262.5 border-collapse">
              <thead className="bg-black/35">
                <tr className="border-b border-[#f5cd7a]/15">
                  <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-[0.22em] text-[#f5cd7a]">
                    Customer
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-[0.22em] text-[#f5cd7a]">
                    Cigar
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-[0.22em] text-[#f5cd7a]">
                    Qty
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-[0.22em] text-[#f5cd7a]">
                    Location
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-[0.22em] text-[#f5cd7a]">
                    Status
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-[0.22em] text-[#f5cd7a]">
                    Submitted
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-medium uppercase tracking-[0.22em] text-[#f5cd7a]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {inquiries.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center text-sm text-[#b8a99a]"
                    >
                      No inquiries yet.
                    </td>
                  </tr>
                ) : (
                  inquiries.map((inquiry) => (
                    <tr
                      key={inquiry.id}
                      className="border-b border-[#f5cd7a]/10 transition-colors duration-300 last:border-b-0 hover:bg-[#f5cd7a]/5"
                    >
                      <td className="px-5 py-5">
                        <div>
                          <p className="font-medium text-[#f8efe3]">
                            {inquiry.fullName}
                          </p>

                          <p className="mt-1 text-sm text-[#b8a99a]">
                            {inquiry.email}
                          </p>

                          {inquiry.phone ? (
                            <p className="mt-1 text-sm text-[#8f8174]">
                              {inquiry.phone}
                            </p>
                          ) : null}
                        </div>
                      </td>

                      <td className="px-5 py-5 text-sm font-medium text-[#f8efe3]">
                        {inquiry.product.name}
                      </td>

                      <td className="px-5 py-5 text-sm text-[#d9cbbb]">
                        {inquiry.quantity}
                      </td>

                      <td className="px-5 py-5 text-sm text-[#d9cbbb]">
                        {inquiry.location}
                      </td>

                      <td className="px-5 py-5">
                        <div className="w-44">
                          <InquiryStatusSelect
                            inquiryId={inquiry.id}
                            currentStatus={inquiry.status}
                            showHelp={false}
                          />
                        </div>
                      </td>

                      <td className="px-5 py-5 text-sm text-[#d9cbbb]">
                        {new Intl.DateTimeFormat("en", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }).format(inquiry.createdAt)}
                      </td>

                      <td className="px-5 py-5 text-right">
                        <div className="flex items-center justify-end gap-4">
                          <Link
                            href={`/admin/inquiries/${inquiry.id}`}
                            aria-label={`View inquiry from ${inquiry.fullName}`}
                            title={`View inquiry from ${inquiry.fullName}`}
                            className="inline-flex h-9 w-9 items-center justify-center border border-[#f5cd7a]/25 bg-black/25 text-[#f8efe3] transition-all duration-300 hover:border-[#f5cd7a] hover:bg-[#f5cd7a] hover:text-black"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>

                          <InquiryArchiveButton
                            inquiryId={inquiry.id}
                            isArchived={inquiry.isArchived}
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
