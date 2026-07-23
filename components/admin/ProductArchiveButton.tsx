"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
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

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="inline-flex h-9 items-center justify-center border border-[#f5cd7a]/25 bg-black/25 px-4 text-xs font-medium uppercase tracking-[0.16em] text-[#f8efe3] transition-all duration-300 hover:border-[#f5cd7a] hover:bg-[#f5cd7a] hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isPending ? "Saving..." : isActive ? "Archive" : "Restore"}
    </button>
  );
}
