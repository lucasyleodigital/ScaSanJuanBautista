-- ============================================================
-- SCA San Juan Bautista Peñolite — panel de Eva
-- Ejecutar completo en Supabase → SQL Editor → New query → Run
-- ============================================================

-- Tarifas: una sola fila que lee la web pública y edita Eva
create table pricing_config (
  id int primary key default 1,
  precio_caja_3x5l numeric not null default 85.00,
  precio_caja_6x2l numeric not null default 69.00,
  envio_peninsula numeric not null default 8.50,
  envio_baleares numeric not null default 18.00,
  envio_ue numeric not null default 35.00,
  envio_gratis_desde numeric not null default 150.00,
  descuento_50l_pct numeric not null default 5,
  descuento_100l_pct numeric not null default 10,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);
insert into pricing_config (id) values (1);

-- Pedidos que llegan desde el configurador de la web
create table pedidos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nombre text not null,
  email text not null,
  telefono text not null,
  codigo_postal text not null,
  perfil text not null,
  cajas_3x5l int not null default 0,
  cajas_6x2l int not null default 0,
  total_litros int not null,
  destino_envio text not null,
  subtotal numeric not null,
  descuento numeric not null default 0,
  portes numeric not null default 0,
  total_estimado numeric not null,
  estado text not null default 'pendiente'
);

alter table pricing_config enable row level security;
alter table pedidos enable row level security;

-- pricing_config: lectura pública (la necesita el configurador), escritura solo si Eva ha iniciado sesión
create policy "pricing publico lectura" on pricing_config for select using (true);
create policy "pricing solo eva escribe" on pricing_config for update using (auth.role() = 'authenticated');

-- pedidos: cualquiera puede crear uno (el formulario público), solo Eva puede verlos/editarlos
create policy "pedidos publico inserta" on pedidos for insert with check (true);
create policy "pedidos solo eva lee" on pedidos for select using (auth.role() = 'authenticated');
create policy "pedidos solo eva actualiza" on pedidos for update using (auth.role() = 'authenticated');

-- Permisos base de PostgreSQL (necesarios ADEMÁS de las políticas de
-- arriba: sin esto, Postgres rechaza el acceso antes de evaluar RLS).
grant usage on schema public to anon, authenticated;

grant select, insert on public.pedidos to anon;
grant select, update on public.pedidos to authenticated;

grant select on public.pricing_config to anon;
grant select, update on public.pricing_config to authenticated;

-- Permite a Eva borrar pedidos (p. ej. si el cliente se echa atrás)
create policy "pedidos solo eva borra" on pedidos for delete using (auth.role() = 'authenticated');
grant delete on public.pedidos to authenticated;

-- ============================================================
-- Promociones/ofertas: popups que Eva activa/desactiva desde el panel
-- (descuentos, portes gratis, o lo que quiera anunciar)
-- ============================================================
create table promociones (
  id uuid primary key default gen_random_uuid(),
  activo boolean not null default false,
  titulo text not null,
  texto text not null,
  codigo text,
  fecha_fin date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table promociones enable row level security;

-- El público solo ve la que esté marcada como activa; Eva ve y gestiona todas
create policy "promociones publico lee activas" on promociones for select using (activo = true);
create policy "promociones eva lee todo" on promociones for select using (auth.role() = 'authenticated');
create policy "promociones eva inserta" on promociones for insert with check (auth.role() = 'authenticated');
create policy "promociones eva actualiza" on promociones for update using (auth.role() = 'authenticated');
create policy "promociones eva borra" on promociones for delete using (auth.role() = 'authenticated');

grant select on public.promociones to anon;
grant select, insert, update, delete on public.promociones to authenticated;
