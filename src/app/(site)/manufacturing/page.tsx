import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { LeadForm } from "@/components/lead-form";

export const metadata: Metadata = {
  title: "Отшив одежды в Кыргызстане — пошив крупной партии",
  description:
    "Отшив и пошив одежды в Кыргызстане для селлеров и магазинов. Крупные партии под ваш бренд: ткань, лекала, бирка, упаковка. Оставьте заявку.",
  alternates: { canonical: "/manufacturing" },
};

const FLOW = [
  { t: "Бриф", d: "Обсуждаем модель, ткань, размерный ряд, тираж и сроки." },
  { t: "Образец", d: "Согласуем лекала и при необходимости отшиваем образец." },
  { t: "Производство", d: "Запускаем партию на проверенных цехах рынка Дордой." },
  { t: "Контроль и отправка", d: "Проверяем качество, брендируем и отправляем по СНГ." },
];

export default function ManufacturingPage() {
  return (
    <>
      <PageHero
        eyebrow="Отшив крупной партии"
        title="Пошив одежды под ваш бренд"
        subtitle="Организуем отшив крупной партии на производствах рынка Дордой — с вашим логотипом, биркой и упаковкой."
      />

      <section className="container-x py-14">
        <h2 className="font-display text-3xl font-bold">Как проходит работа</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FLOW.map((s, i) => (
            <div key={s.t} className="card relative p-6">
              <span className="font-display text-3xl font-bold text-clay">0{i + 1}</span>
              <h3 className="mt-2 text-lg font-semibold">{s.t}</h3>
              <p className="mt-1 text-sm text-ink-muted">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x grid gap-10 pb-16 lg:grid-cols-[1fr_1.1fr]">
        <div className="card bg-ink p-8 text-cream">
          <h2 className="font-display text-2xl font-bold">Что входит в отшив</h2>
          <ul className="mt-6 space-y-3 text-cream/80">
            {[
              "Подбор ткани и фурнитуры",
              "Разработка и корректировка лекал",
              "Полный размерный ряд",
              "Брендирование: логотип, бирка, бирочки на упаковке",
              "Индивидуальная упаковка",
              "Контроль качества перед отправкой",
            ].map((x) => (
              <li key={x} className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-saffron" /> {x}
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold">Заявка на отшив партии</h2>
          <p className="mt-1 text-sm text-ink-muted">Опишите задачу — рассчитаем стоимость и сроки.</p>
          <div className="mt-6">
            <LeadForm type="seller" />
          </div>
        </div>
      </section>
    </>
  );
}
