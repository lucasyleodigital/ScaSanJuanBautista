# SCA San Juan Bautista de Peñolite — Contexto Maestro
> Última actualización: 2026-10-01

## 1. QUIÉN ES EL CLIENTE / QUÉ ES EL PROYECTO

**Cliente:** SCA San Juan Bautista de Peñolite, cooperativa oleícola fundada el 23/07/1958 en Peñolite (Puente de Génave), Sierra de Segura, Jaén. Unas 200 familias socias (cooperativa pequeña y familiar; dato confirmado por el cliente el 2026-10-06, antes la web decía 500). D.O. Sierra de Segura. Variedad Picual 100%, olivar a 840m de altitud.

**Marca comercial real (impresa en las garrafas):** "Dehesa de Peñolite" — distinta de la razón social legal "SCA San Juan Bautista de Peñolite". Las dos conviven a propósito en la web: la razón social en textos legales/JSON-LD `name`, la marca comercial en `alternateName`, en el título SEO y en el sello del footer.

**Datos oficiales:**
- CIF: F23006992
- Dirección: Calle Peñolite, 1, Peñolite (Puente de Génave), Jaén
- Email oficial en la web (activo desde 2026-10-01): info@dehesapenolite.com (general/legal) · pedidos@dehesapenolite.com (pedidos, from de los emails automáticos) · contacto@dehesapenolite.com — los 3 son reglas de Cloudflare Email Routing que reenvían a Gmails reales
- Email real de Eva (sin cambios, usado como destino interno, no se muestra en la web): sca.sanjuanbautistaonline@gmail.com
- Teléfono fijo: +34 953 435 316
- WhatsApp / Bizum (móvil real, distinto del fijo): +34 620 022 801
- Facebook real y verificado: https://www.facebook.com/p/SCA-San-Juan-Bautista-Pe%C3%B1olite-100063301534955/
- IBAN (Caja Rural Jaén, para futura plantilla de email de resguardo): ES92 3067 0059 6611 4941 7121

**Premios reales (verificados por el usuario en la investigación inicial, no inventar ninguno más):**
- Medalla de Oro de Andalucía 2022 — Economía y Empresa (Jaencoop Grupo) — este NO es un "Premio Ardilla"
- 6 (no 7) Premios Ardilla D.O. Sierra de Segura, campañas 2017/18, 2007/08, 2018/19, 2004/05, 2007/08 (accésit), 2015/16 (accésit) — la lista completa con títulos exactos está en `components/PremiosV2.tsx`

**Productos y precios reales:**
- Caja 3 Garrafas × 5L (15L totales) — 85€ (5,67€/L)
- Caja 6 Garrafas × 2L (12L totales) — 69€ (5,75€/L)
- Pedidos a medida para hostelería/distribución bajo presupuesto

**Estado del proyecto:** La junta de la cooperativa YA APROBÓ la web. `web-cinematic/` está DESPLEGADA EN PRODUCCIÓN, no es una demo. Recibe pedidos reales, gestionados por Eva desde el panel `/panel-eva`.

**2026-09-27 — Proyecto centralizado y limpiado:** existían tres carpetas duplicadas/obsoletas (`web-quiet-luxury/`, `web-cinematic - copia/`, y una maqueta inicial de `create-next-app` nunca desarrollada) repartidas entre dos directorios madre distintos (`Nueva web SCA San juan bautista/` y `SCA San Juan Bautista Peñolite/`). El usuario confirmó explícitamente que no seguirán adelante con esas direcciones, así que se **borraron** (no archivaron) y todo se centralizó en una única carpeta. Ya no existen — si aparece alguna referencia antigua a ellas en el historial de esta conversación, ignorarla.

**Dominio:** `dehesapenolite.com` (sin ñ para evitar problemas de IDN, sin "de" por ser más corto) — **comprado en Cloudflare y conectado a Vercel desde 2026-10-01** (CNAME de apex y www apuntando a Vercel, proxy DNS-only). URL provisional de respaldo: `https://web-cinematic-lilac.vercel.app`.

**Repositorio:** GitHub `lucasyleodigital/ScaSanJuanBautista`, rama `master`, despliegue automático en Vercel en cada push.

---

## 2. ESTRUCTURA DEL PROYECTO

