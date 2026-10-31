"use client";

import { useSiteText } from "@/i18n/text";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteInquiry } from "@/app/actions/inquiries";

export function InquiryDeleteButton({ inquiryId, customerName }: {
  inquiryId: string;
  customerName: string;
}) {
  const t = useSiteText();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(t("Permanently delete the inquiry from \u201c{name}\u201d, including its message and admin notes? This cannot be undone. The product will not be deleted.", { name: customerName }))) {
      return;
    }

    startTransition(async () => {
      try {
        const result = await deleteInquiry(inquiryId);
        if (!result.success) {
          window.alert(t(result.message));
          return;
        }
        router.refresh();
      } catch {
        window.alert(t("We couldn't confirm whether the inquiry was deleted. Refresh the inquiry list to check before trying again."));
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={t("Delete inquiry from {name}", { name: customerName })}
      title={t("Delete inquiry from {name}", { name: customerName })}
      className="inline-flex h-9 w-9 items-center justify-center border border-[#f5cd7a]/25 bg-black/25 text-[#f8efe3] transition-all duration-300 hover:border-red-400 hover:bg-red-500/15 hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5cd7a] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Trash2 aria-hidden="true" className="h-4 w-4" />
    </button>
  );
}
