import { isLocale } from "@/i18n/locales";
type ProductText = {description: string; strength: string; wrapper: string | null; binder: string | null; filler: string | null; origin: string | null; translations?: unknown};
export const translatedFields = ["description", "strength", "wrapper", "binder", "filler", "origin"] as const;
export function localizeProduct<T extends ProductText>(product: T, locale: string): T {
  if (!isLocale(locale) || !product.translations || typeof product.translations !== "object") return product;
  const translation = (product.translations as Record<string, unknown>)[locale];
  if (!translation || typeof translation !== "object") return product;
  const result = {...product};
  for (const field of translatedFields) {
    const value = (translation as Record<string, unknown>)[field];
    if (typeof value === "string" && value.trim()) result[field] = value.trim();
  }
  return result;
}
