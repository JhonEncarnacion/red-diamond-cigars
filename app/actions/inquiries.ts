"use server";

import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { inquirySchema, type InquiryFormInput } from "@/lib/validators";
import { revalidatePath } from "next/cache";

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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const adminInquiryUrl = `${siteUrl}/admin/inquiries/${inquiry.id}`;

  try {
    await resend.emails.send({
      from: "Cigar Site <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL!,
      replyTo: validatedFields.data.email,
      subject: `New cigar inquiry: ${product.name}`,
      html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
      <h2>New cigar inquiry</h2>

      <p>
        <a
          href="${adminInquiryUrl}"
          style="display: inline-block; background: #111; color: white; padding: 10px 14px; text-decoration: none; border-radius: 6px;"
        >
          View inquiry in admin
        </a>
      </p>

      <p><strong>Cigar:</strong> ${product.name}</p>
      <p><strong>Name:</strong> ${validatedFields.data.fullName}</p>
      <p><strong>Email:</strong> ${validatedFields.data.email}</p>
      <p><strong>Phone:</strong> ${validatedFields.data.phone || "Not provided"}</p>
      <p><strong>Location:</strong> ${validatedFields.data.location}</p>
      <p><strong>Desired quantity:</strong> ${validatedFields.data.quantity}</p>
      <p><strong>Message:</strong> ${validatedFields.data.message || "No message provided"}</p>
    </div>
  `,
    });

    await resend.emails.send({
      from: "Red Diamond Cigars <onboarding@resend.dev>",
      to: validatedFields.data.email,
      subject: "We received your cigar inquiry",
      html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
      <h2>We received your inquiry</h2>

      <p>Hi ${validatedFields.data.fullName},</p>

      <p>
        Thank you for reaching out to Red Diamond Cigars. We received your inquiry
        for <strong>${product.name}</strong>.
      </p>

      <p>
        Someone from Red Diamond Cigars will contact you soon using the information
        you provided.
      </p>

      <hr />

      <h3>Inquiry details</h3>

      <p><strong>Cigar:</strong> ${product.name}</p>
      <p><strong>Desired quantity:</strong> ${validatedFields.data.quantity}</p>
      <p><strong>Location:</strong> ${validatedFields.data.location}</p>

      ${
        validatedFields.data.message
          ? `<p><strong>Your message:</strong> ${validatedFields.data.message}</p>`
          : ""
      }

      <hr />

      <p style="font-size: 13px; color: #555;">
        This email confirms that your inquiry was received. It is not a purchase,
        order confirmation, payment confirmation, shipping confirmation, or guarantee
        of product availability.
      </p>

      <p style="font-size: 13px; color: #555;">
        Red Diamond Cigars products are intended only for adults 21 and older.
      </p>
    </div>
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

export async function updateInquiryAdminNotes(
  inquiryId: string,
  adminNotes: string,
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
      adminNotes: adminNotes.trim() || null,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${inquiryId}`);

  return {
    success: true,
    message: "Admin notes updated.",
  };
}
