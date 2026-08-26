# 🆓 GENERAR IMÁGENES COMPLETAMENTE GRATIS

Si no tienes presupuesto, tienes **3 opciones 100% gratuitas** para obtener imágenes cinematográficas.

---

## ✅ OPCIÓN 1: Descargar de Unsplash/Pexels (Más Rápido)

Imágenes de alta calidad, completamente gratuitas, licencia CC0.

### Ejecuta el script:

```powershell
# Windows
.\scripts\download-free-images.ps1

# macOS/Linux
bash scripts/download-free-images.sh
```

**Tiempo:** 2 minutos  
**Costo:** $0  
**Calidad:** 4K, profesional  

---

## ✅ OPCIÓN 2: Generar Localmente con Stable Diffusion (Gratis)

Instala Stable Diffusion localmente (sin pagar nada).

### Setup:

```bash
# 1. Instala Python 3.10+
# 2. Descarga Stable Diffusion WebUI
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
cd stable-diffusion-webui

# 3. Ejecuta
./webui.bat  # Windows
./webui.sh   # Mac/Linux

# Se abre en http://localhost:7860
```

### Usar en la web:

1. Pega el prompt en "Prompt" field
2. Ajusta:
   - Width: 1920 (para 16:9)
   - Height: 1080 (para 16:9)
   - Steps: 30-50 (más = mejor calidad)
   - Sampler: DPM++ 2M Karras
3. Click "Generate"
4. Descarga la imagen → guarda en `/public/images/`

**Tiempo:** 5-10 min por imagen (depende de GPU)  
**Costo:** $0 (solo electricidad)  
**Calidad:** Buena (3K-4K)  
**Nota:** Necesitas GPU decente (8GB+ VRAM recomendado)

---

## ✅ OPCIÓN 3: Hugging Face Spaces (Gratis + Código Abierto)

Modelos de IA en el navegador, sin instalar nada.

### 1. Open Hugging Face Spaces

Ve a: https://huggingface.co/spaces

### 2. Busca estos spaces gratuitos:

| Space | Modelo | Link |
|-------|--------|------|
| **Gradio** | Stable Diffusion 3 | https://huggingface.co/spaces/Stability-AI/stable-diffusion-3-5-large-turbo |
| Openjourney | Midjourney-like | https://huggingface.co/spaces/openjourney-community/openjourney |
| Kandinsky | Russian SOTA | https://huggingface.co/spaces/kandinsky-community/kandinsky-3 |
| FLUX.1 | Texto-imagen | https://huggingface.co/spaces/black-forest-labs/FLUX.1-dev |

### 3. Genera imágenes

1. Pega el prompt
2. Click "Generate"
3. Descarga → guarda en `/public/images/`

**Tiempo:** 1-3 min por imagen  
**Costo:** $0  
**Calidad:** Excelente (2K-4K)  
**Ventaja:** Sin instalar nada, directo en navegador

---

## 🎨 RECOMENDACIÓN: Hybrid Approach

1. **Descarga de Unsplash** (rápido) → 8 imágenes
2. **Edita en Canva** (gratis) → añade dorado/verde Peñolite
3. **Genera mapa topográfico** → usa SVG manualmente

**Tiempo total:** 10 minutos  
**Costo:** $0  
**Resultado:** Profesional

---

## 📥 OPCIÓN 1: Script de Descarga (Recomendado)

### Ejecuta:

```powershell
.\scripts\download-free-images.ps1
```

Descarga 9 imágenes directamente de Unsplash.

### Qué obtiene:

```
public/images/
├── hero/
│   └── olivares-amanecer.jpg ✅
├── terroir/
│   └── rama-aceitunas.png ✅
├── proceso/
│   ├── cosecha-manual.jpg ✅
│   ├── prensa.jpg ✅
│   └── embotellado.jpg ✅
├── productos/
│   ├── caja-3x5l.png ✅
│   └── caja-6x2l.png ✅
├── cierre/
│   └── olivares-atardecer.jpg ✅
└── decorativo/
    └── gota-aceite.png ✅
```

**Nota:** Mapa topográfico necesita generarse manualmente.

---

## 🎨 CREAR MAPA TOPOGRÁFICO (Manual)

### Opción A: Canva (Gratis)

