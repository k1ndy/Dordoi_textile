"use client";

import { useSite } from "./providers";

export function Price({ amount, className }: { amount: number; className?: string }) {
  const { price } = useSite();
  return <span className={className}>{price(amount)}</span>;
}
