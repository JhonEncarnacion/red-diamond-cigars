import { NextIntlClientProvider } from "next-intl";
import { getSiteText } from "@/i18n/server";
import { getLocale } from "next-intl/server";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { AgeGate } from "@/components/site/AgeGate";
import { ClerkProvider } from "@clerk/nextjs";
import { siteConfig } from "@/lib/site";
import { Metadata } from "next";
import { AppFooter } from "@/components/site/AppFooter";
import { AppNavbar } from "@/components/site/AppNavbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getSiteText();
  return {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: t(siteConfig.description),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <ClerkProvider>
      <html
        lang={locale}
        className={`${inter.variable} ${cormorant.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col font-sans">
          <NextIntlClientProvider>
          <AgeGate />
          <AppNavbar />
          {children}
          <AppFooter />
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
