"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { archiveInquiry, restoreInquiry } from "@/app/actions/inquiries";
import { Button } from "@/components/ui/button";

type InquiryArchiveButtonProps = {
  inquiryId: string;
  isArchived: boolean;
};

export function InquiryArchiveButton({
  inquiryId,
  isArchived,
}: InquiryArchiveButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    const confirmed = window.confirm(
      isArchived
        ? "Restore this inquiry?"
        : "Archive this inquiry? You can restore it later.",
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      if (isArchived) {
        await restoreInquiry(inquiryId);
      } else {
        await archiveInquiry(inquiryId);
      }

      router.refresh();
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? "Saving..." : isArchived ? "Restore" : "Archive"}
    </Button>
  );
}
