"use server";

import { prisma } from "@/lib/prisma";
import { inquirySchema, type InquiryFormInput } from "@/lib/validators";

type CreateInquiryResult = {
  success: boolean;
  message: string;
};

export async function createInquiry(
  productId: string,
  values: InquiryFormInput,
): Promise<CreateInquiryResult> {
  const validatedFields = inquirySchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Please check the form and try again.",
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
      message: "This cigar could not be found.",
    };
  }

  await prisma.inquiry.create({
    data: {
      productId: product.id,
      fullName: validatedFields.data.fullName,
      email: validatedFields.data.email,
      phone: validatedFields.data.phone || null,
      location: validatedFields.data.location,
      quantity: validatedFields.data.quantity,
      message: validatedFields.data.message || null,
      confirmed21: validatedFields.data.confirmed21,
      inquiryOnly: validatedFields.data.inquiryOnly,
    },
  });

  return {
    success: true,
    message: "Inquiry submitted successfully.",
  };
}
