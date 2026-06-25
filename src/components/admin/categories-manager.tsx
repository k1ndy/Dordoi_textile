"use client";

import { useState } from "react";
import type { Category } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const slugify = (s: string) =>
  s.toLowerCase().trim()
    .replace(/[а-яё]/g, (c) => ({ а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"e",ж:"zh",з:"z",и:"i",й:"y",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"h",ц:"c",ч:"ch",ш:"sh",щ:"sch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya" }[c] || c))
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

/* eslint-disable @typescript-eslint/no-explicit-any */
const toRow = (c: Category): any => ({ slug: c.slug, title: c.title, emoji: c.emoji, order: c.order, hidden: c.hidden });
/* eslint-enable @typescript-eslint/no-explicit-any */

export function CategoriesManager({ initial }: { initial: Category[] }) {
  const [cats, setCats] = useState(initial);
  const [editing, setEditing] = useState<Category | null>(null);

  async function persist(c: Category, isNew: boolean) {
    if (isSupabaseConfigured) {
      const sb = createClient();
      if (isNew) {
        const { data } = await sb!.from("categories").insert(toRow(c)).select().single();
        if (data) setCats((p) => [...p, { ...c, id: data.id }]);
      } else {
        await sb?.from("categories").update(toRow(c)).eq("id", c.id);
        setCats((p) => p.map((x) => (x.id === c.id ? c : x)));
      }
    } else {
      if (isNew) setCats((p) => [...p, { ...c, id: `local-${Date.now()}` }]);
      else setCats((p) => p.map((x) => (x.id === c.id ? c : x)));
    }
    setEditing(null);
  }

  async function toggleHide(c: Category) {
    const u = { ...c, hidden: !c.hidden };
    setCats((p) => p.map((x) => (x.id === c.id ? u : x)));
    if (isSupabaseConfigured) { const sb = createClient(); await sb?.from("categories").update({ hidden: u.hidden }).eq("id", c.id); }
  }

  async function remove(c: Category) {
    if (!confirm(`Удалить категорию «${c.title}»?`)) return;
    setCats((p) => p.filter((x) => x.id !== c.id));
    if (isSupabaseConfigured) { const sb = createClient(); await sb?.from("categories").delete().eq("id", c.id); }
  }

  async function move(c: Category, dir: -1 | 1) {
    const sorted = [...cats].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((x) => x.id === c.id);
    const swap = sorted[idx + dir];
    if (!swap) return;
    const a = { ...c, order: swap.order };
    const b = { ...swap, order: c.order };
    setCats((p) => p.map((x) => (x.id === a.id ? a : x.id === b.id ? b : x)));
    if (isSupabaseConfigured) {
      const sb = createClient();
      await sb?.from("categories").update({ order: a.order }).eq("id", a.id);
      await sb?.from("categories").update({ order: b.order }).eq("id", b.id);
    }
  }

  const sorted = [...cats].sort((a, b) => a.order - b.order);

  return (
    <div>
      <div className="mb-5 flex justify-end">
        <button onClick={() => setEditing({ id: "", slug: "", title: "", emoji: "🏷️", order: (cats.at(-1)?.order ?? 0) + 1, hidden: false })} className="btn-primary">
          + Добавить категорию
        </button>
      </div>

      <div className="card divide-y divide-line">
        {sorted.map((c, i) => (
          <div key={c.id} className="flex items-center gap-3 px-4 py-3">
            <div className="flex flex-col">
              <button onClick={() => move(c, -1)} disabled={i === 0} className="text-ink-muted hover:text-ink disabled:opacity-30">▲</button>
              <button onClick={() => move(c, 1)} disabled={i === sorted.length - 1} className="text-ink-muted hover:text-ink disabled:opacity-30">▼</button>
            </div>
            <span className="text-2xl">{c.emoji}</span>
            <div className="flex-1">
              <p className="font-semibold">{c.title}</p>
              <p className="text-xs text-ink-muted">/{c.slug}</p>
            </div>
            <button onClick={() => toggleHide(c)} className={`rounded-lg px-2.5 py-1 text-xs font-medium ${c.hidden ? "bg-ink/8 text-ink-muted" : "bg-pine/15 text-pine"}`}>
              {c.hidden ? "Скрыта" : "Активна"}
            </button>
            <button onClick={() => setEditing(c)} className="rounded-lg border border-line px-2.5 py-1 text-xs hover:border-ink/40">Изменить</button>
            <button onClick={() => remove(c)} className="rounded-lg border border-clay/30 px-2.5 py-1 text-xs text-clay hover:bg-clay hover:text-cream">Удалить</button>
          </div>
        ))}
        {sorted.length === 0 && <p className="px-4 py-10 text-center text-ink-muted">Категорий нет.</p>}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center p-5">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setEditing(null)} />
          <div className="relative w-full max-w-md rounded-xl2 bg-cream p-6 shadow-lift">
            <h2 className="font-display text-xl font-bold">{editing.id ? "Редактировать" : "Новая категория"}</h2>
            <div className="mt-4 space-y-3">
              <div>
                <label className="label">Название</label>
                <input className="input" value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value, slug: editing.id ? editing.slug : slugify(e.target.value) })} />
              </div>
              <div className="grid grid-cols-[1fr_80px] gap-3">
                <div>
                  <label className="label">Ссылка (slug)</label>
                  <input className="input" value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })} />
                </div>
                <div>
                  <label className="label">Эмодзи</label>
                  <input className="input text-center" value={editing.emoji ?? ""} onChange={(e) => setEditing({ ...editing, emoji: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => { if (!editing.title || !editing.slug) { alert("Заполните название и slug"); return; } persist(editing, !editing.id); }} className="btn-primary">Сохранить</button>
              <button onClick={() => setEditing(null)} className="btn-ghost">Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
