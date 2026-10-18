"use client";

import { useId, useState, useTransition } from "react";
import { useLocale } from "next-intl";
import { ChevronDown, Check, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { languages } from "@/i18n/locales";
import { useSiteText } from "@/i18n/text";
import { setLanguage } from "@/app/actions/language";

export function LanguageSelector({ variant = "compact" }: { variant?: "menu" | "compact" }) {
  const id = useId();
  const locale = useLocale();
  const t = useSiteText();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState(false);

  function changeLanguage(value: string) {
    setError(false);
    startTransition(async () => {
      try {
        await setLanguage(value);
        router.refresh();
      } catch {
        setError(true);
      }
    });
  }

  const feedback = (
    <>
      {pending && <p role="status" className="mt-2 px-4 text-xs normal-case tracking-normal text-[#b8a99a]">{t("Changing language…")}</p>}
      {error && <p role="alert" className="mt-2 px-4 text-xs normal-case tracking-normal text-red-300">{t("Could not change language. Please try again.")}</p>}
    </>
  );

  if (variant === "menu") {
    return (
      <div className="border-t border-[#f5cd7a]/10">
        <details>
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 text-sm uppercase tracking-[0.22em] text-[#cbbba7] transition-colors duration-300 hover:bg-[#f5cd7a] hover:text-black focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#f5cd7a] lg:py-3 [&::-webkit-details-marker]:hidden">
            <span>{t("Language")}</span>
            <span className="flex items-center gap-2 text-[10px] tracking-[0.12em]">
              {locale.toUpperCase()}<ChevronDown aria-hidden="true" className="h-3.5 w-3.5" />
            </span>
          </summary>
          <div role="group" aria-label={t("Language")} className="border-t border-[#f5cd7a]/10">
            {languages.map(language => (
              <button key={language.code} type="button" lang={language.code} aria-pressed={locale === language.code} disabled={pending} onClick={() => changeLanguage(language.code)} className={`flex min-h-11 w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm transition-colors duration-300 hover:bg-[#f5cd7a] hover:text-black focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#f5cd7a] disabled:opacity-60 ${locale === language.code ? "bg-[#f5cd7a]/[0.05] text-[#f5cd7a]" : "text-[#cbbba7]"}`}>
                {language.name}{locale === language.code && <Check aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />}
              </button>
            ))}
            <button type="button" disabled={pending} onClick={() => changeLanguage("auto")} className="min-h-11 w-full border-t border-[#f5cd7a]/10 px-4 py-3 text-left text-sm text-[#cbbba7] transition-colors duration-300 hover:bg-[#f5cd7a] hover:text-black focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#f5cd7a] disabled:opacity-60">{t("Use browser language")}</button>
          </div>
        </details>
        {feedback}
      </div>
    );
  }

  return (
    <div className="text-left">
      <label htmlFor={id} className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#d3b77f]">
        <Globe aria-hidden="true" className="h-3.5 w-3.5" />{t("Language")}
      </label>
      <select id={id} value={locale} disabled={pending} onChange={event => changeLanguage(event.target.value)} className="min-h-11 w-full cursor-pointer rounded-none border border-[#f5cd7a]/25 bg-[#100909] px-3 py-2 text-sm text-[#f8efe3] outline-none focus-visible:border-[#f5cd7a] focus-visible:ring-1 focus-visible:ring-[#f5cd7a] disabled:opacity-60">
        {languages.map(language => <option key={language.code} value={language.code} lang={language.code}>{language.name}</option>)}
        <option value="auto">{t("Use browser language")}</option>
      </select>
      {feedback}
    </div>
  );
}
