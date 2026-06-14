"use server";

import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
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

  const inquiry = await prisma.inquiry.create({
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

  try {
    await resend.emails.send({
      from: "Cigar Site <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL!,
      replyTo: validatedFields.data.email,
      subject: `New cigar inquiry: ${product.name}`,
      text: `
New cigar inquiry received.

Product: ${product.name}
Inquiry ID: ${inquiry.id}

Customer:
${validatedFields.data.fullName}
${validatedFields.data.email}
${validatedFields.data.phone || "No phone provided"}
${validatedFields.data.location}

Desired quantity: ${validatedFields.data.quantity}

Message:
${validatedFields.data.message || "No message provided."}

Confirmed 21+: ${validatedFields.data.confirmed21 ? "Yes" : "No"}
Inquiry only confirmation: ${validatedFields.data.inquiryOnly ? "Yes" : "No"}
    `,
    });
  } catch (error) {
    console.error("Failed to send inquiry email:", error);
  }

  return {
    success: true,
    message: "Inquiry submitted successfully.",
  };
}

export async function updateInquiryStatus(
  inquiryId: string,
  status: "NEW" | "CONTACTED" | "INTERESTED" | "NOT_INTERESTED" | "COMPLETED",
) {
  await requireAdmin();

  const inquiry = await prisma.inquiry.findUnique({
    where: {
      id: inquiryId,
    },
  });

  if (!inquiry) {
    return {
      success: false,
      message: "Inquiry could not be found.",
    };
  }

  await prisma.inquiry.update({
    where: {
      id: inquiryId,
    },
    data: {
      status,
    },
  });

  return {
    success: true,
    message: "Inquiry status updated.",
  };
}
