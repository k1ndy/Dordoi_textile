import Link from "next/link";
import { adminGetCategories, adminGetLeads, adminGetProducts } from "@/lib/admin-data";

const STATUS_LABEL: Record<string, string> = {
  new: "Новые", in_progress: "В работе", done: "Завершено", rejected: "Отказ",
};
const TYPE_LABEL: Record<string, string> = {
  retail: "Розница", wholesale: "Опт", seller: "Селлеры",
};

export default async function AdminDashboard() {
  const [products, categories, leads] = await Promise.all([
    adminGetProducts(),
    adminGetCategories(),
    adminGetLeads(),
  ]);

  const newLeads = leads.filter((l) => l.status === "new").length;
  const visibleProducts = products.filter((p) => !p.hidden).length;

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Дашборд</h1>
      <p className="mt-1 text-ink-muted">Обзор магазина и последние заявки.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Товары" value={products.length} sub={`${visibleProducts} на сайте`} href="/admin/products" />
        <Stat label="Категории" value={categories.length} sub={`${categories.filter((c) => !c.hidden).length} активны`} href="/admin/categories" />
        <Stat label="Заявки" value={leads.length} sub="всего" href="/admin/leads" />
        <Stat label="Новые заявки" value={newLeads} sub="требуют ответа" href="/admin/leads" accent />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {(["new", "in_progress", "done"] as const).map((st) => (
          <div key={st} className="card p-5">
            <p className="text-sm text-ink-muted">{STATUS_LABEL[st]}</p>
            <p className="font-display text-2xl font-bold">{leads.filter((l) => l.status === st).length}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 card overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-lg font-bold">Последние заявки</h2>
          <Link href="/admin/leads" className="text-sm font-semibold text-clay hover:underline">Все заявки →</Link>
        </div>
        <div className="divide-y divide-line">
          {leads.slice(0, 5).map((l) => (
            <div key={l.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-sm">
              <div className="flex items-center gap-3">
                <span className="chip">{TYPE_LABEL[l.type]}</span>
                <span className="font-semibold">{l.name}</span>
                <span className="text-ink-muted">{l.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-ink-muted">
                <span>{[l.country, l.city].filter(Boolean).join(", ")}</span>
                <StatusBadge status={l.status} />
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

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    new: "bg-clay/15 text-clay",
    in_progress: "bg-saffron/20 text-[#9a6a12]",
    done: "bg-pine/15 text-pine",
    rejected: "bg-ink/10 text-ink-muted",
  };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${map[status]}`}>{STATUS_LABEL[status]}</span>;
}
