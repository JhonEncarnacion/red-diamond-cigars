"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Product } from "@/lib/sample-products";
import {
  inquirySchema,
  type InquiryFormInput,
  type InquiryFormValues,
} from "@/lib/validators";
type InquiryFormProps = {
  product: Product;
};

export function InquiryForm({ product }: InquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);

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

  function onSubmit(values: InquiryFormValues) {
    console.log({
      product: product.name,
      productSlug: product.slug,
      ...values,
    });

    // Temporary frontend-only behavior.
    // Later this will save to the database and send an email.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-xl border bg-muted/40 p-6">
        <h2 className="text-xl font-semibold">Inquiry received</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Thanks for your interest in {product.name}. This is only a demo
          confirmation for now. Later, this form will save the inquiry and
          notify the business owner.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="rounded-xl border bg-muted/40 p-6"
    >
      <div>
        <h2 className="text-xl font-semibold">Request Availability</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Let us know you are interested in {product.name}. This is not a
          purchase and no payment is processed online.
        </p>
      </div>

      <div className="mt-6 grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            placeholder="Your full name"
            {...form.register("fullName")}
          />
          {form.formState.errors.fullName && (
            <p className="text-sm text-destructive">
              {form.formState.errors.fullName.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-sm text-destructive">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Phone (Optional)</Label>
          <Input
            id="phone"
            placeholder="Phone number"
            {...form.register("phone")}
          />
          {form.formState.errors.phone && (
            <p className="text-sm text-destructive">
              {form.formState.errors.phone.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="City, state, or country"
            {...form.register("location")}
          />
          {form.formState.errors.location && (
            <p className="text-sm text-destructive">
              {form.formState.errors.location.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="quantity">Desired Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            placeholder="Example: 5"
            {...form.register("quantity")}
          />
          {form.formState.errors.quantity && (
            <p className="text-sm text-destructive">
              {form.formState.errors.quantity.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="message">Message (Optional)</Label>
          <Textarea
            id="message"
            placeholder="Ask about availability, pricing, pickup, or contact preference."
            {...form.register("message")}
          />
          {form.formState.errors.message && (
            <p className="text-sm text-destructive">
              {form.formState.errors.message.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <div className="flex items-start gap-3">
            <Checkbox
              id="confirmed21"
              checked={form.watch("confirmed21")}
              onCheckedChange={(checked) =>
                form.setValue("confirmed21", checked === true, {
                  shouldValidate: true,
                })
              }
            />
            <Label htmlFor="confirmed21" className="text-sm leading-5">
              I confirm that I am 21 years of age or older.
            </Label>
          </div>
          {form.formState.errors.confirmed21 && (
            <p className="text-sm text-destructive">
              {form.formState.errors.confirmed21.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <div className="flex items-start gap-3">
            <Checkbox
              id="inquiryOnly"
              checked={form.watch("inquiryOnly")}
              onCheckedChange={(checked) =>
                form.setValue("inquiryOnly", checked === true, {
                  shouldValidate: true,
                })
              }
            />
            <Label htmlFor="inquiryOnly" className="text-sm leading-5">
              I understand this is an inquiry only and not a purchase, sale, or
              shipment agreement.
            </Label>
          </div>
          {form.formState.errors.inquiryOnly && (
            <p className="text-sm text-destructive">
              {form.formState.errors.inquiryOnly.message}
            </p>
          )}
        </div>

        <Button type="submit" className="mt-2">
          Submit Inquiry
        </Button>
      </div>
    </form>
  );
}
