"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Cigar = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  origin: string | null;
  wrapper: string | null;
  strength: string | null;
};

type CigarCollectionExperienceProps = {
  cigars: Cigar[];
};

export function CigarCollectionExperience({
  cigars,
}: CigarCollectionExperienceProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const isAnimatingRef = useRef(false);
  const touchStartYRef = useRef<number | null>(null);

  const activeCigar = cigars[activeIndex];

  const cigarCount = cigars.length;

  const activeMeta = useMemo(() => {
    if (!activeCigar) return [];

    return [
      activeCigar.origin ? `Origin: ${activeCigar.origin}` : null,
      activeCigar.wrapper ? `Wrapper: ${activeCigar.wrapper}` : null,
      activeCigar.strength ? `Strength: ${activeCigar.strength}` : null,
    ].filter(Boolean);
  }, [activeCigar]);

  const goToSlide = useCallback(
    (nextIndex: number) => {
      if (isAnimatingRef.current) return;
      if (nextIndex < 0 || nextIndex >= cigarCount) return;

      isAnimatingRef.current = true;
      setActiveIndex(nextIndex);

      window.setTimeout(() => {
        isAnimatingRef.current = false;
      }, 950);
    },
    [cigarCount],
  );

  useEffect(() => {
    if (!activeCigar) return;

    window.history.replaceState(null, "", `/cigars#${activeCigar.slug}`);

    window.dispatchEvent(
      new CustomEvent("active-cigar-change", {
        detail: {
          name: activeCigar.name,
          slug: activeCigar.slug,
        },
      }),
    );
  }, [activeCigar]);

  useEffect(() => {
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
    };
  }, []);

  useEffect(() => {
    function handleWheel(event: WheelEvent) {
      event.preventDefault();

      if (Math.abs(event.deltaY) < 28) return;

      if (event.deltaY > 0) {
        goToSlide(activeIndex + 1);
      } else {
        goToSlide(activeIndex - 1);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowDown" || event.key === "PageDown") {
        goToSlide(activeIndex + 1);
      }

      if (event.key === "ArrowUp" || event.key === "PageUp") {
        goToSlide(activeIndex - 1);
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, cigarCount, goToSlide]);

  function handleTouchStart(event: React.TouchEvent<HTMLElement>) {
    touchStartYRef.current = event.touches[0].clientY;
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLElement>) {
    const startY = touchStartYRef.current;

    if (startY === null) return;

    const endY = event.changedTouches[0].clientY;
    const distance = startY - endY;

    if (Math.abs(distance) < 50) return;

    if (distance > 0) {
      goToSlide(activeIndex + 1);
    } else {
      goToSlide(activeIndex - 1);
    }

    touchStartYRef.current = null;
  }

  if (cigars.length === 0) {
    return (
      <main className="relative flex h-screen items-center justify-center overflow-hidden bg-[#050000] px-6 text-center text-[#f8efe3]">
        <div className="absolute inset-0 page-bg-luxury-center" />
        <div className="absolute inset-0 page-bg-texture" />

        <div className="relative z-10 max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.55em] text-[#f5cd7a]">
            Collection
          </p>

          <h1 className="mt-6 font-serif text-5xl font-semibold tracking-[0.04em]">
            No Cigars Available
          </h1>

          <p className="mt-6 text-base leading-8 text-[#b8a99a]">
            The collection is currently being updated. Please check back soon.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative h-screen overflow-hidden bg-[#050000] text-[#f8efe3]"
    >
      {/* Background cigar images */}
      <div className="absolute inset-0">
        {cigars.map((cigar, index) => (
          <div
            key={cigar.id}
            className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              index === activeIndex
                ? "scale-100 opacity-100"
                : "scale-105 opacity-0"
            }`}
          >
            <Image
              src={cigar.image}
              alt={cigar.name}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Luxury overlays */}
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.55),rgba(0,0,0,0.12)_42%,rgba(0,0,0,0.88))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.28)_42%,rgba(0,0,0,0.78)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(90,10,10,0.34),transparent_45%,rgba(245,205,122,0.12))]" />

      {/* Center-bottom text */}
      <section className="relative z-10 flex h-full items-center justify-center px-6 text-center">
        <div key={activeCigar.id} className="max-w-4xl animate-luxury-rise">
          <p className="text-xs font-medium uppercase tracking-[0.55em] text-[#f5cd7a]">
            Red Diamond Collection
          </p>

          <h1 className="mt-5 font-serif text-5xl font-semibold leading-none tracking-wider text-[#f8efe3] sm:text-7xl lg:text-8xl">
            {activeCigar.name}
          </h1>

          <div className="mx-auto mt-6 h-px w-24 bg-[#f5cd7a]/60" />

          {activeMeta.length > 0 ? (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs uppercase tracking-[0.22em] text-[#cbbba7]">
              {activeMeta.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          ) : null}

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#d9cbbb] sm:text-base sm:leading-8">
            {activeCigar.description}
          </p>

          <Link
            href={`/cigars/${activeCigar.slug}`}
            className="mt-8 inline-flex h-12 items-center justify-center border border-[#f5cd7a]/40 bg-[#f5cd7a] px-7 text-xs font-semibold uppercase tracking-[0.28em] text-black shadow-[0_0_45px_rgba(245,205,122,0.18)] transition-all duration-500 hover:bg-[#ffe3a3] hover:shadow-[0_0_65px_rgba(245,205,122,0.28)]"
          >
            View Cigar
          </Link>
        </div>
      </section>

      {/* Page indicator */}
      <div className="pointer-events-auto absolute right-[clamp(20px,4vw,48px)] top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-4">
        {cigars.map((cigar, index) => (
          <button
            key={cigar.id}
            type="button"
            onClick={() => goToSlide(index)}
            aria-label={`View ${cigar.name}`}
            className={`h-10 w-px transition-all duration-500 ${
              index === activeIndex
                ? "bg-[#f5cd7a]"
                : "bg-[#f5cd7a]/25 hover:bg-[#f5cd7a]/55"
            }`}
          />
        ))}
      </div>
    </main>
  );
}
