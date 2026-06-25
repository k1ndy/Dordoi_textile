"use client";

import { useMemo, useState } from "react";
import type { Lead, LeadStatus, LeadType } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import {
  LEAD_STATUSES, LEAD_STATUS_LABEL, LEAD_STATUS_COLOR,
  LEAD_TYPE_LABEL, LEAD_TYPE_SHORT, DETAIL_LABELS,
} from "@/lib/leads";

const TYPE_OPTIONS: LeadType[] = [
  "retail_order", "wholesale_request", "large_wholesale_request",
  "marketplace_seller_request", "manufacturing_request", "general_contact",
];

export function LeadsManager({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [typeFilter, setTypeFilter] = useState<LeadType | "">("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "">("");
  const [countryFilter, setCountryFilter] = useState("");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<Lead | null>(null);

  const countries = useMemo(
    () => Array.from(new Set(leads.map((l) => l.country).filter(Boolean))) as string[],
    [leads]
  );

  const filtered = useMemo(
    () =>
      leads.filter((l) => {
        if (typeFilter && l.type !== typeFilter) return false;
        if (statusFilter && l.status !== statusFilter) return false;
        if (countryFilter && l.country !== countryFilter) return false;
        if (q) {
          const hay = `${l.name} ${l.phone} ${l.messenger ?? ""}`.toLowerCase();
          if (!hay.includes(q.toLowerCase())) return false;
        }
        return true;
      }),
    [leads, typeFilter, statusFilter, countryFilter, q]
  );

  async function patch(id: string, patch: Record<string, unknown>, local: Partial<Lead>) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...local } : l)));
    setOpen((o) => (o && o.id === id ? { ...o, ...local } : o));
    if (isSupabaseConfigured) {
      const sb = createClient();
      await sb?.from("leads").update(patch).eq("id", id);
    }
  }

  const updateStatus = (id: string, status: LeadStatus) =>
    patch(id, { status, last_contact_at: new Date().toISOString() }, { status, lastContactAt: new Date().toISOString() });

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-3">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Поиск: имя или телефон..." className="input max-w-xs" />
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as LeadType | "")} className="input sm:w-52">
          <option value="">Все типы</option>
          {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{LEAD_TYPE_SHORT[t]}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as LeadStatus | "")} className="input sm:w-48">
          <option value="">Все статусы</option>
          {LEAD_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} className="input sm:w-44">
          <option value="">Все страны</option>
          {countries.map((c) => <option key={c}>{c}</option>)}
        </select>
        <span className="ml-auto self-center text-sm text-ink-muted">Найдено: <b className="text-ink">{filtered.length}</b></span>
      </div>

      <div className="card overflow-hidden">
        <div className="hidden grid-cols-[130px_1fr_1fr_1fr_150px] gap-3 border-b border-line bg-cream-deep/40 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-muted lg:grid">
          <span>Тип</span><span>Клиент</span><span>Контакты</span><span>Детали</span><span>Статус</span>
        </div>
        <div className="divide-y divide-line">
          {filtered.map((l) => (
            <button key={l.id} onClick={() => setOpen(l)} className="grid w-full grid-cols-1 gap-1 px-4 py-3 text-left text-sm hover:bg-cream-deep/30 lg:grid-cols-[130px_1fr_1fr_1fr_150px] lg:items-center lg:gap-3">
              <span className="chip w-fit">{LEAD_TYPE_SHORT[l.type]}</span>
              <span className="font-semibold">{l.name}{l.manager && <span className="ml-1 text-xs font-normal text-ink-muted">· {l.manager}</span>}</span>
              <span className="text-ink-muted">{l.phone}{l.messenger ? ` · ${l.messenger}` : ""}</span>
              <span className="truncate text-ink-muted">{[l.product || l.category, l.quantity, [l.country, l.city].filter(Boolean).join(", ")].filter(Boolean).join(" · ")}</span>
              <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${LEAD_STATUS_COLOR[l.status]}`}>{LEAD_STATUS_LABEL[l.status]}</span>
            </button>
          ))}
          {filtered.length === 0 && <p className="px-4 py-10 text-center text-ink-muted">Заявок нет.</p>}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(null)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-cream p-6 shadow-lift">
            <div className="flex items-center justify-between">
              <span className="chip">{LEAD_TYPE_LABEL[open.type]}</span>
              <button onClick={() => setOpen(null)} className="text-2xl text-ink-muted hover:text-ink">×</button>
            </div>
            <h2 className="mt-3 font-display text-2xl font-bold">{open.name}</h2>
            <p className="text-sm text-ink-muted">{new Date(open.createdAt).toLocaleString("ru-RU")}</p>

            <div className="mt-5 space-y-1.5 text-sm">
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
              {open.details && Object.entries(open.details).map(([k, v]) => (
                <Row key={k} k={DETAIL_LABELS[k] ?? k} v={String(v)} />
              ))}
              <Row k="Комментарий" v={open.comment} />
            </div>

            <div className="mt-6">
              <p className="label">Статус</p>
              <div className="flex flex-wrap gap-2">
                {LEAD_STATUSES.map((s) => (
                  <button key={s.value} onClick={() => updateStatus(open.id, s.value)}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${open.status === s.value ? LEAD_STATUS_COLOR[s.value] + " ring-2 ring-clay/30" : "border border-line bg-cream-card text-ink-soft hover:border-ink/40"}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <label className="label">Менеджер</label>
              <input
                className="input"
                defaultValue={open.manager ?? ""}
                placeholder="Имя менеджера"
                onBlur={(e) => { if (e.target.value !== (open.manager ?? "")) patch(open.id, { manager: e.target.value || null }, { manager: e.target.value }); }}
              />
            </div>
            <div className="mt-3">
              <label className="label">Заметки менеджера</label>
              <textarea
                className="input resize-none" rows={3}
                defaultValue={open.managerNotes ?? ""}
                placeholder="Внутренние заметки по клиенту"
                onBlur={(e) => { if (e.target.value !== (open.managerNotes ?? "")) patch(open.id, { manager_notes: e.target.value || null }, { managerNotes: e.target.value }); }}
              />
            </div>
            {open.lastContactAt && <p className="mt-2 text-xs text-ink-muted">Последний контакт: {new Date(open.lastContactAt).toLocaleString("ru-RU")}</p>}

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
