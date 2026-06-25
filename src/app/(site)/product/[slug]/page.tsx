import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { getProductBySlug, getProducts, getSettings } from "@/lib/data";
import { ProductGallery } from "@/components/product-gallery";
import { Price } from "@/components/price";
import { ProductCard } from "@/components/product-card";
import { ProductBuyBox } from "@/components/product-buy-box";
import { LeadForm } from "@/components/lead-form";
import { CheckIcon } from "@/components/icons";

type Params = { params: { slug: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Товар не найден" };
  return {
    title: product.seoTitle || `${product.title} — купить оптом и в розницу`,
    description:
      product.seoDescription ||
      `${product.title} с рынка Дордой. ${product.shortDescription} Опт от ${product.minWholesale} шт, доставка по СНГ.`,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: { images: product.images.slice(0, 1) },
  };
}

const GENDER_LABEL: Record<string, string> = { men: "Мужское", women: "Женское", kids: "Детское", unisex: "Унисекс" };

export default async function ProductPage({ params }: Params) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const [all, settings] = await Promise.all([getProducts(), getSettings()]);
  const related = all.filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.shortDescription,
    image: product.images,
    category: product.categorySlug,
    offers: {
      "@type": "Offer",
      priceCurrency: "KGS",
      price: product.priceRetail,
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
    },
  };

  const nonce = headers().get("x-nonce") ?? undefined;

  return (
    <>
      <script type="application/ld+json" nonce={nonce} dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container-x py-8">
        <nav className="mb-6 text-sm text-ink-muted">
          <Link href="/" className="hover:text-clay">Главная</Link> ·{" "}
          <Link href="/catalog" className="hover:text-clay">Каталог</Link> ·{" "}
          <Link href={`/catalog/${product.categorySlug}`} className="hover:text-clay">{product.type}</Link> ·{" "}
          <span className="text-ink">{product.title}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          <ProductGallery images={product.images} title={product.title} />

          <div>
            <div className="flex flex-wrap gap-2">
              {product.isNew && <span className="rounded-full bg-pine px-3 py-1 text-xs font-semibold text-cream">Новинка</span>}
              {product.isHit && <span className="rounded-full bg-clay px-3 py-1 text-xs font-semibold text-cream">Хит продаж</span>}
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${product.inStock ? "bg-pine/15 text-pine" : "bg-ink/10 text-ink-muted"}`}>
                {product.inStock ? "В наличии" : "Под заказ"}
              </span>
            </div>

            <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">{product.title}</h1>
            <p className="mt-3 text-ink-soft">{product.description}</p>

            {/* Цены */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="card p-4">
                <p className="text-xs uppercase tracking-wide text-ink-muted">Розница</p>
                <Price amount={product.priceRetail} className="font-display text-2xl font-bold text-ink" />
              </div>
              <div className="card border-clay/30 bg-clay/5 p-4">
                <p className="text-xs uppercase tracking-wide text-clay">Опт от {product.minWholesale} шт</p>
                <Price amount={product.priceWholesale} className="font-display text-2xl font-bold text-clay" />
              </div>
            </div>

            {/* Выбор размера/цвета/кол-ва + корзина */}
            <div className="mt-6">
              <ProductBuyBox product={product} settings={settings} />
            </div>

            {/* Характеристики */}
            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <Spec k="Категория" v={product.type} />
              <Spec k="Пол" v={GENDER_LABEL[product.gender]} />
              <Spec k="Материал" v={product.material} />
              <Spec k="Страна производства" v={product.countryOfOrigin} />
              <Spec k="Доставка" v={product.deliveryCountries.join(", ")} />
            </dl>

            <Link href="/manufacturing" className="mt-6 inline-block text-sm font-semibold text-clay hover:underline">
              Заказать крупную партию / отшив под бренд →
            </Link>

            {/* Branding block */}
            <div className="mt-6 card flex items-start gap-3 bg-cream-deep/60 p-5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-clay text-cream"><CheckIcon className="h-5 w-5" /></span>
              <div>
                <p className="font-semibold">Нужен этот товар под вашим брендом?</p>
                <p className="mt-1 text-sm text-ink-muted">
                  Оставьте заявку — обсудим отшив партии с вашим логотипом, биркой и упаковкой.{" "}
                  <Link href="/sellers" className="font-semibold text-clay hover:underline">Оставить заявку</Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Форма заказа */}
        <section id="order" className="mt-16 scroll-mt-24">
          <div className="card p-6 sm:p-8">
            <h2 className="font-display text-2xl font-bold">Оформить заказ</h2>
            <p className="mt-1 text-sm text-ink-muted">Заполните форму — мы свяжемся с вами и согласуем доставку.</p>
            <div className="mt-6">
              <LeadForm type="retail" productName={product.title} />
            </div>
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-bold">Похожие товары</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} settings={settings} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

function Spec({ k, v }: { k: string; v: string }) {
  return (
    <>
      <dt className="border-b border-line/70 py-1.5 text-ink-muted">{k}</dt>
      <dd className="border-b border-line/70 py-1.5 font-medium">{v}</dd>
    </>
  );
}
