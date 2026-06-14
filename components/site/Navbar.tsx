import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { SignInButton, UserButton } from "@clerk/nextjs";

export async function Navbar() {
  const { userId } = await auth();

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Red Diamond Cigars
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

          {userId && (
            <Link
              href="/admin"
              className="text-muted-foreground hover:text-foreground"
            >
              Admin
            </Link>
          )}

          {userId ? (
            <UserButton />
          ) : (
            <SignInButton mode="modal">
              <button className="text-muted-foreground hover:text-foreground">
                Sign in
              </button>
            </SignInButton>
          )}
        </nav>
      </div>
    </header>
  );
}
