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
    href: "/#story",
  },
  {
    label: "Contact",
    href: "/#contact",
  },
];

export function Navbar() {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "112px",
        zIndex: 50,
        background:
          "linear-gradient(to bottom, rgba(0,0,0,0.72), rgba(0,0,0,0.28), transparent)",
      }}
    >
      {/* Left: Menu */}
      <div
        style={{
          position: "absolute",
          top: "32px",
          left: "48px",
        }}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Open navigation menu"
              style={{
                height: "44px",
                width: "44px",
                borderRadius: "999px",
                border: "1px solid rgba(245,205,122,0.35)",
                background: "rgba(0,0,0,0.25)",
                color: "#f5cd7a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                }}
              >
                <span
                  style={{
                    display: "block",
                    width: "20px",
                    height: "1px",
                    background: "currentColor",
                  }}
                />
                <span
                  style={{
                    display: "block",
                    width: "20px",
                    height: "1px",
                    background: "currentColor",
                  }}
                />
                <span
                  style={{
                    display: "block",
                    width: "20px",
                    height: "1px",
                    background: "currentColor",
                  }}
                />
              </span>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            sideOffset={14}
            className="z-999 min-w-56 border border-[#f5cd7a]/25 bg-black/90 p-2 text-[#f7efe2] shadow-[0_24px_80px_rgba(0,0,0,0.65)] backdrop-blur-xl"
          >
            {publicLinks.map((link) => (
              <DropdownMenuItem key={link.href} asChild>
                <Link
                  href={link.href}
                  className="cursor-pointer rounded-sm px-4 py-3 text-sm uppercase tracking-[0.22em] text-[#cbbba7] transition-colors duration-300 hover:bg-[#f5cd7a]/10 hover:text-[#f5cd7a]"
                >
                  {link.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Center: Logo */}
      <div
        style={{
          position: "absolute",
          top: "28px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <Link href="/" aria-label="Go to Red Diamond Cigars homepage">
          <Image
            src="/images/red-diamond-logo.png"
            alt="Red Diamond Cigars logo"
            width={76}
            height={64}
            priority
            className="object-contain drop-shadow-[0_0_22px_rgba(245,205,122,0.35)]"
          />
        </Link>
      </div>

      {/* Right: CTA */}
      <div
        style={{
          position: "absolute",
          top: "32px",
          right: "48px",
        }}
      >
        <Link
          href="/cigars"
          style={{
            height: "44px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(245,205,122,0.4)",
            background: "rgba(0,0,0,0.25)",
            padding: "0 24px",
            fontSize: "12px",
            fontWeight: 500,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#f7efe2",
            textDecoration: "none",
          }}
        >
          Inquire Now
        </Link>
      </div>
    </header>
  );
}
