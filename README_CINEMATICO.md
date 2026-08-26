# 🎬 Web Cinematográfica — SCA San Juan Bautista Peñolite

Sitio cinematográfico Awwwards-level para la cooperativa de aceite de oliva Peñolite. Scroll-driven narrativo con GSAP, Three.js, Lenis y animaciones cinemáticas.

## 🚀 Quick Start

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build para producción
npm run build
npm start
```

Abre [http://localhost:3000](http://localhost:3000) para ver el sitio.

---

## 📋 Estructura de Capítulos

El sitio se divide en **7 capítulos cinematográficos** de scroll:

### **Cap 1 — HERO | La Raíz**
- `<HeroV2 />`
- Vídeo de fondo (olivares amanecer)
- Tipografía cinemática con variable font
- Scrubbing de frames por scroll
- **Archivo:** `components/HeroV2.tsx`

### **Cap 2 — TERROIR | La Tierra**
- `<TerroirV2 />`
- Clip-path reveal cinematográfico
- Bento grid asimétrico
- Especificaciones: altitud, variedad, sostenibilidad
- **Archivo:** `components/TerroirV2.tsx`

### **Cap 3 — PROCESO | Las Manos**
- `<ProcesoV2 />`
- Timeline de 6 pasos (cosecha → distribución)
- Scrubbing de fotogramas
- Particulares orgánicas
- **Archivo:** `components/ProcesoV2.tsx`

### **Cap 4 — PRODUCTO | La Esencia**
- `<ProductoV2 />`
- Showcase 3D interactivo (SVG + GSAP)
- Especificaciones técnicas (acidez, polifenoles, D.O.)
- Narrativa sensorial
- Beneficios para la salud
- **Archivo:** `components/ProductoV2.tsx`

### **Cap 5 — CATÁLOGO | La Elección**
- `<CatalogV2 />`
- Dos tarjetas de producto con precios reales
- Caja 3×5L (85€)
- Caja 12×2L (69€)
- Micro-interacciones magnéticas
- **Archivo:** `components/CatalogV2.tsx`

### **Cap 6 — FORMULARIO | El Contacto**
- `<FormularioContactoV2 />`
- Formulario de presupuesto con validación real-time
- Campos: nombre, email, teléfono, empresa, tipo comprador, formato, cantidad, código postal, mensaje
- Toast de éxito con animación
- **Archivo:** `components/FormularioContactoV2.tsx`

### **Cap 7 — CIERRE | La Invitación**
- `<CierreV2 />`
- Frase épica sobre comunidad
- Vídeo de fondo atardecer
- CTAs finales
- Información de contacto
- **Archivo:** `components/CierreV2.tsx`

---

## 🎨 Sistema de Diseño

Todos los tokens están centralizados en `lib/design-tokens.ts`:

### **Paleta de Color**
```typescript
- Negro: #060D03
- Verde Oliva: #2D4A2B
- Dorado: #C8961E
- Crema: #F5F1E8
```

### **Tipografía**
```typescript
- Serif: EB Garamond (títulos, variable font)
- Sans: Inter (body, UI)
- Mono: Fira Code (especificaciones)
```

### **Motion**
```typescript
- Ease Divine: cubic-bezier(0.22, 1, 0.36, 1)
- Ease Smooth: cubic-bezier(0.43, 0.13, 0.23, 0.96)
- Duración estándar: 800ms
- Scroll scrub: 1.2 segundos
```

---

## 🛠️ Stack Tecnológico

| Librería | Versión | Propósito |
|----------|---------|----------|
| **Next.js** | 16.3.1 | Framework React + SSR + Vercel deployment |
| **GSAP** | 3.15.0 | Orquestación de timelines y animaciones |
| **ScrollTrigger** | Incluido en GSAP | Sync con scroll del usuario |
| **SplitText** | Incluido en GSAP | Animación por palabra/carácter |
| **Three.js** | 0.185.1 | 3D (preparado para futura expansión) |
| **React Three Fiber** | 9.7.0 | React binding para Three.js |
| **Lenis** | 1.3.26 | Smooth scroll nativo |
| **Motion** | 13.1.0 | Micro-interacciones (framer motion) |
| **Lucide React** | 1.33.0 | Iconos (sin emojis en UI) |
| **TailwindCSS** | 4.0 | Base estilística |

---

## 📁 Estructura de Proyecto

```
web-cinematic/
├── app/
│   ├── layout.tsx          # Root layout + meta + scroll smooth
│   ├── page.tsx            # Página principal con 7 capítulos
│   └── globals.css         # Estilos globales + CSS tokens
├── components/
│   ├── HeroV2.tsx          # Cap 1
│   ├── TerroirV2.tsx       # Cap 2
│   ├── ProcesoV2.tsx       # Cap 3
│   ├── ProductoV2.tsx      # Cap 4
│   ├── CatalogV2.tsx       # Cap 5
│   ├── FormularioContactoV2.tsx # Cap 6
│   ├── CierreV2.tsx        # Cap 7
│   ├── Nav.tsx             # Navegación fija
│   ├── Footer.tsx          # Footer
│   ├── ScrollProgress.tsx  # Barra de progreso
│   ├── SmoothScroll.tsx    # Lenis integration
│   ├── GrainOverlay.tsx    # Film grain overlay
│   └── CustomCursor.tsx    # Cursor personalizado
├── hooks/
│   ├── useScrollTrigger.ts # Hook para GSAP + ScrollTrigger
│   └── useScrollAnimation.ts # Hook para animaciones custom
├── lib/
│   └── design-tokens.ts    # Tokens centralizados (colores, motion, spacing)
├── public/
│   └── images/             # Assets (ver ASSETS_GUIDE.md)
├── ASSETS_GUIDE.md         # Guía detallada para generar imágenes
├── README.md               # Este archivo
└── package.json
```

---

## 🎯 Puntos Clave de Arquitectura

### **1. Hooks Personalizados**
```typescript
// useScrollTrigger.ts
useScrollTrigger(ref, {
  trigger: ref,
  start: "top 80%",
  end: "center center",
  scrub: 1.2,
  onEnter: () => console.log("entra"),
});
```

### **2. Context + GSAP**
- Cada componente es autocontenido con su propio `gsap.context()`
- Cleanup automático en useEffect return
- Sin dependencia global de scroll listener

### **3. Validación de Motion**
```css
/* Respecta prefers-reduced-motion */
html:not(.force-motion) {
  animation: none !important;
  transition: none !important;
}
```

### **4. Variable Fonts**
```typescript
// Aumentar peso según scroll
gsap.to(titleRef.current, {
  fontVariationSettings: `"wght" ${400 + progress * 300}`,
});
```

---

## 🖼️ Assets Requeridos

**Todos los assets están en:** `ASSETS_GUIDE.md`

Necesitas generar o proporcionar:
1. ✅ Olivares amanecer (hero, 2K)
2. ✅ Rama con aceitunas (macro)
3. ✅ Mapa topográfico (1:1)
4. ✅ Cosecha manual (16:9)
5. ✅ Prensa (16:9)
6. ✅ Embotellado (16:9)
7. ✅ Caja 3×5L (4:5)
8. ✅ Caja 12×2L (4:5)
9. ✅ Olivares atardecer (2K)
10. ✅ Gota de aceite (1:1)

**Ubicación:** `/public/images/`

---

## 🚀 Deployment en Vercel

```bash
# Deploy automático desde GitHub
git push origin main

