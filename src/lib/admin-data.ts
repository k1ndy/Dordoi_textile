import "server-only";
import type { Category, Lead, Product } from "./types";
import { mockCategories, mockLeads, mockProducts } from "./mock";
import { createServerSupabase } from "./supabase/server";

/* eslint-disable @typescript-eslint/no-explicit-any */
// Админ видит ВСЕ записи, включая скрытые.
export async function adminGetProducts(): Promise<Product[]> {
  const sb = createServerSupabase();
  if (sb) {
    const { data } = await sb.from("products").select("*").order("created_at", { ascending: false });
    if (data) return data.map(mapProduct);
  }
  return mockProducts;
}

export async function adminGetCategories(): Promise<Category[]> {
  const sb = createServerSupabase();
  if (sb) {
    const { data } = await sb.from("categories").select("*").order("order", { ascending: true });
    if (data) return data.map(mapCategory);
  }
  return [...mockCategories].sort((a, b) => a.order - b.order);
}

export async function adminGetLeads(): Promise<Lead[]> {
  const sb = createServerSupabase();
  if (sb) {
    const { data } = await sb.from("leads").select("*").order("created_at", { ascending: false });
    if (data) return data.map(mapLead);
  }
  return mockLeads;
}

function mapProduct(r: any): Product {
  return {
    id: r.id, slug: r.slug, title: r.title,
    shortDescription: r.short_description ?? "", description: r.description ?? "",
    categorySlug: r.category_slug, gender: r.gender, type: r.type ?? "", season: r.season ?? "all",
    material: r.material ?? "", countryOfOrigin: r.country_of_origin ?? "",
    sizes: r.sizes ?? [], colors: r.colors ?? [], images: r.images ?? [],
    priceRetail: Number(r.price_retail ?? 0), priceWholesale: Number(r.price_wholesale ?? 0),
    minWholesale: Number(r.min_wholesale ?? 1), inStock: r.in_stock ?? true,
    isNew: r.is_new ?? false, isHit: r.is_hit ?? false, hidden: r.hidden ?? false,
    deliveryCountries: r.delivery_countries ?? [],
    seoTitle: r.seo_title ?? undefined, seoDescription: r.seo_description ?? undefined,
    createdAt: r.created_at ?? new Date().toISOString(),
  };
}
function mapCategory(r: any): Category {
  return { id: r.id, slug: r.slug, title: r.title, emoji: r.emoji ?? undefined, order: r.order ?? 0, hidden: r.hidden ?? false };
}
function mapLead(r: any): Lead {
  return {
    id: r.id, type: r.type, status: r.status, name: r.name, phone: r.phone,
    messenger: r.messenger ?? undefined, company: r.company ?? undefined,
    country: r.country ?? undefined, city: r.city ?? undefined, product: r.product ?? undefined,
    category: r.category ?? undefined, size: r.size ?? undefined, color: r.color ?? undefined,
    quantity: r.quantity ?? undefined, budget: r.budget ?? undefined, sellChannel: r.sell_channel ?? undefined,
    needBranding: r.need_branding ?? undefined, needLabelPack: r.need_label_pack ?? undefined,
    comment: r.comment ?? undefined, createdAt: r.created_at ?? new Date().toISOString(),
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */
