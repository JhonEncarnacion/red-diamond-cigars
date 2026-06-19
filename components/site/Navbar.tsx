import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { SignInButton, UserButton } from "@clerk/nextjs";

export async function Navbar() {
  const { userId } = await auth();

  return (
    <header className="sticky top-0 z-50 border-b border-red-950/60 bg-black/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="group flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-700 shadow-[0_0_18px_rgba(185,28,28,0.9)]" />
          <span className="text-xl font-bold tracking-tight">
            Red Diamond <span className="gold-text">Cigars</span>
          </span>
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/cigars"
            className="text-muted-foreground transition-colors hover:text-amber-300"
          >
            Cigars
          </Link>

          <Link
            href="/#story"
            className="text-muted-foreground transition-colors hover:text-amber-300"
          >
            Story
          </Link>

          <Link
            href="/#contact"
            className="text-muted-foreground transition-colors hover:text-amber-300"
          >
            Contact
          </Link>

          {userId && (
            <Link
              href="/admin"
              className="text-muted-foreground transition-colors hover:text-amber-300"
            >
              Admin
            </Link>
          )}

          {userId ? (
            <UserButton />
          ) : (
            <SignInButton mode="modal">
              <button className="text-muted-foreground transition-colors hover:text-amber-300">
                Sign in
              </button>
            </SignInButton>
          )}
        </nav>
      </div>
    </header>
  );
}
