-- Фото в шапке главной страницы (управляются из админки → Настройки).
-- Запустите этот скрипт в Supabase → SQL Editor.
alter table public.settings
  add column if not exists hero_images text[] default '{}';
