import { NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";
import type { LeadType } from "@/lib/types";

// Простой in-memory rate-limit (на инстанс) — базовая защита от спама.
const hits = new Map<string, { count: number; ts: number }>();
const WINDOW = 60_000; // 1 минута
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

const VALID_TYPES: LeadType[] = ["retail", "wholesale", "seller"];

const TYPE_LABEL: Record<LeadType, string> = {
  retail: "🛍️ Розничный заказ",
  wholesale: "📦 Оптовая заявка",
  seller: "🏭 Заявка от селлера",
};

async function notifyTelegram(lead: Record<string, unknown>) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const t = lead.type as LeadType;
  const lines = [
    `<b>${TYPE_LABEL[t] ?? "Новая заявка"}</b>`,
    lead.name && `👤 Имя: ${lead.name}`,
    lead.phone && `📞 Телефон: ${lead.phone}`,
    lead.messenger && `💬 Мессенджер: ${lead.messenger}`,
    lead.company && `🏢 Компания: ${lead.company}`,
    (lead.country || lead.city) && `📍 ${[lead.country, lead.city].filter(Boolean).join(", ")}`,
    lead.product && `🧥 Товар: ${lead.product}`,
    lead.category && `🗂️ Категория: ${lead.category}`,
    lead.size && `📏 Размер: ${lead.size}`,
    lead.color && `🎨 Цвет: ${lead.color}`,
    lead.quantity && `🔢 Количество: ${lead.quantity}`,
    lead.budget && `💰 Бюджет: ${lead.budget}`,
    lead.sellChannel && `🛒 Где продаёт: ${lead.sellChannel}`,
    lead.needBranding && `🏷️ Нужен отшив под бренд`,
    lead.needLabelPack && `📦 Нужны бирка / упаковка`,
    lead.comment && `📝 Комментарий: ${lead.comment}`,
  ].filter(Boolean);

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: lines.join("\n"), parse_mode: "HTML" }),
    });
  } catch {
    // уведомление не критично для сохранения заявки
  }
}

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

  // honeypot
  if (body.website) return NextResponse.json({ ok: true });

  const type = body.type as LeadType;
  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: "Некорректный тип заявки" }, { status: 400 });
  }
  const name = String(body.name ?? "").trim().slice(0, 120);
  const phone = String(body.phone ?? "").trim().slice(0, 40);
  if (!name || !phone) {
    return NextResponse.json({ error: "Укажите имя и телефон" }, { status: 400 });
  }

  const s = (v: unknown) => (v == null ? null : String(v).slice(0, 1000));
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
    sell_channel: s(body.sellChannel),
    need_branding: Boolean(body.needBranding),
    need_label_pack: Boolean(body.needLabelPack),
    comment: s(body.comment),
  };

  // Сохранение в Supabase (если настроен)
  const sb = createServiceSupabase();
  if (sb) {
    const { error } = await sb.from("leads").insert(lead);
    if (error) {
      console.error("Lead insert error:", error.message);
      // продолжаем — хотя бы отправим уведомление
    }
  } else {
    console.log("📥 Новая заявка (Supabase не настроен, демо-режим):", lead);
  }

  await notifyTelegram(body);

  return NextResponse.json({ ok: true });
}
