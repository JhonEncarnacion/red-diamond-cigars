"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { productSchema, type ProductEditorInput } from "@/lib/validators";
import { generateProductSlug } from "@/lib/product-slug";
import { requireAdmin } from "@/lib/admin-auth";

type UpdateProductResult = {
  success: boolean;
  message: string;
};

export async function updateProduct(
  productId: string,
  values: ProductEditorInput,
): Promise<UpdateProductResult> {
  await requireAdmin();

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

  const validatedFields = productSchema.safeParse({ ...values, slug: existingProduct.slug });

  if (!validatedFields.success) {
    return {
      success: false,
      message:
        validatedFields.error.issues.find((issue) => issue.path[0] === "image")
          ?.message ?? "Please check the product form and try again.",
    };
  }

  await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      name: validatedFields.data.name,
      description: validatedFields.data.description,
      wrapper: validatedFields.data.wrapper || null,
      binder: validatedFields.data.binder || null,
      filler: validatedFields.data.filler || null,
      origin: validatedFields.data.origin || null,
      size: validatedFields.data.size || null,
      strength: validatedFields.data.strength,
      image: validatedFields.data.image || null,
      isActive: validatedFields.data.isActive,
    },
  });

  revalidatePath("/");
  revalidatePath("/cigars");
  revalidatePath(`/cigars/${existingProduct.slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}/edit`);

  return {
    success: true,
    message: "Product updated successfully.",
  };
}

export async function createProduct(
  values: ProductEditorInput,
): Promise<UpdateProductResult> {
  await requireAdmin();

  const validatedFields = productSchema.safeParse({ ...values, slug: generateProductSlug(values?.name) });

  if (!validatedFields.success) {
    return {
      success: false,
      message:
        validatedFields.error.issues.find((issue) => issue.path[0] === "image")
          ?.message ?? "Please check the product form and try again.",
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
      message: "A product with this generated address already exists. Please use a different name.",
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

export async function archiveProduct(productId: string) {
  await requireAdmin();

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
      isActive: false,
    },
  });

  revalidatePath("/");
  revalidatePath("/cigars");
  revalidatePath(`/cigars/${product.slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/products");

  return {
    success: true,
    message: "Product archived.",
  };
}

export async function restoreProduct(productId: string) {
  await requireAdmin();

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
      isActive: true,
    },
  });

  revalidatePath("/");
  revalidatePath("/cigars");
  revalidatePath(`/cigars/${product.slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/products");

  return {
    success: true,
    message: "Product restored.",
  };
}

export async function deleteProduct(productId: string): Promise<UpdateProductResult> {
  await requireAdmin();

  const result = await prisma.$transaction(async (tx) => {
    // Block concurrent foreign-key inserts while preserving and detaching inquiries.
    const products = await tx.$queryRaw<{ id: string; slug: string }[]>`
      SELECT "id", "slug" FROM "Product" WHERE "id" = ${productId} FOR UPDATE
    `;
    const product = products[0];
    if (!product) return { success: false, message: "Product could not be found." };

    // Fill snapshots missed by older deployments without changing inquiry timestamps.
    await tx.$executeRaw`
      UPDATE "Inquiry" AS i SET
        "productOriginalId" = p."id", "productName" = p."name",
        "productDescription" = p."description", "productStrength" = p."strength",
        "productSize" = p."size", "productWrapper" = p."wrapper"
      FROM "Product" AS p
      WHERE i."productId" = ${productId} AND p."id" = i."productId"
        AND i."productName" IS NULL
    `;
    // Explicitly detach first, so even a legacy cascade cannot remove inquiries.
    await tx.$executeRaw`
      UPDATE "Inquiry" SET "productId" = NULL WHERE "productId" = ${productId}
    `;

    await tx.product.delete({ where: { id: productId } });
    return { success: true, message: "Product deleted permanently.", slug: product.slug };
  }, { isolationLevel: "ReadCommitted" });

  if (result.success && "slug" in result) {
    revalidatePath("/");
    revalidatePath("/cigars");
    revalidatePath(`/cigars/${result.slug}`);
    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath("/admin/inquiries", "layout");
    revalidatePath(`/admin/products/${productId}/edit`);
  }
  return { success: result.success, message: result.message };
}
