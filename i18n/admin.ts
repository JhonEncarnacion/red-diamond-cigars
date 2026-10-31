import { cache } from "react";
import { headers } from "next/headers";
import { createTranslator } from "next-intl";
import { resolveLocale } from "./locales";
import sourceKeys from "../messages/source-keys.json";
import type { TextValues } from "./text";

// Admin language follows the browser's device preferences, not the storefront cookie.
export const getAdminI18n = cache(async () => {
  const locale = resolveLocale(undefined, (await headers()).get("accept-language"));
  const messages = (await import(`../messages/${locale}.json`)).default;
  return { locale, messages, timeZone: "America/New_York" };
});

export async function getAdminText() {
  const config = await getAdminI18n();
  const translate = createTranslator(config);
  return (source: string, values?: TextValues) => {
    const key = (sourceKeys as Record<string, string>)[source];
    return key ? translate(key, values) : source;
  };
}
