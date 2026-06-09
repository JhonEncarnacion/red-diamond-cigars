"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function AgeGate() {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const verified = localStorage.getItem("age-verified");
    setIsVerified(verified === "true");
  }, []);

  function handleConfirm() {
    localStorage.setItem("age-verified", "true");
    setIsVerified(true);
  }

  function handleDeny() {
    window.location.href = "https://www.google.com";
  }

  if (isVerified === null || isVerified) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 px-4 backdrop-blur">
      <div className="max-w-md rounded-xl border bg-background p-6 shadow-lg">
        <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Age Verification Required
        </p>

        <h2 className="mt-3 text-2xl font-bold tracking-tight">
          Are you 21 years of age or older?
        </h2>

        <p className="mt-4 text-sm text-muted-foreground">
          This website contains cigar-related content and is intended only for
          adults 21 years of age or older.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button onClick={handleConfirm} className="w-full">
            Yes, I am 21+
          </Button>

          <Button onClick={handleDeny} variant="outline" className="w-full">
            No, exit site
          </Button>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Product inquiries submitted through this site do not constitute a
          purchase, sale, or shipment agreement.
        </p>
      </div>
    </div>
  );
}
