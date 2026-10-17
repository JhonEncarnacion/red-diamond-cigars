"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import type { Product } from "@/lib/generated/prisma/client";
import {
  inquirySchema,
  type InquiryFormInput,
  type InquiryFormValues,
} from "@/lib/validators";
import { createInquiry } from "@/app/actions/inquiries";

type InquiryFormProps = {
  product: Product;
};

export function InquiryForm({ product }: InquiryFormProps) {
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(
    null,
  );

  const form = useForm<InquiryFormInput, unknown, InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      quantity: 1,
      message: "",
      confirmed21: false,
      inquiryOnly: false,
    },
  });

  const confirmed21 = useWatch({
    control: form.control,
    name: "confirmed21",
  });

  const inquiryOnly = useWatch({
    control: form.control,
    name: "inquiryOnly",
  });

  async function onSubmit(values: InquiryFormValues) {
    form.clearErrors("root");

    try {
      const result = await createInquiry(product.id, values);

      if (!result.success) {
        form.setError("root", {
          message: result.message,
        });

        return;
      }

      setSubmissionMessage(result.message);
    } catch {
      // The request may have succeeded before its response was lost.
      form.setError("root", {
        message:
          "We couldn't confirm whether your inquiry was received. Your entries are still here. Please check your email or contact Red Diamond Cigars before submitting again.",
      });
    }
  }

  if (submissionMessage) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="border border-[#f5cd7a]/20 bg-black/30 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-md"
      >
        <p className="text-xs font-medium uppercase tracking-[0.38em] text-[#f5cd7a]">
          Inquiry Received
        </p>

        <h2 className="mt-4 text-2xl font-semibold text-[#f8efe3]">
          Thank you for your interest.
        </h2>

        <p className="mt-3 text-sm leading-6 text-[#b8a99a]">
          {submissionMessage}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="border-b border-[#f5cd7a]/15 pb-6">
        <p className="text-xs font-medium uppercase tracking-[0.38em] text-[#f5cd7a]">
          Inquiry Form
        </p>

        <h2 className="mt-4 text-2xl font-semibold text-[#f8efe3]">
          Request Availability
        </h2>

        <p className="mt-3 text-sm leading-6 text-[#b8a99a]">
          Let us know you are interested in {product.name} and we will get back
          to you on the cigar&apos;s availability.
        </p>
      </div>

      <div className="mt-6 grid gap-5">
        <div className="grid gap-2">
          <label
            htmlFor="fullName"
            className="text-sm font-medium text-[#f8efe3]"
          >
            Full name
          </label>

          <input
            id="fullName"
            placeholder="Your full name"
            {...form.register("fullName")}
            className="h-12 border border-[#f5cd7a]/20 bg-black/35 px-4 text-sm text-[#f8efe3] outline-none transition-colors duration-300 placeholder:text-[#8f8174] focus:border-[#f5cd7a]/60"
          />

          {form.formState.errors.fullName ? (
            <p className="text-sm leading-6 text-red-300">
              {form.formState.errors.fullName.message}
            </p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm font-medium text-[#f8efe3]">
            Email
          </label>

          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...form.register("email")}
            className="h-12 border border-[#f5cd7a]/20 bg-black/35 px-4 text-sm text-[#f8efe3] outline-none transition-colors duration-300 placeholder:text-[#8f8174] focus:border-[#f5cd7a]/60"
          />

          {form.formState.errors.email ? (
            <p className="text-sm leading-6 text-red-300">
              {form.formState.errors.email.message}
            </p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <label htmlFor="phone" className="text-sm font-medium text-[#f8efe3]">
            Phone <span className="text-[#8f8174]">(Optional)</span>
          </label>

          <input
            id="phone"
            inputMode="tel"
            placeholder="Phone number"
            {...form.register("phone")}
            className="h-12 border border-[#f5cd7a]/20 bg-black/35 px-4 text-sm text-[#f8efe3] outline-none transition-colors duration-300 placeholder:text-[#8f8174] focus:border-[#f5cd7a]/60"
          />

          {form.formState.errors.phone ? (
            <p className="text-sm leading-6 text-red-300">
              {form.formState.errors.phone.message}
            </p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <label
            htmlFor="location"
            className="text-sm font-medium text-[#f8efe3]"
          >
            Location
          </label>

          <input
            id="location"
            placeholder="City, state, or country"
            {...form.register("location")}
            className="h-12 border border-[#f5cd7a]/20 bg-black/35 px-4 text-sm text-[#f8efe3] outline-none transition-colors duration-300 placeholder:text-[#8f8174] focus:border-[#f5cd7a]/60"
          />

          {form.formState.errors.location ? (
            <p className="text-sm leading-6 text-red-300">
              {form.formState.errors.location.message}
            </p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <label
            htmlFor="quantity"
            className="text-sm font-medium text-[#f8efe3]"
          >
            Desired quantity
          </label>

          <input
            id="quantity"
            type="number"
            min="1"
            placeholder="Example: 5"
            {...form.register("quantity")}
            className="h-12 border border-[#f5cd7a]/20 bg-black/35 px-4 text-sm text-[#f8efe3] outline-none transition-colors duration-300 placeholder:text-[#8f8174] focus:border-[#f5cd7a]/60"
          />

          {form.formState.errors.quantity ? (
            <p className="text-sm leading-6 text-red-300">
              {form.formState.errors.quantity.message}
            </p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <label
            htmlFor="message"
            className="text-sm font-medium text-[#f8efe3]"
          >
            Message <span className="text-[#8f8174]">(Optional)</span>
          </label>

          <textarea
            id="message"
            placeholder="Ask about availability, pricing, pickup, or contact preference."
            {...form.register("message")}
            rows={4}
            className="min-h-28 resize-y border border-[#f5cd7a]/20 bg-black/35 px-4 py-3 text-sm leading-6 text-[#f8efe3] outline-none transition-colors duration-300 placeholder:text-[#8f8174] focus:border-[#f5cd7a]/60"
          />

          {form.formState.errors.message ? (
            <p className="text-sm leading-6 text-red-300">
              {form.formState.errors.message.message}
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 border border-[#f5cd7a]/15 bg-black/25 p-4">
          <div className="grid gap-2">
            <div className="flex items-start gap-3">
              <Checkbox
                id="confirmed21"
                checked={confirmed21}
                onCheckedChange={(checked) =>
                  form.setValue("confirmed21", checked === true, {
                    shouldValidate: true,
                  })
                }
                className="mt-1 rounded-none border-[#f5cd7a]/35 data-[state=checked]:border-[#f5cd7a] data-[state=checked]:bg-[#f5cd7a] data-[state=checked]:text-black"
              />

              <label
                htmlFor="confirmed21"
                className="text-sm leading-6 text-[#f8efe3]"
              >
                I confirm that I am 21 years of age or older.
              </label>
            </div>

            {form.formState.errors.confirmed21 ? (
              <p className="text-sm leading-6 text-red-300">
                {form.formState.errors.confirmed21.message}
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <div className="flex items-start gap-3">
              <Checkbox
                id="inquiryOnly"
                checked={inquiryOnly}
                onCheckedChange={(checked) =>
                  form.setValue("inquiryOnly", checked === true, {
                    shouldValidate: true,
                  })
                }
                className="mt-1 rounded-none border-[#f5cd7a]/35 data-[state=checked]:border-[#f5cd7a] data-[state=checked]:bg-[#f5cd7a] data-[state=checked]:text-black"
              />

              <label
                htmlFor="inquiryOnly"
                className="text-sm leading-6 text-[#f8efe3]"
              >
                I understand this is an inquiry only and not a purchase, sale,
                or shipment agreement.
              </label>
            </div>

            {form.formState.errors.inquiryOnly ? (
              <p className="text-sm leading-6 text-red-300">
                {form.formState.errors.inquiryOnly.message}
              </p>
            ) : null}
          </div>
        </div>

        {form.formState.errors.root ? (
          <p
            role="alert"
            className="border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-300"
          >
            {form.formState.errors.root.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="mt-2 h-12 border border-[#f5cd7a]/40 bg-[#f5cd7a] px-8 text-sm font-semibold text-black shadow-[0_0_35px_rgba(245,205,122,0.16)] transition-all duration-500 hover:bg-[#ffe3a3] hover:shadow-[0_0_55px_rgba(245,205,122,0.26)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {form.formState.isSubmitting ? "Submitting..." : "Submit Inquiry"}
        </button>
      </div>
    </form>
  );
}
