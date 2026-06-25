"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "./cart-provider";
import { useSite } from "./providers";
import { CloseIcon, TrashIcon, WhatsAppIcon, CheckIcon } from "./icons";
import { waLink } from "@/lib/links";

const COUNTRIES = ["Кыргызстан", "Казахстан", "Россия", "Узбекистан", "Таджикистан", "Беларусь", "Другая"];

export function CartDrawer({ whatsapp }: { whatsapp: string }) {
  const { items, isOpen, close, count, subtotal, setQty, remove, clear } = useCart();
  const { price } = useSite();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const itemsText = items
    .map((i) => `• ${i.title}${i.size ? `, р.${i.size}` : ""}${i.color ? `, ${i.color}` : ""} — ${i.qty} шт`)
    .join("\n");

  const waText = `Здравствуйте! Хочу заказать:\n${itemsText}\n\nИтого: ${count} шт.`;

  async function checkout(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("website")) return; // honeypot
    const name = String(fd.get("name") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    if (!name || !phone) {
      setStatus("error");
      setErrorMsg("Укажите имя и телефон.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "retail",
          name,
          phone,
          country: fd.get("country"),
          city: fd.get("city"),
          product: `Заказ из корзины (${count} шт)`,
          quantity: `${count} шт`,
          comment: `Состав заказа:\n${itemsText}${fd.get("comment") ? `\n\nКомментарий: ${fd.get("comment")}` : ""}`,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      clear();
    } catch {
      setStatus("error");
      setErrorMsg("Не удалось отправить. Попробуйте ещё раз или напишите в WhatsApp.");
    }
  }

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-ink/40" onClick={close} />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream shadow-lift">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-xl font-bold">Корзина {count > 0 && `· ${count}`}</h2>
          <button onClick={close} className="grid h-10 w-10 place-items-center rounded-full border border-ink/15" aria-label="Закрыть">
            <CloseIcon />
          </button>
        </div>

        {/* SUCCESS */}
        {status === "success" ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-pine text-cream"><CheckIcon className="h-7 w-7" /></span>
            <h3 className="font-display text-xl font-bold">Заказ отправлен!</h3>
            <p className="max-w-xs text-sm text-ink-muted">Мы свяжемся с вами в ближайшее время для подтверждения и доставки.</p>
            <button onClick={() => { setStatus("idle"); close(); }} className="btn-ghost mt-2">Продолжить покупки</button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <p className="font-display text-lg font-bold">Корзина пуста</p>
            <p className="text-sm text-ink-muted">Добавьте товары из каталога.</p>
            <Link href="/catalog" onClick={close} className="btn-primary mt-2">В каталог</Link>
          </div>
        ) : (
          <>
            {/* ITEMS */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="space-y-3">
                {items.map((i) => (
                  <li key={i.key} className="flex gap-3 rounded-xl border border-line bg-cream-card p-3">
                    <Link href={`/product/${i.slug}`} onClick={close} className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-cream-deep">
                      {i.image && <Image src={i.image} alt={i.title} fill sizes="64px" className="object-cover" />}
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link href={`/product/${i.slug}`} onClick={close} className="line-clamp-2 text-sm font-semibold hover:text-clay">{i.title}</Link>
                      <p className="mt-0.5 text-xs text-ink-muted">
                        {[i.size && `Размер: ${i.size}`, i.color].filter(Boolean).join(" · ") || "—"}
                      </p>
                      <p className="mt-1 text-sm font-bold text-clay">{price(i.priceRetail)}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center rounded-lg border border-line">
                          <button onClick={() => setQty(i.key, i.qty - 1)} className="px-2.5 py-1 text-ink-muted hover:text-ink" aria-label="Меньше">−</button>
                          <span className="min-w-7 text-center text-sm font-semibold">{i.qty}</span>
                          <button onClick={() => setQty(i.key, i.qty + 1)} className="px-2.5 py-1 text-ink-muted hover:text-ink" aria-label="Больше">+</button>
                        </div>
                        <button onClick={() => remove(i.key)} className="grid h-8 w-8 place-items-center rounded-lg text-ink-muted hover:bg-clay/10 hover:text-clay" aria-label="Удалить">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* CHECKOUT FORM */}
              <form onSubmit={checkout} className="mt-5 space-y-3 border-t border-line pt-5">
                <p className="text-sm font-semibold">Оформление заказа</p>
                <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
                <div className="grid grid-cols-2 gap-2">
                  <input name="name" className="input" placeholder="Имя *" required />
                  <input name="phone" type="tel" className="input" placeholder="Телефон *" required />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select name="country" className="input" defaultValue="Кыргызстан">
                    {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  <input name="city" className="input" placeholder="Город" />
                </div>
                <textarea name="comment" rows={2} className="input resize-none" placeholder="Комментарий к заказу" />
                {status === "error" && <p className="text-sm font-medium text-clay">{errorMsg}</p>}
                <button type="submit" disabled={status === "loading"} className="btn-primary w-full">
                  {status === "loading" ? "Отправляем..." : "Отправить заказ"}
                </button>
              </form>
            </div>

            {/* FOOTER */}
            <div className="border-t border-line bg-cream-card px-5 py-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-ink-muted">Итого ({count} шт)</span>
                <span className="font-display text-xl font-bold">{price(subtotal)}</span>
              </div>
              <a href={waLink(whatsapp, waText)} target="_blank" rel="noopener noreferrer" className="btn-wa w-full">
                <WhatsAppIcon className="h-4 w-4" /> Оформить в WhatsApp
              </a>
              <button onClick={clear} className="mt-2 w-full text-center text-xs text-ink-muted hover:text-clay">Очистить корзину</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
