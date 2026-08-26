# 🖼️ GUÍA DE INTEGRACIÓN — Conectar Imágenes a Componentes

Una vez que hayas generado las 10 imágenes con `generate-images.py`, integra cada una en los componentes React.

## 📸 Resumen: Imagen → Componente

| Imagen | Ruta | Componente | Propiedad |
|--------|------|-----------|-----------|
| 1. olivares-amanecer.jpg | hero/ | HeroV2 | Background gradient |
| 2. rama-aceitunas.png | terroir/ | TerroirV2 | Card overlay |
| 3. mapa-topografico.svg | terroir/ | TerroirV2 | Card image |
| 4. cosecha-manual.jpg | proceso/ | ProcesoV2 | Proceso visual |
| 5. prensa.jpg | proceso/ | ProcesoV2 | Proceso visual |
| 6. embotellado.jpg | proceso/ | ProcesoV2 | Proceso visual |
| 7. caja-3x5l.png | productos/ | CatalogV2 | Product 1 image |
| 8. caja-6x2l.png | productos/ | CatalogV2 | Product 2 image |
| 9. olivares-atardecer.jpg | cierre/ | CierreV2 | Background |
| 10. gota-aceite.png | decorativo/ | Decorativo | Hero accent |

---

## 1️⃣ HeroV2.tsx — Hero Background

**Ubicación:** `components/HeroV2.tsx`  
**Imagen:** `/public/images/hero/olivares-amanecer.jpg`

### Cambio:

```tsx
// Antes (línea ~85)
style={{
  background: `linear-gradient(135deg, ${colors.verdeOscuro} 0%, ${colors.negro} 70%)`
}}

// Después
style={{
  backgroundImage: 'url(/images/hero/olivares-amanecer.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
}}
```

**Nota:** El overlay radial que está en el componente (línea ~90) sigue manteniendo la opacidad para legibilidad de texto.

---

## 2️⃣ TerroirV2.tsx — Terroir Cards

**Ubicación:** `components/TerroirV2.tsx`  
**Imágenes:**
- `/public/images/terroir/rama-aceitunas.png`
- `/public/images/terroir/mapa-topografico.svg`

### Actualizar Card 1 (Altitud):

```tsx
// Antes (línea ~143)
<div
  style={{
    width: "100%",
    height: "240px",
    background: `linear-gradient(135deg, ${colors.verdeOscuro} 0%, ${colors.negro} 100%)`,
    borderRadius: "8px",
    marginBottom: spacing.lg,
  }}
/>

// Después
<div
  style={{
    width: "100%",
    height: "240px",
    backgroundImage: 'url(/images/terroir/rama-aceitunas.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: "8px",
    marginBottom: spacing.lg,
  }}
/>
```

### Actualizar Card 2 (Variedad):

```tsx
// Antes (línea ~183)
<div
  style={{
    width: "100%",
    height: "240px",
    background: `linear-gradient(135deg, ${colors.verdeOscuro} 0%, ${colors.negro} 100%)`,
    borderRadius: "8px",
    marginBottom: spacing.lg,
  }}
/>

// Después
<div
  style={{
    width: "100%",
    height: "240px",
    backgroundImage: 'url(/images/terroir/mapa-topografico.svg)',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundColor: colors.negro,
    borderRadius: "8px",
    marginBottom: spacing.lg,
  }}
/>
```

---

## 3️⃣ ProcesoV2.tsx — Proceso Visuals

**Ubicación:** `components/ProcesoV2.tsx`  
**Imágenes:** `/public/images/proceso/{cosecha-manual,prensa,embotellado}.jpg`

Este componente tiene placeholders emoji 🌿 🚚 ⚙️ ✓ 🫒 📦.

Para añadir imágenes cinematográficas sin romper el diseño actual (que funciona bien con timeline):

**Opción A: Timeline con imágenes decorativas (recomendado)**

Añade una sección visual antes del timeline:

```tsx
// Añadir después de línea ~149 (después del párrafo subtítulo)

<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: spacing.lg,
    marginBottom: spacing.xxxl,
  }}
>
  {[
    { src: "/images/proceso/cosecha-manual.jpg", alt: "Cosecha Manual" },
    { src: "/images/proceso/prensa.jpg", alt: "Prensa" },
    { src: "/images/proceso/embotellado.jpg", alt: "Embotellado" },
  ].map((img) => (
    <div
      key={img.src}
      style={{
        width: "100%",
        height: "200px",
        backgroundImage: `url(${img.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "8px",
        opacity: 0.85,
      }}
    />
  ))}
</div>
```

**Opción B: Full rewrite con imagen hero (avanzado)**

Si quieres reemplazar completamente ProcesoV2, contacta para un refactor completo.

---

## 4️⃣ CatalogV2.tsx — Product Images

**Ubicación:** `components/CatalogV2.tsx`  
**Imágenes:**
- `/public/images/productos/caja-3x5l.png`
- `/public/images/productos/caja-6x2l.png`

### Cambiar placeholder emoji:

```tsx
// Antes (línea ~171-187)
<div
  style={{
    width: "100%",
    height: "280px",
    background: `linear-gradient(135deg, ${colors.verdeOscuro} 0%, ${colors.negro} 100%)`,
    borderRadius: "8px",
    marginBottom: spacing.lg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "48px",
    opacity: 0.6,
  }}
>
  🫒
