"use server";
import { cookies } from "next/headers";
import { isLocale, localeCookie } from "@/i18n/locales";
export async function setLanguage(value: string) {
  if (value !== "auto" && !isLocale(value)) throw new Error("Unsupported language");
  const store = await cookies();
  if (value === "auto") store.delete(localeCookie);
  else store.set(localeCookie, value, {
    path: "/", maxAge: 60 * 60 * 24 * 365, httpOnly: true,
    sameSite: "lax", secure: process.env.NODE_ENV === "production",
  });
}
