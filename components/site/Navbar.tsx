import Link from "next/link";

export function Navbar() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Red Diamond Cigars
        </Link>

        <Link
          href="/admin/inquiries"
          className="text-muted-foreground hover:text-foreground"
        >
          Admin
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/cigars"
            className="text-muted-foreground hover:text-foreground"
          >
            Cigars
          </Link>
          <Link
            href="/#story"
            className="text-muted-foreground hover:text-foreground"
          >
            Story
          </Link>
          <Link
            href="/#contact"
            className="text-muted-foreground hover:text-foreground"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
