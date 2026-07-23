"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Archive, ArchiveRestore } from "lucide-react";
import { archiveProduct, restoreProduct } from "@/app/actions/products";

type ProductArchiveButtonProps = {
  productId: string;
  isActive: boolean;
};

export function ProductArchiveButton({
  productId,
  isActive,
}: ProductArchiveButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    const confirmed = window.confirm(
      isActive
        ? "Archive this product? It will be hidden from the public catalog."
        : "Restore this product? It will appear in the public catalog again.",
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      const result = isActive
        ? await archiveProduct(productId)
        : await restoreProduct(productId);

      if (!result.success) {
        alert(result.message);
        return;
      }

      router.refresh();
    });
  }

  const Icon = isActive ? Archive : ArchiveRestore;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={isActive ? "Archive product" : "Restore product"}
      title={isActive ? "Archive product" : "Restore product"}
      className="inline-flex h-9 w-9 items-center justify-center border border-[#f5cd7a]/25 bg-black/25 text-[#f8efe3] transition-all duration-300 hover:border-[#f5cd7a] hover:bg-[#f5cd7a] hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
