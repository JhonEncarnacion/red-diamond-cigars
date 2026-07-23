import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/admin-auth";
import {
  AdminButtonLink,
  AdminCard,
  AdminShell,
} from "@/components/admin/AdminShell";

export default async function NewProductPage() {
  await requireAdmin();

  return (
    <AdminShell
      title="Add Product"
      description="Create a new cigar for the public catalog."
      actions={
        <>
          <AdminButtonLink href="/admin/products">
            Back to Products
          </AdminButtonLink>

          <AdminButtonLink href="/admin">Back to Dashboard</AdminButtonLink>
        </>
      }
    >
      <div className="mx-auto max-w-3xl">
        <AdminCard>
          <div className="mb-8 border-b border-[#f5cd7a]/15 pb-6">
            <p className="text-xs font-medium uppercase tracking-[0.38em] text-[#f5cd7a]">
              Product Entry
            </p>

            <h2 className="mt-4 text-2xl font-semibold text-[#f8efe3]">
              New Product
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#b8a99a]">
              Add the cigar details that will appear on the public catalog and
              product inquiry pages.
            </p>
          </div>

          <ProductForm />
        </AdminCard>
      </div>
    </AdminShell>
  );
}
