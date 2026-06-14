"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statuses = [
  { label: "All statuses", value: "ALL" },
  { label: "New", value: "NEW" },
  { label: "Contacted", value: "CONTACTED" },
  { label: "Interested", value: "INTERESTED" },
  { label: "Not interested", value: "NOT_INTERESTED" },
  { label: "Completed", value: "COMPLETED" },
];

export function InquiryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [status, setStatus] = useState(searchParams.get("status") ?? "ALL");

  function updateFilters(nextStatus = status, nextSearch = search) {
    const params = new URLSearchParams();

    if (nextStatus !== "ALL") {
      params.set("status", nextStatus);
    }

    if (nextSearch.trim()) {
      params.set("search", nextSearch.trim());
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
    updateFilters(value, search);
  }

  function handleClear() {
    setSearch("");
    setStatus("ALL");

    startTransition(() => {
      router.push("/admin/inquiries");
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 grid gap-3 rounded-xl border p-4 md:grid-cols-[1fr_220px_auto_auto]"
    >
      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search name, email, location, or cigar..."
      />

      <Select value={status} onValueChange={handleStatusChange}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>

        <SelectContent>
          {statuses.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Searching..." : "Search"}
      </Button>

      <Button type="button" variant="outline" onClick={handleClear}>
        Clear
      </Button>
    </form>
  );
}
