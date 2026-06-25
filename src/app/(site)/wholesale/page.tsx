import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ScenarioForm } from "@/components/scenario-form";
import { LARGE_WHOLESALE_FIELDS } from "@/lib/leads";

export const metadata: Metadata = {
  title: "Одежда оптом из Кыргызстана (Бишкек, Дордой)",
  description:
    "Одежда оптом с рынка Дордой: футболки, худи, костюмы, верхняя и детская одежда. Низкие оптовые цены, доставка по СНГ. Оставьте заявку.",
  alternates: { canonical: "/wholesale" },
};

const STEPS = [
  { t: "Оставляете заявку", d: "Указываете категорию, количество и бюджет — или просто пишете нам." },
  { t: "Подбираем товар", d: "Предлагаем модели в наличии и под заказ, согласуем оптовые цены." },
  { t: "Фото и видео", d: "Высылаем реальные фото/видео партии перед отправкой." },
  { t: "Отправка по СНГ", d: "Отправляем транспортной компанией в вашу страну и город." },
];

export default function WholesalePage() {
  return (
    <>
      <PageHero
        eyebrow="Оптовикам"
        title="Одежда оптом с рынка Дордой"
        subtitle="Прямые поставки от производителей. Оптовые цены, гибкий минимальный заказ и отправка по всему СНГ."
      />

      <section className="container-x py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.t} className="card p-6">
              <span className="font-display text-3xl font-bold text-clay">{i + 1}</span>
              <h3 className="mt-2 text-lg font-semibold">{s.t}</h3>
              <p className="mt-1 text-sm text-ink-muted">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x grid gap-10 pb-16 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <h2 className="font-display text-3xl font-bold">Почему берут оптом у нас</h2>
          <ul className="mt-6 space-y-3">
            {[
              "Цены напрямую с рынка Дордой — без посредников",
              "Минимальный заказ от 5–10 штук на модель",
              "Широкий ассортимент: мужское, женское, детское",
              "Стабильное наличие и регулярные поставки",
              "Фото и видео товара перед оплатой доставки",
              "Отправка во все страны СНГ",
            ].map((x) => (
              <li key={x} className="flex items-start gap-3 text-ink-soft">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-clay" /> {x}
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold">Заявка на оптовый заказ</h2>
          <p className="mt-1 text-sm text-ink-muted">Цена зависит от количества и направления доставки. Менеджер пришлёт актуальный прайс.</p>
          <div className="mt-6">
            <ScenarioForm leadType="large_wholesale_request" fields={LARGE_WHOLESALE_FIELDS} submitLabel="Получить прайс" />
          </div>
        </div>
      </section>
    </>
  );
}
