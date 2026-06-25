"use client";

import Image from "next/image";
import { useState } from "react";
import type { Category, Gender, Product, Season } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const GENDERS: { v: Gender; l: string }[] = [
  { v: "men", l: "Мужское" }, { v: "women", l: "Женское" }, { v: "kids", l: "Детское" }, { v: "unisex", l: "Унисекс" },
];
const SEASONS: { v: Season; l: string }[] = [
  { v: "all", l: "Всесезон" }, { v: "summer", l: "Лето" }, { v: "demi", l: "Демисезон" }, { v: "winter", l: "Зима" },
];

const slugify = (s: string) =>
  s.toLowerCase().trim()
    .replace(/[а-яё]/g, (c) => ({ а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"e",ж:"zh",з:"z",и:"i",й:"y",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"h",ц:"c",ч:"ch",ш:"sh",щ:"sch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya" }[c] || c))
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const empty = (): Product => ({
  id: "", slug: "", title: "", shortDescription: "", description: "",
  categorySlug: "", gender: "unisex", type: "", season: "all", material: "", countryOfOrigin: "Кыргызстан",
  sizes: [], colors: [], images: [], priceRetail: 0, priceWholesale: 0, minWholesale: 10,
  inStock: true, isNew: false, isHit: false, hidden: false,
  deliveryCountries: ["Кыргызстан", "Казахстан", "Россия", "Узбекистан"], createdAt: new Date().toISOString(),
});

