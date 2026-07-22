import Image from "next/image";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const publicLinks = [
  {
    label: "Cigars",
    href: "/cigars",
  },
  {
    label: "Story",
    href: "/story",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export function Navbar() {
  return (
    <header
      className="pointer-events-none fixed left-0 top-0 z-50 h-28 w-full"
      style={{
        background:
          "linear-gradient(to bottom, rgba(0,0,0,0.96), rgba(0,0,0,0.76), rgba(0,0,0,0.36), transparent)",
      }}
    >
      {/* Left: Menu */}
      <div className="pointer-events-auto absolute left-[clamp(20px,4vw,48px)] top-8">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Open navigation menu"
              className="group flex h-11 w-11 cursor-pointer items-center justify-center border border-[#f5cd7a]/40 bg-black/30 text-[#f5cd7a] shadow-[0_0_28px_rgba(0,0,0,0.42)] transition-colors duration-300 hover:border-[#f5cd7a]/80 hover:bg-[#f5cd7a]/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#f5cd7a]/70 data-[state=open]:border-[#f5cd7a]/80 data-[state=open]:bg-[#f5cd7a]/10 data-[state=open]:shadow-[0_0_34px_rgba(245,205,122,0.16)]"
            >
              <span className="flex flex-col gap-1.25">
                <span className="block h-px w-5 bg-current transition-transform duration-300 group-data-[state=open]:translate-y-1.5 group-data-[state=open]:rotate-45" />
                <span className="block h-px w-5 bg-current transition-opacity duration-300 group-data-[state=open]:opacity-0" />
                <span className="block h-px w-5 bg-current transition-transform duration-300 group-data-[state=open]:-translate-y-1.5 group-data-[state=open]:-rotate-45" />
              </span>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            sideOffset={8}
            className="z-999 min-w-56 rounded-none! border border-[#f5cd7a]/25 bg-black/90 p-2 text-[#f7efe2] shadow-[0_24px_80px_rgba(0,0,0,0.65)] backdrop-blur-xl"
          >
            {publicLinks.map((link) => (
              <DropdownMenuItem
                key={link.href}
                asChild
                className="rounded-none! p-0 focus:bg-transparent!"
              >
                <Link
                  href={link.href}
                  className="block w-full cursor-pointer rounded-none! border-b border-[#f5cd7a]/10 px-4 py-3 text-sm uppercase tracking-[0.22em] text-[#cbbba7] transition-colors duration-300 last:border-b-0 hover:bg-[#f5cd7a]! hover:text-black! focus:bg-[#f5cd7a]! focus:text-black! data-highlighted:bg-[#f5cd7a]! data-highlighted:text-black!"
                >
                  {link.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Center: Logo */}
      <div className="pointer-events-auto absolute left-1/2 top-7 -translate-x-1/2">
        <Link href="/" aria-label="Go to Red Diamond Cigars homepage">
          <Image
            src="/images/red-diamond-logo.png"
            alt="Red Diamond Cigars logo"
            width={76}
            height={64}
            priority
            className="object-contain drop-shadow-[0_0_22px_rgba(245,205,122,0.35)] transition-transform duration-500 hover:scale-105"
          />
        </Link>
      </div>

      {/* Right: CTA */}
      <div className="pointer-events-auto absolute right-[clamp(20px,4vw,48px)] top-8">
        <Link
          href="/cigars"
          className="inline-flex h-11 items-center justify-center border border-[#f5cd7a]/40 bg-black/30 px-6 text-xs font-medium uppercase tracking-[0.22em] text-[#f7efe2] no-underline shadow-[0_0_28px_rgba(0,0,0,0.42)] transition-all duration-300 hover:border-[#f5cd7a] hover:bg-[#f5cd7a] hover:text-black hover:shadow-[0_0_38px_rgba(245,205,122,0.2)]"
        >
          Inquire Now
        </Link>
      </div>
    </header>
  );
}
