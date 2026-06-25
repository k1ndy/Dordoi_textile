"use client";

import { useState } from "react";
import type { LeadType } from "@/lib/types";
import { CheckIcon } from "./icons";

const COUNTRIES = ["Кыргызстан", "Казахстан", "Россия", "Узбекистан", "Таджикистан", "Беларусь", "Другая"];

interface Props {
  type: LeadType;
  productName?: string; // предзаполнение для розничного заказа
  compact?: boolean;
}

export function LeadForm({ type, productName, compact }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    // honeypot — если заполнено, это бот
    if (fd.get("website")) return;

    const payload: Record<string, unknown> = { type };
    fd.forEach((value, key) => {
      if (key === "website") return;
      if (key === "needBranding" || key === "needLabelPack") payload[key] = value === "on";
      else payload[key] = value;
    });

    if (!payload.name || !payload.phone) {
      setStatus("error");
      setErrorMsg("Укажите имя и телефон.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Ошибка отправки");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMsg("Не удалось отправить. Попробуйте ещё раз или напишите в WhatsApp.");
    }
  }

  if (status === "success") {
    return (
      <div className="card flex flex-col items-center gap-3 p-8 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-pine text-cream">
          <CheckIcon className="h-7 w-7" />
        </span>
        <h3 className="font-display text-xl font-bold">Заявка отправлена!</h3>
        <p className="max-w-sm text-sm text-ink-muted">
          Мы свяжемся с вами в ближайшее время. Для быстрого ответа напишите нам в WhatsApp или Telegram.
        </p>
        <button onClick={() => setStatus("idle")} className="btn-ghost mt-2">Отправить ещё одну</button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
      {/* honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <Field label="Имя *" name="name" placeholder="Ваше имя" required />
      <Field label="Телефон *" name="phone" type="tel" placeholder="+996 ..." required />

      {type === "seller" && (
        <Field label="Компания / магазин" name="company" placeholder="Название" />
      )}

      <Field label="WhatsApp / Telegram" name="messenger" placeholder="@username или номер" />

      <div>
        <label className="label">Страна</label>
        <select name="country" className="input" defaultValue="Кыргызстан">
          {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      <Field label="Город" name="city" placeholder="Город" />

      {type === "retail" && (
        <>
          <Field label="Товар" name="product" placeholder="Что интересует" defaultValue={productName} />
          <Field label="Размер" name="size" placeholder="M / L / 104..." />
          <Field label="Цвет" name="color" placeholder="Чёрный, белый..." />
          <Field label="Количество" name="quantity" placeholder="Сколько штук" />
        </>
      )}

      {type === "wholesale" && (
        <>
          <Field label="Категория товара" name="category" placeholder="Футболки, худи..." />
          <Field label="Примерное количество" name="quantity" placeholder="напр. 500 шт" />
          <Field label="Бюджет" name="budget" placeholder="напр. 200 000 сом" />
        </>
      )}

      {type === "seller" && (
        <>
          <div className="sm:col-span-2">
            <label className="label">Где продаёте</label>
            <select name="sellChannel" className="input" defaultValue="">
              <option value="" disabled>Выберите...</option>
              <option>Маркетплейс (WB, Ozon, Kaspi и др.)</option>
              <option>Instagram</option>
              <option>Telegram</option>
              <option>Офлайн-магазин</option>
              <option>Другое</option>
            </select>
          </div>
          <Field label="Какой товар нужен" name="product" placeholder="Опишите ассортимент" />
          <Field label="Примерное количество" name="quantity" placeholder="напр. 1000+ шт" />
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" name="needBranding" className="h-4 w-4 accent-clay" />
            Нужен отшив под мой бренд
          </label>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" name="needLabelPack" className="h-4 w-4 accent-clay" />
            Нужны свой логотип / бирка / упаковка
          </label>
        </>
      )}

      <div className="sm:col-span-2">
        <label className="label">Комментарий</label>
        <textarea name="comment" rows={3} className="input resize-none" placeholder="Дополнительная информация" />
      </div>

      {status === "error" && (
        <p className="text-sm font-medium text-clay sm:col-span-2">{errorMsg}</p>
      )}

      <div className="sm:col-span-2">
        <button type="submit" disabled={status === "loading"} className="btn-primary w-full sm:w-auto">
          {status === "loading" ? "Отправляем..." : "Отправить заявку"}
        </button>
        <p className="mt-3 text-xs text-ink-muted">
          Нажимая «Отправить», вы соглашаетесь на обработку контактных данных для связи по заявке.
        </p>
      </div>
    </form>
  );
}

function Field({
  label, name, type = "text", placeholder, required, defaultValue,
}: {
  label: string; name: string; type?: string; placeholder?: string; required?: boolean; defaultValue?: string;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        className="input"
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
      />
    </div>
  );
}
