import Link from "next/link";
import type { ReactNode } from "react";

type AdminShellProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function AdminShell({
  title,
  eyebrow = "Admin",
  description,
  actions,
  children,
}: AdminShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050000] text-[#f8efe3]">
      <div className="absolute inset-0 page-bg-luxury" />
      <div className="absolute inset-0 page-bg-texture" />
      <div className="absolute inset-0 bg-black/25" />

      <section className="relative z-10 mx-auto w-full max-w-6xl px-6 py-12">
        <div className="mb-10 flex flex-col gap-6 border-b border-[#f5cd7a]/15 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.45em] text-[#f5cd7a]">
              {eyebrow}
            </p>

            <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[0.04em] text-[#f8efe3]">
              {title}
            </h1>

            {description ? (
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#b8a99a]">
                {description}
              </p>
            ) : null}
          </div>

          {actions ? (
            <div className="flex flex-wrap gap-3">{actions}</div>
          ) : null}
        </div>

        {children}
      </section>
    </main>
  );
}

export function AdminButtonLink({
  href,
  children,
  variant = "outline",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline";
}) {
  if (variant === "primary") {
    return (
      <Link
        href={href}
        className="inline-flex h-11 items-center justify-center border border-[#f5cd7a]/40 bg-[#f5cd7a] px-6 text-xs font-semibold uppercase tracking-[0.22em] text-black shadow-[0_0_35px_rgba(245,205,122,0.18)] transition-all duration-500 hover:bg-[#ffe3a3] hover:shadow-[0_0_55px_rgba(245,205,122,0.28)]"
      >
        {children}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="inline-flex h-11 items-center justify-center border border-[#f5cd7a]/30 bg-black/25 px-6 text-xs font-medium uppercase tracking-[0.22em] text-[#f8efe3] backdrop-blur-md transition-all duration-500 hover:border-[#f5cd7a] hover:bg-[#f5cd7a] hover:text-black"
    >
      {children}
    </Link>
  );
}

export function AdminCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border border-[#f5cd7a]/15 bg-black/30 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  );
}
