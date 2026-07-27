"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

type HomeScrollShellProps = {
  children: ReactNode;
};

export function HomeScrollShell({ children }: HomeScrollShellProps) {
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    function applyDesktopScrollLock() {
      if (!mediaQuery.matches) {
        return undefined;
      }

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
    }

    let cleanup = applyDesktopScrollLock();

    function handleChange() {
      cleanup?.();
      cleanup = applyDesktopScrollLock();
    }

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      cleanup?.();
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <main className="cigar-home-scroll hidden h-screen overflow-y-auto overflow-x-hidden scroll-smooth snap-y snap-mandatory bg-background lg:block">
      {children}
    </main>
  );
}
