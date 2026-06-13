"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

type UpdateProductAvailabilityResult = {
  success: boolean;
  message: string;
};

export async function updateProductAvailability(
  productId: string,
  values: {
    stock: number;
    isActive: boolean;
  },
): Promise<UpdateProductAvailabilityResult> {
  if (!Number.isInteger(values.stock) || values.stock < 0) {
    return {
      success: false,
      message: "Stock must be a whole number of 0 or more.",
    };
  }

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    return {
      success: false,
      message: "Product could not be found.",
    };
  }

  await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      stock: values.stock,
      isActive: values.isActive,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath("/cigars");
  revalidatePath(`/cigars/${product.slug}`);
  revalidatePath("/");

  return {
    success: true,
    message: "Product availability updated.",
  };
}
