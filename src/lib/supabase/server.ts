import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config";

// Серверный клиент с поддержкой cookie (для проверки сессии админа).
export function createServerSupabase() {
  if (!isSupabaseConfigured) return null;
  const cookieStore = cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Вызвано из Server Component — игнорируем (обновит middleware).
        }
      },
    },
  });
}

// Клиент с service role — ТОЛЬКО для серверных API-роутов (запись заявок и т.п.).
export function createServiceSupabase() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return null;
  return createServerClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    cookies: { getAll: () => [], setAll: () => {} },
  });
}
