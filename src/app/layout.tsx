import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { SiteProvider } from "@/components/providers";

// Чтение nonce из заголовков переводит рендер в динамический режим —
// это обязательно, чтобы Next.js подставил nonce в свои inline-скрипты под строгий CSP.

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Одежда с рынка Дордой оптом и в розницу для стран СНГ",
    template: "%s | Dordoy Textile",
  },
  description:
    "Одежда с рынка Дордой оптом и в розницу. Прямые поставки, отправка по СНГ: Кыргызстан, Казахстан, Россия, Узбекистан. Опт, розница и отшив крупной партии под бренд.",
  keywords: [
    "одежда с Дордоя", "одежда оптом Кыргызстан", "одежда оптом Бишкек",
    "одежда с рынка Дордой", "купить одежду оптом СНГ", "мужская одежда оптом",
    "женская одежда оптом", "детская одежда оптом", "пошив одежды Кыргызстан",
    "отшив одежды для селлеров", "одежда для маркетплейсов",
  ],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    title: "Одежда с рынка Дордой оптом и в розницу для стран СНГ",
    description: "Прямые поставки с рынка Дордой. Опт, розница и отшив партий под бренд. Доставка по СНГ.",
    siteName: "Dordoy Textile",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  headers().get("x-nonce"); // переводит рендер в динамику для корректной работы nonce-CSP
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600;700&family=Unbounded:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SiteProvider>{children}</SiteProvider>
      </body>
    </html>
  );
}
