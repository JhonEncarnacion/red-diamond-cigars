import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireAdmin } from "@/lib/admin-auth";
import { InquiryFilters } from "@/components/admin/InquiryFilters";
import { InquiryStatusSelect } from "@/components/admin/InquiryStatusSelect";
import { InquiryArchiveButton } from "@/components/admin/InquiryArchiveButton";
import { Button } from "@/components/ui/button";

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
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div>
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Admin
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          Cigar Inquiries
        </h1>

        <p className="mt-4 text-muted-foreground">
          View customer interest requests submitted through the cigar catalog.
        </p>
      </div>

      <InquiryFilters />

      <div className="mt-6 rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Cigar</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {inquiries.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-8 text-center text-muted-foreground"
                >
                  No inquiries yet.
                </TableCell>
              </TableRow>
            ) : (
              inquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{inquiry.fullName}</p>

                      <p className="text-sm text-muted-foreground">
                        {inquiry.email}
                      </p>

                      {inquiry.phone && (
                        <p className="text-sm text-muted-foreground">
                          {inquiry.phone}
                        </p>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>{inquiry.product.name}</TableCell>

                  <TableCell>{inquiry.quantity}</TableCell>

                  <TableCell>{inquiry.location}</TableCell>

                  <TableCell>
                    <InquiryStatusSelect
                      inquiryId={inquiry.id}
                      currentStatus={inquiry.status}
                    />
                  </TableCell>

                  <TableCell>
                    {new Intl.DateTimeFormat("en", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }).format(inquiry.createdAt)}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <InquiryArchiveButton
                        inquiryId={inquiry.id}
                        isArchived={inquiry.isArchived}
                      />

                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/inquiries/${inquiry.id}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
