import { getTranslations } from "next-intl/server";
import sourceKeys from "../messages/source-keys.json";
import type { TextValues } from "./text";
export async function getSiteText() {
  const translate = await getTranslations();
  return (source: string, values?: TextValues) => {
    const key = (sourceKeys as Record<string, string>)[source];
    return key ? translate(key, values) : source;
  };
}