/* eslint-disable @typescript-eslint/no-explicit-any */
function toRow(p: Product): any {
  return {
    slug: p.slug, title: p.title, short_description: p.shortDescription, description: p.description,
    category_slug: p.categorySlug, gender: p.gender, type: p.type, season: p.season,
    material: p.material, country_of_origin: p.countryOfOrigin, sizes: p.sizes, colors: p.colors,
    images: p.images, price_retail: p.priceRetail, price_wholesale: p.priceWholesale,
    min_wholesale: p.minWholesale, in_stock: p.inStock, is_new: p.isNew, is_hit: p.isHit,
    hidden: p.hidden, delivery_countries: p.deliveryCountries, seo_title: p.seoTitle, seo_description: p.seoDescription,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export function ProductsManager({ initialProducts, categories }: { initialProducts: Product[]; categories: Category[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [editing, setEditing] = useState<Product | null>(null);
  const [q, setQ] = useState("");

  const filtered = products.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()));

  async function quickToggle(p: Product, field: "hidden" | "isNew" | "isHit" | "inStock") {
    const updated = { ...p, [field]: !p[field] };
    setProducts((prev) => prev.map((x) => (x.id === p.id ? updated : x)));
    if (isSupabaseConfigured) {
      const sb = createClient();
      await sb?.from("products").update(toRow(updated)).eq("id", p.id);
    }
  }

  async function remove(p: Product) {
    if (!confirm(`Удалить товар «${p.title}»? Это действие необратимо.`)) return;
    setProducts((prev) => prev.filter((x) => x.id !== p.id));
    if (isSupabaseConfigured) {
      const sb = createClient();
      await sb?.from("products").delete().eq("id", p.id);
    }
  }

  async function save(p: Product) {
    if (isSupabaseConfigured) {
      const sb = createClient();
      if (p.id) {
        await sb?.from("products").update(toRow(p)).eq("id", p.id);
        setProducts((prev) => prev.map((x) => (x.id === p.id ? p : x)));
      } else {
        const { data } = await sb!.from("products").insert(toRow(p)).select().single();
        if (data) setProducts((prev) => [{ ...p, id: data.id }, ...prev]);
      }
    } else {
      // демо-режим: только локально
      if (p.id) setProducts((prev) => prev.map((x) => (x.id === p.id ? p : x)));
      else setProducts((prev) => [{ ...p, id: `local-${Date.now()}` }, ...prev]);
    }
    setEditing(null);
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Поиск товара..." className="input max-w-xs" />
        <button onClick={() => setEditing(empty())} className="btn-primary ml-auto">+ Добавить товар</button>
      </div>

      <div className="card overflow-hidden">
        <div className="divide-y divide-line">
          {filtered.map((p) => (
            <div key={p.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-cream-deep">
                {p.images[0] && <Image src={p.images[0]} alt={p.title} fill sizes="56px" className="object-cover" unoptimized />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{p.title}</p>
                <p className="text-xs text-ink-muted">{p.priceRetail} сом · опт {p.priceWholesale} сом · {categories.find((c) => c.slug === p.categorySlug)?.title ?? p.categorySlug}</p>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <Toggle on={!p.hidden} label={p.hidden ? "Скрыт" : "На сайте"} onClick={() => quickToggle(p, "hidden")} />
                <Toggle on={p.isNew} label="Новинка" onClick={() => quickToggle(p, "isNew")} />
                <Toggle on={p.isHit} label="Хит" onClick={() => quickToggle(p, "isHit")} />
                <Toggle on={p.inStock} label="В наличии" onClick={() => quickToggle(p, "inStock")} />
                <button onClick={() => setEditing(p)} className="rounded-lg border border-line px-2.5 py-1 text-xs font-medium hover:border-ink/40">Изменить</button>
                <button onClick={() => remove(p)} className="rounded-lg border border-clay/30 px-2.5 py-1 text-xs font-medium text-clay hover:bg-clay hover:text-cream">Удалить</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="px-4 py-10 text-center text-ink-muted">Товаров не найдено.</p>}
        </div>
      </div>

      {editing && (
        <ProductForm
          initial={editing}
          categories={categories}
          onCancel={() => setEditing(null)}
          onSave={save}
        />
      )}
    </div>
  );
}

function Toggle({ on, label, onClick }: { on: boolean; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${on ? "bg-pine/15 text-pine" : "bg-ink/8 text-ink-muted"}`}>
      {label}
    </button>
  );
}

function ProductForm({ initial, categories, onCancel, onSave }: {
  initial: Product; categories: Category[]; onCancel: () => void; onSave: (p: Product) => void;
}) {
  const [p, setP] = useState<Product>(initial);
  const [uploading, setUploading] = useState(false);
  // Сырой текст для полей «через запятую» — чтобы запятые и пробелы не стирались при вводе.
  const [sizesText, setSizesText] = useState(initial.sizes.join(", "));
  const [colorsText, setColorsText] = useState(initial.colors.join(", "));
  const [deliveryText, setDeliveryText] = useState(initial.deliveryCountries.join(", "));
  const set = (patch: Partial<Product>) => setP((prev) => ({ ...prev, ...patch }));

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    if (!isSupabaseConfigured) {
      alert("Загрузка файлов доступна после подключения Supabase Storage. Пока добавьте ссылку на фото вручную.");
      return;
    }
    setUploading(true);
    const sb = createClient()!;
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
      const { error } = await sb.storage.from("products").upload(path, file, { upsert: false });
      if (!error) {
        const { data } = sb.storage.from("products").getPublicUrl(path);
        urls.push(data.publicUrl);
      }
    }
    set({ images: [...p.images, ...urls] });
    setUploading(false);
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="absolute inset-0 bg-ink/40" onClick={onCancel} />
      <div className="relative mx-auto my-8 w-full max-w-3xl rounded-xl2 bg-cream p-6 shadow-lift sm:p-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">{p.id ? "Редактировать товар" : "Новый товар"}</h2>
          <button onClick={onCancel} className="text-2xl text-ink-muted hover:text-ink">×</button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label">Название *</label>
            <input className="input" value={p.title} onChange={(e) => set({ title: e.target.value, slug: p.id ? p.slug : slugify(e.target.value) })} />
          </div>
          <div>
            <label className="label">Ссылка (slug)</label>
            <input className="input" value={p.slug} onChange={(e) => set({ slug: slugify(e.target.value) })} />
          </div>
          <div>
            <label className="label">Категория</label>
            <select className="input" value={p.categorySlug} onChange={(e) => set({ categorySlug: e.target.value })}>
              <option value="">— выбрать —</option>
              {categories.map((c) => <option key={c.id} value={c.slug}>{c.title}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="label">Краткое описание</label>
            <input className="input" value={p.shortDescription} onChange={(e) => set({ shortDescription: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Описание</label>
            <textarea rows={3} className="input resize-none" value={p.description} onChange={(e) => set({ description: e.target.value })} />
          </div>

          <div>
            <label className="label">Пол</label>
            <select className="input" value={p.gender} onChange={(e) => set({ gender: e.target.value as Gender })}>
              {GENDERS.map((g) => <option key={g.v} value={g.v}>{g.l}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Тип товара</label>
            <input className="input" value={p.type} onChange={(e) => set({ type: e.target.value })} placeholder="Футболка, худи..." />
          </div>
          <div>
            <label className="label">Сезон</label>
            <select className="input" value={p.season} onChange={(e) => set({ season: e.target.value as Season })}>
              {SEASONS.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Материал</label>
            <input className="input" value={p.material} onChange={(e) => set({ material: e.target.value })} />
          </div>
          <div>
            <label className="label">Страна производства</label>
            <input className="input" value={p.countryOfOrigin} onChange={(e) => set({ countryOfOrigin: e.target.value })} />
          </div>

          <div>
            <label className="label">Размеры (через запятую)</label>
            <input className="input" value={sizesText} onChange={(e) => setSizesText(e.target.value)} placeholder="S, M, L, XL" />
          </div>
          <div>
            <label className="label">Цвета (через запятую)</label>
            <input className="input" value={colorsText} onChange={(e) => setColorsText(e.target.value)} placeholder="Чёрный, Белый" />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Страны доставки (через запятую)</label>
            <input className="input" value={deliveryText} onChange={(e) => setDeliveryText(e.target.value)} />
          </div>

          <div>
            <label className="label">Цена розница (сом)</label>
            <input type="number" min={0} className="input" value={p.priceRetail || ""} onChange={(e) => set({ priceRetail: e.target.value === "" ? 0 : Number(e.target.value) })} placeholder="0" />
          </div>
          <div>
            <label className="label">Цена опт (сом)</label>
            <input type="number" min={0} className="input" value={p.priceWholesale || ""} onChange={(e) => set({ priceWholesale: e.target.value === "" ? 0 : Number(e.target.value) })} placeholder="0" />
          </div>
          <div>
            <label className="label">Мин. заказ опт (шт)</label>
            <input type="number" min={0} className="input" value={p.minWholesale || ""} onChange={(e) => set({ minWholesale: e.target.value === "" ? 0 : Number(e.target.value) })} placeholder="1" />
          </div>

          {/* Images */}
          <div className="sm:col-span-2">
            <label className="label">Фото товара <span className="font-normal normal-case text-ink-muted">— первое фото показывается как обложка</span></label>
            <div className="flex flex-wrap gap-2">
              {p.images.map((src, i) => (
                <div key={i} className={`group relative h-24 w-20 overflow-hidden rounded-lg border-2 ${i === 0 ? "border-clay" : "border-line"}`}>
                  <Image src={src} alt="" fill sizes="80px" className="object-cover" unoptimized />
                  <button onClick={() => set({ images: p.images.filter((_, idx) => idx !== i) })} className="absolute right-0 top-0 grid h-5 w-5 place-items-center bg-ink/70 text-xs text-cream hover:bg-clay" title="Удалить фото">×</button>
                  {i === 0 ? (
                    <span className="absolute inset-x-0 bottom-0 bg-clay py-0.5 text-center text-[10px] font-semibold text-cream">★ Обложка</span>
                  ) : (
                    <button
                      onClick={() => set({ images: [src, ...p.images.filter((_, idx) => idx !== i)] })}
                      className="absolute inset-x-0 bottom-0 bg-ink/75 py-0.5 text-center text-[10px] text-cream hover:bg-clay"
                      title="Сделать обложкой"
                    >
                      Сделать обложкой
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <input
                className="input flex-1"
                placeholder="Вставьте ссылку на фото и нажмите Enter"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const v = (e.target as HTMLInputElement).value.trim();
                    if (v) { set({ images: [...p.images, v] }); (e.target as HTMLInputElement).value = ""; }
                  }
                }}
              />
              <label className="btn-ghost cursor-pointer whitespace-nowrap">
                {uploading ? "Загрузка..." : "Загрузить файл"}
                <input type="file" accept="image/*" multiple className="hidden" onChange={onFile} />
              </label>
            </div>
          </div>

          {/* SEO */}
          <div className="sm:col-span-2">
            <label className="label">SEO-заголовок</label>
            <input className="input" value={p.seoTitle ?? ""} onChange={(e) => set({ seoTitle: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">SEO-описание</label>
            <textarea rows={2} className="input resize-none" value={p.seoDescription ?? ""} onChange={(e) => set({ seoDescription: e.target.value })} />
          </div>

          {/* Flags */}
          <div className="flex flex-wrap gap-4 sm:col-span-2">
            <Check label="В наличии" checked={p.inStock} onChange={(v) => set({ inStock: v })} />
            <Check label="Новинка" checked={p.isNew} onChange={(v) => set({ isNew: v })} />
            <Check label="Хит продаж" checked={p.isHit} onChange={(v) => set({ isHit: v })} />
            <Check label="Скрыть с сайта" checked={p.hidden} onChange={(v) => set({ hidden: v })} />
          </div>
        </div>

        <div className="mt-7 flex gap-3">
          <button
            onClick={() => {
              if (!p.title || !p.slug || !p.categorySlug) { alert("Заполните название, ссылку и категорию."); return; }
              // Разбиваем «через запятую» поля в массивы только при сохранении.
              onSave({
                ...p,
                sizes: splitList(sizesText),
                colors: splitList(colorsText),
                deliveryCountries: splitList(deliveryText),
              });
            }}
            className="btn-primary"
          >
            Сохранить
          </button>
          <button onClick={onCancel} className="btn-ghost">Отмена</button>
        </div>
      </div>
    </div>
  );
}

function splitList(v: string) {
  return v.split(",").map((s) => s.trim()).filter(Boolean);
}
function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-clay" />
      {label}
    </label>
  );
}
