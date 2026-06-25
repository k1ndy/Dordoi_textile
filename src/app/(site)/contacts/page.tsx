import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { LeadForm } from "@/components/lead-form";
import { getSettings } from "@/lib/data";
import { waLink, tgLink, igLink } from "@/lib/links";
import { WhatsAppIcon, TelegramIcon, InstagramIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Контакты — связаться с продавцом",
  description: "Свяжитесь с нами в WhatsApp, Telegram или Instagram. Адрес на рынке Дордой, форма обратной связи.",
  alternates: { canonical: "/contacts" },
};

export default async function ContactsPage() {
  const settings = await getSettings();
  return (
    <>
      <PageHero eyebrow="Контакты" title="Свяжитесь с нами" subtitle="Ответим в мессенджерах быстрее всего. Также можно оставить заявку через форму." />

      <section className="container-x grid gap-10 py-14 lg:grid-cols-2">
        <div>
          <div className="grid gap-3 sm:grid-cols-2">
            <a href={waLink(settings.whatsapp)} target="_blank" rel="noopener noreferrer" className="card flex items-center gap-3 p-5 transition hover:border-pine hover:shadow-lift">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-pine text-cream"><WhatsAppIcon /></span>
              <div><p className="font-semibold">WhatsApp</p><p className="text-sm text-ink-muted">+{settings.whatsapp}</p></div>
            </a>
            <a href={tgLink(settings.telegram)} target="_blank" rel="noopener noreferrer" className="card flex items-center gap-3 p-5 transition hover:border-[#2d8fd6] hover:shadow-lift">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[#2d8fd6] text-cream"><TelegramIcon /></span>
              <div><p className="font-semibold">Telegram</p><p className="text-sm text-ink-muted">@{settings.telegram}</p></div>
            </a>
            <a href={igLink(settings.instagram)} target="_blank" rel="noopener noreferrer" className="card flex items-center gap-3 p-5 transition hover:border-clay hover:shadow-lift">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-clay text-cream"><InstagramIcon /></span>
              <div><p className="font-semibold">Instagram</p><p className="text-sm text-ink-muted">@{settings.instagram}</p></div>
            </a>
            <div className="card flex items-center gap-3 p-5">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-ink text-cream">📍</span>
              <div><p className="font-semibold">Адрес</p><p className="text-sm text-ink-muted">{settings.address}</p></div>
            </div>
          </div>

          <div className="card mt-4 overflow-hidden">
            <iframe
              title="Рынок Дордой на карте"
              className="h-64 w-full border-0"
              loading="lazy"
              src="https://www.openstreetmap.org/export/embed.html?bbox=74.62%2C42.93%2C74.66%2C42.96&layer=mapnik"
            />
          </div>
        </div>

        <div className="card p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold">Написать нам</h2>
          <p className="mt-1 text-sm text-ink-muted">Оставьте заявку — свяжемся с вами по указанным контактам.</p>
          <div className="mt-6">
            <LeadForm type="retail" />
          </div>
        </div>
      </section>
    </>
  );
}
