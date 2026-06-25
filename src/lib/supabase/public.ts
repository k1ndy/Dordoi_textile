import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./config";

// Бескуковый серверный клиент для ПУБЛИЧНЫХ чтений (товары, категории, настройки).
// Важно: не использует cookies() → страницы можно статически кэшировать (ISR),
// а не рендерить динамически на каждый запрос. RLS отдаёт только видимые записи.
export function createPublicSupabase() {
  if (!isSupabaseConfigured) return null;
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
