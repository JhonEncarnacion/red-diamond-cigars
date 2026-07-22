"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

type HomeScrollShellProps = {
  children: ReactNode;
};

export function HomeScrollShell({ children }: HomeScrollShellProps) {
  useEffect(() => {
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlHeight = document.documentElement.style.height;
    const originalBodyHeight = document.body.style.height;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.documentElement.style.height = "100%";
    document.body.style.height = "100%";

    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.height = originalHtmlHeight;
      document.body.style.height = originalBodyHeight;
    };
  }, []);

  return (
    <main className="h-screen overflow-y-auto overflow-x-hidden scroll-smooth snap-y snap-mandatory bg-black">
      {children}
    </main>
  );
}
