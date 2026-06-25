import type { Category, Lead, Product, SiteSettings } from "./types";

// Демо-изображения подбираются по ключевым словам (loremflickr) — стабильны за счёт lock.
const img = (kw: string, lock: number) =>
  `https://loremflickr.com/800/1000/${kw}?lock=${lock}`;

export const mockSettings: SiteSettings = {
  shopName: "Dordoy Textile",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "996700123456",
  telegram: process.env.NEXT_PUBLIC_TELEGRAM || "dordoy_shop",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM || "dordoy_shop",
  address: "Кыргызстан, г. Бишкек, рынок «Дордой»",
  deliveryCountries: ["Кыргызстан", "Казахстан", "Россия", "Узбекистан", "Таджикистан", "Беларусь"],
  paymentTerms:
    "Предоплата 30–50% на карту или Visa/Mastercard, остаток при отправке. Для оптовых клиентов — индивидуальные условия.",
  deliveryTerms:
    "Отправка через проверенные транспортные компании (Карго, СДЭК и др.). Перед отправкой высылаем фото и видео товара.",
  heroText: "Одежда с рынка Дордой оптом и в розницу для стран СНГ",
};

export const mockCategories: Category[] = [
  { id: "c1", slug: "muzhskaya", title: "Мужская одежда", emoji: "👔", order: 1, hidden: false },
  { id: "c2", slug: "zhenskaya", title: "Женская одежда", emoji: "👗", order: 2, hidden: false },
  { id: "c3", slug: "detskaya", title: "Детская одежда", emoji: "🧒", order: 3, hidden: false },
  { id: "c4", slug: "futbolki", title: "Футболки", emoji: "👕", order: 4, hidden: false },
  { id: "c5", slug: "polo", title: "Поло", emoji: "🎽", order: 5, hidden: false },
  { id: "c6", slug: "hudi", title: "Худи", emoji: "🧥", order: 6, hidden: false },
  { id: "c7", slug: "sportivnye-kostyumy", title: "Спортивные костюмы", emoji: "🏃", order: 7, hidden: false },
  { id: "c8", slug: "verhnyaya-odezhda", title: "Верхняя одежда", emoji: "🧥", order: 8, hidden: false },
];

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

function makeProduct(p: Partial<Product> & {
  id: string; slug: string; title: string; categorySlug: string;
  priceRetail: number; priceWholesale: number; lock: number; kw: string;
}): Product {
  return {
    shortDescription: "Качественный товар с рынка Дордой. Опт и розница.",
    description:
      "Популярная модель с рынка «Дордой». Прямые поставки от производителя, стабильное качество и наличие. Перед отправкой высылаем фото и видео. Доступен опт и розница, возможен отшив крупной партии под ваш бренд.",
    gender: "unisex",
    type: "Одежда",
    season: "all",
    material: "Хлопок 95%, эластан 5%",
    countryOfOrigin: "Кыргызстан / Китай",
    sizes: SIZES,
    colors: ["Чёрный", "Белый", "Серый", "Бежевый"],
    images: [img(p.kw, p.lock), img(p.kw, p.lock + 100), img(p.kw, p.lock + 200)],
    minWholesale: 10,
    inStock: true,
    isNew: false,
    isHit: false,
    hidden: false,
    deliveryCountries: ["Кыргызстан", "Казахстан", "Россия", "Узбекистан"],
    createdAt: new Date().toISOString(),
    ...p,
  } as Product;
}

