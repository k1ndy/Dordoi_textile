"use client";

import { useState } from "react";
import type { SiteSettings } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const [s, setS] = useState(initial);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const set = (patch: Partial<SiteSettings>) => setS((prev) => ({ ...prev, ...patch }));

  async function save() {
    setSaving(true);
    if (isSupabaseConfigured) {
      const sb = createClient();
      await sb?.from("settings").upsert({
        id: 1,
        shop_name: s.shopName, logo_url: s.logoUrl, whatsapp: s.whatsapp, telegram: s.telegram,
        instagram: s.instagram, address: s.address, delivery_countries: s.deliveryCountries,
        payment_terms: s.paymentTerms, delivery_terms: s.deliveryTerms, hero_text: s.heroText,
      });
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Group title="Магазин">
        <Field label="Название магазина" value={s.shopName} onChange={(v) => set({ shopName: v })} />
        <Field label="Логотип (URL)" value={s.logoUrl ?? ""} onChange={(v) => set({ logoUrl: v })} />
        <Field label="Адрес" value={s.address} onChange={(v) => set({ address: v })} />
      </Group>

      <Group title="Контакты">
        <Field label="WhatsApp (номер без +)" value={s.whatsapp} onChange={(v) => set({ whatsapp: v })} />
        <Field label="Telegram (username)" value={s.telegram} onChange={(v) => set({ telegram: v })} />
        <Field label="Instagram (username)" value={s.instagram} onChange={(v) => set({ instagram: v })} />
      </Group>

      <Group title="Доставка и оплата">
        <Field label="Страны доставки (через запятую)" value={s.deliveryCountries.join(", ")} onChange={(v) => set({ deliveryCountries: v.split(",").map((x) => x.trim()).filter(Boolean) })} />
        <Area label="Условия оплаты" value={s.paymentTerms} onChange={(v) => set({ paymentTerms: v })} />
        <Area label="Условия доставки" value={s.deliveryTerms} onChange={(v) => set({ deliveryTerms: v })} />
      </Group>

      <Group title="Главная страница">
        <Area label="Текст в шапке (hero)" value={s.heroText} onChange={(v) => set({ heroText: v })} />
      </Group>

      <div className="flex items-center gap-4">
        <button onClick={save} disabled={saving} className="btn-primary">{saving ? "Сохраняем..." : "Сохранить настройки"}</button>
        {saved && <span className="text-sm font-semibold text-pine">✓ Сохранено</span>}
      </div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-6">
      <h2 className="font-display text-lg font-bold">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}
function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input className="input" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
function Area({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="label">{label}</label>
      <textarea rows={3} className="input resize-none" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
