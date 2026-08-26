# Storyboard — Peñolite, pieza insignia 2026

Demo de venta premium (no el entregable de 1.100€) para justificar subir el
presupuesto ante la junta. Contenido placeholder de momento, sustituible por
material real de la cooperativa cuando se apruebe.

Tesis del sitio: **"El aceite no se hace en la almazara. Se hace en la
montaña, 66 años antes."** — el hero no vende una botella, vende una
altitud, un linaje y una comunidad.

---

## Capítulo 0 — Cinema Intro (una vez, saltable)
- Entra: barras de cine que se abren, localización + nombre + año en el negro.
- Sale: barras se retiran hacia arriba/abajo, revelan el Hero.
- Dispara: carga de página. Se puede saltar con tap/click o tecla.
- Por qué existe: ancla el tono (patrimonio, no producto de supermercado)
  antes de que el usuario vea nada más. Un solo uso, nunca se repite.

## Capítulo 1 — Hero: "El Alma del Olivar" (pin corto)
- Entra: titular partido por palabras con blur→foco (SplitText), fondo con
  escena Three.js ligera de partículas doradas (gotas de aceite) que
  reaccionan al scroll inicial.
- Libera scroll cuando: el titular termina de revelarse.
- Por qué: es la frase más característica de la marca, no un genérico
  "bienvenido a nuestra web".

## Capítulo 2 — Historia (pin, timeline horizontal 1958→2026)
- Entra: al hacer pin, el scroll vertical avanza la timeline horizontalmente
  (ScrollTrigger scrub). Cada hito enciende su punto dorado.
- Sale: al llegar a 2026 ("primera web"), el pin se libera y cae a Olivar.
- Por qué: 66 años de historia no se leen, se recorren — el scroll hace de
  máquina del tiempo.

## Capítulo 3 — El Olivar (parallax + reveal de datos)
- Entra: imagen real del olivar (Imagenes/dehesa-penolite) con parallax
  sutil; los datos (840m, Picual, D.O., campaña) aparecen en cascada.
- Transición de entrada: curtain-reveal (clip-path) desde el verde noche de
  Historia hacia el crema del Olivar — marca el cambio de "pasado" a
  "territorio presente".
- Por qué: justifica el sabor con el lugar antes de hablar de producto.

## Capítulo 4 — Productos (bento asimétrico)
- Entra: dos formatos (2L / 5L) en tarjetas con tilt magnético al hover;
  reveal progresivo, no todo de golpe.
- Por qué: production readiness — aquí es donde el usuario decide "quiero
  esto".

## Capítulo 5 — Calidad / Certificaciones (sello estampado)
- Entra: sellos de D.O. "estampan" al entrar en viewport (ya prototipado en
  el demo anterior — se traslada a GSAP).
- Por qué: la calidad se demuestra con papel, no con adjetivos — el gesto de
  sellar es la metáfora visual.

## Capítulo 6 — Cooperativa (valores + stat grande)
- Entra: 500+ familias, valores del cooperativismo, foto/placeholder.
- Por qué: cierre emocional antes del CTA — de "producto" a "comunidad".

## Capítulo 7 — Pedido / Contacto
- Entra: formulario + mapa (placeholder Google Maps hasta datos reales).
- Transición de página (si se navega a otra ruta): View Transitions API,
  fundido tipo corte de cámara.

## Capítulo 8 — Footer
- Estático, sin motion — punto de descanso final.

---

## Reglas transversales
- `prefers-reduced-motion`: cada capítulo tiene versión estática funcional
  (contenido visible, sin pin, sin parallax).
- Sin JS/WebGL: el HTML semántico ya cuenta la historia completa en orden de
  lectura normal — el motion es una capa, no un requisito.
- Mobile: sin partículas 3D, timeline vertical simple, sin magnetic buttons
  (hover:none).
