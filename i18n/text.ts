import { useTranslations } from "next-intl";
import sourceKeys from "../messages/source-keys.json";
export type TextValues = Record<string, string | number>;
export function messageKey(source: string): string | undefined {
  return (sourceKeys as Record<string, string>)[source];
}
export function useSiteText() {
  const translate = useTranslations();
  return (source: string, values?: TextValues) => {
    const key = messageKey(source);
    return key ? translate(key, values) : source;
  };
}
