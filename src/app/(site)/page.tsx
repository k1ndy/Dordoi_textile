import Link from "next/link";
import Image from "next/image";
import { getCategories, getProducts, getSettings } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { ArrowIcon, WhatsAppIcon } from "@/components/icons";
import { waLink } from "@/lib/links";

const ADVANTAGES = [
  { t: "Прямые поставки с Дордоя", d: "Берём товар напрямую у производителей рынка — без лишних наценок." },
  { t: "Опт и розница", d: "Покупайте от 1 штуки или крупными партиями по оптовым ценам." },
  { t: "Отправка по всему СНГ", d: "Кыргызстан, Казахстан, Россия, Узбекистан и другие страны." },
  { t: "Крупные партии", d: "Соберём заказ любого объёма под ваш магазин или маркетплейс." },
  { t: "Отшив под заказ", d: "Произведём партию под ваш бренд: ткань, лекала, бирка, упаковка." },
  { t: "Фото и видео перед отправкой", d: "Показываем реальный товар до того, как вы оплатите доставку." },
];

export default async function HomePage() {
  const [products, categories, settings] = await Promise.all([
    getProducts(),
    getCategories(),
    getSettings(),
  ]);

  const featured = products.filter((p) => p.isNew || p.isHit).slice(0, 8);
  const showcase = (featured.length ? featured : products).slice(0, 8);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container-x grid items-center gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div className="animate-fade-up">
            <span className="section-eyebrow">Рынок «Дордой» · опт и розница</span>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
              {settings.heroText}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink-soft">
              Каталог одежды напрямую с рынка Дордой. Продаём в розницу, оптом и организуем
              отшив крупных партий для магазинов и селлеров по всему СНГ.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/catalog" className="btn-primary">
                Смотреть каталог <ArrowIcon />
              </Link>
              <Link href="/wholesale" className="btn-dark">Заказать оптом</Link>
              <a href={waLink(settings.whatsapp, "Здравствуйте! Пишу с сайта Dordoy Textile.")} target="_blank" rel="noopener noreferrer" className="btn-wa">
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp / Telegram
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink-muted">
              <span><b className="text-ink">6+</b> стран доставки</span>
              <span><b className="text-ink">1000+</b> моделей одежды</span>
              <span><b className="text-ink">от 1 шт</b> до оптовых партий</span>
            </div>
          </div>

          <div className="animate-fade-up [animation-delay:120ms]">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <HeroImg src="https://loremflickr.com/600/800/fashion,clothes?lock=31" className="aspect-[3/4]" priority />
                <HeroImg src="https://loremflickr.com/600/600/tshirt?lock=32" className="aspect-square" />
              </div>
              <div className="space-y-4 pt-8">
                <HeroImg src="https://loremflickr.com/600/600/hoodie?lock=33" className="aspect-square" />
                <HeroImg src="https://loremflickr.com/600/800/dress,fashion?lock=34" className="aspect-[3/4]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE TRUST STRIP */}
      <div className="border-y border-line bg-ink py-3 text-cream">
        <div className="flex overflow-hidden">
          <div className="flex shrink-0 animate-marquee gap-10 whitespace-nowrap pr-10 font-display text-sm font-medium uppercase tracking-wide">
            {[...MARQUEE, ...MARQUEE].map((m, i) => (
              <span key={i} className="flex items-center gap-3">
                <span className="text-saffron">✦</span> {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ADVANTAGES */}
      <section className="container-x py-16">
        <div className="max-w-2xl">
          <span className="section-eyebrow">Почему мы</span>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Удобно покупать и выгодно заказывать</h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ADVANTAGES.map((a, i) => (
            <div key={a.t} className="card p-6 transition hover:-translate-y-1 hover:shadow-lift">
              <span className="font-display text-2xl font-bold text-clay">0{i + 1}</span>
              <h3 className="mt-3 text-lg font-semibold">{a.t}</h3>
              <p className="mt-2 text-sm text-ink-muted">{a.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-x py-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="section-eyebrow">Ассортимент</span>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Популярные категории</h2>
          </div>
          <Link href="/catalog" className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-clay hover:underline sm:inline-flex">
            Весь каталог <ArrowIcon />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c, i) => (
            <Link
              key={c.id}
              href={`/catalog/${c.slug}`}
              className="card group flex items-center gap-3 p-5 transition hover:-translate-y-1 hover:border-clay hover:shadow-lift"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-cream-deep text-2xl">{c.emoji}</span>
              <div>
                <p className="font-semibold leading-tight">{c.title}</p>
                <span className="text-xs text-clay opacity-0 transition group-hover:opacity-100">Смотреть →</span>
              </div>
            </Link>
          ))}
          <Link href="/wholesale" className="card group flex items-center gap-3 bg-clay p-5 text-cream transition hover:-translate-y-1 hover:shadow-lift">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-cream/15 text-2xl">📦</span>
            <div>
              <p className="font-semibold leading-tight">Опт</p>
              <span className="text-xs text-cream/80">Оптовые цены →</span>
            </div>
          </Link>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="container-x py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="section-eyebrow">Новинки и хиты</span>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Выбор покупателей</h2>
          </div>
          <Link href="/catalog" className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-clay hover:underline sm:inline-flex">
            Все товары <ArrowIcon />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {showcase.map((p) => (
            <ProductCard key={p.id} product={p} settings={settings} />
          ))}
        </div>
      </section>

      {/* SELLERS BLOCK */}
      <section className="container-x py-8">
        <div className="card relative overflow-hidden bg-ink p-8 text-cream sm:p-12">
          <div className="ornament-strip absolute right-0 top-0 h-full w-2" />
          <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <span className="section-eyebrow !text-saffron">Для селлеров и магазинов</span>
              <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
                Продаёте на маркетплейсах, в Instagram или офлайн?
              </h2>
              <p className="mt-4 max-w-xl text-cream/75">
                Мы подготовим для вас крупную партию одежды или организуем отшив под ваш
                запрос — с вашим логотипом, биркой и упаковкой. Работаем с Wildberries, Ozon,
                Kaspi, Uzum и офлайн-магазинами по всему СНГ.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/sellers" className="btn-primary">Оставить заявку на крупную партию</Link>
                <Link href="/manufacturing" className="btn-ghost !border-cream/25 !bg-transparent !text-cream hover:!border-cream">
                  Про отшив партий
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {["Партии от 100 шт", "Отшив под бренд", "Бирка и упаковка", "Под маркетплейсы"].map((x) => (
                <div key={x} className="rounded-xl border border-cream/15 bg-cream/5 p-4 text-sm font-medium">{x}</div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const MARQUEE = [
  "Прямые поставки с Дордоя",
  "Отправка по всему СНГ",
  "Опт и розница",
  "Отшив под бренд",
  "Фото и видео перед отправкой",
  "Быстрая связь в WhatsApp",
];

function HeroImg({ src, className, priority }: { src: string; className?: string; priority?: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-xl2 border border-line bg-cream-deep shadow-card ${className}`}>
      <Image
        src={src}
        alt="Одежда с рынка Дордой"
        fill
        sizes="(max-width:1024px) 50vw, 25vw"
        className="object-cover"
        priority={priority}
      />
    </div>
  );
}
