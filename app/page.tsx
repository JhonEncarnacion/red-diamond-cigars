import Link from "next/link";
import { ProductCard } from "@/components/site/ProductCard";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    take: 3,
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Background video */}
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/cigar-placeholder.png"
        >
          <source src="/videos/cigar-hero.mp4" type="video/mp4" />
        </video>

        {/* Dark overlays */}
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,205,122,0.14),transparent_34%),linear-gradient(to_bottom,rgba(0,0,0,0.35),rgba(0,0,0,0.82))]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(80,0,0,0.32),transparent_40%,rgba(120,75,0,0.18))]" />

        {/* Foreground text */}
        <div className="relative z-10 flex min-h-screen items-center justify-center px-6 text-center">
          <div className="animate-luxury-rise max-w-3xl">
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.6em] text-[#f5cd7a] sm:text-sm">
              Red Diamond Cigars
            </p>

            <h1 className="font-serif text-4xl font-semibold leading-tight tracking-[0.06em] text-[#f8efe3] drop-shadow-[0_0_30px_rgba(0,0,0,0.75)] sm:text-6xl lg:text-7xl">
              Crafted for the
              <br />
              Moment
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-[#d9cbbb] sm:text-base">
              A refined cigar experience built on tradition, character, and
              unforgettable taste.
            </p>
          </div>
        </div>
      </section>

      {/* Featured cigars */}
      <section
        id="featured"
        className="relative min-h-screen border-t border-[#f5cd7a]/15 bg-[#070202] px-6 py-24"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(185,28,28,0.18),transparent_32%),linear-gradient(to_bottom,#070202,#120606)]" />

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.5em] text-[#f5cd7a]">
              Collection
            </p>
            <h2 className="mt-4 font-serif text-4xl font-semibold text-[#f8efe3] sm:text-5xl">
              Featured Cigars
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#b8a99a]">
              Explore selected cigars and submit an inquiry for availability.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section
        id="story"
        className="min-h-screen bg-black px-6 py-24 text-[#f8efe3]"
      >
        <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.5em] text-[#f5cd7a]">
              Our Story
            </p>
            <h2 className="mt-5 font-serif text-4xl font-semibold sm:text-5xl">
              Built around craft, patience, and presence.
            </h2>
            <p className="mt-6 text-base leading-8 text-[#b8a99a]">
              Red Diamond Cigars is built around craftsmanship, tradition, and
              direct customer relationships. Each cigar listed here represents a
              product customers can ask about directly before making any
              arrangement with the business owner.
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="border-t border-[#f5cd7a]/15 bg-[#090303] px-6 py-24 text-[#f8efe3]"
      >
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.5em] text-[#f5cd7a]">
            Contact
          </p>
          <h2 className="mt-5 font-serif text-4xl font-semibold sm:text-5xl">
            Interested in a cigar?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#b8a99a]">
            Browse the collection and submit an inquiry from any cigar detail
            page.
          </p>

          <div className="mt-9">
            <Link
              href="/cigars"
              className="inline-flex h-12 items-center justify-center border border-[#f5cd7a]/40 bg-[#f5cd7a] px-7 text-xs font-semibold uppercase tracking-[0.28em] text-black transition-all duration-500 hover:bg-[#ffe3a3] hover:shadow-[0_0_42px_rgba(245,205,122,0.25)]"
            >
              Inquire Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
