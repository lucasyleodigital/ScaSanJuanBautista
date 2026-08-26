# 🎬 Generador de Imágenes Cinematográficas — Peñolite

Script automático para generar 10 imágenes cinematográficas de nivel Awwwards usando **Recraft V4.1 API**.

## 📋 10 Imágenes a Generar

| # | Nombre | Carpeta | Formato | Uso |
|---|--------|---------|---------|-----|
| 1 | Olivares Amanecer | `hero/` | JPG 16:9 | Hero background |
| 2 | Rama Aceitunas | `terroir/` | PNG 4:5 | Terroir detail |
| 3 | Mapa Topográfico | `terroir/` | SVG 1:1 | Terroir map |
| 4 | Cosecha Manual | `proceso/` | JPG 16:9 | Proceso section |
| 5 | Prensa | `proceso/` | JPG 16:9 | Proceso section |
| 6 | Embotellado | `proceso/` | JPG 16:9 | Proceso section |
| 7 | Caja 3×5L | `productos/` | PNG 4:5 | Catálogo producto 1 |
| 8 | Caja 6×2L | `productos/` | PNG 4:5 | Catálogo producto 2 |
| 9 | Olivares Atardecer | `cierre/` | JPG 16:9 | Sección cierre |
| 10 | Gota Aceite Macro | `decorativo/` | PNG 1:1 | Detalles decorativos |

## 🚀 Instalación

### 1. Obtén API Key de Recraft

```bash
# Regístrate en https://app.recraft.ai/
# Cuenta gratuita con créditos iniciales
# Ve a Settings → API Keys
# Copia tu API key (ej: re_abc123xyz...)
```

### 2. Configura .env

```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita .env y agrega tu API key
# RECRAFT_API_KEY=re_tu_key_aqui
```

### 3. Instala dependencias

```bash
pip install requests pillow python-dotenv
# o si usas poetry:
poetry add requests pillow python-dotenv
```

## ▶️ Ejecutar

```bash
python scripts/generate-images.py
```

### Output esperado

```
🎬 GENERADOR DE IMÁGENES CINEMATOGRÁFICAS — Peñolite
======================================================================

📸 [1/10] olivares-amanecer
   Folder: hero
   Aspect: 16:9
  ⏳ Generando (16:9)...
    ✅ Guardado: olivares-amanecer.jpg
    ✨ Mejorado: olivares-amanecer.jpg

📸 [2/10] rama-aceitunas
   Folder: terroir
   Aspect: 4:5
  ⏳ Generando (4:5)...
    ✅ Guardado: rama-aceitunas.png
    ✨ Mejorado: rama-aceitunas.png

... [continues for 10 images]

======================================================================
✅ Generadas: 10/10
❌ Fallidas: 0/10

📁 Output: C:\Users\polch\Desktop\PROYECTOS\Nueva web SCA San juan bautista\web-cinematic\public\images\
```

## 🎨 Características del Script

✅ **Recraft V4.1** — Modelo cinematográfico de máxima calidad  
✅ **Prompts optimizados** — Enfocados en dorado/verde/crema Peñolite  
✅ **Aspect ratios correctos** — 16:9 (paisajes), 4:5 (productos), 1:1 (detalles)  
✅ **Auto-enhancement** — Satura y optimiza cada JPG  
✅ **Carpetas automáticas** — Crea `/public/images/{hero,terroir,...}`  
✅ **Rate limiting** — 2s entre generaciones (respeta limits de API)  
✅ **Error handling** — Continúa si falla una imagen, reporta al final  

## 📁 Estructura de Output

```
public/images/
├── hero/
│   └── olivares-amanecer.jpg           (2K, LCP)
├── terroir/
│   ├── rama-aceitunas.png              (1K, transparencia)
│   └── mapa-topografico.svg            (1K, cartografía)
├── proceso/
│   ├── cosecha-manual.jpg              (1.5K, documental)
│   ├── prensa.jpg                      (1.5K, industrial)
│   └── embotellado.jpg                 (1.5K, industrial)
├── productos/
│   ├── caja-3x5l.png                   (1K, catálogo)
│   └── caja-6x2l.png                   (1K, catálogo)
├── cierre/
│   └── olivares-atardecer.jpg          (2K, épico)
└── decorativo/
    └── gota-aceite.png                 (1K, macro)
```

## 🔧 Solucionar Problemas

### "RECRAFT_API_KEY no configurada"
→ Copia `.env.example` a `.env` y agrega tu key

### "Error 401: Unauthorized"
→ La API key es inválida o expiró
→ Regenera en https://app.recraft.ai/settings/api-keys

### "Error 429: Too many requests"
→ Esperando rate limit (el script reinicia automáticamente)

### "Generación vacía o negra"
→ El prompt generó resultado inesperado
→ Regenera con `python scripts/generate-images.py`

### "PIL: cannot identify image file"
→ Descarga corrompida (raro), reintentar

## 💰 Costos Estimados

**Recraft V4.1** (precios aprox., verificar en https://recraft.ai/)
- 1 imagen 4K ≈ 0.5 - 1 crédito
- 1 imagen 2K ≈ 0.3 - 0.5 créditos
- 10 imágenes totales ≈ 5-8 créditos

Cuenta gratuita: ~50 créditos iniciales → suficiente para varias pasadas.

## 📸 Próximos Pasos Después de Generar

1. **Verifica las imágenes**
   ```bash
   open public/images/  # Mac
   explorer public\images\  # Windows
   ```

2. **Reemplaza placeholders en componentes**
   - HeroV2.tsx → hero/olivares-amanecer.jpg
   - TerroirV2.tsx → terroir/rama-aceitunas.png + mapa-topografico.svg
   - ProcesoV2.tsx → proceso/*.jpg
   - CatalogV2.tsx → productos/*.png
   - CierreV2.tsx → cierre/olivares-atardecer.jpg

3. **Optimiza imágenes para web**
   ```bash
   # Comprime JPG sin perder calidad
   # Convierte a WebP si necesitas más
   ```

4. **Ejecuta desarrollo local**
   ```bash
   npm run dev
   # Abre http://localhost:3000
   # Verifica que todas las imágenes cargan
   ```

5. **Deploy a Vercel**
   ```bash
   git add public/images/
   git commit -m "chore: add cinematographic hero images"
   vercel deploy --prod
   ```

## 🎬 Paleta Cinematográfica

Todas las imágenes están optimizadas para:
- **Dorado:** `#C8961E` (acentos, luz)
- **Verde Oliva:** `#2D4A2B` (fondos, tierra)
- **Verde Oscuro:** `#243D0F` (sombras)
- **Crema:** `#F5F1E8` (texto, superposiciones)
- **Negro:** `#060D03` (fondos cinematográficos)

El script no modifica paletas, pero Recraft V4.1 entiende "warm golden tones" y "olive green accents" en los prompts.

## 📝 Personalizar Prompts

Si quieres ajustar un prompt específico, edita `scripts/generate-images.py`:

```python
IMAGES = [
    {
        "id": "olivares-amanecer",
        "prompt": """
            Tu prompt personalizado aquí.
            Puedes ser más específico o cambiar el tone.
        """,
    },
]
```

Luego vuelve a ejecutar — solo regenerará los cambios.

## 🆘 Contacto / Soporte

- **Recraft Docs:** https://docs.recraft.ai/
- **API Reference:** https://api.recraft.ai/docs
- **Issues:** Reporta en el log del script

---

**Hecho con 🎨 para SCA San Juan Bautista Peñolite**
