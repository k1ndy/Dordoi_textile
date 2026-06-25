import type { Metadata } from "next";
import { headers } from "next/headers";
import { Unbounded, Golos_Text } from "next/font/google";
import "./globals.css";
import { SiteProvider } from "@/components/providers";

// Шрифты самостоятельно хостятся Next.js (скачиваются при сборке, отдаются с своего
// домена с предзагрузкой) — убирает render-blocking запрос к Google Fonts и ускоряет FCP.
const display = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});
const body = Golos_Text({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

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
    <html lang="ru" className={`${display.variable} ${body.variable}`}>
      <body>
        <SiteProvider>{children}</SiteProvider>
      </body>
    </html>
  );
}
