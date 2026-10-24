-- ============================================================
-- Turnstile: cerrar la inserción directa de pedidos
-- ============================================================
-- EJECUTAR SOLO CUANDO la función "crear-pedido" ya está desplegada, tiene el
-- secreto TURNSTILE_SECRET_KEY y se ha comprobado que un pedido de prueba
-- entra correctamente desde la web con el captcha activo, viéndolo en
-- Edge Functions > crear-pedido > Logs/Invocations (respuesta 200), no solo en el panel.
--
-- Qué hace: quita al público (rol anon) el permiso de escribir en la tabla
-- "pedidos". A partir de ahí los pedidos solo pueden crearse a través de la
-- función, que exige haber superado el captcha. Sin esto, un bot podría
-- saltarse el formulario y llamar a la base de datos directamente.
--
-- Eva (panel) no se ve afectada: usa el rol authenticated.

-- La función crear-pedido guarda con el rol service_role, que en este proyecto
-- no recibe permisos automáticamente (sin esto: "permission denied for table pedidos").
grant insert on public.pedidos to service_role;

revoke insert on public.pedidos from anon;
drop policy if exists "pedidos publico inserta" on pedidos;

-- Para deshacerlo (si algo fallara):
--   grant insert on public.pedidos to anon;
--   create policy "pedidos publico inserta" on pedidos for insert with check (true);
