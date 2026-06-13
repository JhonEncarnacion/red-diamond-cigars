"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateProduct } from "@/app/actions/products";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ProductFormInput } from "@/lib/validators";

type ProductFormProps = {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    wrapper: string | null;
    binder: string | null;
    filler: string | null;
    origin: string | null;
    size: string | null;
    strength: string;
    image: string | null;
    stock: number;
    isActive: boolean;
  };
};

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(product.isActive);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const formData = new FormData(event.currentTarget);

    const values: ProductFormInput = {
      name: String(formData.get("name") || ""),
      slug: String(formData.get("slug") || ""),
      description: String(formData.get("description") || ""),
      wrapper: String(formData.get("wrapper") || ""),
      binder: String(formData.get("binder") || ""),
      filler: String(formData.get("filler") || ""),
      origin: String(formData.get("origin") || ""),
      size: String(formData.get("size") || ""),
      strength: String(formData.get("strength") || ""),
      image: String(formData.get("image") || ""),
      stock: Number(formData.get("stock") || 0),
      isActive,
    };

    startTransition(async () => {
      const result = await updateProduct(product.id, values);
      setMessage(result.message);

      if (result.success) {
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border p-6">
      <div>
        <h2 className="text-xl font-semibold">Product Details</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Update the cigar information shown in the public catalog.
        </p>
      </div>

      <div className="mt-6 grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="name">Product name</Label>
          <Input id="name" name="name" defaultValue={product.name} required />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={product.slug} required />
          <p className="text-xs text-muted-foreground">
            Example: reserva-especial-robusto
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={product.description}
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="wrapper">Wrapper</Label>
            <Input
              id="wrapper"
              name="wrapper"
              defaultValue={product.wrapper ?? ""}
              placeholder="Habano, Maduro, Connecticut..."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="binder">Binder</Label>
            <Input
              id="binder"
              name="binder"
              defaultValue={product.binder ?? ""}
              placeholder="Dominican, Nicaraguan..."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="filler">Filler</Label>
            <Input
              id="filler"
              name="filler"
              defaultValue={product.filler ?? ""}
              placeholder="Dominican blend..."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="origin">Origin</Label>
            <Input
              id="origin"
              name="origin"
              defaultValue={product.origin ?? ""}
              placeholder="Dominican Republic"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="size">Size / Vitola</Label>
            <Input
              id="size"
              name="size"
              defaultValue={product.size ?? ""}
              placeholder="Robusto, Toro, Churchill..."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="strength">Strength</Label>
            <Input
              id="strength"
              name="strength"
              defaultValue={product.strength}
              placeholder="Mild, Medium, Full"
              required
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="image">Image path</Label>
          <Input
            id="image"
            name="image"
            defaultValue={product.image ?? ""}
            placeholder="/images/cigar-placeholder.png"
          />
          <p className="text-xs text-muted-foreground">
            For now, use a path from the public folder. Example:
            /images/cigar-placeholder.png
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            min="0"
            defaultValue={product.stock}
            required
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
          {isPending ? "Saving..." : "Save product"}
        </Button>
      </div>
    </form>
  );
}