**Ruta local exacta del repo:** `C:\Users\polch\Desktop\PROYECTOS\SCA San Juan Bautista Peñolite\web-cinematic\`

Todo el proyecto vive ahora bajo una única carpeta madre: `C:\Users\polch\Desktop\PROYECTOS\SCA San Juan Bautista Peñolite\`
  - `web-cinematic/` — el repo real (este documento vive dentro de él).
  - `Imagenes/` — fotos reales, logos, garrafas. Aquí es donde el usuario deja los archivos nuevos que hay que integrar (p. ej. `dehesa peñolite logo.png`, `favicon.png`).
  - `Investigación/05_presencia_digital.md` — de aquí sale la URL real de Facebook y el análisis de competencia/SEO inicial.
  - `Propuesta-Comercial/` — material de venta, no tocar.
  - `BRIEF-WEB-NUEVA-DESDE-CERO.md` — brief para reconstruir la web desde cero si hiciera falta (histórico, ya no aplica porque la web real ya existe y está aprobada).
  - `PRODUCT.md` — contexto de producto (de la skill `impeccable`, no explorado a fondo esta sesión).
  - `claves acceso panel.txt`, `supabase.txt` — credenciales/notas sueltas del usuario, no tocar.

### Componentes REALMENTE usados (importados en `app/page.tsx` y `app/layout.tsx`)

Orden de renderizado en `page.tsx`:
`ScrollProgress` → `OliveGuide` → `Nav` → `HeroV2` → `AuthorityBar` → `AgitacionV2` → `TerroirV2` → `ProcesoV2` → `ProductoV2` → `PremiosV2` → `CatalogV2` → `CalculadoraPedidoInteractive` → `FaqV2` → `CierreV2` → `Footer` → `PromoPopup`

En `layout.tsx` (global, todas las páginas): `SmoothScroll` (Lenis), `GrainOverlay`, `CustomCursor` (con anillo desactivado en `/panel-eva`, ver sección 6), `CookieConsent`, `AudioProvider` (de `AudioEngine.tsx`), `Analytics` de `@vercel/analytics`.

`FloatingParticles.tsx` se usa dentro de varias secciones para el efecto de aceitunas cayendo (con prop `mobileCount` para reducir densidad en móvil).

`LegalPageLayout.tsx` es el wrapper compartido de `/aviso-legal`, `/politica-privacidad`, `/politica-cookies`.

### ⚠️ Componentes MUERTOS — no se importan en ningún sitio, restos de una iteración de diseño anterior

Verificado con grep que ninguno de estos se importa desde `app/` ni desde ningún componente vivo — solo se referencian entre sí:

- `Calidad.tsx`, `Contacto.tsx`, `Cooperativa.tsx`, `Historia.tsx`, `Olivar.tsx`, `Productos.tsx`, `Stats.tsx` (todos importan `Reveal.tsx`)
- `Hero.tsx` (v1 vieja, distinta de `HeroV2.tsx` que sí se usa) importa `MagneticButton.tsx`
- `HeroScene.tsx`, `CinemaIntro.tsx`, `Reveal.tsx`, `MagneticButton.tsx`

No afectan a nada visible, pero son candidatos claros a borrar en una limpieza — razón no documentada de por qué no se borraron ya (probablemente por precaución, nunca se confirmó con el usuario).

### `lib/`
- `design-tokens.ts` — fuente única de colores (negro `#060D03`, verde oliva `#2D4A2B`, dorado `#C8961E`, crema `#F5F1E8`), tipografía (EB Garamond serif, Inter sans, Fira Code mono), motion (easings, duraciones), spacing.
- `supabase.ts` — cliente Supabase (URL + clave **publishable**, no secreta, correcto tenerla en el código) + interfaces TypeScript: `PricingConfig`, `Promocion`, `Pedido`, `Provincia`.
- `provincias.ts` — mapeo verificado (contra Wikipedia/codigopostal.org) de prefijo de código postal (2 dígitos) → provincia española, más `getProvinciaFromCP()`. Usado por el configurador para calcular el envío real.
- `gsap.ts`, `animations-eisenberg.ts` — no explorados a fondo en esta sesión, no se han tocado.

---

