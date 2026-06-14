import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { InquiryStatusSelect } from "@/components/admin/InquiryStatusSelect";
import { requireAdmin } from "@/lib/admin-auth";
import { InquiryAdminNotesForm } from "@/components/admin/InquiryAdminNotesForm";

type InquiryDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function InquiryDetailPage({
  params,
}: InquiryDetailPageProps) {
  await requireAdmin();

  const { id } = await params;

  const inquiry = await prisma.inquiry.findUnique({
    where: {
      id,
    },
    include: {
      product: true,
    },
  });

  if (!inquiry) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <Button asChild variant="outline">
          <Link href="/admin/inquiries">Back to inquiries</Link>
        </Button>
      </div>

      <div>
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Inquiry Details
        </p>

        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-4xl font-bold tracking-tight">
            {inquiry.fullName}
          </h1>

          <div className="w-full sm:w-64">
            <InquiryStatusSelect
              inquiryId={inquiry.id}
              currentStatus={inquiry.status}
            />
          </div>
        </div>

        <p className="mt-4 text-muted-foreground">
          Submitted on{" "}
          {new Intl.DateTimeFormat("en", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          }).format(inquiry.createdAt)}
        </p>
      </div>

      <div className="mt-10 grid gap-6">
        <section className="rounded-xl border p-6">
          <h2 className="text-xl font-semibold">Customer Information</h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Detail label="Full name" value={inquiry.fullName} />
            <Detail label="Email" value={inquiry.email} />
            <Detail label="Phone" value={inquiry.phone} />
            <Detail label="Location" value={inquiry.location} />
          </div>
        </section>

        <section className="rounded-xl border p-6">
          <h2 className="text-xl font-semibold">Cigar Requested</h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Detail label="Cigar" value={inquiry.product.name} />
            <Detail label="Desired quantity" value={inquiry.quantity} />
            <Detail label="Strength" value={inquiry.product.strength} />
            <Detail label="Size" value={inquiry.product.size} />
            <Detail label="Wrapper" value={inquiry.product.wrapper} />
            <Detail label="Available stock" value={inquiry.product.stock} />
          </div>
        </section>

        <section className="rounded-xl border p-6">
          <h2 className="text-xl font-semibold">Message</h2>

          <p className="mt-4 whitespace-pre-wrap text-muted-foreground">
            {inquiry.message || "No message provided."}
          </p>
        </section>

        <InquiryAdminNotesForm
          inquiryId={inquiry.id}
          initialNotes={inquiry.adminNotes}
        />

        <section className="rounded-xl border p-6">
          <h2 className="text-xl font-semibold">Confirmations</h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Detail
              label="Confirmed 21+"
              value={inquiry.confirmed21 ? "Yes" : "No"}
            />
            <Detail
              label="Inquiry only"
              value={inquiry.inquiryOnly ? "Yes" : "No"}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value ?? "Not listed"}</p>
    </div>
  );
}
