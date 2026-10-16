"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateInquiryStatus } from "@/app/actions/inquiries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type InquiryStatus =
  | "NEW"
  | "CONTACTED"
  | "INTERESTED"
  | "NOT_INTERESTED"
  | "COMPLETED";

type InquiryStatusSelectProps = {
  inquiryId: string;
  currentStatus: InquiryStatus;
  showHelp?: boolean;
};

const statuses: { label: string; value: InquiryStatus }[] = [
  {
    label: "New",
    value: "NEW",
  },
  {
    label: "Contacted",
    value: "CONTACTED",
  },
  {
    label: "Interested",
    value: "INTERESTED",
  },
  {
    label: "Not interested",
    value: "NOT_INTERESTED",
  },
  {
    label: "Completed",
    value: "COMPLETED",
  },
];

export function InquiryStatusSelect({
  inquiryId,
  currentStatus,
  showHelp = true,
}: InquiryStatusSelectProps) {
  const router = useRouter();
  const [status, setStatus] = useState<InquiryStatus>(currentStatus);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(value: string) {
    const newStatus = value as InquiryStatus;
    const previousStatus = status;

    setError(null);

    setStatus(newStatus);

    startTransition(async () => {
      try {
        const result = await updateInquiryStatus(inquiryId, newStatus);

        if (!result.success) {
          setStatus(previousStatus);
          setError(result.message);
          return;
        }

        router.refresh();
      } catch {
        setStatus(previousStatus);
        setError(
          "We couldn't confirm whether the status was saved. The previous selection is shown. Refresh the page to check the saved status before trying again.",
        );
      }
    });
  }

  return (
    <div className="grid gap-3">
      <Select
        value={status}
        onValueChange={handleStatusChange}
        disabled={isPending}
      >
        <SelectTrigger className="h-12! min-h-12 w-full rounded-none border-[#f5cd7a]/20 bg-black/35 px-4 text-sm text-[#f8efe3] shadow-none transition-colors duration-300 focus:border-[#f5cd7a]/60 focus:ring-0 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-60 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-[#f5cd7a]">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>

        <SelectContent className="rounded-none border-[#f5cd7a]/20 bg-black text-[#f8efe3]">
          {statuses.map((status) => (
            <SelectItem
              key={status.value}
              value={status.value}
              className="rounded-none text-[#d9cbbb] focus:bg-[#f5cd7a] focus:text-black"
            >
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error ? (
        <p role="alert" className="text-sm leading-6 text-red-300">
          {error}
        </p>
      ) : null}

      {showHelp && !error ? (
        isPending ? (
          <p className="text-xs uppercase tracking-[0.18em] text-[#f5cd7a]">
            Updating status...
          </p>
        ) : (
          <p className="text-xs leading-5 text-[#8f8174]">
            Changes save automatically after selecting a new status.
          </p>
        )
      ) : null}
    </div>
  );
}
