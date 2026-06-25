import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Доставка и оплата — отправка одежды по СНГ",
  description:
    "Доставка одежды с рынка Дордой по Кыргызстану, Казахстану, России, Узбекистану и СНГ. Условия оплаты, сроки отправки, фото и видео перед отправкой.",
  alternates: { canonical: "/delivery" },
};

const COUNTRIES = [
  { c: "Кыргызстан", d: "Доставка по Бишкеку и регионам. Возможен самовывоз с рынка Дордой." },
  { c: "Казахстан", d: "Отправка карго и транспортными компаниями в Алматы, Астану и другие города." },
  { c: "Россия", d: "Доставка СДЭК и карго в любой город России." },
  { c: "Узбекистан", d: "Отправка в Ташкент и регионы через транспортные компании." },
  { c: "Другие страны СНГ", d: "Таджикистан, Беларусь и др. — рассчитаем доставку индивидуально." },
];

export default async function DeliveryPage() {
  const settings = await getSettings();
  return (
    <>
      <PageHero
        eyebrow="Доставка и оплата"
        title="Отправляем одежду по всему СНГ"
        subtitle="Работаем с проверенными транспортными компаниями. Перед отправкой высылаем фото и видео товара."
      />

      <section className="container-x py-14">
        <h2 className="font-display text-3xl font-bold">Куда доставляем</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {COUNTRIES.map((x) => (
            <div key={x.c} className="card p-6">
              <h3 className="text-lg font-semibold">{x.c}</h3>
              <p className="mt-2 text-sm text-ink-muted">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x grid gap-6 pb-16 lg:grid-cols-2">
        <div className="card p-7">
          <h3 className="font-display text-xl font-bold">Оплата</h3>
          <p className="mt-3 text-ink-soft">{settings.paymentTerms}</p>
          <ul className="mt-4 space-y-2 text-sm text-ink-muted">
            <li>• Предоплата на карту / перевод</li>
            <li>• Visa / Mastercard (оплата картой — скоро)</li>
            <li>• Индивидуальные условия для оптовиков</li>
          </ul>
        </div>
        <div className="card p-7">
          <h3 className="font-display text-xl font-bold">Доставка и сроки</h3>
          <p className="mt-3 text-ink-soft">{settings.deliveryTerms}</p>
          <ul className="mt-4 space-y-2 text-sm text-ink-muted">
            <li>• Отправка в течение 1–3 дней после оплаты</li>
            <li>• Фото и видео товара перед отправкой</li>
            <li>• Трек-номер для отслеживания (скоро в личном кабинете)</li>
          </ul>
        </div>
      </section>

      <section className="container-x pb-16">
        <div className="card flex flex-col items-center gap-3 bg-cream-deep/60 p-8 text-center">
          <h3 className="font-display text-2xl font-bold">Хотите увидеть товар перед отправкой?</h3>
          <p className="max-w-xl text-ink-muted">
            Перед отправкой мы всегда высылаем фото и видео вашего заказа. Напишите нам — покажем товар «вживую».
          </p>
        </div>
      </section>
    </>
  );
}
