"use client";

import Image from "next/image";
import Link from "next/link";
import { Cigarette, MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import type { MouseEvent } from "react";

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
  const pathname = usePathname();
  const menuRef = useRef<HTMLDetailsElement | null>(null);
  const [menuRenderKey, setMenuRenderKey] = useState(0);

  let rightLink = {
    label: "Inquire Now",
    href: "/cigars",
    icon: Cigarette,
  };

  if (pathname === "/cigars") {
    rightLink = {
      label: "Contact Us",
      href: "/contact",
      icon: MessageCircle,
    };
  }

  if (pathname.startsWith("/cigars/")) {
    rightLink = {
      label: "View Collection",
      href: "/cigars",
      icon: Cigarette,
    };
  }

  if (pathname === "/contact") {
    rightLink = {
      label: "View Collection",
      href: "/cigars",
      icon: Cigarette,
    };
  }

  const RightIcon = rightLink.icon;

  function blurActiveElement() {
    const activeElement = document.activeElement;

    if (activeElement instanceof HTMLElement) {
      activeElement.blur();
    }
  }

  function closeMenu() {
    if (menuRef.current) {
      menuRef.current.open = false;
    }

    blurActiveElement();

    window.setTimeout(() => {
      setMenuRenderKey((current) => current + 1);
    }, 0);
  }

  function handleMenuLinkMouseDown(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
  }

  function handleMenuLinkClick(event: MouseEvent<HTMLAnchorElement>) {
    event.currentTarget.blur();
    closeMenu();
  }

  return (
    <header
      className="fixed left-0 top-0 z-9999 h-24 w-full lg:h-28"
      style={{
        background:
          "linear-gradient(to bottom, rgba(0,0,0,0.96), rgba(0,0,0,0.76), rgba(0,0,0,0.36), transparent)",
      }}
    >
      {/* Left: Menu */}
      <details
        ref={menuRef}
        className="group absolute left-[clamp(16px,4vw,48px)] top-5 z-10000 lg:left-[clamp(20px,4vw,48px)] lg:top-8"
      >
        <summary
          aria-label="Open navigation menu"
          className="flex h-12 w-12 touch-manipulation cursor-pointer list-none select-none items-center justify-center border border-[#f5cd7a]/40 bg-black/30 text-[#f5cd7a] shadow-[0_0_28px_rgba(0,0,0,0.42)] transition-colors duration-300 hover:border-[#f5cd7a]/80 hover:bg-[#f5cd7a]/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#f5cd7a]/70 lg:h-11 lg:w-11 [&::-webkit-details-marker]:hidden"
        >
          <span className="relative block h-5 w-5">
            <span className="absolute left-0 top-1.25 block h-px w-5 bg-current transition-all duration-300 group-open:top-1/2 group-open:-translate-y-1/2 group-open:rotate-45" />
            <span className="absolute left-0 top-1/2 block h-px w-5 -translate-y-1/2 bg-current transition-opacity duration-300 group-open:opacity-0" />
            <span className="absolute left-0 bottom-1.25 block h-px w-5 bg-current transition-all duration-300 group-open:bottom-1/2 group-open:translate-y-1/2 group-open:-rotate-45" />
          </span>
        </summary>

        <nav
          key={menuRenderKey}
          aria-label="Main navigation"
          className="fixed left-[clamp(16px,4vw,48px)] top-19 z-10000 w-64 border border-[#f5cd7a]/25 bg-black/95 p-2 text-[#f7efe2] shadow-[0_24px_80px_rgba(0,0,0,0.75)] backdrop-blur-xl lg:left-[clamp(20px,4vw,48px)] lg:top-21"
        >
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onMouseDown={handleMenuLinkMouseDown}
              onClick={handleMenuLinkClick}
              className="block w-full border-b border-[#f5cd7a]/10 px-4 py-4 text-sm uppercase tracking-[0.22em] text-[#cbbba7] transition-colors duration-300 last:border-b-0 hover:bg-[#f5cd7a] hover:text-black focus:bg-transparent focus:text-[#cbbba7] focus:outline-none active:bg-transparent active:text-[#cbbba7] lg:py-3"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </details>

      {/* Center: Logo */}
      <div className="absolute left-1/2 top-5 z-9999 -translate-x-1/2 lg:top-7">
        <Link
          href="/"
          aria-label="Go to Red Diamond Cigars homepage"
          onMouseDown={(event) => event.preventDefault()}
          onClick={closeMenu}
        >
          <Image
            src="/images/red-diamond-logo.png"
            alt="Red Diamond Cigars logo"
            width={76}
            height={64}
            priority
            className="h-14 w-auto object-contain drop-shadow-[0_0_22px_rgba(245,205,122,0.35)] transition-transform duration-500 hover:scale-105 lg:h-16"
          />
        </Link>
      </div>

      {/* Right: Dynamic CTA */}
      <div className="absolute right-[clamp(16px,4vw,48px)] top-5 z-9999 lg:right-[clamp(20px,4vw,48px)] lg:top-8">
        <Link
          href={rightLink.href}
          aria-label={rightLink.label}
          onMouseDown={(event) => event.preventDefault()}
          onClick={closeMenu}
          className="inline-flex h-12 w-12 touch-manipulation items-center justify-center border border-[#f5cd7a]/40 bg-black/30 text-[#f5cd7a] no-underline shadow-[0_0_28px_rgba(0,0,0,0.42)] transition-all duration-300 hover:border-[#f5cd7a] hover:bg-[#f5cd7a] hover:text-black hover:shadow-[0_0_38px_rgba(245,205,122,0.2)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#f5cd7a]/70 lg:h-11 lg:w-auto lg:px-6 lg:text-xs lg:font-medium lg:uppercase lg:tracking-[0.22em] lg:text-[#f7efe2]"
        >
          <RightIcon className="h-5 w-5 lg:hidden" />
          <span className="hidden lg:inline">{rightLink.label}</span>
        </Link>
      </div>
    </header>
  );
}
