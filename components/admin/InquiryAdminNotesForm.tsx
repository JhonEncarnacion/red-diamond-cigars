"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateInquiryAdminNotes } from "@/app/actions/inquiries";

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
    <form
      onSubmit={handleSubmit}
      className="border border-[#f5cd7a]/15 bg-black/30 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-md transition-all duration-500 hover:border-[#f5cd7a]/35 hover:bg-black/40 hover:shadow-[0_0_55px_rgba(245,205,122,0.06)]"
    >
      <div className="border-b border-[#f5cd7a]/15 pb-6">
        <p className="text-xs font-medium uppercase tracking-[0.38em] text-[#f5cd7a]">
          Internal Notes
        </p>

        <h2 className="mt-4 text-2xl font-semibold text-[#f8efe3]">
          Admin Notes
        </h2>

        <p className="mt-3 text-sm leading-6 text-[#b8a99a]">
          Internal notes for follow-up. Customers cannot see this.
        </p>
      </div>

      <div className="mt-6 grid gap-4">
        <div className="grid gap-2">
          <label
            htmlFor="adminNotes"
            className="text-sm font-medium text-[#f8efe3]"
          >
            Notes
          </label>

          <textarea
            id="adminNotes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Example: Called customer. They want 10 cigars next Friday."
            className="min-h-36 resize-y border border-[#f5cd7a]/20 bg-black/35 px-4 py-3 text-sm leading-6 text-[#f8efe3] outline-none transition-colors duration-300 placeholder:text-[#8f8174] focus:border-[#f5cd7a]/60"
          />
        </div>

        {message ? (
          <p className="border border-[#f5cd7a]/15 bg-black/25 px-4 py-3 text-sm leading-6 text-[#b8a99a]">
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="h-12 border border-[#f5cd7a]/40 bg-[#f5cd7a] px-8 text-sm font-semibold text-black shadow-[0_0_35px_rgba(245,205,122,0.16)] transition-all duration-500 hover:bg-[#ffe3a3] hover:shadow-[0_0_55px_rgba(245,205,122,0.26)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save notes"}
        </button>
      </div>
    </form>
  );
}
