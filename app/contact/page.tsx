import { getSiteText } from "@/i18n/server";
import { useSiteText } from "@/i18n/text";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getSiteText();
  return { title: t("Contact"), description: t("Contact Red Diamond Cigars for cigar availability and inquiries.") };
}

const instagramUrl = "https://www.instagram.com/reddiamond001";

const contacts = [
  {
    role: "Founder",
    name: "Luis Encarnacion",
    email: "reddiamondcigars001@gmail.com",
    phone: "(914) 689-6167",
  },
  {
    role: "Manager",
    name: "Osvaldina Contreras",
    email: "more@reddiamondcigar.com",
    phone: "(347) 981-6331",
  },
  {
    role: "Technology",
    name: "Jhon Encarnacion",
    email: "contact@reddiamondcigar.com",
    phone: "(347) 282-0207",
  },
];

function getPhoneHref(phone: string) {
  return `tel:${phone.replace(/[^0-9+]/g, "")}`;
}

function getWhatsAppHref(phone: string) {
  const digitsOnly = phone.replace(/\D/g, "");

  // Assumes US numbers. WhatsApp needs country code with no symbols.
  return `https://wa.me/1${digitsOnly}`;
}

function WhatsAppIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="currentColor"
    >
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.5 0 .15 5.35.15 11.93c0 2.1.55 4.16 1.6 5.97L.05 24l6.25-1.64a11.9 11.9 0 0 0 5.78 1.47h.01c6.58 0 11.93-5.35 11.93-11.93 0-3.19-1.24-6.18-3.5-8.42ZM12.09 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.71.97.99-3.61-.23-.37a9.85 9.85 0 0 1-1.51-5.27c0-5.44 4.43-9.87 9.88-9.87a9.8 9.8 0 0 1 6.98 2.9 9.8 9.8 0 0 1 2.89 6.97c0 5.44-4.43 9.87-9.89 9.87Zm5.42-7.39c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.95 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.51s1.08 2.91 1.23 3.11c.15.2 2.13 3.25 5.16 4.56.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function ContactPage() {
  const t = useSiteText();
  return (
    <main className="min-h-screen bg-[#050000] text-[#f8efe3]">
      <section className="relative flex min-h-screen items-center overflow-hidden px-6 py-28">
        {/* Unified luxury background */}
        <div className="absolute inset-0 page-bg-luxury-center" />
        <div className="absolute inset-0 page-bg-texture" />
        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.55em] text-[#f5cd7a]">{t("Contact")}</p>

            <h1 className="mt-6 font-serif text-5xl font-semibold leading-tight tracking-[0.04em] text-[#f8efe3] sm:text-6xl lg:text-7xl">{t("Get in Touch")}</h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#b8a99a]">{t("Reach out directly for cigar availability, questions, and inquiry follow-up.")}</p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {contacts.map((contact) => (
              <div
                key={contact.email}
                className="border border-[#f5cd7a]/20 bg-black/35 p-7 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-md transition-all duration-500 hover:border-[#f5cd7a]/45 hover:bg-black/50 hover:shadow-[0_0_45px_rgba(245,205,122,0.08)]"
              >
                <p className="text-xs font-medium uppercase tracking-[0.35em] text-[#f5cd7a]">
                  {t(contact.role)}
                </p>

                <h2 className="mt-4 font-serif text-3xl font-semibold tracking-[0.04em] text-[#f8efe3]">
                  {contact.name}
                </h2>

                <div className="mt-7 space-y-5 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-[#8f8174]">{t("Email")}</p>

                    <a
                      href={`mailto:${contact.email}`}
                      className="mt-2 block wrap-break-word text-[#d9cbbb] transition-colors duration-300 hover:text-[#f5cd7a]"
                    >
                      {contact.email}
                    </a>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-[#8f8174]">{t("Phone")}</p>

                    <div className="relative mt-2">
                      <a
                        href={getPhoneHref(contact.phone)}
                        className="block pr-14 text-[#d9cbbb] transition-colors duration-300 hover:text-[#f5cd7a]"
                      >
                        {contact.phone}
                      </a>

                      <a
                        href={getWhatsAppHref(contact.phone)}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={t("Message {name} on WhatsApp", {name: contact.name})}
                        className="absolute right-0 top-1 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-[#f5cd7a]/30 bg-black/25 text-[#f5cd7a] transition-all duration-300 hover:border-[#f5cd7a] hover:bg-[#f5cd7a] hover:text-black hover:shadow-[0_0_30px_rgba(245,205,122,0.18)]"
                      >
                        <WhatsAppIcon />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 justify-center gap-4 text-center sm:grid-cols-2">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 py-3 w-full items-center justify-center gap-3 border border-[#f5cd7a]/40 bg-black/25 px-7 text-xs font-medium uppercase tracking-[0.28em] text-[#f8efe3] backdrop-blur-md transition-all duration-500 hover:border-[#f5cd7a] hover:bg-[#f5cd7a] hover:text-black hover:shadow-[0_0_42px_rgba(245,205,122,0.2)]"
            >
              <InstagramIcon />
              Instagram
            </a>
            <Link
              href="/cigars"
              className="inline-flex min-h-12 py-3 w-full items-center justify-center border border-[#f5cd7a]/40 bg-[#f5cd7a] px-7 text-xs font-semibold uppercase tracking-[0.28em] text-black shadow-[0_0_45px_rgba(245,205,122,0.18)] transition-all duration-500 hover:bg-[#ffe3a3] hover:shadow-[0_0_65px_rgba(245,205,122,0.28)]"
            >{t("Browse Cigars")}</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
