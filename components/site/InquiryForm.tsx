"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Product } from "@/lib/sample-products";

type InquiryFormProps = {
  product: Product;
};

export function InquiryForm({ product }: InquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

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
    <form onSubmit={handleSubmit} className="rounded-xl border bg-muted/40 p-6">
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
            name="fullName"
            placeholder="Your full name"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Phone (Optional)</Label>
          <Input id="phone" name="phone" placeholder="Phone number" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            placeholder="City, state, or country"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="quantity">Desired Quantity</Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            min="1"
            placeholder="Example: 5"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="message">Message (Optional)</Label>
          <Textarea
            id="message"
            name="message"
            placeholder="Ask about availability, pricing, pickup, or contact preference."
          />
        </div>

        <div className="flex items-start gap-3">
          <Checkbox id="confirmed21" name="confirmed21" required />
          <Label htmlFor="confirmed21" className="text-sm leading-5">
            I confirm that I am 21 years of age or older.
          </Label>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox id="notPurchase" name="notPurchase" required />
          <Label htmlFor="notPurchase" className="text-sm leading-5">
            I understand this is an inquiry only and not a purchase, sale, or
            shipment agreement.
          </Label>
        </div>

        <Button type="submit" className="mt-2">
          Submit Inquiry
        </Button>
      </div>
    </form>
  );
}
