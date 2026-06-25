// Лёгкая система мультиязычности. RU — основной. Структура готова к добавлению
// kg / kz / uz / en: достаточно дополнить словарь dict ниже.
export type Locale = "ru" | "kg" | "kz" | "uz" | "en";

export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "kg", label: "Кыргызча", flag: "🇰🇬" },
  { code: "kz", label: "Қазақша", flag: "🇰🇿" },
  { code: "uz", label: "Oʻzbekcha", flag: "🇺🇿" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

type Dict = Record<string, string>;

const ru: Dict = {
  "nav.catalog": "Каталог",
  "nav.wholesale": "Оптовикам",
  "nav.sellers": "Для селлеров",
  "nav.manufacturing": "Отшив партии",
  "nav.delivery": "Доставка и оплата",
  "nav.about": "О нас",
  "nav.contacts": "Контакты",
  "cta.catalog": "Смотреть каталог",
  "cta.wholesale": "Заказать оптом",
  "cta.order": "Заказать",
  "cta.contact": "Связаться",
  "common.from": "от",
  "common.retail": "Розница",
  "common.wholesale": "Опт",
  "common.inStock": "В наличии",
  "common.outOfStock": "Под заказ",
  "common.new": "Новинка",
  "common.hit": "Хит",
  "common.minOrder": "Мин. опт",
};

// Заглушки локалей: пока возвращают русские строки.
// Чтобы включить язык — замените значения переводами.
const en: Dict = {
  "nav.catalog": "Catalog",
  "nav.wholesale": "Wholesale",
  "nav.sellers": "For sellers",
  "nav.manufacturing": "Manufacturing",
  "nav.delivery": "Delivery & payment",
  "nav.about": "About",
  "nav.contacts": "Contacts",
  "cta.catalog": "Browse catalog",
  "cta.wholesale": "Order wholesale",
  "cta.order": "Order",
  "cta.contact": "Contact",
  "common.from": "from",
  "common.retail": "Retail",
  "common.wholesale": "Wholesale",
  "common.inStock": "In stock",
  "common.outOfStock": "Pre-order",
  "common.new": "New",
  "common.hit": "Bestseller",
  "common.minOrder": "Min. wholesale",
};

export const dict: Record<Locale, Dict> = { ru, kg: ru, kz: ru, uz: ru, en };

export function translate(locale: Locale, key: string): string {
  return dict[locale]?.[key] ?? dict.ru[key] ?? key;
}
