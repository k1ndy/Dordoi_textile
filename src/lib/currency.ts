// Базовая валюта — сом (KGS). Курсы можно вынести в админку/БД позже.
export type CurrencyCode = "KGS" | "RUB" | "KZT" | "USD";

export interface CurrencyInfo {
  code: CurrencyCode;
  label: string;
  symbol: string;
  rateFromKGS: number; // сколько единиц валюты в 1 соме
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  KGS: { code: "KGS", label: "Сом", symbol: "сом", rateFromKGS: 1 },
  RUB: { code: "RUB", label: "Рубль", symbol: "₽", rateFromKGS: 0.9 },
  KZT: { code: "KZT", label: "Тенге", symbol: "₸", rateFromKGS: 5.6 },
  USD: { code: "USD", label: "Доллар", symbol: "$", rateFromKGS: 0.0115 },
};

export function formatPrice(amountKGS: number, code: CurrencyCode): string {
  const c = CURRENCIES[code];
  const value = Math.round(amountKGS * c.rateFromKGS);
  const formatted = new Intl.NumberFormat("ru-RU").format(value);
  return code === "USD" ? `${c.symbol}${formatted}` : `${formatted} ${c.symbol}`;
}
