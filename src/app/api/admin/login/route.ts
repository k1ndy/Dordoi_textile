import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

// Демо-вход (используется только когда Supabase НЕ настроен).
// Логин/пароль задаются через ADMIN_USER / ADMIN_PASS (по умолчанию admin / admin123).
export async function POST(req: Request) {
  if (isSupabaseConfigured) {
    return NextResponse.json({ error: "Используйте вход через Supabase" }, { status: 400 });
  }

  const { username, password } = await req.json().catch(() => ({}));
  const u = process.env.ADMIN_USER || "admin";
  const p = process.env.ADMIN_PASS || "admin123";

  if (username !== u || password !== p) {
    return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_demo", "1", {
    httpOnly: true,
    sameSite: "lax",
    // Демо-cookie работает и по http (например, localhost). В боевом режиме
    // используйте Supabase Auth — он управляет своими secure-cookie.
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 8, // 8 часов
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_demo", "", { path: "/", maxAge: 0 });
  return res;
}
