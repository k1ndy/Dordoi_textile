"use client";

import { useSite } from "./providers";
import { LOCALES } from "@/lib/i18n";
import { CURRENCIES, type CurrencyCode } from "@/lib/currency";

export function LocaleSwitcher() {
  const { locale, setLocale } = useSite();
  return (
    <label className="relative inline-flex items-center">
      <select
        aria-label="Язык"
        value={locale}
        onChange={(e) => setLocale(e.target.value as never)}
        className="cursor-pointer appearance-none rounded-full border border-ink/15 bg-cream-card py-1.5 pl-3 pr-7 text-xs font-semibold text-ink outline-none hover:border-ink/40"
      >
        {LOCALES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.flag} {l.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 text-[10px] text-ink-muted">▾</span>
    </label>
  );
}

export function CurrencySwitcher() {
  const { currency, setCurrency } = useSite();
  return (
    <label className="relative inline-flex items-center">
      <select
        aria-label="Валюта"
        value={currency}
        onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
        className="cursor-pointer appearance-none rounded-full border border-ink/15 bg-cream-card py-1.5 pl-3 pr-7 text-xs font-semibold text-ink outline-none hover:border-ink/40"
      >
        {Object.values(CURRENCIES).map((c) => (
          <option key={c.code} value={c.code}>
            {c.code} · {c.symbol}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 text-[10px] text-ink-muted">▾</span>
    </label>
  );
}
