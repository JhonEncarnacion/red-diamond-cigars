import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/admin-auth";

export default async function NewProductPage() {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <Button asChild variant="outline">
          <Link href="/admin/products">Back to products</Link>
        </Button>
      </div>

      <div>
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Admin
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight">Add Product</h1>

        <p className="mt-4 text-muted-foreground">
          Create a new cigar for the public catalog.
        </p>
      </div>

      <div className="mt-8">
        <ProductForm />
      </div>
    </div>
  );
}
