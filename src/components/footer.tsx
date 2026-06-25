import Link from "next/link";
import type { Category, SiteSettings } from "@/lib/types";
import { waLink, tgLink, igLink } from "@/lib/links";
import { WhatsAppIcon, TelegramIcon, InstagramIcon } from "./icons";

export function Footer({ settings, categories }: { settings: SiteSettings; categories: Category[] }) {
  return (
    <footer className="mt-24 border-t border-line bg-ink text-cream">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-clay text-cream font-display text-lg font-bold">Д</span>
            <span className="font-display text-lg font-bold">{settings.shopName}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-cream/70">
            Одежда с рынка «Дордой» оптом и в розницу. Прямые поставки и отшив крупных партий для стран СНГ.
          </p>
          <div className="mt-5 flex gap-2">
            <a href={waLink(settings.whatsapp)} target="_blank" rel="noopener noreferrer" className="grid h-10 w-10 place-items-center rounded-full bg-cream/10 hover:bg-pine" aria-label="WhatsApp">
              <WhatsAppIcon className="h-5 w-5" />
            </a>
            <a href={tgLink(settings.telegram)} target="_blank" rel="noopener noreferrer" className="grid h-10 w-10 place-items-center rounded-full bg-cream/10 hover:bg-[#2d8fd6]" aria-label="Telegram">
              <TelegramIcon className="h-5 w-5" />
            </a>
            <a href={igLink(settings.instagram)} target="_blank" rel="noopener noreferrer" className="grid h-10 w-10 place-items-center rounded-full bg-cream/10 hover:bg-clay" aria-label="Instagram">
              <InstagramIcon className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-cream/50">Каталог</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {categories.slice(0, 6).map((c) => (
              <li key={c.id}>
                <Link href={`/catalog/${c.slug}`} className="text-cream/80 hover:text-saffron">{c.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-cream/50">Бизнесу</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/wholesale" className="text-cream/80 hover:text-saffron">Оптовикам</Link></li>
            <li><Link href="/sellers" className="text-cream/80 hover:text-saffron">Для селлеров</Link></li>
            <li><Link href="/manufacturing" className="text-cream/80 hover:text-saffron">Отшив крупной партии</Link></li>
            <li><Link href="/delivery" className="text-cream/80 hover:text-saffron">Доставка и оплата</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-cream/50">Контакты</h4>
          <ul className="mt-4 space-y-2 text-sm text-cream/80">
            <li>{settings.address}</li>
            <li><a href={waLink(settings.whatsapp)} className="hover:text-saffron">WhatsApp: +{settings.whatsapp}</a></li>
            <li><a href={tgLink(settings.telegram)} className="hover:text-saffron">Telegram: @{settings.telegram}</a></li>
            <li className="pt-2"><Link href="/about" className="hover:text-saffron">О нас</Link> · <Link href="/contacts" className="hover:text-saffron">Контакты</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-cream/50 sm:flex-row">
          <span>© {new Date().getFullYear()} {settings.shopName}. Одежда с рынка Дордой для СНГ.</span>
          <Link href="/admin" className="hover:text-cream">Админ-панель</Link>
        </div>
      </div>
    </footer>
  );
}