# O manual
vercel deploy --prod
```

**Environment variables:**
```
NEXT_PUBLIC_SITE_URL=https://penolite.vercel.app
```

---

## ⚡ Performance Targets

- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1
- **TTB (Time to Interactive):** < 3.8s

**Optimizaciones en lugar:**
- Lazy load de vídeos
- Imágenes WebP/AVIF con fallback
- Code splitting por capítulo
- GSAP animations GPU-accelerated
- Smooth scroll con Lenis (no JS interrupts)

---

## 🔧 Debugging

### **Ver clases de motion forzado:**
```javascript
// En browser console
document.documentElement.classList.add("force-motion");
```

### **Desactivar animaciones (accesibilidad):**
```
?motion=off
```

### **Logs GSAP:**
```typescript
gsap.defaults({ console: { log: true } });
```

---

## 📝 Notas de Desarrollo

- **No hay emojis en UI:** Solo Lucide/Tabler icons
- **Léxico en español:** Mantener a lo largo del código
- **Responsive:** Mobile-first, probado en gama media
- **Accesibilidad:** Skip link, keyboard nav, screen reader friendly
- **Sin comments innecesarios:** Solo WHY, no WHAT

---

## 📞 Contacto & Feedback

**Email:** sanjuanbautista.sca@gmail.com  
**Teléfono:** +34 953 435 316

---

## 📄 Licencia

Proyecto propietario de SCA San Juan Bautista Peñolite (2026).

