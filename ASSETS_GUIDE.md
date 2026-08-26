# Guía de Assets Requeridos — SCA San Juan Bautista Peñolite

## Imágenes Necesarias para la Web Cinematográfica

Este documento lista todas las imágenes que necesitas generar o proporcionar para que el sitio cinematográfico sea completamente funcional.

---

## 📸 Prompts de Generación (Recraft V4.1 recomendado)

### **1. Hero Background — Olivares Peñolite al Amanecer**
- **Tipo:** Imagen de fondo (16:9)
- **Ubicación:** Hero section (cap 1)
- **Prompt:**
  ```
  Aerial drone shot of olive groves in Sierra de Segura at golden sunrise, 
  soft morning mist, warm golden light, lush green Picual olives, 
  mountain landscape at 840m altitude, breathtaking panoramic view, 
  cinematic quality, 8K, film grain subtle, color grading warm-cool balance
  ```
- **Características:**
  - Resolución: 2K mínimo (1920×1080)
  - Formato: JPG/WebP (comprimido para LCP rápido)
  - Estilos: Cinemático, tono dorado-verde

---

### **2. Rama con Aceitunas Maduras — Detalle Sensorial**
- **Tipo:** Producto shot (4:5)
- **Ubicación:** Puede usarse como hero overlay o en secciones de terroir
- **Prompt:**
  ```
  Close-up macro shot of ripe dark green olives on wooden branch, 
  fresh leaves with water droplets, shallow depth of field, 
  professional food photography, natural soft golden hour lighting, 
  hyperrealistic detail, 85mm macro lens effect, studio lighting
  ```
- **Características:**
  - Resolución: 1K (800×1000)
  - Formato: PNG con transparencia (para overlays)
  - Estilos: Lujo, producto premium

---

### **3. Mapa Topográfico de Peñolite**
- **Tipo:** Ilustración 3D estilizada (1:1)
- **Ubicación:** Sección Terroir (Cap 2)
- **Prompt:**
  ```
  3D stylized topographic map of Sierra de Segura region showing Peñolite location, 
  terrain elevation visualization with contour lines, earthy tones with olive green accents, 
  professional cartography style, high detail, isometric perspective
  ```
- **Características:**
  - Resolución: 1K (1000×1000)
  - Formato: PNG/SVG
  - Estilos: Profesional, minimalista

---

### **4. Cosecha Manual — Manos en el Olivar**
- **Tipo:** Foto documental (16:9)
- **Ubicación:** Sección Proceso (Cap 3)
- **Prompt:**
  ```
  Hands of farmer manually harvesting ripe olives from branches during harvest season, 
  traditional method, warm golden afternoon sunlight, authentic rural moment, 
  hyperrealistic photography, documentary style, emotional authentic capture, 
  worn hands, detail of leaves and branches
  ```
- **Características:**
  - Resolución: 1.5K
  - Formato: JPG
  - Estilos: Auténtico, emocional

---

### **5. Proceso de Prensa — Maquinaria Tradicional y Moderna**
- **Tipo:** Industrial photography (16:9)
- **Ubicación:** Sección Proceso (Cap 3)
- **Prompt:**
  ```
  Professional olive oil production: traditional stone press alongside modern hydraulic press, 
  detailed machinery with visible gears and pressure mechanisms, clean production facility, 
  golden olive oil visible in transparent containers, professional industrial photography, 
  high contrast dramatic lighting, cinematic composition
  ```
- **Características:**
  - Resolución: 1.5K
  - Formato: JPG
  - Estilos: Industrial, profesional

---

### **6. Línea de Embotellado — Producción Moderna**
- **Tipo:** Industrial photography (16:9)
- **Ubicación:** Sección Proceso (Cap 3)
- **Prompt:**
  ```
  Olive oil bottling line: modern automated production facility, 
  golden extra virgin olive oil flowing into glass bottles, 
  quality control checkpoints with technicians, professional industrial photography, 
  clean bright facility with warm professional lighting, hyperrealistic detail, 
  stainless steel equipment, safety uniforms
  ```
- **Características:**
  - Resolución: 1.5K
  - Formato: JPG
  - Estilos: Moderno, limpio, profesional

---

### **7. Caja 3 Garrafas × 5L — Producto Premium**
- **Tipo:** Product shot (4:5)
- **Ubicación:** Catálogo / Productos (Cap 4-5)
- **Prompt:**
  ```
  Premium product shot: olive oil glass bottle 5L with minimalist brand label, 
  wooden box containing 3 glass bottles, golden extra virgin oil visible through glass, 
  professional product photography with studio lighting, clean white or black background, 
  premium luxury packaging presentation, soft shadows, reflections
  ```
- **Características:**
  - Resolución: 1K
  - Formato: PNG (fondo transparente) o JPG (fondo blanco)
  - Estilos: Lujo, premium, catálogo

