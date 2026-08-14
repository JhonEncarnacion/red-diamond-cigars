"use server";

import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { siteConfig } from "@/lib/site";
import { inquirySchema, type InquiryFormInput } from "@/lib/validators";
import { revalidatePath } from "next/cache";
import type { CreateEmailOptions } from "resend";

type CreateInquiryResult = {
  success: boolean;
  message: string;
};

const inquiryEmailSender =
  `Red Diamond Cigars <${siteConfig.contactEmail}>`;

async function sendInquiryEmail(
  kind: "admin notification" | "customer confirmation",
  inquiryId: string,
  options: CreateEmailOptions,
): Promise<boolean> {
  try {
    const { data, error } = await resend.emails.send(options);

    if (error) {
      console.error(`Failed to send inquiry ${kind}:`, {
        inquiryId,
        error,
      });
      return false;
    }

    if (!data) {
      console.error(`Resend returned no data for inquiry ${kind}:`, {
        inquiryId,
      });
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Unexpected error while sending inquiry ${kind}:`, {
      inquiryId,
      error,
    });
    return false;
  }
}

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

  const adminInquiryUrl = `${siteConfig.url}/admin/inquiries/${inquiry.id}`;

  const [adminEmailSent, customerEmailSent] = await Promise.all([
    sendInquiryEmail("admin notification", inquiry.id, {
      from: inquiryEmailSender,
      to: siteConfig.contactEmail,
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
    }),

    sendInquiryEmail("customer confirmation", inquiry.id, {
      from: inquiryEmailSender,
      to: validatedFields.data.email,
      replyTo: siteConfig.contactEmail,
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
    }),
  ]);

  if (!adminEmailSent || !customerEmailSent) {
    console.error("One or more inquiry emails could not be sent:", {
      inquiryId: inquiry.id,
      adminEmailSent,
      customerEmailSent,
    });
  }

  return {
    success: true,
    message: customerEmailSent
      ? "Your inquiry was received, and a confirmation email is on the way."
      : "Your inquiry was received, but we could not send the confirmation email. Please do not resubmit; Red Diamond Cigars will still follow up directly.",
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

export async function archiveInquiry(inquiryId: string) {
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
      isArchived: true,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${inquiryId}`);

  return {
    success: true,
    message: "Inquiry archived.",
  };
}

export async function restoreInquiry(inquiryId: string) {
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
      isArchived: false,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/inquiries");
  revalidatePath(`/admin/inquiries/${inquiryId}`);

  return {
    success: true,
    message: "Inquiry restored.",
  };
}
