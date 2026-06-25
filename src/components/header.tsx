"use client";

import Link from "next/link";
import { useState } from "react";
import type { Category, SiteSettings } from "@/lib/types";
import { useSite } from "./providers";
import { CurrencySwitcher, LocaleSwitcher } from "./switchers";
import { MenuIcon, CloseIcon, WhatsAppIcon, SearchIcon } from "./icons";
import { waLink } from "@/lib/links";

const NAV = [
  { key: "nav.catalog", href: "/catalog" },
  { key: "nav.wholesale", href: "/wholesale" },
  { key: "nav.sellers", href: "/sellers" },
  { key: "nav.manufacturing", href: "/manufacturing" },
  { key: "nav.delivery", href: "/delivery" },
  { key: "nav.about", href: "/about" },
  { key: "nav.contacts", href: "/contacts" },
];

export function Header({ settings, categories }: { settings: SiteSettings; categories: Category[] }) {
  const { t } = useSite();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-cream/85 backdrop-blur-md">
      <div className="ornament-strip h-1 w-full" />
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-cream font-display text-lg font-bold">Д</span>
          <span className="font-display text-lg font-bold tracking-tight">{settings.shopName}</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-ink-soft transition hover:bg-cream-deep hover:text-ink"
            >
              {t(n.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden xl:flex items-center gap-2">
            <LocaleSwitcher />
            <CurrencySwitcher />
          </div>
          <a
            href={waLink(settings.whatsapp, "Здравствуйте! Пишу с сайта Dordoy Textile.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-wa hidden md:inline-flex !px-4 !py-2"
          >
            <WhatsAppIcon className="h-4 w-4" /> WhatsApp
          </a>
          <Link href="/catalog" className="btn-ghost hidden sm:inline-flex !px-4 !py-2">
            <SearchIcon className="h-4 w-4" /> {t("cta.catalog")}
          </Link>
          <button
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-full border border-ink/15 lg:hidden"
            aria-label="Меню"
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      {/* Мобильное меню */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[86%] max-w-sm animate-fade-up overflow-y-auto bg-cream p-5 shadow-lift">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-display text-lg font-bold">{settings.shopName}</span>
              <button onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border border-ink/15" aria-label="Закрыть">
                <CloseIcon />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base font-medium hover:bg-cream-deep">
                  {t(n.key)}
                </Link>
              ))}
            </nav>
            <div className="mt-5 border-t border-line pt-5">
              <p className="label">Категории</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <Link key={c.id} href={`/catalog/${c.slug}`} onClick={() => setOpen(false)} className="chip">
                    {c.emoji} {c.title}
                  </Link>
                ))}
              </div>
            </div>
            <div className="mt-5 flex items-center gap-2 border-t border-line pt-5">
              <LocaleSwitcher />
              <CurrencySwitcher />
            </div>
            <a
              href={waLink(settings.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa mt-5 w-full"
            >
              <WhatsAppIcon className="h-4 w-4" /> Написать в WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
