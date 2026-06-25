import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { LeadForm } from "@/components/lead-form";

export const metadata: Metadata = {
  title: "Одежда для селлеров и маркетплейсов — отшив под бренд",
  description:
    "Одежда для селлеров Wildberries, Ozon, Kaspi, Uzum и Instagram. Крупные партии и отшив под ваш бренд с биркой и упаковкой. Оставьте заявку.",
  alternates: { canonical: "/sellers" },
};

export default function SellersPage() {
  return (
    <>
      <PageHero
        eyebrow="Для селлеров и магазинов"
        title="Партии одежды и отшив под ваш бренд"
        subtitle="Продаёте на маркетплейсах, в Instagram, Telegram или офлайн? Подготовим партию или организуем отшив под ваш запрос."
      />

      <section className="container-x py-14">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { t: "Под маркетплейсы", d: "Wildberries, Ozon, Kaspi, Uzum — поможем собрать ходовой ассортимент." },
            { t: "Отшив под бренд", d: "Произведём партию с вашим логотипом, биркой и упаковкой." },
            { t: "Любой объём", d: "От пробной партии до постоянных регулярных поставок." },
          ].map((x) => (
            <div key={x.t} className="card p-6">
              <h3 className="text-lg font-semibold">{x.t}</h3>
              <p className="mt-2 text-sm text-ink-muted">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x grid gap-10 pb-16 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <h2 className="font-display text-3xl font-bold">Что мы можем сделать для вас</h2>
          <ul className="mt-6 space-y-3">
            {[
              "Подбор ассортимента под вашу нишу и аудиторию",
              "Закупка крупной партии по оптовым ценам",
              "Отшив под бренд: ткань, лекала, размерный ряд",
              "Брендирование: логотип, бирка, индивидуальная упаковка",
              "Подготовка товара под требования маркетплейсов",
              "Регулярные поставки и сопровождение",
            ].map((x) => (
              <li key={x} className="flex items-start gap-3 text-ink-soft">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-clay" /> {x}
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold">Заявка для селлеров</h2>
          <p className="mt-1 text-sm text-ink-muted">Расскажите о себе и задаче — предложим решение и цены.</p>
          <div className="mt-6">
            <LeadForm type="seller" />
          </div>
        </div>
      </section>
    </>
  );
}
