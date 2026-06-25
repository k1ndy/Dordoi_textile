"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { MenuIcon, CloseIcon } from "@/components/icons";

const NAV = [
  { href: "/admin", label: "Дашборд", icon: "📊" },
  { href: "/admin/products", label: "Товары", icon: "🧥" },
  { href: "/admin/categories", label: "Категории", icon: "🗂️" },
  { href: "/admin/leads", label: "Заявки", icon: "📥" },
  { href: "/admin/settings", label: "Настройки", icon: "⚙️" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    if (isSupabaseConfigured) {
      const sb = createClient();
      await sb?.auth.signOut();
    } else {
      await fetch("/api/admin/login", { method: "DELETE" });
    }
    router.push("/admin/login");
    router.refresh();
  }

  const links = (
    <nav className="flex flex-col gap-1">
      {NAV.map((n) => {
        const active = n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
              active ? "bg-clay text-cream" : "text-cream/70 hover:bg-cream/10 hover:text-cream"
            }`}
          >
            <span>{n.icon}</span> {n.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* mobile topbar */}
      <div className="flex items-center justify-between border-b border-cream/10 bg-ink px-4 py-3 text-cream lg:hidden">
        <Link href="/admin" className="flex items-center gap-2 font-display font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-clay">Д</span> Админ
        </Link>
        <button onClick={() => setOpen(true)} aria-label="Меню"><MenuIcon /></button>
      </div>

      {/* desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-ink p-5 text-cream lg:flex">
        <Link href="/admin" className="mb-8 flex items-center gap-2 font-display text-lg font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-clay">Д</span> Админ-панель
        </Link>
        {links}
        <div className="mt-auto space-y-2 pt-6">
          <Link href="/" className="block rounded-xl px-4 py-2.5 text-sm text-cream/70 hover:bg-cream/10 hover:text-cream">↗ На сайт</Link>
          <button onClick={logout} className="block w-full rounded-xl px-4 py-2.5 text-left text-sm text-cream/70 hover:bg-cream/10 hover:text-cream">⎋ Выйти</button>
        </div>
      </aside>

      {/* mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col bg-ink p-5 text-cream">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-display font-bold">Админ-панель</span>
              <button onClick={() => setOpen(false)}><CloseIcon /></button>
            </div>
            {links}
            <div className="mt-auto space-y-2 pt-6">
              <Link href="/" className="block rounded-xl px-4 py-2.5 text-sm text-cream/70 hover:bg-cream/10">↗ На сайт</Link>
              <button onClick={logout} className="block w-full rounded-xl px-4 py-2.5 text-left text-sm text-cream/70 hover:bg-cream/10">⎋ Выйти</button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
