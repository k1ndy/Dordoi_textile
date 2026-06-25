import "server-only";
import { unstable_cache } from "next/cache";
import type { Category, Lead, Product, SiteSettings } from "./types";
import { mockCategories, mockLeads, mockProducts, mockSettings } from "./mock";
import { createPublicSupabase } from "./supabase/public";
import { isSupabaseConfigured } from "./supabase/config";

// ── Мапперы строк БД (snake_case) → типы приложения (camelCase) ──────────────
/* eslint-disable @typescript-eslint/no-explicit-any */
function mapProduct(r: any): Product {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    shortDescription: r.short_description ?? "",
    description: r.description ?? "",
    categorySlug: r.category_slug,
    gender: r.gender,
    type: r.type ?? "",
    season: r.season ?? "all",
    material: r.material ?? "",
    countryOfOrigin: r.country_of_origin ?? "",
    sizes: r.sizes ?? [],
    colors: r.colors ?? [],
    images: r.images ?? [],
    priceRetail: Number(r.price_retail ?? 0),
    priceWholesale: Number(r.price_wholesale ?? 0),
    minWholesale: Number(r.min_wholesale ?? 1),
    inStock: r.in_stock ?? true,
    isNew: r.is_new ?? false,
    isHit: r.is_hit ?? false,
    hidden: r.hidden ?? false,
    deliveryCountries: r.delivery_countries ?? [],
    seoTitle: r.seo_title ?? undefined,
    seoDescription: r.seo_description ?? undefined,
    createdAt: r.created_at ?? new Date().toISOString(),
  };
}

function mapCategory(r: any): Category {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    emoji: r.emoji ?? undefined,
    order: r.order ?? 0,
    hidden: r.hidden ?? false,
  };
}

function mapLead(r: any): Lead {
  return {
    id: r.id,
    type: r.type,
    status: r.status,
    name: r.name,
    phone: r.phone,
    messenger: r.messenger ?? undefined,
    company: r.company ?? undefined,
    country: r.country ?? undefined,
    city: r.city ?? undefined,
    product: r.product ?? undefined,
    category: r.category ?? undefined,
    size: r.size ?? undefined,
    color: r.color ?? undefined,
    quantity: r.quantity ?? undefined,
    budget: r.budget ?? undefined,
    sellChannel: r.sell_channel ?? undefined,
    needBranding: r.need_branding ?? undefined,
    needLabelPack: r.need_label_pack ?? undefined,
    comment: r.comment ?? undefined,
    details: r.details ?? undefined,
    manager: r.manager ?? undefined,
    managerNotes: r.manager_notes ?? undefined,
    lastContactAt: r.last_contact_at ?? undefined,
    createdAt: r.created_at ?? new Date().toISOString(),
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// ── Публичные read-функции ──────────────────────────────────────────────────
// Кэшируются (unstable_cache, revalidate 60с): даже при динамическом рендере
// (nonce-CSP) запросы к БД не повторяются на каждый заход.
async function fetchCategories(): Promise<Category[]> {
  const sb = createPublicSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("categories")
      .select("*")
      .eq("hidden", false)
      .order("order", { ascending: true });
    if (!error && data) return data.map(mapCategory);
  }
  return mockCategories.filter((c) => !c.hidden).sort((a, b) => a.order - b.order);
}

async function fetchProducts(): Promise<Product[]> {
  const sb = createPublicSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("products")
      .select("*")
      .eq("hidden", false)
      .order("created_at", { ascending: false });
    if (!error && data) return data.map(mapProduct);
  }
  return mockProducts.filter((p) => !p.hidden);
}

async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const sb = createPublicSupabase();
  if (sb) {
    const { data, error } = await sb.from("products").select("*").eq("slug", slug).single();
    if (!error && data) return mapProduct(data);
    return null;
  }
  return mockProducts.find((p) => p.slug === slug) ?? null;
}

async function fetchSettings(): Promise<SiteSettings> {
  const sb = createPublicSupabase();
  if (sb) {
    const { data } = await sb.from("settings").select("*").eq("id", 1).single();
    if (data) {
      return {
        shopName: data.shop_name ?? mockSettings.shopName,
        logoUrl: data.logo_url ?? undefined,
        whatsapp: data.whatsapp ?? mockSettings.whatsapp,
        telegram: data.telegram ?? mockSettings.telegram,
        instagram: data.instagram ?? mockSettings.instagram,
        address: data.address ?? mockSettings.address,
        deliveryCountries: data.delivery_countries ?? mockSettings.deliveryCountries,
        paymentTerms: data.payment_terms ?? mockSettings.paymentTerms,
        deliveryTerms: data.delivery_terms ?? mockSettings.deliveryTerms,
        heroText: data.hero_text ?? mockSettings.heroText,
      };
    }
  }
  return mockSettings;
}

// Заявки — читаются только в админ-панели (через защищённый layout).
export async function getLeads(): Promise<Lead[]> {
  const sb = createPublicSupabase();
  if (sb) {
    const { data, error } = await sb
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) return data.map(mapLead);
  }
  return mockLeads;
}

// Кэшированные публичные обёртки (revalidate 60с).
export const getCategories = unstable_cache(fetchCategories, ["categories"], {
  revalidate: 60,
  tags: ["catalog"],
});
export const getProducts = unstable_cache(fetchProducts, ["products"], {
  revalidate: 60,
  tags: ["catalog"],
});
export const getProductBySlug = unstable_cache(fetchProductBySlug, ["product-by-slug"], {
  revalidate: 60,
  tags: ["catalog"],
});
export const getSettings = unstable_cache(fetchSettings, ["settings"], {
  revalidate: 60,
  tags: ["settings"],
});

export { isSupabaseConfigured };
