import type { LeadStatus, LeadType } from "./types";

export const LEAD_TYPE_LABEL: Record<LeadType, string> = {
  retail_order: "🛍️ Розничный заказ",
  wholesale_request: "📦 Оптовая заявка",
  large_wholesale_request: "🏭 Крупный опт",
  marketplace_seller_request: "🛒 Селлер / маркетплейс",
  manufacturing_request: "🧵 Отшив под бренд",
  general_contact: "✉️ Обращение",
};

export const LEAD_TYPE_SHORT: Record<LeadType, string> = {
  retail_order: "Розница",
  wholesale_request: "Опт",
  large_wholesale_request: "Крупный опт",
  marketplace_seller_request: "Селлер",
  manufacturing_request: "Отшив",
  general_contact: "Контакт",
};

// Единый набор статусов с порядком (общая воронка для всех типов).
export const LEAD_STATUSES: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "Новая" },
  { value: "contacted", label: "Связались" },
  { value: "processing", label: "В обработке" },
  { value: "quote_sent", label: "Прайс / расчёт отправлен" },
  { value: "negotiation", label: "Переговоры" },
  { value: "prepaid", label: "Предоплата" },
  { value: "paid", label: "Оплачено" },
  { value: "in_production", label: "В производстве" },
  { value: "shipped", label: "Отправлено" },
  { value: "completed", label: "Завершено" },
  { value: "rejected", label: "Отказ" },
];

export const LEAD_STATUS_LABEL = Object.fromEntries(
  LEAD_STATUSES.map((s) => [s.value, s.label])
) as Record<LeadStatus, string>;

export const LEAD_STATUS_COLOR: Record<LeadStatus, string> = {
  new: "bg-clay/15 text-clay",
  contacted: "bg-saffron/20 text-[#9a6a12]",
  processing: "bg-saffron/20 text-[#9a6a12]",
  quote_sent: "bg-[#2d8fd6]/15 text-[#2479b3]",
  negotiation: "bg-[#2d8fd6]/15 text-[#2479b3]",
  prepaid: "bg-pine/15 text-pine",
  paid: "bg-pine/15 text-pine",
  in_production: "bg-saffron/20 text-[#9a6a12]",
  shipped: "bg-pine/15 text-pine",
  completed: "bg-pine/20 text-pine",
  rejected: "bg-ink/10 text-ink-muted",
};

// ── Сценарии клиента (определяют цену, форму и CTA) ─────────────────────────
export type ScenarioId = "retail" | "wholesale" | "marketplace" | "manufacturing";
export type PriceMode = "retail" | "wholesale_from" | "hidden_seller" | "hidden_calc";

export interface FieldDef {
  name: string;
  label: string;
  type: "text" | "tel" | "number" | "textarea" | "select" | "checkbox";
  placeholder?: string;
  required?: boolean;
  options?: string[];
  full?: boolean; // на всю ширину
}

export interface ScenarioDef {
  id: ScenarioId;
  leadType: LeadType;
  tabLabel: string;
  priceMode: PriceMode;
  cta: string;
  note: string;
  fields: FieldDef[];
}

const COUNTRY_OPTS = ["Кыргызстан", "Казахстан", "Россия", "Узбекистан", "Таджикистан", "Беларусь", "Другая"];

const baseContacts: FieldDef[] = [
  { name: "name", label: "Имя", type: "text", placeholder: "Ваше имя", required: true },
  { name: "phone", label: "Телефон / WhatsApp", type: "tel", placeholder: "+996 ...", required: true },
  { name: "country", label: "Страна", type: "select", options: COUNTRY_OPTS },
  { name: "city", label: "Город", type: "text", placeholder: "Город" },
];

