"use client";

import { useCart } from "./cart-provider";
import { CartIcon } from "./icons";

export function CartButton({ className = "" }: { className?: string }) {
  const { count, open } = useCart();
  return (
    <button
      onClick={open}
      aria-label="Корзина"
      className={`relative grid h-10 w-10 place-items-center rounded-full border border-ink/15 transition hover:border-ink/40 ${className}`}
    >
      <CartIcon className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-clay px-1 text-[11px] font-bold text-cream">
          {count}
        </span>
      )}
    </button>
  );
}
