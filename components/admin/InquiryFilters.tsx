"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { getInquiryStatusFilter } from "@/lib/inquiry-status";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusOptions = [
  { label: "All statuses", value: "ALL" },
  { label: "New", value: "NEW" },
  { label: "Contacted", value: "CONTACTED" },
  { label: "Interested", value: "INTERESTED" },
  { label: "Not interested", value: "NOT_INTERESTED" },
  { label: "Completed", value: "COMPLETED" },
];

const archiveOptions = [
  { label: "Active inquiries", value: "ACTIVE" },
  { label: "Archived inquiries", value: "ARCHIVED" },
  { label: "All inquiries", value: "ALL" },
];

export function InquiryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [status, setStatus] = useState<string>(
    getInquiryStatusFilter(searchParams.get("status")) ?? "ALL",
  );
  const [archive, setArchive] = useState(
    searchParams.get("archive") ?? "ACTIVE",
  );

  function updateFilters(
    nextStatus = status,
    nextArchive = archive,
    nextSearch = search,
  ) {
    const params = new URLSearchParams();

    if (nextSearch.trim()) {
      params.set("search", nextSearch.trim());
    }

    if (nextStatus !== "ALL") {
      params.set("status", nextStatus);
    }

    if (nextArchive !== "ACTIVE") {
      params.set("archive", nextArchive);
    }

    const queryString = params.toString();

    startTransition(() => {
      router.push(
        queryString ? `/admin/inquiries?${queryString}` : "/admin/inquiries",
      );
    });
  }

  function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    updateFilters();
  }

  function handleStatusChange(value: string) {
    setStatus(value);
    updateFilters(value, archive, search);
  }

  function handleArchiveChange(value: string) {
    setArchive(value);
    updateFilters(status, value, search);
  }

  function handleClear() {
    setSearch("");
    setStatus("ALL");
    setArchive("ACTIVE");

    startTransition(() => {
      router.push("/admin/inquiries");
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-[#f5cd7a]/15 bg-black/30 p-4 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-md"
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search name, email, location, or cigar..."
          className="h-12 flex-1 border border-[#f5cd7a]/20 bg-black/35 px-4 text-sm text-[#f8efe3] outline-none transition-colors duration-300 placeholder:text-[#8f8174] focus:border-[#f5cd7a]/60"
        />

        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="h-12! min-h-12 w-full rounded-none border-[#f5cd7a]/20 bg-black/35 px-4 text-sm text-[#f8efe3] shadow-none transition-colors duration-300 focus:border-[#f5cd7a]/60 focus:ring-0 focus:ring-offset-0 xl:w-52 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-[#f5cd7a]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>

          <SelectContent className="rounded-none border-[#f5cd7a]/20 bg-black text-[#f8efe3]">
            {statusOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="rounded-none text-[#d9cbbb] focus:bg-[#f5cd7a] focus:text-black"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={archive} onValueChange={handleArchiveChange}>
          <SelectTrigger className="h-12! min-h-12 w-full rounded-none border-[#f5cd7a]/20 bg-black/35 px-4 text-sm text-[#f8efe3] shadow-none transition-colors duration-300 focus:border-[#f5cd7a]/60 focus:ring-0 focus:ring-offset-0 xl:w-56 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:text-[#f5cd7a]">
            <SelectValue placeholder="Active inquiries" />
          </SelectTrigger>

          <SelectContent className="rounded-none border-[#f5cd7a]/20 bg-black text-[#f8efe3]">
            {archiveOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="rounded-none text-[#d9cbbb] focus:bg-[#f5cd7a] focus:text-black"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <button
          type="submit"
          disabled={isPending}
          className="h-12 w-full border border-[#f5cd7a]/40 bg-[#f5cd7a] px-6 text-xs font-semibold uppercase tracking-[0.22em] text-black shadow-[0_0_35px_rgba(245,205,122,0.16)] transition-all duration-500 hover:bg-[#ffe3a3] hover:shadow-[0_0_55px_rgba(245,205,122,0.26)] disabled:cursor-not-allowed disabled:opacity-60 xl:w-40"
        >
          {isPending ? "Searching..." : "Search"}
        </button>

        <button
          type="button"
          onClick={handleClear}
          disabled={isPending}
          className="h-12 w-full border border-[#f5cd7a]/25 bg-black/25 px-6 text-xs font-medium uppercase tracking-[0.22em] text-[#f8efe3] transition-all duration-500 hover:border-[#f5cd7a] hover:bg-[#f5cd7a] hover:text-black disabled:cursor-not-allowed disabled:opacity-60 xl:w-40"
        >
          Clear
        </button>
      </div>
    </form>
  );
}
