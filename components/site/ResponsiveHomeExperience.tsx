"use client";

import { useEffect, useState } from "react";
import { HomeDesktopExperience } from "@/components/site/HomeDesktopExperience";
import { HomeMobileTabletExperience } from "@/components/site/HomeMobileTabletExperience";

export function ResponsiveHomeExperience() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    function updateScreenSize() {
      setIsDesktop(mediaQuery.matches);
    }

    updateScreenSize();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateScreenSize);

      return () => {
        mediaQuery.removeEventListener("change", updateScreenSize);
      };
    }
    
    mediaQuery.addListener(updateScreenSize);

    return () => {
      mediaQuery.removeListener(updateScreenSize);
    };
  }, []);

  if (isDesktop) {
    return <HomeDesktopExperience />;
  }

  return <HomeMobileTabletExperience />;
}