</div>

// Después (Product 1 - Caja 3×5L)
<div
  style={{
    width: "100%",
    height: "280px",
    backgroundImage: `url(/images/productos/caja-3x5l.png)`,
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundColor: colors.negro,
    borderRadius: "8px",
    marginBottom: spacing.lg,
  }}
/>

// Después (Product 2 - Caja 6×2L)
<div
  style={{
    width: "100%",
    height: "280px",
    backgroundImage: `url(/images/productos/caja-6x2l.png)`,
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundColor: colors.negro,
    borderRadius: "8px",
    marginBottom: spacing.lg,
  }}
/>
```

---

## 5️⃣ CierreV2.tsx — Closure Background

**Ubicación:** `components/CierreV2.tsx`  
**Imagen:** `/public/images/cierre/olivares-atardecer.jpg`

### Cambiar fondo del section:

```tsx
// Antes (línea ~56-58)
style={{
  background: `linear-gradient(180deg, ${colors.negro} 0%, ${colors.verdeOscuro} 100%)`,
}}

// Después
style={{
  backgroundImage: 'url(/images/cierre/olivares-atardecer.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  backgroundColor: colors.negro,
}}
```

La caja blanca contenida (línea ~72-78) se mantiene como está, con su gradiente dorado suave.

---

## 6️⃣ Decorativo — Gota de Aceite Macro

**Ubicación:** Decorativo (puede usarse en múltiples lugares)  
**Imagen:** `/public/images/decorativo/gota-aceite.png`

**Uso recomendado:** Hero accent, footer, o entre secciones.

### Ejemplo: Floating element en Hero

```tsx
// Añadir en HeroV2.tsx, dentro de la sección (línea ~96, después del div principal)

<div
  style={{
    position: "absolute",
    bottom: "60px",
    right: "40px",
    width: "120px",
    height: "120px",
    backgroundImage: 'url(/images/decorativo/gota-aceite.png)',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    opacity: 0.7,
    pointerEvents: 'none',
    animation: 'float 6s ease-in-out infinite',
  }}
/>
```

Y añadir keyframe en `globals.css`:

```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}
```

---

## 🔍 Verificación

### Checklist de integración:

- [ ] HeroV2 background carga `olivares-amanecer.jpg`
- [ ] TerroirV2 Card 1 muestra `rama-aceitunas.png`
- [ ] TerroirV2 Card 2 muestra `mapa-topografico.svg`
- [ ] ProcesoV2 muestra miniaturas de proceso (opcional)
- [ ] CatalogV2 Product 1 muestra `caja-3x5l.png`
- [ ] CatalogV2 Product 2 muestra `caja-6x2l.png`
- [ ] CierreV2 background carga `olivares-atardecer.jpg`
- [ ] Gota aceite decorativa carga si la usas
- [ ] Todas las imágenes cargan rápido (LCP < 2.5s)
- [ ] Responsive en móvil (images no se distorsionan)

### Test local:

```bash
npm run dev
# Abre http://localhost:3000
# Inspecciona Network tab para verificar que cargan las imágenes
# Verifica en móvil (Chrome DevTools mobile emulation)
```

---

## ⚡ Optimización de Imágenes

Después de integrar, optimiza el rendimiento:

### 1. Convierte JPG a WebP (reducir tamaño 25-35%)

```bash
# Instala imagemagick o cwebp
cwebp public/images/hero/olivares-amanecer.jpg -o public/images/hero/olivares-amanecer.webp
```

### 2. Optimiza PNG

```bash
# Comprime PNG sin perder calidad
pngquant public/images/productos/caja-3x5l.png --ext .png --force
```

### 3. Lazy load imágenes no críticas

Usa `loading="lazy"` en imágenes de cards (no en hero que es LCP).

### 4. Srcset para diferentes resoluciones

```tsx
<picture>
  <source srcSet="/images/hero/olivares-amanecer.webp" type="image/webp" />
  <source srcSet="/images/hero/olivares-amanecer.jpg" type="image/jpeg" />
  <img src="/images/hero/olivares-amanecer.jpg" alt="Olivares Peñolite" />
</picture>
```

---

## 🚀 Deploy

Una vez integradas todas las imágenes:

```bash
# Commitea las imágenes
git add public/images/
git commit -m "feat: add cinematographic hero images

- Hero: olivares-amanecer.jpg (2K)
- Terroir: rama-aceitunas.png + mapa-topografico.svg (1K)
- Proceso: cosecha-manual, prensa, embotellado (1.5K)
- Productos: caja-3x5l, caja-6x2l (1K)
- Cierre: olivares-atardecer.jpg (2K)
- Decorativo: gota-aceite.png (1K)

Enhancement: +saturación 1.2x, +contraste 1.15x para look cinematográfico"

# Deploy a Vercel
vercel deploy --prod
```

---

## 🎨 Palets de Color Referencia

Si necesitas ajustar las imágenes en post-producción:

| Color | Hex | Uso |
|-------|-----|-----|
| Dorado | #C8961E | Acentos, luz |
| Verde Oliva | #2D4A2B | Fondos, tierra |
| Verde Oscuro | #243D0F | Sombras |
| Crema | #F5F1E8 | Texto, overlays |
| Negro | #060D03 | Fondos cinematográficos |

---

**Completado ✅ Web Peñolite lista para deployment de nivel Awwwards**
