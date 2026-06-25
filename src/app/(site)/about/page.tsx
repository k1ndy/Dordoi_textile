import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "О нас — поставщик одежды с рынка Дордой",
  description:
    "Мы поставляем одежду с рынка Дордой оптом и в розницу по всему СНГ, а также организуем отшив крупных партий под бренд для селлеров и магазинов.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="О нас"
        title="Одежда с Дордоя — напрямую для вашего бизнеса"
        subtitle="Мы соединяем производителей рынка «Дордой» с покупателями, оптовиками и селлерами по всему СНГ."
      />

      <section className="container-x grid gap-12 py-14 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-4 text-lg text-ink-soft">
          <p>
            «Дордой» — один из крупнейших рынков в Центральной Азии. Мы работаем здесь напрямую с
            производителями и поставщиками, поэтому можем предложить честные цены, стабильное
            качество и широкий ассортимент одежды.
          </p>
          <p>
            Наша задача — сделать так, чтобы покупатель из любой точки СНГ мог удобно выбрать товар,
            узнать цену, размеры и цвета, и быстро оформить заказ. А бизнесу — помочь закупить
            крупную партию или организовать отшив под собственный бренд.
          </p>
          <p>
            Мы отправляем заказы в Кыргызстан, Казахстан, Россию, Узбекистан и другие страны СНГ,
            и всегда показываем товар на фото и видео перед отправкой.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { n: "6+", l: "стран доставки" },
            { n: "1000+", l: "моделей одежды" },
            { n: "от 1 шт", l: "розница" },
            { n: "100+", l: "партии для бизнеса" },
          ].map((s) => (
            <div key={s.l} className="card p-6 text-center">
              <p className="font-display text-3xl font-bold text-clay">{s.n}</p>
              <p className="mt-1 text-sm text-ink-muted">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x pb-16">
        <div className="card flex flex-col items-center gap-4 bg-ink p-10 text-center text-cream">
          <h2 className="font-display text-3xl font-bold">Готовы сделать заказ?</h2>
          <p className="max-w-xl text-cream/75">Откройте каталог или оставьте заявку — поможем с выбором, ценой и доставкой.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/catalog" className="btn-primary">Смотреть каталог</Link>
            <Link href="/contacts" className="btn-ghost !border-cream/25 !bg-transparent !text-cream hover:!border-cream">Контакты</Link>
          </div>
        </div>
      </section>
    </>
  );
}