## 3. INFRAESTRUCTURA Y SERVICIOS

| Servicio | Uso | Estado |
|---|---|---|
| **Vercel** | Hosting + deploy automático en push a `master` | Activo, dominio propio `dehesapenolite.com` conectado |
| **Supabase** (`vdjgqnzzxbmrjemmohgz.supabase.co`) | Base de datos + Auth para el panel de Eva | Activo, clave publishable hardcodeada en `lib/supabase.ts` (correcto, la seguridad la da RLS) |
| **Web3Forms** | Envío del aviso por email a Eva cuando entra un pedido | Activo todavía (access key en `CalculadoraPedidoInteractive.tsx`), **en proceso de retirada** ahora que la Edge Function de abajo hace lo mismo — hay doble aviso a Eva hasta confirmar que el nuevo sistema funciona y quitar esta llamada |
| **Resend** | Email de confirmación real al cliente + aviso a Eva | Dominio `dehesapenolite.com` verificado en Resend (SPF/DKIM/DMARC en Cloudflare). Lógica de envío en `supabase/functions/enviar-confirmacion-pedido/index.ts`, pendiente de desplegarse manualmente en el dashboard de Supabase (el MCP de Supabase de esta cuenta no tiene acceso a este proyecto, solo a Porteo y saas-erp) + conectar un Database Webhook (insert en `pedidos`) + secret `RESEND_API_KEY` |
| **Cloudflare** | Dominio + Email Routing (`info@`, `contacto@`, `pedidos@` → Gmails reales) | Activo desde 2026-10-01 |
| **Google Analytics 4** | Medición de visitas, respetando el consentimiento de cookies ya existente | Activo (`NEXT_PUBLIC_GA_ID` en Vercel, componente `components/GoogleAnalytics.tsx`) |
| **Monei** | Cobro online con tarjeta + Bizum | Decidido, **NO implementado** — requiere quitar `output: "export"` de `next.config.ts` y añadir 2 funciones serverless (crear pago + webhook) |

### Tablas de Supabase (SQL acumulado en `supabase-setup.sql` del repo)

⚠️ **`supabase-setup.sql` no es idempotente de principio a fin** — usa `CREATE TABLE` sin `IF NOT EXISTS` en las tablas. Si el proyecto de Supabase ya tiene las tablas creadas, hay que ejecutar SOLO los bloques nuevos añadidos al final, nunca todo el archivo desde el principio.

- **`pricing_config`** — fila única (`id=1`). Campos activos: `precio_caja_3x5l`, `precio_caja_6x2l`, `envio_ue`, `envio_gratis_desde`, `descuento_50l_pct`, `descuento_100l_pct`. Los campos `envio_peninsula` y `envio_baleares` **existen pero ya no se usan** — quedaron obsoletos al migrar el envío a `envio_provincias` (ver más abajo), no se borraron de la tabla ni del tipo `PricingConfig` para no romper nada, pero se quitaron de la pestaña "Tarifas" del panel.
- **`pedidos`** — cada pedido real. Campos: `nombre` (nombre+apellidos ya concatenados en un solo string), `email`, `telefono`, `direccion`, `localidad`, `codigo_postal`, `perfil`, `cajas_3x5l`, `cajas_6x2l`, `total_litros`, `destino_envio` (nombre de la provincia real, o "Internacional (UE)"), `subtotal`, `descuento`, `portes`, `total_estimado`, `estado` (`pendiente|confirmado|enviado|cancelado`), `codigo_promo`.
- **`promociones`** — ofertas/popups que gestiona Eva: `activo`, `titulo`, `texto`, `codigo`, `descuento_pct`, `envio_gratis`, `fecha_fin`. Solo una puede estar `activo=true` a la vez (al activar una se desactivan las demás desde el panel).
- **`envio_provincias`** — las 52 provincias españolas + Ceuta/Melilla, cada una con su propio `precio` fijo editable (8,50 € península, 18 € islas y ciudades autónomas en la siembra inicial). **Desde 2026-10-03 es el sistema de respaldo**: solo se usa si el envío automático por peso no está activo (ver siguiente bloque).
- **Envío automático por peso (CEACERO), 2026-10-03** — se activa ejecutando `supabase-envio-automatico.sql` y pulsando "Guardar y publicar precios" en Envíos. Tablas: **`tarifa_transporte`** (fila única; tarifa en bruto de CEACERO —zonas por prefijo postal, escalones de peso y precios— más los parámetros `descuento_pct` 18,6, `carburante_pct` 4, `iva_pct` 21, `margen_pct` 0, `redondeo_eur` 0,10; **privada**, solo Eva; sin GRANT para `anon` a propósito: la tarifa y el descuento son confidenciales) y **`envio_tarifas`** (`provincia`, `escalon_kg`, `precio`, `publicado_at`; precio FINAL al cliente con IVA, **pública para lectura**, la escribe el panel). `pricing_config` gana `peso_caja_3x5l` (13,74) y `peso_caja_6x2l` (10,98). La lógica está en `lib/envios.ts` (`calcularEnvio`, `construirFilasPublicas`, `cotizarEnvio`) y reproduce al céntimo la calculadora de CEACERO (probado con 6.453 casos reales). La tarifa se carga/actualiza con `scripts/extraer-tarifa-ceacero.py` a partir del Excel del transportista (necesita `xlrd`); el Excel trae las fórmulas ocultas, no se intentó saltar la protección.

