-- ============================================================================
--  Дордой Каталог — схема базы данных Supabase
--  Запустите этот скрипт в Supabase → SQL Editor.
-- ============================================================================

-- ── Таблица категорий ──────────────────────────────────────────────────────
create table if not exists public.categories (
  id         uuid primary key default gen_random_uuid(),
  slug       text unique not null,
  title      text not null,
  emoji      text,
  "order"    int default 0,
  hidden     boolean default false,
  created_at timestamptz default now()
);

-- ── Таблица товаров ─────────────────────────────────────────────────────────
create table if not exists public.products (
  id                 uuid primary key default gen_random_uuid(),
  slug               text unique not null,
  title              text not null,
  short_description  text,
  description        text,
  category_slug      text,
  gender             text default 'unisex',
  type               text,
  season             text default 'all',
  material           text,
  country_of_origin  text,
  sizes              text[] default '{}',
  colors             text[] default '{}',
  images             text[] default '{}',
  price_retail       numeric default 0,
  price_wholesale    numeric default 0,
  min_wholesale      int default 1,
  in_stock           boolean default true,
  is_new             boolean default false,
  is_hit             boolean default false,
  hidden             boolean default false,
  delivery_countries text[] default '{}',
  seo_title          text,
  seo_description    text,
  created_at         timestamptz default now()
);
create index if not exists products_category_idx on public.products (category_slug);
create index if not exists products_hidden_idx on public.products (hidden);

-- ── Таблица заявок ──────────────────────────────────────────────────────────
create table if not exists public.leads (
  id              uuid primary key default gen_random_uuid(),
  type            text not null check (type in (
                    'retail_order','wholesale_request','large_wholesale_request',
                    'marketplace_seller_request','manufacturing_request','general_contact')),
  status          text not null default 'new' check (status in (
                    'new','contacted','processing','quote_sent','negotiation',
                    'prepaid','paid','in_production','shipped','completed','rejected')),
  name            text not null,
  phone           text not null,
  messenger       text,
  company         text,
  country         text,
  city            text,
  product         text,
  category        text,
  size            text,
  color           text,
  quantity        text,
  budget          text,
  sell_channel    text,
  need_branding   boolean default false,
  need_label_pack boolean default false,
  comment         text,
  details         jsonb default '{}'::jsonb,   -- сценарные доп-поля
  manager         text,                         -- назначенный менеджер
  manager_notes   text,                         -- заметки менеджера
  last_contact_at timestamptz,                  -- дата последнего контакта
  created_at      timestamptz default now()
);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_type_idx on public.leads (type);
create index if not exists leads_created_idx on public.leads (created_at desc);

-- ── Настройки сайта (одна строка id = 1) ────────────────────────────────────
create table if not exists public.settings (
  id                 int primary key default 1,
  shop_name          text default 'Dordoy Textile',
  logo_url           text,
  whatsapp           text,
  telegram           text,
  instagram          text,
  address            text,
  delivery_countries text[] default '{}',
  payment_terms      text,
  delivery_terms     text,
  hero_text          text,
  constraint settings_singleton check (id = 1)
);

-- ============================================================================
--  Row Level Security
-- ============================================================================
alter table public.categories enable row level security;
alter table public.products   enable row level security;
alter table public.leads      enable row level security;
alter table public.settings   enable row level security;

-- Категории: публичное чтение видимых, полный доступ — авторизованным
drop policy if exists categories_public_read on public.categories;
create policy categories_public_read on public.categories
  for select using (hidden = false or auth.role() = 'authenticated');
drop policy if exists categories_admin_all on public.categories;
create policy categories_admin_all on public.categories
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Товары: публичное чтение видимых, полный доступ — авторизованным
drop policy if exists products_public_read on public.products;
create policy products_public_read on public.products
  for select using (hidden = false or auth.role() = 'authenticated');
drop policy if exists products_admin_all on public.products;
create policy products_admin_all on public.products
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Настройки: публичное чтение, изменение — авторизованным
drop policy if exists settings_public_read on public.settings;
create policy settings_public_read on public.settings for select using (true);
drop policy if exists settings_admin_all on public.settings;
create policy settings_admin_all on public.settings
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Заявки: НИКАКОГО публичного доступа. Запись идёт через service role (API),
-- который обходит RLS. Авторизованный админ может читать и менять статус.
drop policy if exists leads_admin_read on public.leads;
create policy leads_admin_read on public.leads
  for select using (auth.role() = 'authenticated');
drop policy if exists leads_admin_update on public.leads;
create policy leads_admin_update on public.leads
  for update using (auth.role() = 'authenticated');

-- ============================================================================
--  Хранилище изображений товаров
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

drop policy if exists "product images public read" on storage.objects;
create policy "product images public read" on storage.objects
  for select using (bucket_id = 'products');

drop policy if exists "product images admin write" on storage.objects;
create policy "product images admin write" on storage.objects
  for insert with check (bucket_id = 'products' and auth.role() = 'authenticated');

drop policy if exists "product images admin delete" on storage.objects;
create policy "product images admin delete" on storage.objects
  for delete using (bucket_id = 'products' and auth.role() = 'authenticated');

-- ============================================================================
--  Начальные данные
-- ============================================================================
insert into public.settings (id, shop_name, whatsapp, telegram, instagram, address,
  delivery_countries, payment_terms, delivery_terms, hero_text)
values (1, 'Dordoy Textile', '996700123456', 'dordoy_shop', 'dordoy_shop',
  'Кыргызстан, г. Бишкек, рынок «Дордой»',
  array['Кыргызстан','Казахстан','Россия','Узбекистан','Таджикистан','Беларусь'],
  'Предоплата 30–50% на карту, остаток при отправке. Для оптовиков — индивидуальные условия.',
  'Отправка через проверенные транспортные компании. Перед отправкой высылаем фото и видео товара.',
  'Одежда с рынка Дордой оптом и в розницу для стран СНГ')
on conflict (id) do nothing;

insert into public.categories (slug, title, emoji, "order") values
  ('muzhskaya','Мужская одежда','👔',1),
  ('zhenskaya','Женская одежда','👗',2),
  ('detskaya','Детская одежда','🧒',3),
  ('futbolki','Футболки','👕',4),
  ('polo','Поло','🎽',5),
  ('hudi','Худи','🧥',6),
  ('sportivnye-kostyumy','Спортивные костюмы','🏃',7),
  ('verhnyaya-odezhda','Верхняя одежда','🧥',8)
on conflict (slug) do nothing;

-- Примечание: создайте администратора в Supabase → Authentication → Users
-- (Add user → email + password). Этим логином входите в /admin/login.
