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

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${inter.variable} ${cormorant.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col font-sans">
          <AgeGate />
          <AppNavbar />
          {children}
          <AppFooter />
        </body>
      </html>
    </ClerkProvider>
  );
}
