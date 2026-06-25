"use client";

import { useState } from "react";
import type { Product, SiteSettings } from "@/lib/types";
import { useCart } from "./cart-provider";
import { waLink, tgLink } from "@/lib/links";
import { WhatsAppIcon, TelegramIcon, CartIcon, CheckIcon } from "./icons";

export function ProductBuyBox({ product, settings }: { product: Product; settings: SiteSettings }) {
  const { add } = useCart();
  const [size, setSize] = useState<string>(product.sizes[0] ?? "");
  const [color, setColor] = useState<string>(product.colors[0] ?? "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const waText = `Здравствуйте! Интересует товар «${product.title}»${size ? `, размер ${size}` : ""}${color ? `, цвет ${color}` : ""} с сайта ${settings.shopName}.`;

  function addToCart() {
    add(
      {
        productId: product.id,
        slug: product.slug,
        title: product.title,
        image: product.images[0] ?? "",
        priceRetail: product.priceRetail,
        priceWholesale: product.priceWholesale,
        minWholesale: product.minWholesale,
        size: size || undefined,
        color: color || undefined,
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="space-y-5">
      {product.sizes.length > 0 && (
        <div>
          <p className="label">Размер</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`rounded-lg border px-3.5 py-1.5 text-sm font-medium transition ${
                  size === s ? "border-clay bg-clay text-cream" : "border-line bg-cream-card text-ink-soft hover:border-ink/40"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.colors.length > 0 && (
        <div>
          <p className="label">Цвет</p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                  color === c ? "border-clay bg-clay text-cream" : "border-line bg-cream-card text-ink-soft hover:border-ink/40"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div>
          <p className="label">Количество</p>
          <div className="flex items-center rounded-xl border border-line">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-4 py-2.5 text-lg text-ink-muted hover:text-ink" aria-label="Меньше">−</button>
            <span className="min-w-10 text-center font-semibold">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} className="px-4 py-2.5 text-lg text-ink-muted hover:text-ink" aria-label="Больше">+</button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button onClick={addToCart} className={`btn ${added ? "bg-pine text-cream" : "btn-primary"}`}>
          {added ? <><CheckIcon className="h-4 w-4" /> Добавлено</> : <><CartIcon className="h-4 w-4" /> В корзину</>}
        </button>
        <a href="#order" className="btn-dark">Быстрый заказ</a>
        <a href={waLink(settings.whatsapp, waText)} target="_blank" rel="noopener noreferrer" className="btn-wa">
          <WhatsAppIcon className="h-4 w-4" /> WhatsApp
        </a>
        <a href={tgLink(settings.telegram)} target="_blank" rel="noopener noreferrer" className="btn-tg">
          <TelegramIcon className="h-4 w-4" /> Telegram
        </a>
      </div>
    </div>
  );
}
