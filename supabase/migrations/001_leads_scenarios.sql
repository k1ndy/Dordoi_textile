-- ============================================================================
--  Миграция: новая логика заявок (сценарии клиента)
--  Запустите в Supabase → SQL Editor ОДИН РАЗ.
--  Безопасна для повторного запуска (idempotent).
-- ============================================================================

-- 1) Снимаем старые ограничения на type/status (расширяем набор значений)
alter table public.leads drop constraint if exists leads_type_check;
alter table public.leads drop constraint if exists leads_status_check;

-- 2) Новые колонки
alter table public.leads add column if not exists details jsonb default '{}'::jsonb;
alter table public.leads add column if not exists manager text;
alter table public.leads add column if not exists manager_notes text;
alter table public.leads add column if not exists last_contact_at timestamptz;

-- 3) Переносим старые значения типов/статусов на новые (если есть старые данные)
update public.leads set type = 'retail_order'              where type = 'retail';
update public.leads set type = 'wholesale_request'         where type = 'wholesale';
update public.leads set type = 'marketplace_seller_request' where type = 'seller';
update public.leads set status = 'processing' where status = 'in_progress';
update public.leads set status = 'completed'  where status = 'done';

-- 4) Новые ограничения (мягкие — на корректность значений)
alter table public.leads
  add constraint leads_type_check check (type in (
    'retail_order','wholesale_request','large_wholesale_request',
    'marketplace_seller_request','manufacturing_request','general_contact'
  ));
alter table public.leads
  add constraint leads_status_check check (status in (
    'new','contacted','processing','quote_sent','negotiation',
    'prepaid','paid','in_production','shipped','completed','rejected'
  ));

-- 5) Доп-настройки сайта (валюта по умолчанию, мин. опт)
alter table public.settings add column if not exists default_currency text default 'KGS';
alter table public.settings add column if not exists min_wholesale_default int default 20;

create index if not exists leads_type_idx on public.leads (type);
