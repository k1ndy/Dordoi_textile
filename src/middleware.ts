import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./lib/supabase/config";

// Строгий Content-Security-Policy с одноразовым nonce на каждый запрос.
// 'strict-dynamic' + nonce исключают необходимость 'unsafe-inline' в script-src.
function buildCsp(nonce: string) {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    // inline-стили нужны next/image (fill) и Tailwind-утилитам; для стилей это безопасно
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "frame-src 'self' https://www.openstreetmap.org https://openstreetmap.org",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

export async function middleware(req: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  const csp = buildCsp(nonce);

  // Прокидываем nonce и CSP в запрос — Next.js подставит nonce в свои <script>.
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const res = NextResponse.next({ request: { headers: requestHeaders } });
  res.headers.set("Content-Security-Policy", csp);

  // ── Защита админки ──────────────────────────────────────────────
  const { pathname } = req.nextUrl;
  const guarded = pathname.startsWith("/admin") && pathname !== "/admin/login";
  if (!guarded) return res;

  const loginUrl = new URL("/admin/login", req.url);

  if (!isSupabaseConfigured) {
    return req.cookies.get("admin_demo")?.value === "1" ? res : NextResponse.redirect(loginUrl);
  }

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
  return data.user ? res : NextResponse.redirect(loginUrl);
}

export const config = {
  // CSP на все HTML-ответы; исключаем статические ассеты и оптимизатор картинок.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