export const SCENARIOS: Record<ScenarioId, ScenarioDef> = {
  retail: {
    id: "retail",
    leadType: "retail_order",
    tabLabel: "Покупаю для себя",
    priceMode: "retail",
    cta: "Быстрый заказ",
    note: "Розничная цена. Выберите размер, цвет и количество.",
    fields: [
      ...baseContacts,
      { name: "size", label: "Размер", type: "text", placeholder: "напр. M / 52" },
      { name: "color", label: "Цвет", type: "text", placeholder: "напр. чёрный" },
      { name: "quantity", label: "Количество", type: "text", placeholder: "напр. 2 шт" },
      { name: "comment", label: "Комментарий", type: "textarea", placeholder: "Дополнительно", full: true },
    ],
  },
  wholesale: {
    id: "wholesale",
    leadType: "wholesale_request",
    tabLabel: "Покупаю оптом",
    priceMode: "wholesale_from",
    cta: "Запросить оптовую цену",
    note: "Цена зависит от количества, цвета, наличия и доставки. Оставьте заявку — менеджер отправит актуальный прайс.",
    fields: [
      ...baseContacts,
      { name: "quantity", label: "Нужное количество", type: "text", placeholder: "напр. 50 шт", required: true },
      { name: "sizes", label: "Интересующие размеры", type: "text", placeholder: "напр. 46–54" },
      { name: "colors", label: "Интересующие цвета", type: "text", placeholder: "напр. белый, чёрный" },
      { name: "comment", label: "Комментарий", type: "textarea", placeholder: "Например: нужна цена с доставкой", full: true },
    ],
  },
  marketplace: {
    id: "marketplace",
    leadType: "marketplace_seller_request",
    tabLabel: "Для маркетплейса",
    priceMode: "hidden_seller",
    cta: "Получить подборку товаров",
    note: "Подходит для WB / Ozon / Kaspi / Instagram-магазинов. Подберём товары под вашу площадку. Фото, размеры, упаковка и повторные поставки — с менеджером.",
    fields: [
      ...baseContacts,
      { name: "platform", label: "Площадка продаж", type: "select", options: ["Wildberries", "Ozon", "Kaspi", "Uzum", "Instagram", "Офлайн-магазин", "Другое"], required: true },
      { name: "category", label: "Категория товара", type: "text", placeholder: "напр. футболки, худи" },
      { name: "volume", label: "Примерный объём закупа", type: "text", placeholder: "напр. 300–500 шт/мес" },
      { name: "needContent", label: "Нужен контент для карточек товара", type: "checkbox", full: true },
      { name: "comment", label: "Комментарий", type: "textarea", full: true },
    ],
  },
  manufacturing: {
    id: "manufacturing",
    leadType: "manufacturing_request",
    tabLabel: "Отшив под бренд",
    priceMode: "hidden_calc",
    cta: "Рассчитать отшив",
    note: "Расчёт индивидуальный. Цена зависит от модели, ткани, количества, лекал, фурнитуры, логотипа, упаковки и сроков.",
    fields: [
      ...baseContacts,
      { name: "productType", label: "Что хотите отшить", type: "text", placeholder: "напр. футболки оверсайз", required: true },
      { name: "quantity", label: "Количество", type: "text", placeholder: "напр. 500 шт", required: true },
      { name: "fabric", label: "Ткань", type: "text", placeholder: "напр. хлопок 100%" },
      { name: "sizes", label: "Размеры", type: "text", placeholder: "напр. S–XXL" },
      { name: "hasPatterns", label: "Есть лекала", type: "checkbox" },
      { name: "hasLogo", label: "Есть логотип", type: "checkbox" },
      { name: "needPrint", label: "Нужен принт / вышивка", type: "checkbox" },
      { name: "deadline", label: "Желаемые сроки", type: "text", placeholder: "напр. 3 недели" },
      { name: "comment", label: "Комментарий", type: "textarea", full: true },
    ],
  },
};

// Поля для отдельных страниц-форм.
export const LARGE_WHOLESALE_FIELDS: FieldDef[] = [
  { name: "name", label: "Имя", type: "text", placeholder: "Ваше имя", required: true },
  { name: "phone", label: "Телефон / WhatsApp", type: "tel", placeholder: "+996 ...", required: true },
  { name: "messenger", label: "WhatsApp / Telegram", type: "text", placeholder: "@username" },
  { name: "country", label: "Страна", type: "select", options: COUNTRY_OPTS },
  { name: "city", label: "Город", type: "text", placeholder: "Город" },
  { name: "category", label: "Категория товара", type: "text", placeholder: "напр. футболки, худи" },
  { name: "quantity", label: "Объём партии", type: "text", placeholder: "напр. 100+ шт", required: true },
  { name: "budget", label: "Бюджет", type: "text", placeholder: "напр. 500 000 сом" },
  { name: "deadline", label: "Сроки", type: "text", placeholder: "напр. к 1 сентября" },
  { name: "comment", label: "Комментарий", type: "textarea", full: true },
];

export const CONTACT_FIELDS: FieldDef[] = [
  { name: "name", label: "Имя", type: "text", placeholder: "Ваше имя", required: true },
  { name: "phone", label: "Телефон / WhatsApp", type: "tel", placeholder: "+996 ...", required: true },
  { name: "country", label: "Страна", type: "select", options: COUNTRY_OPTS },
  { name: "city", label: "Город", type: "text", placeholder: "Город" },
  { name: "comment", label: "Комментарий", type: "textarea", placeholder: "Чем можем помочь?", full: true },
];

// Поля, которые в БД хранятся отдельными колонками. Остальные уходят в details (jsonb).
export const LEAD_COLUMN_FIELDS = new Set([
  "type", "name", "phone", "messenger", "company", "country", "city",
  "product", "category", "size", "color", "quantity", "budget", "comment",
]);

// Человеко-читаемые подписи для details-полей (для админки и Telegram).
export const DETAIL_LABELS: Record<string, string> = {
  sizes: "Размеры",
  colors: "Цвета",
  platform: "Площадка",
  volume: "Объём закупа",
  needContent: "Нужен контент карточек",
  productType: "Что отшить",
  fabric: "Ткань",
  hasPatterns: "Есть лекала",
  hasLogo: "Есть логотип",
  needPrint: "Принт / вышивка",
  deadline: "Сроки",
};
