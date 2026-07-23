"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/site/Navbar";

export function AppNavbar() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return <Navbar />;
}
