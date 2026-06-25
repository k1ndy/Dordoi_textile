"use client";

import { useState } from "react";
import type { Product, SiteSettings } from "@/lib/types";
import { SCENARIOS, type ScenarioId, type FieldDef } from "@/lib/leads";
import { useCart } from "./cart-provider";
import { useSite } from "./providers";
import { ScenarioForm } from "./scenario-form";
import { waLink, tgLink } from "@/lib/links";
import { WhatsAppIcon, TelegramIcon, CartIcon, CheckIcon } from "./icons";

const TABS: ScenarioId[] = ["retail", "wholesale", "marketplace", "manufacturing"];

export function ScenarioBuyBox({ product, settings }: { product: Product; settings: SiteSettings }) {
  const [tab, setTab] = useState<ScenarioId>("retail");
  const scenario = SCENARIOS[tab];

  return (
    <div>
      {/* Переключатель сценария */}
      <div className="mb-5">
        <p className="label">Кто вы? Выберите сценарий</p>
        <div className="flex flex-wrap gap-2">
          {TABS.map((id) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                tab === id ? "border-clay bg-clay text-cream" : "border-line bg-cream-card text-ink-soft hover:border-ink/40"
              }`}
            >
              {SCENARIOS[id].tabLabel}
            </button>
          ))}
        </div>
      </div>

      {tab === "retail" ? (
        <RetailPanel product={product} settings={settings} />
      ) : (
        <RequestPanel product={product} settings={settings} scenarioId={tab} />
      )}

      <p className="mt-4 text-xs leading-relaxed text-ink-muted">{scenario.note}</p>
    </div>
  );
}

// ── Розница: цена + размер/цвет/кол-во + корзина/быстрый заказ ───────────────
function RetailPanel({ product, settings }: { product: Product; settings: SiteSettings }) {
  const { add } = useCart();
  const { price } = useSite();
  const [size, setSize] = useState(product.sizes[0] ?? "");
  const [color, setColor] = useState(product.colors[0] ?? "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [showForm, setShowForm] = useState(false);

  function addToCart() {
    add(
      {
        productId: product.id, slug: product.slug, title: product.title,
        image: product.images[0] ?? "", priceRetail: product.priceRetail,
        priceWholesale: product.priceWholesale, minWholesale: product.minWholesale,
        size: size || undefined, color: color || undefined,
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  const retailFields: FieldDef[] = [
    { name: "name", label: "Имя", type: "text", placeholder: "Ваше имя", required: true },
    { name: "phone", label: "Телефон / WhatsApp", type: "tel", placeholder: "+996 ...", required: true },
    { name: "country", label: "Страна", type: "select", options: ["Кыргызстан", "Казахстан", "Россия", "Узбекистан", "Таджикистан", "Беларусь", "Другая"] },
    { name: "city", label: "Город", type: "text", placeholder: "Город" },
    { name: "comment", label: "Комментарий", type: "textarea", full: true },
  ];

  return (
    <div>
      <div className="rounded-xl2 border border-clay/25 bg-clay/5 p-4">
        <p className="text-xs uppercase tracking-wide text-ink-muted">Розничная цена</p>
        <p className="font-display text-3xl font-bold text-ink">{price(product.priceRetail)}</p>
        <p className="mt-1 text-xs text-ink-muted">Выберите размер, цвет и количество.</p>
      </div>

      {product.sizes.length > 0 && (
        <div className="mt-4">
          <p className="label">Размер</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button key={s} onClick={() => setSize(s)} className={`rounded-lg border px-3.5 py-1.5 text-sm font-medium transition ${size === s ? "border-clay bg-clay text-cream" : "border-line bg-cream-card text-ink-soft hover:border-ink/40"}`}>{s}</button>
            ))}
          </div>
        </div>
      )}
      {product.colors.length > 0 && (
        <div className="mt-4">
          <p className="label">Цвет</p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button key={c} onClick={() => setColor(c)} className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${color === c ? "border-clay bg-clay text-cream" : "border-line bg-cream-card text-ink-soft hover:border-ink/40"}`}>{c}</button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4">
        <p className="label">Количество</p>
        <div className="inline-flex items-center rounded-xl border border-line">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-2.5 text-lg text-ink-muted hover:text-ink" aria-label="Меньше">−</button>
          <span className="min-w-10 text-center font-semibold">{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} className="px-4 py-2.5 text-lg text-ink-muted hover:text-ink" aria-label="Больше">+</button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button onClick={addToCart} className={`btn ${added ? "bg-pine text-cream" : "btn-primary"}`}>
          {added ? <><CheckIcon className="h-4 w-4" /> Добавлено</> : <><CartIcon className="h-4 w-4" /> В корзину</>}
        </button>
        <button onClick={() => setShowForm((v) => !v)} className="btn-dark">Быстрый заказ</button>
        <a href={waLink(settings.whatsapp, `Здравствуйте! Хочу заказать «${product.title}»${size ? `, размер ${size}` : ""}${color ? `, цвет ${color}` : ""}.`)} target="_blank" rel="noopener noreferrer" className="btn-wa">
          <WhatsAppIcon className="h-4 w-4" /> WhatsApp
        </a>
      </div>

      {showForm && (
        <div className="mt-5 rounded-xl2 border border-line bg-cream-card p-5">
          <p className="mb-3 font-semibold">Быстрый заказ — оставьте контакты</p>
          <ScenarioForm
            leadType="retail_order"
            fields={retailFields}
            submitLabel="Оформить заказ"
            hidden={{ product: product.title, size, color, quantity: `${qty} шт` }}
          />
        </div>
      )}
    </div>
  );
}

// ── Опт / Маркетплейс / Отшив: без точной цены, форма-запрос ─────────────────
function RequestPanel({ product, settings, scenarioId }: { product: Product; settings: SiteSettings; scenarioId: ScenarioId }) {
  const scenario = SCENARIOS[scenarioId];

  const headline =
    scenarioId === "wholesale"
      ? `Опт от ${product.minWholesale} шт`
      : scenarioId === "marketplace"
      ? "Подбор под вашу площадку"
      : "Индивидуальный расчёт";

  const waText =
    scenarioId === "wholesale"
      ? `Здравствуйте! Хочу узнать оптовую цену на «${product.title}».`
      : scenarioId === "marketplace"
      ? `Здравствуйте! Я селлер, интересует подборка товаров (например «${product.title}»).`
      : `Здравствуйте! Интересует отшив под бренд (пример: «${product.title}»).`;

  return (
    <div>
      <div className="rounded-xl2 border border-line bg-cream-deep/40 p-4">
        <p className="font-display text-xl font-bold">{headline}</p>
        <p className="mt-1 text-sm text-ink-muted">{scenario.note}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a href={waLink(settings.whatsapp, waText)} target="_blank" rel="noopener noreferrer" className="btn-wa !py-2 text-sm">
            <WhatsAppIcon className="h-4 w-4" /> {scenarioId === "wholesale" ? "Получить прайс в WhatsApp" : "Связаться в WhatsApp"}
          </a>
          <a href={tgLink(settings.telegram)} target="_blank" rel="noopener noreferrer" className="btn-tg !py-2 text-sm">
            <TelegramIcon className="h-4 w-4" /> Telegram
          </a>
        </div>
      </div>

      <div className="mt-5 rounded-xl2 border border-line bg-cream-card p-5">
        <p className="mb-3 font-semibold">{scenario.cta}</p>
        <ScenarioForm
          leadType={scenario.leadType}
          fields={scenario.fields}
          submitLabel={scenario.cta}
          hidden={{ product: product.title }}
        />
      </div>
    </div>
  );
}
