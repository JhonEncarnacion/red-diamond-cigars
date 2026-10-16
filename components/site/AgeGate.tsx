"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog } from "radix-ui";
import { Button } from "@/components/ui/button";

export function AgeGate() {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let verified = false;

    try {
      verified = localStorage.getItem("age-verified") === "true";
    } catch {
      // Show the prompt when browser storage cannot be read.
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsVerified(verified);
  }, []);

  useEffect(() => {
    if (isVerified !== false) {
      return;
    }

    const scrollPosition = window.scrollY;
    const html = document.documentElement;
    const body = document.body;
    const previousStyles = {
      htmlOverflow: html.style.overflow,
      htmlOverscrollBehavior: html.style.overscrollBehavior,
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyWidth: body.style.width,
    };

    html.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollPosition}px`;
    body.style.width = "100%";

    return () => {
      html.style.overflow = previousStyles.htmlOverflow;
      html.style.overscrollBehavior = previousStyles.htmlOverscrollBehavior;
      body.style.overflow = previousStyles.bodyOverflow;
      body.style.position = previousStyles.bodyPosition;
      body.style.top = previousStyles.bodyTop;
      body.style.width = previousStyles.bodyWidth;
      window.scrollTo(0, scrollPosition);
    };
  }, [isVerified]);

  function handleConfirm() {
    try {
      localStorage.setItem("age-verified", "true");
    } catch {
      // Confirmation still applies to this visit if it cannot be remembered.
    }

    setIsVerified(true);
  }

  function handleDeny() {
    window.location.href = "https://www.google.com";
  }

  if (isVerified === null || isVerified) {
    return null;
  }

  return (
    <Dialog.Root open modal>
      <Dialog.Portal>
        <Dialog.Content
          className="fixed inset-0 z-11000 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black px-4 py-6 outline-none"
          onOpenAutoFocus={() => {
            previousFocusRef.current =
              document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null;
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            if (previousFocusRef.current?.isConnected) {
              previousFocusRef.current.focus({ preventScroll: true });
            }
          }}
          onEscapeKeyDown={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
        >
          <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
            <div
              className="absolute inset-0 scale-[1.02] bg-[url('/images/hero-mobile.webp')] bg-cover bg-center brightness-[0.68] blur-[2px] lg:bg-[url('/images/hero-desktop.webp')]"
            />

            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.12),rgba(0,0,0,0.76))]" />
          </div>

          {/* Card */}
          <div className="relative z-10 my-auto w-full max-w-lg shrink-0 border border-[#f5cd7a]/25 bg-[#080202]/95 p-7 text-center shadow-[0_40px_120px_rgba(0,0,0,0.75)] backdrop-blur-xl sm:p-9">
            <p className="text-xs font-medium uppercase tracking-[0.42em] text-[#f5cd7a]">
              Red Diamond Cigars
            </p>

            <div className="mx-auto mt-5 h-px w-20 bg-[#f5cd7a]/55" />

            <Dialog.Title asChild>
              <h2 className="mt-7 font-serif text-4xl font-semibold leading-tight tracking-[0.04em] text-[#f8efe3] sm:text-5xl">
                Age Verification
              </h2>
            </Dialog.Title>

            <Dialog.Description asChild>
              <p className="mt-5 text-sm font-medium uppercase tracking-[0.22em] text-[#d9cbbb]">
                Are you 21 years of age or older?
              </p>
            </Dialog.Description>

            <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#b8a99a]">
              This website contains cigar-related content and is intended only for
              adults 21 years of age or older.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Button
                type="button"
                onClick={handleConfirm}
                className="h-12 rounded-none border border-[#f5cd7a]/40 bg-[#f5cd7a] px-6 text-xs font-semibold uppercase tracking-[0.22em] text-black shadow-[0_0_35px_rgba(245,205,122,0.22)] transition-all duration-500 hover:bg-[#ffe3a3] hover:text-black hover:shadow-[0_0_55px_rgba(245,205,122,0.32)]"
              >
                Yes, I am 21+
              </Button>

              <Button
                type="button"
                onClick={handleDeny}
                variant="outline"
                className="h-12 rounded-none border-[#f5cd7a]/25 bg-transparent px-6 text-xs font-medium uppercase tracking-[0.22em] text-[#f8efe3] transition-all duration-500 hover:border-[#f5cd7a]/50 hover:bg-[#f5cd7a]/10 hover:text-[#f8efe3]"
              >
                No, exit site
              </Button>
            </div>

            <p className="mx-auto mt-6 max-w-md text-xs leading-6 text-[#8f8174]">
              Product inquiries submitted through this site do not constitute a
              purchase, sale, or shipment agreement.
            </p>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
