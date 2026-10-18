import { useSiteText } from "@/i18n/text";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/site/Reveal";
import { Footer } from "@/components/site/Footer";
import { HomeScrollShell } from "@/components/site/HomeScrollShell";

export function HomeDesktopExperience() {
  const t = useSiteText();
  return (
    <div className="hidden lg:block">
      <HomeScrollShell>
        <div className="bg-background">
          {/* Hero */}
          <section className="relative h-screen snap-start snap-always overflow-hidden">
            <Image
              src="/images/hero-desktop.webp"
              alt={t("Red Diamond cigar on a dark walnut humidor table")}
              fill
              priority
              sizes="100vw"
              className="absolute inset-0 h-full w-full scale-[1.02] object-cover object-center brightness-[0.68] blur-[2px]"
            />

            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.16),rgba(0,0,0,0.74))]" />

            <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
              <div className="animate-luxury-rise max-w-3xl">
                <p className="mb-5 text-xs font-medium uppercase tracking-[0.6em] text-[#f5cd7a] sm:text-sm">
                  Red Diamond Cigars
                </p>

                <h1 className="font-serif text-4xl font-semibold leading-tight tracking-[0.06em] text-[#f8efe3] drop-shadow-[0_0_30px_rgba(0,0,0,0.75)] sm:text-6xl lg:text-7xl">{t("Crafted With")}<br />{t("Passion")}</h1>

                <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#d9cbbb] sm:text-base">{t("A refined cigar experience built on tradition, character, and unforgettable taste.")}</p>

                <div className="mt-9 flex justify-center">
                  <Link
                    href="/cigars"
                    className="inline-flex min-h-12 py-3 items-center justify-center border border-[#f5cd7a]/40 bg-[#f5cd7a]/15 px-7 text-xs font-medium uppercase tracking-[0.28em] text-[#f8efe3] backdrop-blur-md transition-all duration-500 hover:border-[#f5cd7a] hover:bg-[#f5cd7a] hover:text-black hover:shadow-[0_0_42px_rgba(245,205,122,0.25)]"
                  >{t("Explore Cigars")}</Link>
                </div>
              </div>
            </div>

            <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
              <a
                href="#experience"
                aria-label={t("Scroll to Red Diamond experience")}
                className="flex h-12 w-8 items-center justify-center text-[#f5cd7a]/80 transition-colors duration-300 hover:text-[#f5cd7a]"
              >
                <span className="animate-scroll-arrow text-2xl">⌄</span>
              </a>
            </div>
          </section>

          {/* Experience / Product Spotlight */}
          <section
            id="experience"
            className="relative h-screen snap-start snap-always overflow-hidden border-t border-[#f5cd7a]/15 px-6 py-24 text-[#f8efe3]"
          >
            <div className="relative z-10 mx-auto grid h-full max-w-6xl items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
              <Reveal direction="left" className="relative">
                <div className="relative overflow-hidden border border-[#f5cd7a]/20">
                  <Image
                    src="/images/holding-cigar-image.jpg"
                    alt={t("Red Diamond cigar")}
                    width={900}
                    height={650}
                    className="h-[42vh] w-full object-cover transition-transform duration-1600 hover:scale-105 lg:h-[58vh]"
                    priority={false}
                  />
                </div>
              </Reveal>

              <Reveal direction="right" delay={0.12}>
                <p className="text-xs font-medium uppercase tracking-[0.5em] text-[#f5cd7a]">{t("The Experience")}</p>

                <h2 className="mt-5 font-serif text-4xl font-semibold leading-tight sm:text-5xl">{t("A cigar made with the highest level of craftsmanship.")}</h2>

                <p className="mt-6 text-base leading-8 text-[#b8a99a]">{t("Red Diamond Cigars is built for customers who value taste, experience, and atmosphere.")}</p>

                <div className="mt-8 flex flex-col gap-3 text-sm uppercase tracking-[0.28em] text-[#d9cbbb] sm:flex-row sm:gap-8">
                  <span>{t("Rich aroma")}</span>
                  <span>{t("Bold character")}</span>
                  <span>{t("High quality")}</span>
                </div>

                <div className="mt-10">
                  <Link
                    href="/cigars"
                    className="inline-flex min-h-12 py-3 items-center justify-center border border-[#f5cd7a]/40 bg-[#f5cd7a]/15 px-7 text-xs font-medium uppercase tracking-[0.28em] text-[#f8efe3] backdrop-blur-md transition-all duration-500 hover:border-[#f5cd7a] hover:bg-[#f5cd7a] hover:text-black hover:shadow-[0_0_42px_rgba(245,205,122,0.25)]"
                  >{t("View Collection")}</Link>
                </div>
              </Reveal>
            </div>
          </section>

          {/* Story Teaser */}
          <section className="relative h-screen snap-start snap-always overflow-hidden px-6 py-24 text-[#f8efe3]">
            <div className="relative z-10 mx-auto grid h-full max-w-6xl items-center gap-10 lg:grid-cols-[0.9fr_1fr]">
              <Reveal direction="right" delay={0.12}>
                <p className="text-xs font-medium uppercase tracking-[0.5em] text-[#f5cd7a]">{t("Crafted with Tradition")}</p>

                <h2 className="mt-8 font-serif text-4xl font-semibold leading-tight sm:text-6xl">{t("Built around a passion for cigars.")}</h2>

                <p className="mt-7 max-w-2xl text-base leading-8 text-[#b8a99a]">{t("Rooted in passion and expertise, Red Diamond Cigars is made for those who appreciate detail and character.")}</p>

                <div className="mt-10">
                  <Link
                    href="/story"
                    className="inline-flex min-h-12 py-3 items-center justify-center border border-[#f5cd7a]/35 px-7 text-xs font-medium uppercase tracking-[0.28em] text-[#f8efe3] transition-all duration-500 hover:border-[#f5cd7a] hover:bg-[#f5cd7a] hover:text-black"
                  >{t("Our Story")}</Link>
                </div>
              </Reveal>

              <Reveal direction="left" className="relative">
                <div className="relative overflow-hidden border border-[#f5cd7a]/20 bg-black/40 shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
                  <Image
                    src="/images/making-cigars-image.jpg"
                    alt={t("Cigar making process")}
                    width={900}
                    height={650}
                    className="h-[42vh] w-full object-cover transition-transform duration-1600 hover:scale-105 lg:h-[58vh]"
                  />
                </div>
              </Reveal>
            </div>
          </section>

          {/* Final CTA */}
          <section className="relative h-screen snap-start snap-always overflow-hidden px-6 py-24 text-[#f8efe3]">
            <div className="relative z-10 mx-auto flex h-full max-w-4xl items-center justify-center text-center">
              <Reveal className="max-w-3xl">
                <p className="text-xs font-medium uppercase tracking-[0.5em] text-[#f5cd7a]">{t("Submit the Inquiry")}</p>

                <h2 className="mt-6 font-serif text-4xl font-semibold leading-tight sm:text-6xl">{t("Ready to discover your next cigar?")}</h2>

                <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#b8a99a]">{t("Browse the collection and submit an inquiry for availability.")}</p>

                <div className="mt-10">
                  <Link
                    href="/cigars"
                    className="inline-flex min-h-14 py-3 items-center justify-center border border-[#f5cd7a]/40 bg-[#f5cd7a] px-8 text-xs font-semibold uppercase tracking-[0.28em] text-black shadow-[0_0_45px_rgba(245,205,122,0.22)] transition-all duration-500 hover:bg-[#ffe3a3] hover:shadow-[0_0_65px_rgba(245,205,122,0.32)]"
                  >{t("Inquire Now")}</Link>
                </div>
              </Reveal>
            </div>
          </section>

          <div className="snap-end">
            <Footer />
          </div>
        </div>
      </HomeScrollShell>
    </div>
  );
}
