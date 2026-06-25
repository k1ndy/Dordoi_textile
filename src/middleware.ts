import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./lib/supabase/config";

// Защита всех маршрутов /admin/* — публичная часть и админка строго разделены.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  const loginUrl = new URL("/admin/login", req.url);

  // Демо-режим (Supabase не настроен): доступ по cookie, выставляемой /api/admin/login
  if (!isSupabaseConfigured) {
    const demo = req.cookies.get("admin_demo")?.value;
    return demo === "1" ? NextResponse.next() : NextResponse.redirect(loginUrl);
  }

  // Боевой режим: проверка сессии Supabase
  let res = NextResponse.next({ request: req });
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        cookiesToSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  if (!data.user) return NextResponse.redirect(loginUrl);
  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
