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
  stock: number;
};

type CigarCollectionExperienceProps = {
  cigars: Cigar[];
};

export function CigarCollectionExperience({
  cigars,
}: CigarCollectionExperienceProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const desktopScrollRef = useRef<HTMLElement | null>(null);
  const desktopSectionRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const scrollContainer = desktopScrollRef.current;

    if (!scrollContainer) {
      return;
    }

    let animationFrameId = 0;

    function updateActiveIndex() {
      const container = desktopScrollRef.current;

      if (!container) {
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.top + containerRect.height / 2;

      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      desktopSectionRefs.current.forEach((section, index) => {
        if (!section) {
          return;
        }

        const sectionRect = section.getBoundingClientRect();
        const sectionCenter = sectionRect.top + sectionRect.height / 2;
        const distance = Math.abs(sectionCenter - containerCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    }

    function handleScroll() {
      window.cancelAnimationFrame(animationFrameId);

      animationFrameId = window.requestAnimationFrame(() => {
        updateActiveIndex();
      });
    }

    updateActiveIndex();

    scrollContainer.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    window.addEventListener("resize", updateActiveIndex);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      scrollContainer.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateActiveIndex);
    };
  }, [cigars.length]);

  function scrollToDesktopCigar(index: number) {
    const section = desktopSectionRefs.current[index];

    if (!section) {
      return;
    }

    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  if (cigars.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 text-center text-[#f8efe3]">
        <div className="max-w-xl">
          <p className="text-xs font-medium uppercase tracking-[0.45em] text-[#f5cd7a]">
            Cigar Collection
          </p>

          <h1 className="mt-6 font-serif text-4xl font-semibold sm:text-5xl">
            No cigars available yet.
          </h1>

          <p className="mt-5 text-base leading-8 text-[#b8a99a]">
            Check back soon for available Red Diamond Cigars.
          </p>
        </div>
      </main>
    );
  }

  return (
    <>
      {/* Mobile / Tablet Experience */}
      <main className="min-h-screen bg-background px-5 pb-20 pt-32 text-[#f8efe3] lg:hidden">
        <section className="mx-auto max-w-3xl text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.42em] text-[#f5cd7a] sm:text-xs sm:tracking-[0.55em]">
            Red Diamond Collection
          </p>

          <h1 className="mt-5 font-serif text-5xl font-semibold leading-tight tracking-[0.04em] text-[#f8efe3] sm:text-7xl">
            Cigars
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#b8a99a] sm:text-base sm:leading-8">
            Explore available Red Diamond Cigars and submit an inquiry for the
            cigar that fits your taste.
          </p>
        </section>

        <section className="mx-auto mt-14 grid max-w-3xl gap-10 md:max-w-5xl md:grid-cols-2">
          {cigars.map((cigar, index) => (
            <article
              key={cigar.id}
              className="overflow-hidden border border-[#f5cd7a]/18 bg-black shadow-[0_30px_90px_rgba(0,0,0,0.35)]"
            >
              <div className="relative h-107.5 overflow-hidden bg-black sm:h-130 md:h-110">
                <Image
                  src={cigar.image}
                  alt={cigar.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={index === 0}
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-black/12" />

                {/* Image fades fully into black before the info section starts */}
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.12)_28%,rgba(0,0,0,0.42)_58%,rgba(0,0,0,0.82)_82%,rgba(0,0,0,1)_100%)]" />

                <div className="absolute bottom-12 left-5 right-5 sm:left-6 sm:right-6">
                  <p className="text-[10px] font-medium uppercase tracking-[0.34em] text-[#f5cd7a]">
                    Red Diamond
                  </p>

                  <h2 className="mt-2 font-serif text-4xl font-semibold leading-tight text-[#f8efe3]">
                    {cigar.name}
                  </h2>
                </div>
              </div>

              <div className="relative z-10 -mt-10 bg-black px-5 pb-6 pt-12 sm:px-6">
                <p className="text-sm leading-7 text-[#d9cbbb]">
                  {cigar.description}
                </p>

                <div className="mt-6 grid gap-3 text-xs uppercase tracking-[0.18em] text-[#b8a99a]">
                  {cigar.origin && (
                    <div className="border border-[#f5cd7a]/12 bg-white/3 px-4 py-3">
                      <span className="block text-[#f5cd7a]">Origin</span>
                      <span className="mt-1 block">{cigar.origin}</span>
                    </div>
                  )}

                  {cigar.wrapper && (
                    <div className="border border-[#f5cd7a]/12 bg-white/3 px-4 py-3">
                      <span className="block text-[#f5cd7a]">Wrapper</span>
                      <span className="mt-1 block">{cigar.wrapper}</span>
                    </div>
                  )}

                  {cigar.strength && (
                    <div className="border border-[#f5cd7a]/12 bg-white/3 px-4 py-3">
                      <span className="block text-[#f5cd7a]">Strength</span>
                      <span className="mt-1 block">{cigar.strength}</span>
                    </div>
                  )}
                </div>

                <div className="mt-7">
                  <Link
                    href={`/cigars/${cigar.slug}`}
                    className="inline-flex h-13 w-full items-center justify-center border border-[#f5cd7a]/40 bg-[#f5cd7a]/15 px-7 text-xs font-medium uppercase tracking-[0.24em] text-[#f8efe3] backdrop-blur-md transition-all duration-500 hover:border-[#f5cd7a] hover:bg-[#f5cd7a] hover:text-black"
                  >
                    View Cigar
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>

      {/* Desktop Experience */}
      <main
        ref={desktopScrollRef}
        className="cigar-collection-scroll hidden h-screen overflow-y-auto overflow-x-hidden scroll-smooth snap-y snap-mandatory bg-background text-[#f8efe3] lg:block"
      >
        {/* Right Side Indicators */}
        <div className="fixed right-8 top-1/2 z-80 flex -translate-y-1/2 flex-col gap-3">
          {cigars.map((cigar, index) => (
            <button
              key={cigar.id}
              type="button"
              aria-label={`Go to ${cigar.name}`}
              onClick={() => scrollToDesktopCigar(index)}
              className="group flex h-8 w-5 items-center justify-center"
            >
              <span
                className={`block w-px transition-all duration-300 ${
                  activeIndex === index
                    ? "h-8 bg-[#f5cd7a]"
                    : "h-4 bg-[#f5cd7a]/35 group-hover:h-6 group-hover:bg-[#f5cd7a]/70"
                }`}
              />
            </button>
          ))}
        </div>

        {cigars.map((cigar, index) => (
          <section
            key={cigar.id}
            ref={(element) => {
              desktopSectionRefs.current[index] = element;
            }}
            className="relative flex h-screen snap-start snap-always items-center justify-center overflow-hidden px-16 py-28 text-center"
          >
            <Image
              src={cigar.image}
              alt={cigar.name}
              fill
              sizes="100vw"
              priority={index === 0}
              className="object-cover"
            />

            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.42),rgba(0,0,0,0.88))]" />

            <div className="relative z-10 mx-auto max-w-4xl">
              <p className="text-xs font-medium uppercase tracking-[0.55em] text-[#f5cd7a]">
                Red Diamond Collection
              </p>

              <h1 className="mt-5 font-serif text-8xl font-semibold leading-tight tracking-[0.04em] text-[#f8efe3]">
                {cigar.name}
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#d9cbbb]">
                {cigar.description}
              </p>

              <div className="mx-auto mt-8 grid max-w-2xl grid-cols-3 gap-3 text-xs uppercase tracking-[0.22em] text-[#b8a99a]">
                {cigar.origin && (
                  <div className="border border-[#f5cd7a]/15 bg-black/25 px-4 py-3 backdrop-blur-sm">
                    <span className="block text-[#f5cd7a]">Origin</span>
                    <span className="mt-1 block">{cigar.origin}</span>
                  </div>
                )}

                {cigar.wrapper && (
                  <div className="border border-[#f5cd7a]/15 bg-black/25 px-4 py-3 backdrop-blur-sm">
                    <span className="block text-[#f5cd7a]">Wrapper</span>
                    <span className="mt-1 block">{cigar.wrapper}</span>
                  </div>
                )}

                {cigar.strength && (
                  <div className="border border-[#f5cd7a]/15 bg-black/25 px-4 py-3 backdrop-blur-sm">
                    <span className="block text-[#f5cd7a]">Strength</span>
                    <span className="mt-1 block">{cigar.strength}</span>
                  </div>
                )}
              </div>

              <div className="mt-10 flex justify-center">
                <Link
                  href={`/cigars/${cigar.slug}`}
                  className="inline-flex h-13 items-center justify-center border border-[#f5cd7a]/40 bg-[#f5cd7a]/15 px-7 text-xs font-medium uppercase tracking-[0.24em] text-[#f8efe3] backdrop-blur-md transition-all duration-500 hover:border-[#f5cd7a] hover:bg-[#f5cd7a] hover:text-black"
                >
                  View Cigar
                </Link>
              </div>
            </div>
          </section>
        ))}
      </main>
    </>
  );
}
