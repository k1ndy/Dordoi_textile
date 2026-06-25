"use client";

import { useMemo, useState } from "react";
import type { Category, Gender, Product, Season, SiteSettings } from "@/lib/types";
import { ProductCard } from "./product-card";
import { useSite } from "./providers";
import { CloseIcon, SearchIcon } from "./icons";

const GENDERS: { v: Gender; l: string }[] = [
  { v: "men", l: "Мужское" },
  { v: "women", l: "Женское" },
  { v: "kids", l: "Детское" },
  { v: "unisex", l: "Унисекс" },
];
const SEASONS: { v: Season; l: string }[] = [
  { v: "all", l: "Всесезон" },
  { v: "summer", l: "Лето" },
  { v: "demi", l: "Демисезон" },
  { v: "winter", l: "Зима" },
];

type Sort = "new" | "price-asc" | "price-desc" | "popular";

export function CatalogClient({
  products,
  categories,
  settings,
  initialCategory,
}: {
  products: Product[];
  categories: Category[];
  settings: SiteSettings;
  initialCategory?: string;
}) {
  const { price } = useSite();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>(initialCategory ?? "");
  const [genders, setGenders] = useState<Gender[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [country, setCountry] = useState("");
  const [onlyStock, setOnlyStock] = useState(false);
  const [onlyNew, setOnlyNew] = useState(false);
  const [onlyHit, setOnlyHit] = useState(false);
  const [wholesale, setWholesale] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [sort, setSort] = useState<Sort>("new");
  const [drawer, setDrawer] = useState(false);

  const allSizes = useMemo(() => unique(products.flatMap((p) => p.sizes)), [products]);
  const allColors = useMemo(() => unique(products.flatMap((p) => p.colors)), [products]);
  const allCountries = useMemo(() => unique(products.flatMap((p) => p.deliveryCountries)), [products]);
  const priceCeil = useMemo(() => Math.max(...products.map((p) => p.priceRetail), 1000), [products]);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (cat && p.categorySlug !== cat) return false;
      if (genders.length && !genders.includes(p.gender)) return false;
      if (sizes.length && !sizes.some((s) => p.sizes.includes(s))) return false;
      if (colors.length && !colors.some((c) => p.colors.includes(c))) return false;
      if (seasons.length && !seasons.includes(p.season)) return false;
      if (country && !p.deliveryCountries.includes(country)) return false;
      if (onlyStock && !p.inStock) return false;
      if (onlyNew && !p.isNew) return false;
      if (onlyHit && !p.isHit) return false;
      if (maxPrice && p.priceRetail > maxPrice) return false;
      if (q) {
        const hay = `${p.title} ${p.shortDescription} ${p.type}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === "price-asc") return a.priceRetail - b.priceRetail;
      if (sort === "price-desc") return b.priceRetail - a.priceRetail;
      if (sort === "popular") return Number(b.isHit) - Number(a.isHit);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return list;
  }, [products, cat, genders, sizes, colors, seasons, country, onlyStock, onlyNew, onlyHit, maxPrice, q, sort]);

  function reset() {
    setCat(initialCategory ?? "");
    setGenders([]); setSizes([]); setColors([]); setSeasons([]);
    setCountry(""); setOnlyStock(false); setOnlyNew(false); setOnlyHit(false);
    setWholesale(false); setMaxPrice(0); setQ("");
  }

  const Filters = (
    <div className="space-y-6">
      {!initialCategory && (
        <FilterGroup title="Категория">
          <div className="space-y-1.5">
            <RadioRow label="Все категории" checked={!cat} onClick={() => setCat("")} />
            {categories.map((c) => (
              <RadioRow key={c.id} label={`${c.emoji ?? ""} ${c.title}`} checked={cat === c.slug} onClick={() => setCat(c.slug)} />
            ))}
          </div>
        </FilterGroup>
      )}

      <FilterGroup title="Пол">
        {GENDERS.map((g) => (
          <CheckRow key={g.v} label={g.l} checked={genders.includes(g.v)} onClick={() => toggle(setGenders, g.v)} />
        ))}
      </FilterGroup>

      <FilterGroup title="Размер">
        <div className="flex flex-wrap gap-1.5">
          {allSizes.map((s) => (
            <button
              key={s}
              onClick={() => toggle(setSizes, s)}
              className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
                sizes.includes(s) ? "border-clay bg-clay text-cream" : "border-line bg-cream-card text-ink-soft hover:border-ink/40"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Цвет">
        <div className="flex flex-wrap gap-1.5">
          {allColors.map((c) => (
            <button
              key={c}
              onClick={() => toggle(setColors, c)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                colors.includes(c) ? "border-clay bg-clay text-cream" : "border-line bg-cream-card text-ink-soft hover:border-ink/40"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Сезон">
        {SEASONS.map((s) => (
          <CheckRow key={s.v} label={s.l} checked={seasons.includes(s.v)} onClick={() => toggle(setSeasons, s.v)} />
        ))}
      </FilterGroup>

      <FilterGroup title="Страна доставки">
        <select className="input" value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="">Любая</option>
          {allCountries.map((c) => <option key={c}>{c}</option>)}
        </select>
      </FilterGroup>

      <FilterGroup title={`Цена до ${maxPrice ? price(maxPrice) : price(priceCeil)}`}>
        <input
          type="range" min={0} max={priceCeil} step={50}
          value={maxPrice || priceCeil}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-clay"
        />
      </FilterGroup>

      <FilterGroup title="Дополнительно">
        <CheckRow label="Только в наличии" checked={onlyStock} onClick={() => setOnlyStock((v) => !v)} />
        <CheckRow label="Новинки" checked={onlyNew} onClick={() => setOnlyNew((v) => !v)} />
        <CheckRow label="Популярное" checked={onlyHit} onClick={() => setOnlyHit((v) => !v)} />
        <CheckRow label="Показывать оптовые цены" checked={wholesale} onClick={() => setWholesale((v) => !v)} />
      </FilterGroup>

      <button onClick={reset} className="btn-ghost w-full">Сбросить фильтры</button>
    </div>
  );

  return (
    <div className="container-x py-8">
      {/* search + sort bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Поиск по товарам..."
            className="input pl-10"
          />
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="input sm:w-56">
          <option value="new">Сначала новые</option>
          <option value="popular">Популярные</option>
          <option value="price-asc">Сначала дешевле</option>
          <option value="price-desc">Сначала дороже</option>
        </select>
        <button onClick={() => setDrawer(true)} className="btn-dark lg:hidden">Фильтры</button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 no-scrollbar">{Filters}</div>
        </aside>

        <div>
          <p className="mb-4 text-sm text-ink-muted">Найдено товаров: <b className="text-ink">{filtered.length}</b></p>
          {filtered.length === 0 ? (
            <div className="card grid place-items-center p-16 text-center">
              <p className="font-display text-xl font-bold">Ничего не найдено</p>
              <p className="mt-2 text-sm text-ink-muted">Попробуйте изменить фильтры или сбросить их.</p>
              <button onClick={reset} className="btn-ghost mt-4">Сбросить фильтры</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} settings={settings} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setDrawer(false)} />
          <div className="absolute right-0 top-0 h-full w-[86%] max-w-sm animate-fade-up overflow-y-auto bg-cream p-5 shadow-lift">
            <div className="mb-5 flex items-center justify-between">
              <span className="font-display text-lg font-bold">Фильтры</span>
              <button onClick={() => setDrawer(false)} className="grid h-10 w-10 place-items-center rounded-full border border-ink/15"><CloseIcon /></button>
            </div>
            {Filters}
            <button onClick={() => setDrawer(false)} className="btn-primary mt-5 w-full">Показать {filtered.length}</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── helpers ──
function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}
function toggle<T>(setter: React.Dispatch<React.SetStateAction<T[]>>, value: T) {
  setter((prev) => (prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]));
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2.5 text-sm font-semibold text-ink">{title}</p>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}
function CheckRow({ label, checked, onClick }: { label: string; checked: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-2.5 text-left text-sm text-ink-soft hover:text-ink">
      <span className={`grid h-4 w-4 place-items-center rounded border ${checked ? "border-clay bg-clay text-cream" : "border-ink/30"}`}>
        {checked && <span className="text-[10px] leading-none">✓</span>}
      </span>
      {label}
    </button>
  );
}
function RadioRow({ label, checked, onClick }: { label: string; checked: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-2.5 text-left text-sm text-ink-soft hover:text-ink">
      <span className={`grid h-4 w-4 place-items-center rounded-full border ${checked ? "border-clay" : "border-ink/30"}`}>
        {checked && <span className="h-2 w-2 rounded-full bg-clay" />}
      </span>
      {label}
    </button>
  );
}
