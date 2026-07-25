"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
  const scrollRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const activeCigar = cigars[activeIndex];

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

  function handleScroll() {
    const container = scrollRef.current;

    if (!container) return;

    const nextIndex = Math.round(container.scrollTop / window.innerHeight);

    if (
      nextIndex !== activeIndex &&
      nextIndex >= 0 &&
      nextIndex < cigars.length
    ) {
      setActiveIndex(nextIndex);
    }
  }

  if (cigars.length === 0) {
    return (
      <main className="relative flex h-screen items-center justify-center overflow-hidden bg-[#050000] px-6 text-center text-[#f8efe3]">
        <div className="absolute inset-0 page-bg-luxury-center" />
        <div className="absolute inset-0 page-bg-texture" />
        <div className="absolute inset-0 bg-black/25" />

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
      ref={scrollRef}
      onScroll={handleScroll}
      className="cigar-collection-scroll h-screen overflow-y-auto overflow-x-hidden scroll-smooth snap-y snap-mandatory bg-[#050000] text-[#f8efe3]"
    >
      {cigars.map((cigar, index) => {
        const details = [
          cigar.origin ? `Origin: ${cigar.origin}` : null,
          cigar.wrapper ? `Wrapper: ${cigar.wrapper}` : null,
          cigar.strength ? `Strength: ${cigar.strength}` : null,
        ].filter(Boolean);

        return (
          <section
            key={cigar.id}
            className="relative flex h-screen snap-start snap-always items-center justify-center overflow-hidden px-6 text-center"
          >
            <Image
              src={cigar.image}
              alt={cigar.name}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-black/55" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.72),rgba(0,0,0,0.22)_42%,rgba(0,0,0,0.85))]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_42%,rgba(0,0,0,0.82)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(90,10,10,0.38),transparent_44%,rgba(245,205,122,0.12))]" />

            <div className="relative z-10 mx-auto max-w-4xl">
              <p className="text-xs font-medium uppercase tracking-[0.55em] text-[#f5cd7a]">
                Red Diamond Collection
              </p>

              <h1 className="mt-5 font-serif text-5xl font-semibold leading-none tracking-wider text-[#f8efe3] sm:text-7xl lg:text-8xl">
                {cigar.name}
              </h1>

              <div className="mx-auto mt-6 h-px w-50 bg-[#f5cd7a]/60" />

              {details.length > 0 ? (
                <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs uppercase tracking-[0.22em] text-[#cbbba7]">
                  {details.map((detail) => (
                    <span key={detail}>{detail}</span>
                  ))}
                </div>
              ) : null}

              <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#d9cbbb] sm:text-base sm:leading-8">
                {cigar.description}
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href={`/cigars/${cigar.slug}`}
                  className="inline-flex h-12 items-center justify-center border border-[#f5cd7a]/40 bg-[#f5cd7a] px-7 text-xs font-semibold uppercase tracking-[0.28em] text-black shadow-[0_0_45px_rgba(245,205,122,0.18)] transition-all duration-500 hover:bg-[#ffe3a3] hover:shadow-[0_0_65px_rgba(245,205,122,0.28)]"
                >
                  View Cigar
                </Link>
              </div>
            </div>
          </section>
        );
      })}

      {/* Side indicator */}
      <div className="pointer-events-auto fixed right-[clamp(20px,4vw,48px)] top-1/2 z-30 flex -translate-y-1/2 flex-col items-center gap-4">
        {cigars.map((cigar, index) => (
          <button
            key={cigar.id}
            type="button"
            onClick={() => {
              scrollRef.current?.scrollTo({
                top: index * window.innerHeight,
                behavior: "smooth",
              });
            }}
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
