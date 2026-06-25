import { NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import type { LeadType } from "@/lib/types";
import { LEAD_COLUMN_FIELDS, LEAD_TYPE_LABEL, DETAIL_LABELS } from "@/lib/leads";

// Простой in-memory rate-limit (на инстанс) — базовая защита от спама.
const hits = new Map<string, { count: number; ts: number }>();
const WINDOW = 60_000;
const MAX = 5;

function rateLimited(ip: string) {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.ts > WINDOW) {
    hits.set(ip, { count: 1, ts: now });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX;
}

const VALID_TYPES: LeadType[] = [
  "retail_order", "wholesale_request", "large_wholesale_request",
  "marketplace_seller_request", "manufacturing_request", "general_contact",
];

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";

/* eslint-disable @typescript-eslint/no-explicit-any */
async function notifyTelegram(payload: any, details: Record<string, string>) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const t = payload.type as LeadType;
  const detailLines = Object.entries(details).map(
    ([k, v]) => `${DETAIL_LABELS[k] ?? k}: ${v}`
  );
  const lines = [
    `<b>Новая заявка с сайта Dordoi Textile</b>`,
    ``,
    `Тип: ${LEAD_TYPE_LABEL[t] ?? t}`,
    payload.name && `Клиент: ${payload.name}`,
    payload.company && `Компания: ${payload.company}`,
    (payload.country || payload.city) && `📍 ${[payload.country, payload.city].filter(Boolean).join(", ")}`,
    payload.product && `Товар: ${payload.product}`,
    payload.category && `Категория: ${payload.category}`,
    payload.quantity && `Количество: ${payload.quantity}`,
    payload.budget && `Бюджет: ${payload.budget}`,
    ...detailLines,
    payload.phone && `Контакт: ${payload.phone}`,
    payload.messenger && `Мессенджер: ${payload.messenger}`,
    payload.comment && `Комментарий: ${payload.comment}`,
  ].filter(Boolean);

  const phoneDigits = String(payload.phone ?? "").replace(/[^\d]/g, "");
  const buttons: { text: string; url: string }[][] = [];
  if (phoneDigits) buttons.push([{ text: "💬 Написать клиенту", url: `https://wa.me/${phoneDigits}` }]);
  if (SITE_URL) buttons.push([{ text: "📋 Открыть в админке", url: `${SITE_URL}/admin/leads` }]);

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: lines.join("\n"),
        parse_mode: "HTML",
        disable_web_page_preview: true,
        ...(buttons.length ? { reply_markup: { inline_keyboard: buttons } } : {}),
      }),
    });
  } catch {
    /* уведомление не критично */
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Слишком много заявок. Попробуйте позже." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Некорректные данные" }, { status: 400 });
  }

  if (body.website) return NextResponse.json({ ok: true }); // honeypot

  const type = body.type as LeadType;
  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: "Некорректный тип заявки" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim().slice(0, 120);
  const phone = String(body.phone ?? "").trim().slice(0, 40);
  if (!name) return NextResponse.json({ error: "Укажите имя" }, { status: 400 });
  if (phone.replace(/[^\d]/g, "").length < 6) {
    return NextResponse.json({ error: "Укажите корректный телефон" }, { status: 400 });
  }

  const s = (v: unknown) => (v == null || v === "" ? null : String(v).slice(0, 1000));

  // Разделяем известные колонки и сценарные доп-поля (details).
  const details: Record<string, string> = {};
  for (const [k, v] of Object.entries(body)) {
    if (k === "type" || k === "website" || k === "status") continue;
    if (LEAD_COLUMN_FIELDS.has(k)) continue;
    if (v === "" || v == null || v === false) continue;
    details[k] = v === true ? "Да" : String(v).slice(0, 500);
  }

  const lead = {
    type,
    status: "new",
    name,
    phone,
    messenger: s(body.messenger),
    company: s(body.company),
    country: s(body.country),
    city: s(body.city),
    product: s(body.product),
    category: s(body.category),
    size: s(body.size),
    color: s(body.color),
    quantity: s(body.quantity),
    budget: s(body.budget),
    comment: s(body.comment),
    details,
  };

  const sb = createServiceSupabase();
  if (sb) {
    const { error } = await sb.from("leads").insert(lead);
    if (error) {
      console.error("Lead insert error:", error.message);
      // Не теряем заявку: всё равно отправляем уведомление в Telegram.
    }
  } else {
    console.log("📥 Новая заявка (демо-режим):", lead);
  }

  await notifyTelegram(lead, details);

  return NextResponse.json({ ok: true });
}
