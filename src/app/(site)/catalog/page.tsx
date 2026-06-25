import type { Metadata } from "next";
import { getCategories, getProducts, getSettings } from "@/lib/data";
import { CatalogClient } from "@/components/catalog-client";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Каталог одежды с рынка Дордой — опт и розница",
  description:
    "Каталог одежды с рынка Дордой: мужская, женская, детская одежда, футболки, худи, спортивные костюмы. Опт и розница, доставка по СНГ.",
  alternates: { canonical: "/catalog" },
};

export default async function CatalogPage() {
  const [products, categories, settings] = await Promise.all([
    getProducts(),
    getCategories(),
    getSettings(),
  ]);

  return (
    <>
      <section className="border-b border-line bg-cream-deep/50">
        <div className="container-x py-10">
          <span className="section-eyebrow">Каталог</span>
          <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Вся одежда с рынка Дордой</h1>
          <p className="mt-2 max-w-2xl text-ink-muted">
            Используйте фильтры, чтобы быстро найти нужный товар. Доступны опт и розница, отправка по всему СНГ.
          </p>
        </div>
      </section>
      <CatalogClient products={products} categories={categories} settings={settings} />
    </>
  );
}
