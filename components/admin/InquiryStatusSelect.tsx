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
}: InquiryStatusSelectProps) {
  const router = useRouter();
  const [status, setStatus] = useState<InquiryStatus>(currentStatus);
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(value: string) {
    const newStatus = value as InquiryStatus;

    setStatus(newStatus);

    startTransition(async () => {
      const result = await updateInquiryStatus(inquiryId, newStatus);

      if (!result.success) {
        setStatus(currentStatus);
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="grid gap-2">
      <Select
        value={status}
        onValueChange={handleStatusChange}
        disabled={isPending}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select status" />
        </SelectTrigger>

        <SelectContent>
          {statuses.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isPending && (
        <p className="text-xs text-muted-foreground">Updating status...</p>
      )}
    </div>
  );
}