1. https://canva.com
2. "Create Design" → Custom → 1000×1000px
3. Busca "topographic map" template
4. Personaliza colores a verde oliva (#2D4A2B)
5. Descarga como SVG/PNG
6. Guarda en `public/images/terroir/mapa-topografico.svg`

### Opción B: Inkscape (Gratis, Código Abierto)

1. Descarga https://inkscape.org/
2. Crea mapa manualmente con formas
3. Exporta como SVG
4. Guarda en `public/images/terroir/mapa-topografico.svg`

### Opción C: Usar Online Generator

https://www.tools-online.com/topographic-map-generator

1. Ingresa coordenadas de Jaén, España
2. Genera mapa
3. Descarga
4. Guarda en `public/images/terroir/`

---

## 🔧 OPCIÓN 2: Stable Diffusion Local

### Requisitos:

- GPU NVIDIA (8GB+ VRAM)
- Python 3.10+
- 10GB disco libre

### Instalación Rápida:

```bash
# Windows
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
cd stable-diffusion-webui
webui.bat

# macOS
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
cd stable-diffusion-webui
bash webui.sh

# Linux
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
cd stable-diffusion-webui
bash webui.sh --xformers
```

### Prompts a usar (copiar de GENERATE_IMAGES.md)

Genera imágenes con:
- Steps: 30-50
- Width: 1920 / Height: 1080 (16:9)
- Sampler: DPM++ 2M Karras

---

## 🌐 OPCIÓN 3: Hugging Face Spaces (Más Fácil)

### Top Spaces Gratuitos:

1. **FLUX.1-dev** (Mejor calidad)
   https://huggingface.co/spaces/black-forest-labs/FLUX.1-dev

2. **Stable Diffusion 3.5 Turbo** (Rápido)
   https://huggingface.co/spaces/Stability-AI/stable-diffusion-3-5-large-turbo

3. **Kandinsky 3** (Alternativa)
   https://huggingface.co/spaces/kandinsky-community/kandinsky-3

### Cómo usar:

1. Abre el link
2. Scroll down → "Prompt" field
3. Pega prompt de GENERATE_IMAGES.md
4. Ajusta:
   - Height: 1080 (para 16:9)
   - Width: 1920
   - Steps: 30
5. Click "Run"
6. Espera 1-3 minutos
7. Descarga imagen → guarda en `/public/images/`

---

## 📸 Prompts Cinematográficos para Copiar

### Hero: Olivares Amanecer

```
Aerial drone shot of olive groves in Sierra de Segura at golden sunrise, 
soft morning mist, warm golden light, lush green Picual olives, 
mountain landscape at 840m altitude, breathtaking panoramic view, 
cinematic quality, 8K, film grain subtle, color grading warm-cool balance
```

### Terroir: Rama Aceitunas

```
Close-up macro shot of ripe dark green olives on wooden branch, 
fresh leaves with water droplets, shallow depth of field, 
professional food photography, natural soft golden hour lighting, 
hyperrealistic detail, 85mm macro lens effect, studio lighting
```

### Proceso: Cosecha Manual

```
Hands of farmer manually harvesting ripe olives from branches during harvest season, 
traditional method, warm golden afternoon sunlight, authentic rural moment, 
hyperrealistic photography, documentary style, emotional authentic capture, 
worn hands, detail of leaves and branches
```

*(Copia el resto de `GENERATE_IMAGES.md`)*

---

## ✅ CHECKLIST: Obtén Imágenes Gratis

- [ ] Ejecuta `.\scripts\download-free-images.ps1` (opción más rápida)
- [ ] O instala Stable Diffusion localmente
- [ ] O usa Hugging Face Spaces en el navegador
- [ ] Genera mapa topográfico en Canva
- [ ] Verifica que todas las 10 imágenes están en `/public/images/`
- [ ] Sigue `INTEGRATION_GUIDE.md`
- [ ] `npm run dev` para preview
- [ ] `vercel deploy --prod` para deploy

---

## 🎯 OPCIÓN RECOMENDADA (Mi Favorita)

1. **Ejecuta el script** (2 min)
   ```powershell
   .\scripts\download-free-images.ps1
   ```

2. **Crea mapa en Canva** (3 min)
   ```
   https://canva.com → Topographic Map → Personaliza → Descarga SVG
   ```

3. **Integra en componentes** (5 min)
   - Sigue `INTEGRATION_GUIDE.md`

4. **Preview local** (1 min)
   ```bash
   npm run dev
   ```

5. **Deploy** (1 min)
   ```bash
   vercel deploy --prod
   ```

**Total: 12 minutos | Costo: $0**

---

## 📊 Comparación: Todas las Opciones

| Opción | Tiempo | Costo | Calidad | Facilidad |
|--------|--------|-------|---------|-----------|
| Unsplash Download | 2 min | $0 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Stable Diffusion Local | 30+ min | $0 | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Hugging Face Spaces | 30 min | $0 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Recraft V4.1 | 5 min | €5-10 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| DALL-E 3 | 10 min | $5-10 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

**Mi recomendación:** Unsplash Download (más rápido, gratis, buena calidad)

---

## 🚀 Comienza Ahora

```powershell
# 1. Descarga imágenes gratis
.\scripts\download-free-images.ps1

# 2. Crea mapa topográfico en Canva
# https://canva.com → Topographic Map

# 3. Integra en la web
# Sigue INTEGRATION_GUIDE.md

# 4. Preview
npm run dev

# 5. Deploy
vercel deploy --prod
```

**¡Listo! Web Peñolite lista para Awwwards sin gastar un euro.** 🎉

---

**Hecho con 🎨 para SCA San Juan Bautista Peñolite**
