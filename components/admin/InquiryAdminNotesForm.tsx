"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateInquiryAdminNotes } from "@/app/actions/inquiries";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type InquiryAdminNotesFormProps = {
  inquiryId: string;
  initialNotes: string | null;
};

export function InquiryAdminNotesForm({
  inquiryId,
  initialNotes,
}: InquiryAdminNotesFormProps) {
  const router = useRouter();
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const result = await updateInquiryAdminNotes(inquiryId, notes);

      setMessage(result.message);

      if (result.success) {
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border p-6">
      <h2 className="text-xl font-semibold">Admin Notes</h2>

      <p className="mt-2 text-sm text-muted-foreground">
        Internal notes for follow-up. Customers cannot see this.
      </p>

      <div className="mt-6 grid gap-3">
        <Label htmlFor="adminNotes">Notes</Label>

        <Textarea
          id="adminNotes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Example: Called customer. They want 10 cigars next Friday."
          className="min-h-32"
        />

        {message && <p className="text-sm text-muted-foreground">{message}</p>}

        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save notes"}
        </Button>
      </div>
    </form>
  );
}