### ⚠️ Lección de RLS aprendida por las malas (dos veces)
Postgres necesita el `GRANT` explícito ADEMÁS de la política de RLS — sin el `grant select/insert/update/delete on public.<tabla> to anon/authenticated`, da "permission denied" (código `42501`) aunque la política esté bien escrita. Y ojo: si el navegador tiene la sesión de Eva iniciada en el panel a la vez que se prueba el formulario público **en la misma pestaña/origen**, la petición se hace como rol `authenticated`, no `anon` — hay que dar permisos a los dos roles, no asumir que el público siempre es anónimo.

### RLS: patrón usado en todas las tablas
Lectura pública amplia o filtrada (`activo=true` en promociones), escritura solo para `authenticated` (Eva), salvo `pedidos` donde el INSERT es público (el formulario de la web no requiere login) pero SELECT/UPDATE/DELETE son solo para Eva.

---

## 4. ARQUITECTURA Y FLUJO DE DATOS

### Flujo de un pedido (`components/CalculadoraPedidoInteractive.tsx`)
1. Cliente rellena: perfil comprador, cantidades de cajas, destino (España/Internacional), nombre, apellidos, email, teléfono, dirección, localidad, código postal.
2. Mientras escribe el código postal, `getProvinciaFromCP()` (de `lib/provincias.ts`) detecta la provincia en vivo. Con el envío por peso activo (hay filas en `envio_tarifas`), pide solo las filas de esa provincia (unas 46; Supabase corta en 1.000 por petición), calcula el peso (cajas × peso por caja) y cobra el precio del escalón. Si la provincia no tiene tarifa (Canarias, Ceuta, Melilla) o el peso se sale (Baleares > 50 kg, > 2000 kg), muestra «A consultar con la cooperativa», NO regala el envío aunque supere el umbral de envío gratis, y guarda `destino_envio` como "Las Palmas · envío a consultar" (el sufijo viaja a emails, WhatsApp y panel; `esEnvioAConsultar()` lo detecta). Si el envío por peso no está activo o falla la consulta, usa los precios fijos de `envio_provincias` como siempre. **Los portes no se muestran ni se suman al total hasta que el código postal resuelve una provincia real** — antes de eso se ve "Según código postal". Los envíos fuera de España (UE) siguen siendo un precio fijo (`envio_ue`).
3. Si hay código promocional, se busca en `promociones` (`activo=true`, `codigo` case-insensitive) y aplica `descuento_pct` y/o `envio_gratis`.
4. Al enviar: `supabase.from("pedidos").insert(...)` (fuente de verdad, lo que ve Eva) + `fetch` a Web3Forms (aviso rápido a Eva, no bloqueante — si falla, el pedido ya quedó guardado igualmente).
5. Bizum: botón que copia `620022801` al portapapeles (`navigator.clipboard.writeText`) y pide al cliente confirmar por WhatsApp indicando nombre y apellido, porque un ingreso de Bizum no lleva datos del pedido adjuntos.

