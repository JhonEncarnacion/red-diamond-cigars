"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/app/actions/products";
import { Checkbox } from "@/components/ui/checkbox";
import type { ProductFormInput } from "@/lib/validators";

type ProductFormProps = {
  product?: {
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
  const [isError, setIsError] = useState(false);
  const [isActive, setIsActive] = useState(product?.isActive ?? true);

  function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setIsError(false);

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
      try {
        const result = product
          ? await updateProduct(product.id, values)
          : await createProduct(values);

        setMessage(result.message);
        setIsError(!result.success);

        if (result.success) {
          router.refresh();

          if (!product) {
            router.push("/admin/products");
          }
        }
      } catch {
        setIsError(true);
        setMessage(
          "We couldn't confirm whether the product was saved. Your entries are still here. Check the product list in another tab before submitting again.",
        );
      }
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6">
        <div className="grid gap-5">
          <div className="grid gap-2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-[#f8efe3]"
            >
              Product name
            </label>

            <input
              id="name"
              name="name"
              defaultValue={product?.name}
              required
              className="h-12 border border-[#f5cd7a]/20 bg-black/35 px-4 text-sm text-[#f8efe3] outline-none transition-colors duration-300 placeholder:text-[#8f8174] focus:border-[#f5cd7a]/60"
            />
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="slug"
              className="text-sm font-medium text-[#f8efe3]"
            >
              Slug
            </label>

            <input
              id="slug"
              name="slug"
              defaultValue={product?.slug}
              required
              className="h-12 border border-[#f5cd7a]/20 bg-black/35 px-4 text-sm text-[#f8efe3] outline-none transition-colors duration-300 placeholder:text-[#8f8174] focus:border-[#f5cd7a]/60"
            />

            <p className="text-xs leading-5 text-[#8f8174]">
              Example: reserva-especial-robusto
            </p>
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="description"
              className="text-sm font-medium text-[#f8efe3]"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              defaultValue={product?.description}
              required
              rows={4}
              className="min-h-28 resize-y border border-[#f5cd7a]/20 bg-black/35 px-4 py-3 text-sm leading-6 text-[#f8efe3] outline-none transition-colors duration-300 placeholder:text-[#8f8174] focus:border-[#f5cd7a]/60"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <label
              htmlFor="wrapper"
              className="text-sm font-medium text-[#f8efe3]"
            >
              Wrapper
            </label>

            <input
              id="wrapper"
              name="wrapper"
              defaultValue={product?.wrapper ?? ""}
              placeholder="Habano, Maduro, Connecticut..."
              className="h-12 border border-[#f5cd7a]/20 bg-black/35 px-4 text-sm text-[#f8efe3] outline-none transition-colors duration-300 placeholder:text-[#8f8174] focus:border-[#f5cd7a]/60"
            />
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="binder"
              className="text-sm font-medium text-[#f8efe3]"
            >
              Binder
            </label>

            <input
              id="binder"
              name="binder"
              defaultValue={product?.binder ?? ""}
              placeholder="Dominican, Nicaraguan..."
              className="h-12 border border-[#f5cd7a]/20 bg-black/35 px-4 text-sm text-[#f8efe3] outline-none transition-colors duration-300 placeholder:text-[#8f8174] focus:border-[#f5cd7a]/60"
            />
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="filler"
              className="text-sm font-medium text-[#f8efe3]"
            >
              Filler
            </label>

            <input
              id="filler"
              name="filler"
              defaultValue={product?.filler ?? ""}
              placeholder="Dominican blend..."
              className="h-12 border border-[#f5cd7a]/20 bg-black/35 px-4 text-sm text-[#f8efe3] outline-none transition-colors duration-300 placeholder:text-[#8f8174] focus:border-[#f5cd7a]/60"
            />
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="origin"
              className="text-sm font-medium text-[#f8efe3]"
            >
              Origin
            </label>

            <input
              id="origin"
              name="origin"
              defaultValue={product?.origin ?? ""}
              placeholder="Dominican Republic"
              className="h-12 border border-[#f5cd7a]/20 bg-black/35 px-4 text-sm text-[#f8efe3] outline-none transition-colors duration-300 placeholder:text-[#8f8174] focus:border-[#f5cd7a]/60"
            />
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="size"
              className="text-sm font-medium text-[#f8efe3]"
            >
              Size / Vitola
            </label>

            <input
              id="size"
              name="size"
              defaultValue={product?.size ?? ""}
              placeholder="Robusto, Toro, Churchill..."
              className="h-12 border border-[#f5cd7a]/20 bg-black/35 px-4 text-sm text-[#f8efe3] outline-none transition-colors duration-300 placeholder:text-[#8f8174] focus:border-[#f5cd7a]/60"
            />
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="strength"
              className="text-sm font-medium text-[#f8efe3]"
            >
              Strength
            </label>

            <input
              id="strength"
              name="strength"
              defaultValue={product?.strength}
              placeholder="Mild, Medium, Full"
              required
              className="h-12 border border-[#f5cd7a]/20 bg-black/35 px-4 text-sm text-[#f8efe3] outline-none transition-colors duration-300 placeholder:text-[#8f8174] focus:border-[#f5cd7a]/60"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <label htmlFor="image" className="text-sm font-medium text-[#f8efe3]">
            Image path
          </label>

          <input
            id="image"
            name="image"
            defaultValue={product?.image ?? ""}
            placeholder="/images/cigar-placeholder-image.png"
            className="h-12 border border-[#f5cd7a]/20 bg-black/35 px-4 text-sm text-[#f8efe3] outline-none transition-colors duration-300 placeholder:text-[#8f8174] focus:border-[#f5cd7a]/60"
          />

          <p className="text-xs leading-5 text-[#8f8174]">
            Use an existing image in public/images, such as
            /images/products/toro-habano-corojo-red.webp. Supported formats: PNG,
            JPG, JPEG, WebP, GIF, and AVIF. Leave blank to use a fallback image.
          </p>
        </div>

        <div className="grid gap-2">
          <label htmlFor="stock" className="text-sm font-medium text-[#f8efe3]">
            Stock
          </label>

          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            defaultValue={product?.stock}
            required
            className="h-12 border border-[#f5cd7a]/20 bg-black/35 px-4 text-sm text-[#f8efe3] outline-none transition-colors duration-300 placeholder:text-[#8f8174] focus:border-[#f5cd7a]/60"
          />
        </div>

        <div className="border border-[#f5cd7a]/15 bg-black/25 p-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id="isActive"
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(checked === true)}
              className="mt-1 rounded-none border-[#f5cd7a]/35 data-[state=checked]:border-[#f5cd7a] data-[state=checked]:bg-[#f5cd7a] data-[state=checked]:text-black"
            />

            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="isActive"
                className="text-sm font-medium text-[#f8efe3]"
              >
                Active product
              </label>

              <p className="text-sm leading-6 text-[#b8a99a]">
                Active cigars appear on the public catalog. Inactive cigars are
                hidden from customers.
              </p>
            </div>
          </div>
        </div>

        {message ? (
          <p
            role={isError ? "alert" : "status"}
            className="border border-[#f5cd7a]/15 bg-black/25 px-4 py-3 text-sm leading-6 text-[#b8a99a]"
          >
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="h-12 border border-[#f5cd7a]/40 bg-[#f5cd7a] px-8 text-sm font-semibold text-black shadow-[0_0_35px_rgba(245,205,122,0.16)] transition-all duration-500 hover:bg-[#ffe3a3] hover:shadow-[0_0_55px_rgba(245,205,122,0.26)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending
            ? "Saving..."
            : product
              ? "Save product"
              : "Create product"}
        </button>
      </div>
    </form>
  );
}
