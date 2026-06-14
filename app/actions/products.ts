"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { productSchema, type ProductFormInput } from "@/lib/validators";

type UpdateProductResult = {
  success: boolean;
  message: string;
};

export async function updateProduct(
  productId: string,
  values: ProductFormInput,
): Promise<UpdateProductResult> {
  const validatedFields = productSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Please check the product form and try again.",
    };
  }

  const existingProduct = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!existingProduct) {
    return {
      success: false,
      message: "Product could not be found.",
    };
  }

  const slugOwner = await prisma.product.findUnique({
    where: {
      slug: validatedFields.data.slug,
    },
  });

  if (slugOwner && slugOwner.id !== productId) {
    return {
      success: false,
      message: "Another product already uses this slug.",
    };
  }

  const updatedProduct = await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      name: validatedFields.data.name,
      slug: validatedFields.data.slug,
      description: validatedFields.data.description,
      wrapper: validatedFields.data.wrapper || null,
      binder: validatedFields.data.binder || null,
      filler: validatedFields.data.filler || null,
      origin: validatedFields.data.origin || null,
      size: validatedFields.data.size || null,
      strength: validatedFields.data.strength,
      image: validatedFields.data.image || null,
      stock: validatedFields.data.stock,
      isActive: validatedFields.data.isActive,
    },
  });

  revalidatePath("/");
  revalidatePath("/cigars");
  revalidatePath(`/cigars/${existingProduct.slug}`);
  revalidatePath(`/cigars/${updatedProduct.slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}/edit`);

  return {
    success: true,
    message: "Product updated successfully.",
  };
}

export async function createProduct(
  values: ProductFormInput,
): Promise<UpdateProductResult> {
  const validatedFields = productSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Please check the product form and try again.",
    };
  }

  const existingProduct = await prisma.product.findUnique({
    where: {
      slug: validatedFields.data.slug,
    },
  });

  if (existingProduct) {
    return {
      success: false,
      message: "Another product already uses this slug.",
    };
  }

  const product = await prisma.product.create({
    data: {
      name: validatedFields.data.name,
      slug: validatedFields.data.slug,
      description: validatedFields.data.description,
      wrapper: validatedFields.data.wrapper || null,
      binder: validatedFields.data.binder || null,
      filler: validatedFields.data.filler || null,
      origin: validatedFields.data.origin || null,
      size: validatedFields.data.size || null,
      strength: validatedFields.data.strength,
      image: validatedFields.data.image || null,
      stock: validatedFields.data.stock,
      isActive: validatedFields.data.isActive,
    },
  });

  revalidatePath("/");
  revalidatePath("/cigars");
  revalidatePath(`/cigars/${product.slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/products");

  return {
    success: true,
    message: "Product created successfully.",
  };
}