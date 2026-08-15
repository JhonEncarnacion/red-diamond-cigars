import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/site/Footer";

export function HomeMobileTabletExperience() {
  return (
    <main className="min-h-screen bg-background text-[#f8efe3] lg:hidden">
      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-32 text-center">
        <Image
          src="/images/hero-mobile.webp"
          alt="Red Diamond cigar on a dark walnut humidor table"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 h-full w-full scale-[1.02] object-cover object-center brightness-[0.68] blur-[2px]"
        />

        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.08),rgba(0,0,0,0.72))]" />

        <div className="relative z-10 mx-auto max-w-3xl pt-10">
          <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.42em] text-[#f5cd7a] sm:text-xs sm:tracking-[0.55em]">
            Red Diamond Cigars
          </p>

          <h1 className="font-serif text-5xl font-semibold leading-tight tracking-[0.06em] text-[#f8efe3] drop-shadow-[0_0_30px_rgba(0,0,0,0.75)] sm:text-7xl">
            Crafted With
            <br />
            Passion
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#d9cbbb] sm:text-base sm:leading-8">
            A refined cigar experience built on tradition, character, and
            unforgettable taste.
          </p>

          <div className="mt-9 flex justify-center">
            <Link
              href="/cigars"
              className="inline-flex h-12 w-full max-w-xs items-center justify-center border border-[#f5cd7a]/40 bg-[#f5cd7a]/15 px-7 text-xs font-medium uppercase tracking-[0.24em] text-[#f8efe3] backdrop-blur-md transition-all duration-500 hover:border-[#f5cd7a] hover:bg-[#f5cd7a] hover:text-black sm:w-auto sm:max-w-none"
            >
              Explore Cigars
            </Link>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section
        id="experience"
        className="relative overflow-hidden border-t border-[#f5cd7a]/15 px-6 py-24 text-[#f8efe3]"
      >
        <div className="relative z-10 mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[1fr_0.9fr]">
          <div className="relative overflow-hidden border border-[#f5cd7a]/20">
            <Image
              src="/images/holding-cigar-image.jpg"
              alt="Red Diamond cigar"
              width={900}
              height={650}
              className="h-90 w-full object-cover transition-transform duration-700 hover:scale-105 sm:h-115 md:h-130"
              priority={false}
            />
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.42em] text-[#f5cd7a] sm:tracking-[0.5em]">
              The Experience
            </p>

            <h2 className="mt-5 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
              A cigar made with the highest level of craftsmanship.
            </h2>

            <p className="mt-6 text-base leading-8 text-[#b8a99a]">
              Red Diamond Cigars is built for customers who value taste,
              experience, and atmosphere.
            </p>

            <div className="mt-8 flex flex-col gap-3 text-sm uppercase tracking-[0.22em] text-[#d9cbbb] sm:flex-row sm:gap-8 sm:tracking-[0.28em] md:flex-col">
              <span>Rich aroma</span>
              <span>Bold character</span>
              <span>High quality</span>
            </div>

            <div className="mt-10">
              <Link
                href="/cigars"
                className="inline-flex h-12 w-full max-w-xs items-center justify-center border border-[#f5cd7a]/40 bg-[#f5cd7a]/15 px-7 text-xs font-medium uppercase tracking-[0.24em] text-[#f8efe3] backdrop-blur-md transition-all duration-500 hover:border-[#f5cd7a] hover:bg-[#f5cd7a] hover:text-black sm:w-auto sm:max-w-none"
              >
                View Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="relative overflow-hidden px-6 py-24 text-[#f8efe3]">
        <div className="relative z-10 mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[0.9fr_1fr]">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.42em] text-[#f5cd7a] sm:tracking-[0.5em]">
              Crafted with Tradition
            </p>

            <h2 className="mt-8 font-serif text-4xl font-semibold leading-tight sm:text-6xl">
              Built around a passion for cigars.
            </h2>

            <p className="mt-7 max-w-2xl text-base leading-8 text-[#b8a99a]">
              Rooted in passion and expertise, Red Diamond Cigars is made for
              those who appreciate detail and character.
            </p>

            <div className="mt-10">
              <Link
                href="/story"
                className="inline-flex h-12 w-full max-w-xs items-center justify-center border border-[#f5cd7a]/35 px-7 text-xs font-medium uppercase tracking-[0.24em] text-[#f8efe3] transition-all duration-500 hover:border-[#f5cd7a] hover:bg-[#f5cd7a] hover:text-black sm:w-auto sm:max-w-none"
              >
                Our Story
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden border border-[#f5cd7a]/20 bg-black/40 shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
            <Image
              src="/images/making-cigars-image.jpg"
              alt="Cigar making process"
              width={900}
              height={650}
              className="h-90 w-full object-cover transition-transform duration-700 hover:scale-105 sm:h-115 md:h-130"
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden px-6 py-24 text-[#f8efe3]">
        <div className="relative z-10 mx-auto flex max-w-4xl items-center justify-center text-center">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.42em] text-[#f5cd7a] sm:tracking-[0.5em]">
              Begin the Inquiry
            </p>

            <h2 className="mt-6 font-serif text-4xl font-semibold leading-tight sm:text-6xl">
              Ready to discover your next cigar?
            </h2>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#b8a99a]">
              Browse the collection and submit an inquiry for availability.
            </p>

            <div className="mt-10">
              <Link
                href="/cigars"
                className="inline-flex h-14 w-full max-w-xs items-center justify-center border border-[#f5cd7a]/40 bg-[#f5cd7a] px-8 text-xs font-semibold uppercase tracking-[0.24em] text-black shadow-[0_0_45px_rgba(245,205,122,0.22)] transition-all duration-500 hover:bg-[#ffe3a3] hover:shadow-[0_0_65px_rgba(245,205,122,0.32)] sm:w-auto sm:max-w-none"
              >
                Inquire Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
