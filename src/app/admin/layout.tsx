import { AdminSidebar } from "@/components/admin/sidebar";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata = {
  title: "Админ-панель",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-cream-deep/40 lg:flex-row">
      <AdminSidebar />
      <div className="flex-1 overflow-x-hidden">
        {!isSupabaseConfigured && (
          <div className="border-b border-saffron/40 bg-saffron/15 px-5 py-2.5 text-center text-sm text-ink">
            ⚠️ Демо-режим: Supabase не подключён. Данные — тестовые, изменения не сохраняются.
            Подключите Supabase в <code className="font-semibold">.env.local</code> для полноценной работы.
          </div>
        )}
        <div className="p-5 sm:p-8">{children}</div>
      </div>
    </div>
  );
}
