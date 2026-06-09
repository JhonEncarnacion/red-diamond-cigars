import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-12">
      <h1 className="text-4xl font-bold">Cigar Site</h1>
      <p className="mt-4 text-muted-foreground">
        Premium cigar catalog and inquiry website.
      </p>

      <Button className="mt-6">Test Button</Button>
    </main>
  );
}