### Panel de Eva (`app/panel-eva/page.tsx`)
Protegido con Supabase Auth (email+password). Pestañas: **Pedidos** (lista, cambiar estado, borrar), **Clientes** (buscador por nombre/email/teléfono/localidad/provincia + botón "Ver envíos" que despliega el historial completo de esa persona), **Informes** (2026-10-03: listados de clientes y de envíos filtrables por periodo —mes/rango de fechas—, zona —comunidad/provincia/internacional— y estado, agrupables por mes/día/provincia/comunidad, con totales y descarga en **Excel (.xlsx) y CSV**; código en `components/panel-eva/InformesTab.tsx` + `lib/informes.ts`; todo se calcula en el navegador con los pedidos que ya lee el panel, cargados por páginas de 1.000 porque Supabase corta ahí; el Excel usa `write-excel-file`, que se carga solo al pulsar el botón; el CSV va en formato Excel español: `;`, decimales con coma, BOM UTF-8; ambos neutralizan fórmulas maliciosas en datos de clientes), **Tarifas** (precios de cajas, envío internacional, envío gratis desde, descuentos por volumen), **Envíos** (`components/panel-eva/EnviosPanel.tsx`: parámetros editables —pesos de caja, descuento, carburante, IVA, margen, redondeo—, vista previa del precio por provincia y escalón, simulador con desglose y botón "Guardar y publicar precios"; publica con upsert por lotes de 500 y luego borra lo que no lleve la misma marca `publicado_at`, así la web nunca se queda sin precios; si el sistema no está activado en Supabase, muestra un aviso y el editor de precios fijos de siempre), **Ofertas** (crear/editar/activar/borrar promociones, con % de descuento y/o envío gratis).

El cursor personalizado (`CustomCursor.tsx`) oculta el anillo exterior específicamente en `/panel-eva` (vía `usePathname()`) porque desentonaba en un panel de administración — el punto sigue igual en todas partes.

---

## 5. IDIOMAS / INTERNACIONALIZACIÓN
No aplica — toda la web es en español únicamente. No hay i18n.

---

## 6. TODOS LOS BUGS CORREGIDOS (esta sesión)

| Síntoma | Causa raíz | Fix | Archivo |
|---|---|---|---|
| Popup de oferta no salía en desktop de un usuario | El propio usuario lo había cerrado antes en ese navegador (localStorage `penolite-promo-dismissed-<id>`), o probó antes de aceptar/rechazar cookies (el popup espera a que se decida sobre cookies) | No era bug — comportamiento esperado, explicado al usuario | `components/PromoPopup.tsx` |
| Pedido no se podía enviar, error 42501 "permission denied for table pedidos" | Faltaba `GRANT INSERT ... TO authenticated` — el navegador del usuario tenía la sesión de Eva abierta a la vez | Añadido el grant que faltaba | `supabase-setup.sql` |
| Portes de envío mostraban 9€ fijo antes de escribir el código postal | El fallback usaba `pricing.envio_peninsula` incluso sin código postal válido | Se muestra "Según código postal" y no se suma al total hasta resolver provincia real | `CalculadoraPedidoInteractive.tsx` |
| "Suelo volcánico" en el texto de Terroir | Afirmación geológica inventada — la Sierra de Segura es caliza/kárstica, verificado por búsqueda web | Corregido a "suelo calizo" (sin la palabra "kárstica" a petición del usuario, por ser jerga) | `TerroirV2.tsx` |
| "7 Premios Ardilla" en la barra de autoridad | La lista real en `PremiosV2.tsx` solo tiene 6 premios con "Ardilla" en el nombre — el 7º es la Medalla de Oro de Andalucía, un premio distinto | Corregido a "6 Premios Ardilla" | `AuthorityBar.tsx` |
| Política de privacidad decía "Resend" como proveedor de email | Resend nunca se implementó, el proveedor real es Web3Forms | Corregido, y se añadió que Supabase también guarda los datos de pedidos (antes no se mencionaba) | `app/politica-privacidad/page.tsx` |
| "Envío protegido en caja térmica anti-roturas" | No es cierto, no se envía en caja térmica | Corregido a "Envío embalado para evitar roturas en el transporte" | `CalculadoraPedidoInteractive.tsx` |
| Botón "Contactar Directamente" abría Outlook en vez de Gmail | Es un enlace `mailto:` — lo intercepta el SO del visitante según su app de correo predeterminada, no algo que la web pueda controlar | Cambiado a enlace de WhatsApp (mismo número que el resto de la web) | `CierreV2.tsx` |
| Logo/enlace de Facebook en el footer mal maquetado, sin icono | lucide-react no incluye logos de marca (los quitaron de la librería) | Icono SVG propio del logo de Facebook, en botón circular separado | `Footer.tsx` |
| Insignia del Hero tapada por el menú en móvil | Al agrandar el logo del nav (80-112px), el menú fijo pasó a medir ~120px de alto en móvil, y el `pt-16` del Hero se quedó corto | `pt-16` → `pt-36` en móvil (`md:pt-16` sin cambios, en desktop ya había espacio de sobra) | `HeroV2.tsx` |
| WhatsApp usaba el teléfono fijo (no tiene WhatsApp) | Número equivocado tanto en el enlace `wa.me` como en el texto visible | Cambiado a `+34 620 022 801` en ambos sitios | `CalculadoraPedidoInteractive.tsx` |

