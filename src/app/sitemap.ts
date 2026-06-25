import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  const staticRoutes = ["", "/catalog", "/wholesale", "/sellers", "/manufacturing", "/delivery", "/about", "/contacts"].map(
    (p) => ({ url: `${base}${p}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 })
  );

  const catRoutes = categories.map((c) => ({
    url: `${base}/catalog/${c.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6,
  }));

  const productRoutes = products.map((p) => ({
    url: `${base}/product/${p.slug}`, lastModified: new Date(p.createdAt), changeFrequency: "weekly" as const, priority: 0.5,
  }));

  return [...staticRoutes, ...catRoutes, ...productRoutes];
}
