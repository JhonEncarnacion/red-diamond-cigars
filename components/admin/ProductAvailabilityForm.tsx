"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateProductAvailability } from "@/app/actions/products";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ProductAvailabilityFormProps = {
  product: {
    id: string;
    stock: number;
    isActive: boolean;
  };
};

export function ProductAvailabilityForm({
  product,
}: ProductAvailabilityFormProps) {
  const router = useRouter();
  const [stock, setStock] = useState(product.stock);
  const [isActive, setIsActive] = useState(product.isActive);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const result = await updateProductAvailability(product.id, {
        stock,
        isActive,
      });

      setMessage(result.message);

      if (result.success) {
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border p-6">
      <div>
        <h2 className="text-xl font-semibold">Availability</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Update whether this cigar is visible publicly and how much stock is
          currently available.
        </p>
      </div>

      <div className="mt-6 grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            value={stock}
            onChange={(event) => setStock(Number(event.target.value))}
          />
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="isActive"
            checked={isActive}
            onCheckedChange={(checked) => setIsActive(checked === true)}
          />

          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="isActive">Active product</Label>
            <p className="text-sm text-muted-foreground">
              Active cigars appear on the public catalog. Inactive cigars are
              hidden from customers.
            </p>
          </div>
        </div>

        {message && <p className="text-sm text-muted-foreground">{message}</p>}

        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
