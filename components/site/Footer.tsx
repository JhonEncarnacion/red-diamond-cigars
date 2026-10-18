import { useSiteText } from "@/i18n/text";
export function Footer() {
  const t = useSiteText();
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground">
        <p>{t("This website is intended for adults 21 years of age or older. Product inquiries submitted through this site do not constitute a purchase, sale, or shipment agreement.")}</p>
      </div>
    </footer>
  );
}
