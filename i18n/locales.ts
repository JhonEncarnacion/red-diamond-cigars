export const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "pt", name: "Português" },
  { code: "de", name: "Deutsch" },
  { code: "it", name: "Italiano" },
  { code: "zh", name: "简体中文" },
] as const;
export type Locale = (typeof languages)[number]["code"];
export const localeCookie = "rd-language";
export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && languages.some(language => language.code === value);
}
export function resolveLocale(saved: string | undefined, acceptLanguage: string | null): Locale {
  if (isLocale(saved)) return saved;
  const preferences = (acceptLanguage ?? "").split(",").map((entry, index) => {
    const [tag, ...parameters] = entry.trim().toLowerCase().split(";");
    const quality = parameters.find(parameter => parameter.trim().startsWith("q="));
    const weight = quality ? Number(quality.trim().slice(2)) : 1;
    return { tag, weight, index };
  }).filter(({weight}) => Number.isFinite(weight) && weight > 0 && weight <= 1)
    .sort((a, b) => b.weight - a.weight || a.index - b.index);
  for (const {tag} of preferences) {
    // Traditional Chinese is not offered as a Simplified Chinese translation.
    if (/^zh-(tw|hk|mo|hant)(-|$)/.test(tag)) continue;
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return "en";
}
