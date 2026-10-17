"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/app/actions/products";

export function ProductDeleteButton({ productId, productName }: {
  productId: string;
  productName: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(`Permanently delete “${productName}”? This cannot be undone. Existing inquiries and their saved product details will be kept.`)) {
      return;
    }

    startTransition(async () => {
      try {
        const result = await deleteProduct(productId);
        if (!result.success) {
          window.alert(result.message);
          return;
        }
        router.refresh();
      } catch {
        window.alert("We couldn't confirm whether the product was deleted. Refresh the product list to check before trying again.");
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={`Delete ${productName}`}
      title={`Delete ${productName}`}
      className="inline-flex h-9 w-9 items-center justify-center border border-[#f5cd7a]/25 bg-black/25 text-[#f8efe3] transition-all duration-300 hover:border-red-400 hover:bg-red-500/15 hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5cd7a] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Trash2 aria-hidden="true" className="h-4 w-4" />
    </button>
  );
}
