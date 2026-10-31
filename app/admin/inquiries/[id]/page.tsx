import { getAdminI18n, getAdminText } from "@/i18n/admin";
import { getInquiryProduct } from "@/lib/inquiry-product";
import { formatProductSize } from "@/lib/product-size";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { InquiryStatusSelect } from "@/components/admin/InquiryStatusSelect";
import { requireAdmin } from "@/lib/admin-auth";
import { InquiryAdminNotesForm } from "@/components/admin/InquiryAdminNotesForm";
import {
  AdminButtonLink,
  AdminCard,
  AdminShell,
} from "@/components/admin/AdminShell";

type InquiryDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function InquiryDetailPage({
  params,
}: InquiryDetailPageProps) {
  const t = await getAdminText();
  const { locale, timeZone } = await getAdminI18n();
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

  const savedProduct = getInquiryProduct(inquiry);

  return (
    <AdminShell
      title={inquiry.fullName}
      eyebrow={t("Inquiry Details")}
      description={t("Submitted on {date}", { date: new Intl.DateTimeFormat(locale, {
        timeZone,
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(inquiry.createdAt) })}
      actions={
        <>
          <AdminButtonLink href="/admin/inquiries">
            {t("Back to Inquiries")}
          </AdminButtonLink>

          <AdminButtonLink href="/admin">{t("Back to Dashboard")}</AdminButtonLink>
        </>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Left column */}
        <aside className="grid gap-6 lg:sticky lg:top-24 lg:h-fit">
          <AdminCard>
            <div className="border-b border-[#f5cd7a]/15 pb-6">
              <p className="text-xs font-medium uppercase tracking-[0.38em] text-[#f5cd7a]">
                {t("Current Status")}
              </p>

              <h2 className="mt-4 text-2xl font-semibold text-[#f8efe3]">
                {t("Manage Inquiry")}
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#b8a99a]">
                {t("Update the customer request status as you contact, qualify, or complete the inquiry.")}
              </p>
            </div>

            <div className="mt-6">
              <InquiryStatusSelect
                inquiryId={inquiry.id}
                currentStatus={inquiry.status}
              />
            </div>
          </AdminCard>

          <AdminCard>
            <div className="border-b border-[#f5cd7a]/15 pb-6">
              <p className="text-xs font-medium uppercase tracking-[0.38em] text-[#f5cd7a]">
                {t("Customer")}
              </p>

              <h2 className="mt-4 font-serif text-3xl font-semibold tracking-[0.04em] text-[#f8efe3]">
                {inquiry.fullName}
              </h2>
            </div>

            <div className="mt-6 grid gap-4">
              <Detail label={t("Email")} value={inquiry.email} />
              <Detail label={t("Phone")} value={inquiry.phone} />
              <Detail label={t("Location")} value={inquiry.location} />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a
                href={`mailto:${inquiry.email}`}
                className="inline-flex h-11 items-center justify-center border border-[#f5cd7a]/30 bg-black/25 px-5 text-xs font-medium uppercase tracking-[0.18em] text-[#f8efe3] transition-all duration-500 hover:border-[#f5cd7a] hover:bg-[#f5cd7a] hover:text-black"
              >
                {t("Email")}
              </a>

              {inquiry.phone ? (
                <a
                  href={`tel:${inquiry.phone.replace(/[^0-9+]/g, "")}`}
                  className="inline-flex h-11 items-center justify-center border border-[#f5cd7a]/30 bg-black/25 px-5 text-xs font-medium uppercase tracking-[0.18em] text-[#f8efe3] transition-all duration-500 hover:border-[#f5cd7a] hover:bg-[#f5cd7a] hover:text-black"
                >
                  {t("Call")}
                </a>
              ) : (
                <span className="inline-flex h-11 items-center justify-center border border-[#f5cd7a]/10 bg-black/15 px-5 text-xs font-medium uppercase tracking-[0.18em] text-[#8f8174]">
                  {t("No Phone")}
                </span>
              )}
            </div>
          </AdminCard>
        </aside>

        {/* Right column */}
        <div className="grid gap-6">
          <AdminCard>
            <div className="mb-6 border-b border-[#f5cd7a]/15 pb-6">
              <p className="text-xs font-medium uppercase tracking-[0.38em] text-[#f5cd7a]">
                {t("Cigar Requested")}
              </p>

              <h2 className="mt-4 text-2xl font-semibold text-[#f8efe3]">
                {savedProduct.name}
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#b8a99a]">
                {t("Customer requested {count} units.", { count: inquiry.quantity })}
              </p>
            </div>

            <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
              <Detail label={t("Cigar")} value={savedProduct.name} />
              <Detail label={t("Desired quantity")} value={inquiry.quantity} />
              <Detail label={t("Strength")} value={savedProduct.strength} />
              <Detail label={t("Size")} value={formatProductSize(savedProduct)} />
              <Detail label={t("Wrapper")} value={savedProduct.wrapper} />
            </div>

            {inquiry.product?.isActive ? (
            <div className="mt-6">
              <Link
                href={`/cigars/${inquiry.product.slug}`}
                className="inline-flex h-11 items-center justify-center border border-[#f5cd7a]/30 bg-black/25 px-6 text-xs font-medium uppercase tracking-[0.22em] text-[#f8efe3] transition-all duration-500 hover:border-[#f5cd7a] hover:bg-[#f5cd7a] hover:text-black"
              >
                {t("View Product")}
              </Link>
            </div>
            ) : (
              <p className="mt-6 text-sm text-[#b8a99a]">{t("The product is no longer in the public catalog. Its details are preserved above.")}</p>
            )}
          </AdminCard>

          <AdminCard>
            <div className="mb-6 border-b border-[#f5cd7a]/15 pb-6">
              <p className="text-xs font-medium uppercase tracking-[0.38em] text-[#f5cd7a]">
                {t("Customer Message")}
              </p>

              <h2 className="mt-4 text-2xl font-semibold text-[#f8efe3]">
                {t("Message")}
              </h2>
            </div>

            <p className="whitespace-pre-wrap text-sm leading-7 text-[#b8a99a]">
              {inquiry.message || t("No message provided.")}
            </p>
          </AdminCard>

          <InquiryAdminNotesForm
            inquiryId={inquiry.id}
            initialNotes={inquiry.adminNotes}
          />
        </div>
      </div>
    </AdminShell>
  );
}

async function Detail({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  const t = await getAdminText();
  return (
    <div className="border-b border-[#f5cd7a]/10 pb-3 last:border-b-0 last:pb-0">
      <p className="text-xs uppercase tracking-[0.24em] text-[#8f8174]">
        {label}
      </p>

      <p className="mt-1 font-medium text-[#f8efe3]">{value ?? t("Not listed")}</p>
    </div>
  );
}
