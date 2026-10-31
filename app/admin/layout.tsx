import { NextIntlClientProvider } from "next-intl";
import { getAdminI18n } from "@/i18n/admin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const config = await getAdminI18n();
  return (
    <NextIntlClientProvider {...config}>
      <div lang={config.locale}>{children}</div>
    </NextIntlClientProvider>
  );
}
