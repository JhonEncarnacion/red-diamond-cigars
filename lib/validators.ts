import { z } from "zod";
import { getProductImageError } from "./product-images";

export const inquirySchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters.")
    .max(80, "Full name must be less than 80 characters."),

  email: z.email("Enter a valid email address."),

  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-()\s]*$/, "Enter a valid phone number.")
    .max(30, "Phone number is too long.")
    .optional(),

  location: z
    .string()
    .min(2, "Location is required.")
    .max(100, "Location must be less than 100 characters."),

  quantity: z.coerce
    .number()
    .int("Quantity must be a whole number.")
    .min(1, "Quantity must be at least 1.")
    .max(500, "Quantity seems too high. Please enter a smaller number."),

  message: z
    .string()
    .max(500, "Message must be less than 500 characters.")
    .optional(),

  confirmed21: z.boolean().refine((value) => value === true, {
    message: "You must confirm that you are 21 or older.",
  }),

  inquiryOnly: z.boolean().refine((value) => value === true, {
    message: "You must confirm that this is only an inquiry.",
  }),
});

export type InquiryFormInput = z.input<typeof inquirySchema>;
export type InquiryFormValues = z.output<typeof inquirySchema>;

export const productSchema = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters.")
    .max(100, "Product name must be less than 100 characters."),

  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters.")
    .max(120, "Slug must be less than 120 characters.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must use lowercase letters, numbers, and hyphens only.",
    ),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters.")
    .max(1000, "Description must be less than 1000 characters."),

  wrapper: z
    .string()
    .max(80, "Wrapper must be less than 80 characters.")
    .optional(),
  binder: z
    .string()
    .max(80, "Binder must be less than 80 characters.")
    .optional(),
  filler: z
    .string()
    .max(120, "Filler must be less than 120 characters.")
    .optional(),
  origin: z
    .string()
    .max(100, "Origin must be less than 100 characters.")
    .optional(),
  size: z.string().max(80, "Size must be less than 80 characters.").optional(),

  strength: z
    .string()
    .min(1, "Strength is required.")
    .max(40, "Strength must be less than 40 characters."),

  image: z
    .string()
    .trim()
    .max(300, "Image path is too long.")
    .superRefine((image, ctx) => {
      const message = getProductImageError(image);
      if (message) ctx.addIssue({ code: "custom", message });
    })
    .optional(),

  isActive: z.boolean(),
});

export type ProductFormInput = z.input<typeof productSchema>;
export type ProductFormValues = z.output<typeof productSchema>;