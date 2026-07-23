"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/site/Footer";

export function AppFooter() {
  const pathname = usePathname();

  if (pathname === "/" || pathname.startsWith("/admin")) {
    return null;
  }

  return <Footer />;
}
