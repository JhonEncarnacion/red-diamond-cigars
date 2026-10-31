"use client";

import { useSiteText } from "@/i18n/text";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Archive, ArchiveRestore } from "lucide-react";
import { archiveInquiry, restoreInquiry } from "@/app/actions/inquiries";

type InquiryArchiveButtonProps = {
  inquiryId: string;
  isArchived: boolean;
};

export function InquiryArchiveButton({
  inquiryId,
  isArchived,
}: InquiryArchiveButtonProps) {
  const t = useSiteText();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    const confirmed = window.confirm(
      isArchived
        ? t("Restore this inquiry? It will appear in the active inquiries list again.")
        : t("Archive this inquiry? It will be hidden from the active inquiries list."),
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      try {
        const result = isArchived
          ? await restoreInquiry(inquiryId)
          : await archiveInquiry(inquiryId);

        if (!result.success) {
          alert(t(result.message));
          return;
        }

        router.refresh();
      } catch {
        alert(
          t("We couldn't confirm whether the inquiry was archived or restored. Refresh the page to check its current state before trying again."),
        );
      }
    });
  }

  const Icon = isArchived ? ArchiveRestore : Archive;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={isArchived ? t("Restore inquiry") : t("Archive inquiry")}
      title={isArchived ? t("Restore inquiry") : t("Archive inquiry")}
      className="inline-flex h-9 w-9 items-center justify-center border border-[#f5cd7a]/25 bg-black/25 text-[#f8efe3] transition-all duration-300 hover:border-[#f5cd7a] hover:bg-[#f5cd7a] hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