export const mockProducts: Product[] = [
  makeProduct({ id: "p1", slug: "futbolka-oversize-cotton", title: "Футболка Oversize Premium", categorySlug: "futbolki", gender: "unisex", type: "Футболка", priceRetail: 450, priceWholesale: 320, isNew: true, isHit: true, kw: "tshirt", lock: 11, colors: ["Чёрный", "Белый", "Молочный", "Хаки"] }),
  makeProduct({ id: "p2", slug: "hudi-flis-unisex", title: "Худи на флисе Unisex", categorySlug: "hudi", gender: "unisex", type: "Худи", priceRetail: 1290, priceWholesale: 950, season: "winter", isHit: true, kw: "hoodie", lock: 12 }),
  makeProduct({ id: "p3", slug: "polo-classic-pique", title: "Поло Classic Pique", categorySlug: "polo", gender: "men", type: "Поло", priceRetail: 690, priceWholesale: 510, kw: "polo,shirt", lock: 13 }),
  makeProduct({ id: "p4", slug: "sportivnyy-kostyum-track", title: "Спортивный костюм Track", categorySlug: "sportivnye-kostyumy", gender: "men", type: "Костюм", priceRetail: 2100, priceWholesale: 1650, season: "demi", isNew: true, kw: "tracksuit,sport", lock: 14 }),
  makeProduct({ id: "p5", slug: "zhenskoe-plate-letnee", title: "Женское платье летнее", categorySlug: "zhenskaya", gender: "women", type: "Платье", priceRetail: 1150, priceWholesale: 820, season: "summer", isHit: true, kw: "dress,fashion", lock: 15, sizes: ["S", "M", "L", "XL"] }),
  makeProduct({ id: "p6", slug: "detskiy-komplekt-cotton", title: "Детский комплект Cotton", categorySlug: "detskaya", gender: "kids", type: "Комплект", priceRetail: 560, priceWholesale: 390, isNew: true, kw: "kids,clothes", lock: 16, sizes: ["86", "92", "98", "104", "110", "116"] }),
  makeProduct({ id: "p7", slug: "kurtka-vetrovka", title: "Куртка-ветровка", categorySlug: "verhnyaya-odezhda", gender: "unisex", type: "Куртка", priceRetail: 1850, priceWholesale: 1400, season: "demi", kw: "jacket", lock: 17 }),
  makeProduct({ id: "p8", slug: "muzhskaya-rubashka-oxford", title: "Мужская рубашка Oxford", categorySlug: "muzhskaya", gender: "men", type: "Рубашка", priceRetail: 980, priceWholesale: 720, kw: "shirt,men", lock: 18 }),
  makeProduct({ id: "p9", slug: "futbolka-basic-pack", title: "Футболка Basic (упаковка 5 шт)", categorySlug: "futbolki", gender: "unisex", type: "Футболка", priceRetail: 1900, priceWholesale: 1500, minWholesale: 5, isHit: true, kw: "tshirt,plain", lock: 19 }),
  makeProduct({ id: "p10", slug: "zhenskiy-kostyum-dvoyka", title: "Женский костюм-двойка", categorySlug: "zhenskaya", gender: "women", type: "Костюм", priceRetail: 1750, priceWholesale: 1300, isNew: true, kw: "women,suit", lock: 20, sizes: ["S", "M", "L", "XL"] }),
  makeProduct({ id: "p11", slug: "hudi-zip-cotton", title: "Худи на молнии Cotton", categorySlug: "hudi", gender: "unisex", type: "Худи", priceRetail: 1390, priceWholesale: 1050, season: "demi", kw: "hoodie,zip", lock: 21 }),
  makeProduct({ id: "p12", slug: "detskaya-futbolka-print", title: "Детская футболка с принтом", categorySlug: "detskaya", gender: "kids", type: "Футболка", priceRetail: 340, priceWholesale: 240, kw: "kids,tshirt", lock: 22, sizes: ["98", "104", "110", "116", "122"] }),
  makeProduct({ id: "p13", slug: "muzhskie-shorty-sport", title: "Мужские шорты спортивные", categorySlug: "muzhskaya", gender: "men", type: "Шорты", priceRetail: 520, priceWholesale: 370, season: "summer", isNew: true, kw: "shorts,sport", lock: 23 }),
  makeProduct({ id: "p14", slug: "puhovik-zimniy", title: "Пуховик зимний", categorySlug: "verhnyaya-odezhda", gender: "unisex", type: "Пуховик", priceRetail: 3400, priceWholesale: 2750, season: "winter", isHit: true, kw: "winter,coat", lock: 24 }),
];

export const mockLeads: Lead[] = [
  {
    id: "l1", type: "wholesale", status: "new", name: "Айбек", phone: "+996555112233",
    messenger: "WhatsApp", country: "Кыргызстан", city: "Бишкек", category: "Футболки",
    quantity: "500 шт", budget: "200 000 сом", comment: "Нужны базовые футболки на сезон.",
    createdAt: new Date(Date.now() - 3600_000).toISOString(),
  },
  {
    id: "l2", type: "seller", status: "in_progress", name: "Мария", company: "MarMarket",
    phone: "+77011234567", messenger: "Telegram", country: "Казахстан", city: "Алматы",
    sellChannel: "Wildberries / Kaspi", product: "Худи и костюмы", quantity: "1000+ шт",
    needBranding: true, needLabelPack: true, comment: "Хочу отшить под свой бренд с биркой.",
    createdAt: new Date(Date.now() - 86400_000).toISOString(),
  },
  {
    id: "l3", type: "retail", status: "done", name: "Дмитрий", phone: "+79161234567",
    country: "Россия", city: "Новосибирск", product: "Футболка Oversize Premium",
    size: "L", color: "Чёрный", quantity: "2 шт", comment: "Отправьте СДЭКом.",
    createdAt: new Date(Date.now() - 2 * 86400_000).toISOString(),
  },
];
