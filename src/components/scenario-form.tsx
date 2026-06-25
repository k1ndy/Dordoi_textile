"use client";

import { useState } from "react";
import type { LeadType } from "@/lib/types";
import type { FieldDef } from "@/lib/leads";
import { CheckIcon } from "./icons";

interface Props {
  leadType: LeadType;
  fields: FieldDef[];
  submitLabel: string;
  hidden?: Record<string, string>; // предзаполненный контекст (товар и т.п.)
  compact?: boolean;
}

export function ScenarioForm({ leadType, fields, submitLabel, hidden, compact }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get("website")) return; // honeypot

    const values: Record<string, unknown> = { type: leadType, ...hidden };
    for (const f of fields) {
      if (f.type === "checkbox") values[f.name] = fd.get(f.name) === "on";
      else values[f.name] = (fd.get(f.name) ?? "").toString().trim();
    }

    // Валидация
    for (const f of fields) {
      if (f.required && f.type !== "checkbox" && !values[f.name]) {
        setStatus("error");
        setError(`Заполните поле «${f.label}».`);
        return;
      }
    }
    const phoneField = fields.find((f) => f.type === "tel");
    if (phoneField) {
      const digits = String(values[phoneField.name] ?? "").replace(/[^\d]/g, "");
      if (digits.length < 6) {
        setStatus("error");
        setError("Укажите корректный телефон.");
        return;
      }
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Ошибка отправки");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Не удалось отправить. Напишите нам в WhatsApp.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl2 border border-pine/30 bg-pine/5 p-8 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-pine text-cream"><CheckIcon className="h-7 w-7" /></span>
        <h3 className="font-display text-xl font-bold">Заявка отправлена!</h3>
        <p className="max-w-sm text-sm text-ink-muted">Менеджер свяжется с вами в ближайшее время. Для быстрого ответа напишите нам в WhatsApp или Telegram.</p>
        <button onClick={() => setStatus("idle")} className="btn-ghost mt-2">Отправить ещё одну</button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {fields.map((f) => (
        <div key={f.name} className={f.full || f.type === "textarea" ? "sm:col-span-2" : ""}>
          {f.type === "checkbox" ? (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name={f.name} className="h-4 w-4 accent-clay" /> {f.label}
            </label>
          ) : (
            <>
              <label className="label">{f.label}{f.required ? " *" : ""}</label>
              {f.type === "textarea" ? (
                <textarea name={f.name} rows={3} className="input resize-none" placeholder={f.placeholder} />
              ) : f.type === "select" ? (
                <select name={f.name} className="input" defaultValue={f.options?.[0] ?? ""}>
                  {!f.options?.length && <option value="">—</option>}
                  {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input name={f.name} type={f.type} className="input" placeholder={f.placeholder} />
              )}
            </>
          )}
        </div>
      ))}

      {status === "error" && <p className="text-sm font-medium text-clay sm:col-span-2">{error}</p>}

      <div className="sm:col-span-2">
        <button type="submit" disabled={status === "loading"} className="btn-primary w-full sm:w-auto">
          {status === "loading" ? "Отправляем..." : submitLabel}
        </button>
        <p className="mt-3 text-xs text-ink-muted">Нажимая кнопку, вы соглашаетесь на обработку контактных данных для связи по заявке.</p>
      </div>
    </form>
  );
}
