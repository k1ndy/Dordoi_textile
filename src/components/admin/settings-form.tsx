"use client";

import Image from "next/image";
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
        hero_images: s.heroImages,
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
        <div>
          <label className="label">Фото в шапке (4 шт)</label>
          <p className="-mt-1 mb-2 text-xs text-ink-muted">Вставьте ссылку на фото или загрузите файл. Порядок: слева сверху → справа снизу.</p>
          <HeroImagesEditor value={s.heroImages} onChange={(imgs) => set({ heroImages: imgs })} />
        </div>
      </Group>

      <div className="flex items-center gap-4">
        <button onClick={save} disabled={saving} className="btn-primary">{saving ? "Сохраняем..." : "Сохранить настройки"}</button>
        {saved && <span className="text-sm font-semibold text-pine">✓ Сохранено</span>}
      </div>
    </div>
  );
}

function HeroImagesEditor({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [uploading, setUploading] = useState<number | null>(null);
  const slots = Array.from({ length: 4 }, (_, i) => value?.[i] ?? "");

  function setSlot(i: number, url: string) {
    const next = [...slots];
    next[i] = url;
    onChange(next);
  }

  async function upload(i: number, file: File) {
    if (!isSupabaseConfigured) {
      alert("Загрузка файлов доступна после подключения Supabase. Пока вставьте ссылку на фото.");
      return;
    }
    setUploading(i);
    const sb = createClient()!;
    const path = `hero/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const { error } = await sb.storage.from("products").upload(path, file, { upsert: false });
    if (!error) {
      const { data } = sb.storage.from("products").getPublicUrl(path);
      setSlot(i, data.publicUrl);
    } else {
      alert("Не удалось загрузить фото: " + error.message);
    }
    setUploading(null);
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {slots.map((src, i) => (
        <div key={i} className="space-y-2">
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-line bg-cream-deep">
            {src ? (
              <Image src={src} alt={`Фото ${i + 1}`} fill sizes="160px" className="object-cover" unoptimized />
            ) : (
              <div className="grid h-full place-items-center text-xs text-ink-muted">Фото {i + 1}</div>
            )}
          </div>
          <input className="input !py-1.5 text-xs" placeholder="Ссылка на фото" value={src} onChange={(e) => setSlot(i, e.target.value)} />
          <label className="btn-ghost w-full cursor-pointer !py-1.5 text-xs">
            {uploading === i ? "Загрузка..." : "Загрузить"}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(i, f); }} />
          </label>
        </div>
      ))}
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
