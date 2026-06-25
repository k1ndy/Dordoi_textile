"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const supabase = createClient();
        const { error } = await supabase!.auth.signInWithPassword({ email, password });
        if (error) throw new Error("Неверный email или пароль");
      } else {
        const res = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: email, password }),
        });
        if (!res.ok) throw new Error("Неверный логин или пароль");
      }
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка входа");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-cream px-5">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-cream font-display text-lg font-bold">Д</span>
          <span className="font-display text-xl font-bold">Админ-панель</span>
        </div>
        <form onSubmit={onSubmit} className="card p-7">
          <h1 className="font-display text-2xl font-bold">Вход</h1>
          <p className="mt-1 text-sm text-ink-muted">
            {isSupabaseConfigured ? "Войдите по email и паролю." : "Демо-режим: логин admin, пароль admin123."}
          </p>

          <div className="mt-5">
            <label className="label">{isSupabaseConfigured ? "Email" : "Логин"}</label>
            <input
              className="input"
              type={isSupabaseConfigured ? "email" : "text"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isSupabaseConfigured ? "admin@example.com" : "admin"}
              required
              autoFocus
            />
          </div>
          <div className="mt-4">
            <label className="label">Пароль</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="mt-4 text-sm font-medium text-clay">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary mt-6 w-full">
            {loading ? "Входим..." : "Войти"}
          </button>
        </form>
        <a href="/" className="mt-4 block text-center text-sm text-ink-muted hover:text-ink">← На сайт</a>
      </div>
    </div>
  );
}
