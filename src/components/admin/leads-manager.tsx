"use client";

import { useMemo, useState } from "react";
import type { Lead, LeadStatus, LeadType } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const STATUS: { v: LeadStatus; l: string }[] = [
  { v: "new", l: "Новая" },
  { v: "in_progress", l: "В работе" },
  { v: "done", l: "Завершена" },
  { v: "rejected", l: "Отказ" },
];
const TYPE_LABEL: Record<LeadType, string> = { retail: "🛍️ Розница", wholesale: "📦 Опт", seller: "🏭 Селлер" };
const STATUS_COLOR: Record<string, string> = {
  new: "bg-clay/15 text-clay", in_progress: "bg-saffron/20 text-[#9a6a12]",
  done: "bg-pine/15 text-pine", rejected: "bg-ink/10 text-ink-muted",
};

export function LeadsManager({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [typeFilter, setTypeFilter] = useState<LeadType | "">("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "">("");
  const [open, setOpen] = useState<Lead | null>(null);

  const filtered = useMemo(
    () => leads.filter((l) => (!typeFilter || l.type === typeFilter) && (!statusFilter || l.status === statusFilter)),
    [leads, typeFilter, statusFilter]
  );

  async function updateStatus(id: string, status: LeadStatus) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    setOpen((o) => (o && o.id === id ? { ...o, status } : o));
    if (isSupabaseConfigured) {
      const sb = createClient();
      await sb?.from("leads").update({ status }).eq("id", id);
    }
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-3">
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as LeadType | "")} className="input sm:w-48">
          <option value="">Все типы</option>
          <option value="retail">Розница</option>
          <option value="wholesale">Опт</option>
          <option value="seller">Селлеры</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as LeadStatus | "")} className="input sm:w-48">
          <option value="">Все статусы</option>
          {STATUS.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
        </select>
        <span className="ml-auto self-center text-sm text-ink-muted">Найдено: <b className="text-ink">{filtered.length}</b></span>
      </div>

      <div className="card overflow-hidden">
        <div className="hidden grid-cols-[110px_1fr_1fr_1fr_140px] gap-3 border-b border-line bg-cream-deep/40 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-muted lg:grid">
          <span>Тип</span><span>Клиент</span><span>Контакты</span><span>Детали</span><span>Статус</span>
        </div>
        <div className="divide-y divide-line">
          {filtered.map((l) => (
            <button
              key={l.id}
              onClick={() => setOpen(l)}
              className="grid w-full grid-cols-1 gap-1 px-4 py-3 text-left text-sm hover:bg-cream-deep/30 lg:grid-cols-[110px_1fr_1fr_1fr_140px] lg:items-center lg:gap-3"
            >
              <span className="chip w-fit">{TYPE_LABEL[l.type]}</span>
              <span className="font-semibold">{l.name}</span>
              <span className="text-ink-muted">{l.phone}{l.messenger ? ` · ${l.messenger}` : ""}</span>
              <span className="text-ink-muted">
                {[l.product || l.category, l.quantity, [l.country, l.city].filter(Boolean).join(", ")].filter(Boolean).join(" · ")}
              </span>
              <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLOR[l.status]}`}>
                {STATUS.find((s) => s.v === l.status)?.l}
              </span>
            </button>
          ))}
          {filtered.length === 0 && <p className="px-4 py-10 text-center text-ink-muted">Заявок нет.</p>}
        </div>
      </div>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(null)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-cream p-6 shadow-lift">
            <div className="flex items-center justify-between">
              <span className="chip">{TYPE_LABEL[open.type]}</span>
              <button onClick={() => setOpen(null)} className="text-2xl text-ink-muted hover:text-ink">×</button>
            </div>
            <h2 className="mt-3 font-display text-2xl font-bold">{open.name}</h2>
            <p className="text-sm text-ink-muted">{new Date(open.createdAt).toLocaleString("ru-RU")}</p>

            <div className="mt-5 space-y-2 text-sm">
              <Row k="Телефон" v={open.phone} />
              <Row k="Мессенджер" v={open.messenger} />
              <Row k="Компания" v={open.company} />
              <Row k="Страна / город" v={[open.country, open.city].filter(Boolean).join(", ")} />
              <Row k="Товар" v={open.product} />
              <Row k="Категория" v={open.category} />
              <Row k="Размер" v={open.size} />
              <Row k="Цвет" v={open.color} />
              <Row k="Количество" v={open.quantity} />
              <Row k="Бюджет" v={open.budget} />
              <Row k="Где продаёт" v={open.sellChannel} />
              <Row k="Отшив под бренд" v={open.needBranding ? "Да" : undefined} />
              <Row k="Бирка / упаковка" v={open.needLabelPack ? "Да" : undefined} />
              <Row k="Комментарий" v={open.comment} />
            </div>

            <div className="mt-6">
              <p className="label">Статус заявки</p>
              <div className="flex flex-wrap gap-2">
                {STATUS.map((s) => (
                  <button
                    key={s.v}
                    onClick={() => updateStatus(open.id, s.v)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      open.status === s.v ? STATUS_COLOR[s.v] + " ring-2 ring-clay/30" : "border border-line bg-cream-card text-ink-soft hover:border-ink/40"
                    }`}
                  >
                    {s.l}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <a href={`tel:${open.phone}`} className="btn-dark flex-1 !py-2 text-sm">Позвонить</a>
              <a href={`https://wa.me/${open.phone.replace(/[^\d]/g, "")}`} target="_blank" rel="noopener noreferrer" className="btn-wa flex-1 !py-2 text-sm">WhatsApp</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ k, v }: { k: string; v?: string }) {
  if (!v) return null;
  return (
    <div className="flex justify-between gap-4 border-b border-line/60 py-1.5">
      <span className="text-ink-muted">{k}</span>
      <span className="text-right font-medium">{v}</span>
    </div>
  );
}
