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

const statusOptions = [
  { label: "All products", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

const stockOptions = [
  { label: "All stock levels", value: "ALL" },
  { label: "Low stock", value: "LOW_STOCK" },
];

export function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [status, setStatus] = useState(searchParams.get("status") ?? "ALL");
  const [stock, setStock] = useState(searchParams.get("stock") ?? "ALL");

  function updateFilters(
    nextStatus = status,
    nextStock = stock,
    nextSearch = search,
  ) {
    const params = new URLSearchParams();

    if (nextSearch.trim()) {
      params.set("search", nextSearch.trim());
    }

    if (nextStatus !== "ALL") {
      params.set("status", nextStatus);
    }

    if (nextStock !== "ALL") {
      params.set("stock", nextStock);
    }

    const queryString = params.toString();

    startTransition(() => {
      router.push(
        queryString ? `/admin/products?${queryString}` : "/admin/products",
      );
    });
  }

  function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    updateFilters();
  }

  function handleStatusChange(value: string) {
    setStatus(value);
    updateFilters(value, stock, search);
  }

  function handleStockChange(value: string) {
    setStock(value);
    updateFilters(status, value, search);
  }

  function handleClear() {
    setSearch("");
    setStatus("ALL");
    setStock("ALL");

    startTransition(() => {
      router.push("/admin/products");
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 grid gap-3 rounded-xl border p-4 lg:grid-cols-[1fr_180px_180px_auto_auto]"
    >
      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search name, origin, wrapper, size, or strength..."
      />

      <Select value={status} onValueChange={handleStatusChange}>
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>

        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={stock} onValueChange={handleStockChange}>
        <SelectTrigger>
          <SelectValue placeholder="Stock" />
        </SelectTrigger>

        <SelectContent>
          {stockOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
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
