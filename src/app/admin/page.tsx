import Link from "next/link";
import { adminGetCategories, adminGetLeads, adminGetProducts } from "@/lib/admin-data";
import { LEAD_STATUS_LABEL, LEAD_STATUS_COLOR, LEAD_TYPE_SHORT } from "@/lib/leads";
import type { LeadType } from "@/lib/types";

const TYPE_ORDER: LeadType[] = [
  "retail_order", "wholesale_request", "large_wholesale_request",
  "marketplace_seller_request", "manufacturing_request", "general_contact",
];

export default async function AdminDashboard() {
  const [products, categories, leads] = await Promise.all([
    adminGetProducts(),
    adminGetCategories(),
    adminGetLeads(),
  ]);

  const newLeads = leads.filter((l) => l.status === "new").length;
  const visibleProducts = products.filter((p) => !p.hidden).length;
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  const todayLeads = leads.filter((l) => new Date(l.createdAt) >= todayStart).length;
  const inWork = leads.filter((l) => !["new", "completed", "rejected"].includes(l.status)).length;

  const byType = TYPE_ORDER.map((t) => ({ t, n: leads.filter((l) => l.type === t).length })).filter((x) => x.n > 0);
  const byCountry = Object.entries(
    leads.reduce<Record<string, number>>((acc, l) => {
      if (l.country) acc[l.country] = (acc[l.country] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 6);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Дашборд</h1>
      <p className="mt-1 text-ink-muted">Обзор магазина и заявок по типам клиентов.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Новые заявки" value={newLeads} sub="требуют ответа" href="/admin/leads" accent />
        <Stat label="Заявки за сегодня" value={todayLeads} sub="с начала дня" href="/admin/leads" />
        <Stat label="В работе" value={inWork} sub="в процессе" href="/admin/leads" />
        <Stat label="Товары" value={products.length} sub={`${visibleProducts} на сайте`} href="/admin/products" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="font-display text-lg font-bold">Заявки по типам клиентов</h2>
          <div className="mt-4 space-y-2">
            {byType.length === 0 && <p className="text-sm text-ink-muted">Пока нет заявок.</p>}
            {byType.map(({ t, n }) => {
              const max = Math.max(...byType.map((x) => x.n));
              return (
                <div key={t} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 text-sm text-ink-soft">{LEAD_TYPE_SHORT[t]}</span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-cream-deep">
                    <div className="h-full rounded-full bg-clay" style={{ width: `${(n / max) * 100}%` }} />
                  </div>
                  <span className="w-6 text-right text-sm font-semibold">{n}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-display text-lg font-bold">Страны клиентов</h2>
          <div className="mt-4 space-y-2">
            {byCountry.length === 0 && <p className="text-sm text-ink-muted">Пока нет данных.</p>}
            {byCountry.map(([c, n]) => (
              <div key={c} className="flex items-center justify-between text-sm">
                <span className="text-ink-soft">{c}</span>
                <span className="font-semibold">{n}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 card overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-lg font-bold">Последние заявки</h2>
          <Link href="/admin/leads" className="text-sm font-semibold text-clay hover:underline">Все заявки →</Link>
        </div>
        <div className="divide-y divide-line">
          {leads.slice(0, 6).map((l) => (
            <div key={l.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-sm">
              <div className="flex items-center gap-3">
                <span className="chip">{LEAD_TYPE_SHORT[l.type]}</span>
                <span className="font-semibold">{l.name}</span>
                <span className="text-ink-muted">{l.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-ink-muted">
                <span>{[l.country, l.city].filter(Boolean).join(", ")}</span>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${LEAD_STATUS_COLOR[l.status]}`}>{LEAD_STATUS_LABEL[l.status]}</span>
              </div>
            </div>
          ))}
          {leads.length === 0 && <p className="px-5 py-8 text-center text-ink-muted">Заявок пока нет.</p>}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, sub, href, accent }: { label: string; value: number; sub: string; href: string; accent?: boolean }) {
  return (
    <Link href={href} className={`card p-5 transition hover:-translate-y-0.5 hover:shadow-lift ${accent ? "border-clay/40 bg-clay/5" : ""}`}>
      <p className="text-sm text-ink-muted">{label}</p>
      <p className={`font-display text-3xl font-bold ${accent ? "text-clay" : ""}`}>{value}</p>
      <p className="mt-1 text-xs text-ink-muted">{sub}</p>
    </Link>
  );
}