---

## 7. CÓMO DESPLEGAR

1. Editar código.
2. `npx tsc --noEmit` y `npm run build` — ambos deben pasar limpios antes de commitear.
3. Si el cambio es visualmente observable, verificar en navegador (servir `out/` con `npx serve out -p <puerto>` y comprobar con el navegador integrado — nunca asumir que "compila" significa "se ve bien").
4. `git add`, `git commit` (con mensaje descriptivo + línea `Co-Authored-By`), `git push origin master`.
5. Vercel despliega automáticamente. Verificar con la API de GitHub (`commits/<sha>/status`) hasta que el check de Vercel diga "Deployment has completed" — normalmente tarda 3-5 intentos de 10s.
6. Si hay cambios de SQL, avisar al usuario del bloque exacto a ejecutar en el SQL Editor de Supabase (no puedo ejecutarlo yo mismo, MCP de Supabase sin autorizar).

⚠️ `git push` a veces da timeout intermitente sin que sea un problema real — reintentar en segundo plano si pasa.

⚠️ El proyecto NO es un repo git tradicional en cuanto a la detección del entorno (revisar `AGENTS.md`/`CLAUDE.md` del proyecto — avisan de que esta versión de Next.js tiene breaking changes respecto al conocimiento genérico, y que ese bloque de advertencia lo regenera `next dev` automáticamente, no borrarlo del diff).

---

## 8. GOTCHAS Y TRAMPAS CONOCIDAS

| Trampa | Cómo evitarla |
|---|---|
| RLS de Supabase da "permission denied" aunque la política esté bien | Comprobar que existe el `GRANT` explícito para el rol correcto (`anon` Y `authenticated` si aplica) |
| Lenis (smooth scroll) rompe `scrollIntoView` nativo y las capturas de pantalla automáticas | Usar `getBoundingClientRect()` + comprobaciones por JS en vez de fiarse de una captura tras un scroll programático |
| `lucide-react` no tiene iconos de marca (Facebook, etc.) | Usar un SVG propio a mano con el path oficial del logo |
| Los logos con mucho detalle (raíces finas, texto perimetral) se convierten en una mancha ilegible en el favicon/nav a 16-44px | Redimensionar de verdad con `sharp` y mirar el resultado a tamaño real (x2/x4 con `kernel: nearest` para ver honestamente, no confiar en cómo el visor de imágenes escala una miniatura) antes de decidir |
| Afirmaciones factuales específicas (geología, ciencia, conteos) pueden colarse en la copy sin verificar | Verificar con búsqueda web antes de publicar cualquier dato específico y comprobable — ver memoria `feedback_verify-factual-claims-in-copy` |
| Poner un email/teléfono nuevo en la web antes de que el canal real exista | Ya resuelto (2026-10-01): dominio y Email Routing activos antes de sustituir `sca.sanjuanbautistaonline@gmail.com` por `info@dehesapenolite.com`/`pedidos@dehesapenolite.com` en la web. Regla general para el futuro: nunca mostrar un canal de contacto en la web antes de verificar que recibe de verdad |
| `supabase-setup.sql` no es idempotente completo | Ejecutar solo los bloques SQL nuevos añadidos al final, no todo el archivo si las tablas base ya existen |
| Web3Forms free no tiene autoresponder (confirmación al cliente) | Es función de pago (plan Pro). Por eso se planificó Resend en su lugar |
| Stripe no soporta Bizum | Por eso se descartó a favor de Monei para el cobro online |

