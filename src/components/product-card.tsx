"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product, SiteSettings } from "@/lib/types";
import { useSite } from "./providers";
import { waLink } from "@/lib/links";
import { WhatsAppIcon } from "./icons";

export function ProductCard({ product, settings }: { product: Product; settings: SiteSettings }) {
  const { t, price } = useSite();
  const href = `/product/${product.slug}`;
  const waText = `Здравствуйте! Хочу узнать цену на «${product.title}» с сайта Dordoy Textile.`;

  // Тизерная цена «от» = минимальная (оптовая) цена. Точная цена — на странице товара
  // в зависимости от сценария. Розничную и оптовую цену вместе НЕ показываем.
  const fromPrice = product.priceWholesale || product.priceRetail;

  return (
    <div className="card group flex flex-col overflow-hidden transition hover:shadow-lift">
      <Link href={href} className="relative block aspect-[4/5] overflow-hidden bg-cream-deep">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isNew && <span className="rounded-full bg-pine px-2.5 py-1 text-[11px] font-semibold text-cream">{t("common.new")}</span>}
          {product.isHit && <span className="rounded-full bg-clay px-2.5 py-1 text-[11px] font-semibold text-cream">{t("common.hit")}</span>}
        </div>
        {!product.inStock && (
          <span className="absolute right-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-[11px] font-semibold text-cream">
            {t("common.outOfStock")}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={href} className="line-clamp-2 font-semibold leading-snug hover:text-clay">
          {product.title}
        </Link>
        {product.material && <p className="mt-1 text-xs text-ink-muted">Ткань: {product.material}</p>}

        <div className="mt-2 flex flex-wrap gap-1.5">
          {product.sizes.slice(0, 6).map((s) => (
            <span key={s} className="rounded border border-line px-1.5 py-0.5 text-[10px] font-medium text-ink-soft">{s}</span>
          ))}
        </div>
        {product.colors.length > 0 && (
          <p className="mt-2 line-clamp-1 text-xs text-ink-muted">Цвета: {product.colors.join(", ")}</p>
        )}

        <div className="mt-auto pt-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-ink-muted">Цена</p>
              <p className="font-display text-xl font-bold text-ink">от {price(fromPrice)}</p>
            </div>
            <p className="rounded-full bg-cream-deep px-2.5 py-1 text-[11px] font-semibold text-ink-soft">
              Опт от {product.minWholesale} шт
            </p>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link href={href} className="btn-primary !px-3 !py-2 text-xs">Узнать цену</Link>
            <a href={waLink(settings.whatsapp, waText)} target="_blank" rel="noopener noreferrer" className="btn-wa !px-3 !py-2 text-xs">
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp
            </a>
          </div>
          <Link href={href} className="mt-2 block text-center text-xs font-semibold text-ink-muted hover:text-clay">
            Подробнее →
          </Link>
        </div>
      </div>
    </div>
  );
}
