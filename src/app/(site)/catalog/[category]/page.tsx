import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategories, getProducts, getSettings } from "@/lib/data";
import { CatalogClient } from "@/components/catalog-client";

export const revalidate = 60;

// Пред-рендер всех категорий на этапе сборки (отдаются с CDN).
export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ category: c.slug }));
}

type Params = { params: { category: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const categories = await getCategories();
  const cat = categories.find((c) => c.slug === params.category);
  if (!cat) return { title: "Категория не найдена" };
  return {
    title: `${cat.title} оптом и в розницу — Дордой`,
    description: `${cat.title} с рынка Дордой оптом и в розницу. Большой выбор, доступные цены, доставка по СНГ.`,
    alternates: { canonical: `/catalog/${cat.slug}` },
  };
}

export default async function CategoryPage({ params }: Params) {
  const [products, categories, settings] = await Promise.all([
    getProducts(),
    getCategories(),
    getSettings(),
  ]);
  const cat = categories.find((c) => c.slug === params.category);
  if (!cat) notFound();

  return (
    <>
      <section className="border-b border-line bg-cream-deep/50">
        <div className="container-x py-10">
          <nav className="mb-3 text-sm text-ink-muted">
            <Link href="/" className="hover:text-clay">Главная</Link> ·{" "}
            <Link href="/catalog" className="hover:text-clay">Каталог</Link> ·{" "}
            <span className="text-ink">{cat.title}</span>
          </nav>
          <span className="section-eyebrow">{cat.emoji} Категория</span>
          <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{cat.title} с рынка Дордой</h1>
          <p className="mt-2 max-w-2xl text-ink-muted">
            {cat.title} оптом и в розницу. Прямые поставки, отправка по Кыргызстану, Казахстану, России и другим странам СНГ.
          </p>
        </div>
      </section>
      <CatalogClient products={products} categories={categories} settings={settings} initialCategory={cat.slug} />
    </>
  );
}
