import { getAdminText } from "@/i18n/admin";
import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/admin-auth";
import {
  AdminButtonLink,
  AdminCard,
  AdminShell,
} from "@/components/admin/AdminShell";

export default async function NewProductPage() {
  const t = await getAdminText();
  await requireAdmin();

  return (
    <AdminShell
      title={t("Add Product")}
      description={t("Create a new cigar for the public catalog.")}
      actions={
        <>
          <AdminButtonLink href="/admin/products">
            {t("Back to Products")}
          </AdminButtonLink>

          <AdminButtonLink href="/admin">{t("Back to Dashboard")}</AdminButtonLink>
        </>
      }
    >
      <div className="mx-auto max-w-3xl">
        <AdminCard>
          <div className="mb-8 border-b border-[#f5cd7a]/15 pb-6">
            <p className="text-xs font-medium uppercase tracking-[0.38em] text-[#f5cd7a]">
              {t("Product Entry")}
            </p>

            <h2 className="mt-4 text-2xl font-semibold text-[#f8efe3]">
              {t("New Product")}
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#b8a99a]">
              {t("Add the cigar details that will appear on the public catalog and product inquiry pages.")}
            </p>
          </div>

          <ProductForm />
        </AdminCard>
      </div>
    </AdminShell>
  );
}