---

### **8. Caja 12 Garrafas × 2L — Formato Profesional**
- **Tipo:** Product shot (4:5)
- **Ubicación:** Catálogo / Productos (Cap 4-5)
- **Prompt:**
  ```
  Premium product shot: olive oil glass bottles 2L with minimalist label, 
  sturdy cardboard box containing 6 bottles arranged neatly, 
  professional packaging design visible, studio lighting with warm tones, 
  clean presentation, shadow details showing depth, professional product photography
  ```
- **Características:**
  - Resolución: 1K
  - Formato: PNG (fondo transparente) o JPG (fondo blanco)
  - Estilos: Lujo, profesional, catálogo

---

### **9. Olivares al Atardecer — Cierre Emocional**
- **Tipo:** Paisaje cinemático (16:9)
- **Ubicación:** Sección Cierre (Cap 7)
- **Prompt:**
  ```
  Aerial panoramic view of Sierra de Segura olive groves at sunset, 
  golden hour light with warm amber-orange tones, beautiful landscape photography, 
  mountain silhouettes in distance, peaceful evening atmosphere, cinematic beauty, 
  soft haze over valleys, 8K quality, film grain, color grading warm-golden
  ```
- **Características:**
  - Resolución: 2K
  - Formato: JPG/WebP
  - Estilos: Cinemático, emotivo, épico

---

### **10. Gota de Aceite Macro — Detalle Sensorial**
- **Tipo:** Macro photography (1:1 o 4:5)
- **Ubicación:** Decorativa / Secciones destacadas
- **Prompt:**
  ```
  Macro photography: single perfect spherical drop of golden extra virgin olive oil 
  suspended in air with motion blur, macro detail with shallow depth of field, 
  beautiful liquid drop shape with light refractions, professional food photography, 
  studio lighting with accent lights, hyperrealistic, water drops nearby
  ```
- **Características:**
  - Resolución: 1K
  - Formato: PNG (fondo transparente)
  - Estilos: Lujo, sensorial, detalle

---

## 🗂️ Estructura de Carpetas para Assets

```
/public
├── images
│   ├── hero
│   │   └── olivares-amanecer.jpg (2K)
│   ├── terroir
│   │   ├── rama-aceitunas.png
│   │   └── mapa-topografico.svg
│   ├── proceso
│   │   ├── cosecha-manual.jpg
│   │   ├── prensa.jpg
│   │   └── embotellado.jpg
│   ├── productos
│   │   ├── caja-3x5l.png
│   │   └── caja-12x2l.png
│   ├── cierre
│   │   └── olivares-atardecer.jpg (2K)
│   └── decorativo
│       └── gota-aceite.png
└── videos
    └── (para futuros vídeos de fondo)
```

---

## 📋 Formato de Exportación Recomendado

| Tipo | Formato | Compresión | Fallback |
|------|---------|-----------|----------|
| Hero/Paisaje | WebP/AV1 | 60% quality | JPG 85% quality |
| Producto | PNG | Lossless | JPG 90% quality |
| Decorativo | PNG | 8-bit optimized | GIF |
| 3D/Ilustración | SVG o PNG | Vector preferred | PNG |

---

## 🎬 Consideraciones Cinematográficas

- **Paleta de color:** Verde oliva (#2D4A2B), Dorado (#C8961E), Crema (#F5F1E8), Negro (#060D03)
- **Tono visual:** Premium, auténtico, cinemático, sin artificialidad
- **Lighting:** Luz dorada, suave, con contrastes cinematográficos
- **Grain:** Película ligera (film grain sutil, 0.5-1%)
- **Depth of field:** Poca profundidad para producto, profunda para paisajes
- **Composición:** Regla de tercios, líneas guía, composición balanceada

---

## 🔄 Alternativa: Usar Imágenes Existentes

Si ya tienes fotos/vídeos de Peñolite:
1. Cargalas en `/public/images/`
2. Actualiza las rutas en los componentes (busca `backgroundImage` y `<img>`)
3. Optimiza con herramientas como TinyPNG o Squoosh

---

## ✅ Checklist de Implementación

- [ ] Generar todas las 10 imágenes
- [ ] Exportar en formatos recomendados
- [ ] Crear estructura de carpetas en `/public/images/`
- [ ] Actualizar rutas en componentes (buscar `TODO: ADD IMAGE`)
- [ ] Optimizar tamaño con WebP/AVIF
- [ ] Probar carga en mobile (simular 4G)
- [ ] Verificar Core Web Vitals (LCP < 2.5s)

---

## 📞 Soporte

Cualquier duda sobre los prompts o generación contactar a:
- Email: sanjuanbautista.sca@gmail.com
- Repositorio: /web-cinematic/

