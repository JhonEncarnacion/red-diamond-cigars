"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { archiveProduct, restoreProduct } from "@/app/actions/products";
import { Button } from "@/components/ui/button";

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
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? "Saving..." : isActive ? "Archive" : "Restore"}
    </Button>
  );
}
