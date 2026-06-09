import { z } from "zod";

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
