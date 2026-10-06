-- ============================================================
-- Turnstile: cerrar la inserción directa de pedidos
-- ============================================================
-- EJECUTAR SOLO CUANDO la función "crear-pedido" ya está desplegada, tiene el
-- secreto TURNSTILE_SECRET_KEY y se ha comprobado que un pedido de prueba
-- entra correctamente desde la web con el captcha activo.
--
-- Qué hace: quita al público (rol anon) el permiso de escribir en la tabla
-- "pedidos". A partir de ahí los pedidos solo pueden crearse a través de la
-- función, que exige haber superado el captcha. Sin esto, un bot podría
-- saltarse el formulario y llamar a la base de datos directamente.
--
-- Eva (panel) no se ve afectada: usa el rol authenticated.

revoke insert on public.pedidos from anon;
drop policy if exists "pedidos publico inserta" on pedidos;

-- Para deshacerlo (si algo fallara):
--   grant insert on public.pedidos to anon;
--   create policy "pedidos publico inserta" on pedidos for insert with check (true);