---

## 9. DECISIONES ARQUITECTÓNICAS

| Decisión | Razón | Alternativa descartada |
|---|---|---|
| Envío calculado por provincia (código postal) en vez de 3 zonas fijas | El coste real de portes varía por provincia; además cubre Ceuta/Melilla que antes no encajaban en ningún botón | Selector manual "Península/Baleares/UE" (impreciso, y el cliente podía elegir mal) |
| Monei para el cobro online | Comisión de tarjeta más barata que Stripe (0,90%+0,25€ vs 1,5%+0,25€), sin cuota mensual fija, Bizum incluido sin trámite bancario aparte, integración más rápida | Stripe (no soporta Bizum), Redsys puro (papeleo bancario + integración manual, comisión desconocida sin preguntar a Caja Rural Jaén) |
| `dehesapenolite.com` sin ñ ni "de" | Evita problemas de IDN (Cloudflare no lo registra con ñ, y aunque otros registradores sí, da fricción a quien tenga que teclearlo) y es más corto de recordar | `dehesadepenolite.com`, `dehesapeñolite.com` |
| Bizum "manual" (número + confirmación por WhatsApp) en vez de integración de comercio | La integración automática (Bizum Comercios) requiere el mismo trámite bancario que Redsys — no es un atajo aparte. Se hace así mientras tanto, sin coste ni papeleo | Botón de Bizum automático (requeriría Monei/Redsys ya implementado) |
| Nombre y apellidos como campos separados en el configurador | Evita ambigüedad al confirmar pagos por Bizum/WhatsApp (dos clientes con el mismo nombre de pila) | Un solo campo "Nombre completo" (como estaba antes) |
| Dirección de envío (calle+localidad) añadida al configurador | Antes Eva tenía que pedirla aparte por teléfono/email tras cada pedido | Dejar solo el código postal (como estaba antes) |

---

## 10. HISTORIAL DE SESIONES (resumen cronológico de esta sesión larga)

1. Ajustes de imágenes y animaciones (galería de proceso, partículas de aceitunas, encuadre de fotos en Hero/Cierre, bento grid de Terroir).
2. Estrategia de dominio y SEO inicial, brief para reconstruir la web desde cero (ya no aplica, la real ya existe).
3. Construcción del panel de Eva desde cero: Ofertas/promociones con popup público, luego código de descuento real (Stripe→Monei descartado por Bizum), Bizum manual, Envíos por provincia, Clientes con buscador e historial.
4. Depuración de varios bugs de RLS de Supabase (el más repetido: falta de GRANT explícito).
5. Trabajo de logos: varias iteraciones probadas y verificadas a tamaño real antes de integrar (nav/favicon = árbol solo; footer/email = sello "Dehesa de Peñolite"). Queda un tercer diseño sin resolver.
6. Auditoría completa de la copy en busca de datos falsos (encontrados y corregidos: suelo volcánico, conteo de premios, proveedor de email incorrecto).
7. SEO on-page: título/descripción separados de los de redes sociales, `alternateName` y `sameAs` en JSON-LD, refuerzo del nombre de marca en texto visible, `llms.txt`.
8. Corrección de UX menor: botón de contacto que abría Outlook, textos poco precisos (caja térmica), campos de formulario (nombre/apellidos, dirección).
9. Decisión de email de contacto oficial (`info@dehesapenolite.com`), pendiente de activar hasta tener dominio.

---
## CÓMO CONTINUAR EN LA PRÓXIMA SESIÓN

Al inicio de la próxima conversación, di a Claude:

> "Lee el archivo CONTEXT_MAESTRO.md en `C:\Users\polch\Desktop\PROYECTOS\SCA San Juan Bautista Peñolite\web-cinematic\` y continúa el trabajo de SCA San Juan Bautista de Peñolite desde donde lo dejamos."

Claude leerá el archivo y estará al día sin que tengas que explicar nada.
