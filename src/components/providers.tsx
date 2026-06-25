"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CurrencyCode } from "@/lib/currency";
import { formatPrice } from "@/lib/currency";
import type { Locale } from "@/lib/i18n";
import { translate } from "@/lib/i18n";

interface SiteContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  t: (key: string) => string;
  price: (amountKGS: number) => string;
}

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ru");
  const [currency, setCurrencyState] = useState<CurrencyCode>("KGS");

  useEffect(() => {
    const l = localStorage.getItem("locale") as Locale | null;
    const c = localStorage.getItem("currency") as CurrencyCode | null;
    if (l) setLocaleState(l);
    if (c) setCurrencyState(c);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("locale", l);
  }, []);

  const setCurrency = useCallback((c: CurrencyCode) => {
    setCurrencyState(c);
    localStorage.setItem("currency", c);
  }, []);

  const value = useMemo<SiteContextValue>(
    () => ({
      locale,
      setLocale,
      currency,
      setCurrency,
      t: (key: string) => translate(locale, key),
      price: (amountKGS: number) => formatPrice(amountKGS, currency),
    }),
    [locale, currency, setLocale, setCurrency]
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used within SiteProvider");
  return ctx;
}
