import { getSiteText } from "@/i18n/server";
import { useSiteText } from "@/i18n/text";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getSiteText();
  return { title: t("Story"), description: t("Learn the story behind Red Diamond Cigars, a family-driven cigar brand built on tradition, craftsmanship, and passion.") };
}

export default function StoryPage() {
  const t = useSiteText();
  return (
    <main className="relative overflow-hidden bg-[#050000] text-[#f8efe3]">
      {/* Page background */}
      <div className="absolute inset-0 page-bg-luxury-alt" />
      <div className="absolute inset-0 page-bg-texture" />
      <div className="absolute inset-0 bg-black/25" />

      {/* Hero / Story intro */}
      <section className="relative z-10 px-6 pb-20 pt-36">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          {/* Left photo */}
          <div className="relative overflow-hidden border border-[#f5cd7a]/20 bg-black/35 shadow-[0_40px_120px_rgba(0,0,0,0.6)] backdrop-blur-md">
            <div className="absolute inset-0 z-10 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.08),rgba(0,0,0,0.48))]" />
            <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.45))]" />

            <Image
              src="/images/story-image.jpg"
              alt={t("Red Diamond Cigars story")}
              width={900}
              height={1100}
              priority
              className="h-[52vh] w-full object-cover transition-transform duration-1600 hover:scale-105 lg:h-[68vh]"
            />

            <div className="absolute bottom-0 left-0 z-20 w-full border-t border-[#f5cd7a]/15 bg-black/45 px-6 py-5 backdrop-blur-md">
              <p className="text-xs font-medium uppercase tracking-[0.35em] text-[#f5cd7a]">{t("Quality. Craft. Experience.")}</p>
            </div>
          </div>

          {/* Right story content */}
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.55em] text-[#f5cd7a]">{t("Our Story")}</p>

            <h1 className="mt-6 font-serif text-5xl font-semibold leading-tight tracking-[0.04em] text-[#f8efe3] sm:text-6xl lg:text-7xl">{t("Made with Passion")}</h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-[#b8a99a]">{t("Red Diamond Cigars is a cigar brand shaped by passion, patience, and respect for the cigar-making tradition.")}</p>

            <div className="mt-9 border border-[#f5cd7a]/20 bg-black/35 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-md">
              <div className="space-y-6">
                <div className="border-b border-[#f5cd7a]/15 pb-6">
                  <p className="text-sm uppercase tracking-[0.28em] text-[#d9cbbb]">{t("Quality")}</p>

                  <p className="mt-3 leading-7 text-[#b8a99a]">{t("Every cigar is crafted with meticulous attention to detail, ensuring a premium smoking experience that reflects our commitment to excellence.")}</p>
                </div>

                <div className="border-b border-[#f5cd7a]/15 pb-6">
                  <p className="text-sm uppercase tracking-[0.28em] text-[#d9cbbb]">{t("Craft")}</p>

                  <p className="mt-3 leading-7 text-[#b8a99a]">{t("The brand is built around the details that make cigars memorable: aroma, character, quality, and the experience that comes with smoking a great cigar.")}</p>
                </div>

                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-[#d9cbbb]">{t("Experience")}</p>

                  <p className="mt-3 leading-7 text-[#b8a99a]">{t("Our cigars are designed to be savored, creating moments of relaxation and enjoyment.")}</p>
                </div>
              </div>
            </div>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/cigars"
                className="inline-flex min-h-12 py-3 items-center justify-center border border-[#f5cd7a]/40 bg-[#f5cd7a] px-8 text-xs font-semibold uppercase tracking-[0.28em] text-black shadow-[0_0_45px_rgba(245,205,122,0.18)] transition-all duration-500 hover:bg-[#ffe3a3] hover:shadow-[0_0_65px_rgba(245,205,122,0.28)]"
              >{t("Explore Cigars")}</Link>

              <Link
                href="/contact"
                className="inline-flex min-h-12 py-3 items-center justify-center border border-[#f5cd7a]/30 bg-black/25 px-8 text-xs font-medium uppercase tracking-[0.28em] text-[#f8efe3] backdrop-blur-md transition-all duration-500 hover:border-[#f5cd7a] hover:bg-[#f5cd7a]/10"
              >{t("Contact Us")}</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
