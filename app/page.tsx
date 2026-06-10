import Link from "next/link";
import { Button } from "@/components/ui/button";
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
    <div>
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Handmade Premium Cigars
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            A refined cigar catalog for serious cigar enthusiasts.
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Explore a curated collection of handmade cigars and request
            availability directly. This website is for inquiries only and does
            not process online payments.
          </p>

          <div className="mt-8 flex gap-4">
            <Button asChild size="lg">
              <Link href="/cigars">View Cigars</Link>
            </Button>

            <Button asChild variant="outline" size="lg">
              <Link href="#story">Our Story</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl font-bold tracking-tight">Featured Cigars</h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section id="story" className="mx-auto max-w-6xl px-4 py-16">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight">Our Story</h2>
          <p className="mt-4 text-muted-foreground">
            Built around craftsmanship, tradition, and direct customer
            relationships. Each cigar listed here represents a product that
            customers can ask about directly before making any arrangement with
            the business owner.
          </p>
        </div>
      </section>

      <section id="contact" className="border-t bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="text-2xl font-bold tracking-tight">
            Interested in a cigar?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Browse the catalog and submit an inquiry from any cigar detail page.
          </p>
        </div>
      </section>
    </div>
  );
}
