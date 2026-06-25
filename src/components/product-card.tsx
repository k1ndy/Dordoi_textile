"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product, SiteSettings } from "@/lib/types";
import { useState } from "react";
import { useSite } from "./providers";
import { useCart } from "./cart-provider";
import { waLink } from "@/lib/links";
import { WhatsAppIcon, CartIcon, CheckIcon } from "./icons";

export function ProductCard({ product, settings }: { product: Product; settings: SiteSettings }) {
  const { t, price } = useSite();
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const href = `/product/${product.slug}`;

  function quickAdd() {
    add({
      productId: product.id,
      slug: product.slug,
      title: product.title,
      image: product.images[0] ?? "",
      priceRetail: product.priceRetail,
      priceWholesale: product.priceWholesale,
      minWholesale: product.minWholesale,
      size: product.sizes[0],
      color: product.colors[0],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }
  const waText = `Здравствуйте! Интересует товар «${product.title}» с сайта Dordoy Textile.`;

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
        <p className="mt-1 line-clamp-1 text-xs text-ink-muted">{product.shortDescription}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.sizes.slice(0, 5).map((s) => (
            <span key={s} className="rounded border border-line px-1.5 py-0.5 text-[10px] font-medium text-ink-soft">{s}</span>
          ))}
        </div>

        <div className="mt-auto pt-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-ink-muted">{t("common.retail")}</p>
              <p className="font-display text-lg font-bold text-ink">{price(product.priceRetail)}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wide text-clay">{t("common.wholesale")}</p>
              <p className="font-display text-sm font-bold text-clay">
                {price(product.priceWholesale)}
              </p>
              <p className="text-[10px] text-ink-muted">{t("common.minOrder")}: {product.minWholesale} шт</p>
            </div>
          </div>

          <button
            onClick={quickAdd}
            className={`btn mt-3 w-full !px-3 !py-2 text-xs ${added ? "bg-pine text-cream" : "btn-primary"}`}
          >
            {added ? <><CheckIcon className="h-4 w-4" /> Добавлено</> : <><CartIcon className="h-4 w-4" /> В корзину</>}
          </button>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Link href={`${href}#order`} className="btn-dark !px-3 !py-2 text-xs">{t("cta.order")}</Link>
            <a href={waLink(settings.whatsapp, waText)} target="_blank" rel="noopener noreferrer" className="btn-wa !px-3 !py-2 text-xs">
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
