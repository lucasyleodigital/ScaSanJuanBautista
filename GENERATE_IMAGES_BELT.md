# 🎬 Generador de Imágenes con inference.sh belt CLI

**Opción recomendada** para generar las 10 imágenes cinematográficas usando Seedream 4.5 (2K-4K quality).

## ⚡ Quick Start

```bash
# 1. Instala belt (una sola vez)
npm install -g @inference-sh/belt

# 2. Autentica
belt login

# 3. Genera las 10 imágenes (Windows)
.\scripts\generate-with-belt.ps1

# o (macOS/Linux)
bash scripts/generate-with-belt.sh
```

**Tiempo:** ~5 minutos  
**Costo:** Muy económico (inference.sh tiene precios competitivos)  
**Calidad:** Excelente — Seedream 4.5 = 2K-4K cinematic

---

## 📋 Instalación Detallada

### 1️⃣ Instala `belt` CLI globalmente

```bash
npm install -g @inference-sh/belt
```

Verifica:
```bash
belt --version
```

### 2️⃣ Autentica con inference.sh

```bash
belt login
```

Se abre tu navegador → crea cuenta gratuita en https://inference.sh o inicia sesión.

### 3️⃣ Genera imágenes

**Windows (PowerShell):**
```powershell
.\scripts\generate-with-belt.ps1
```

**macOS/Linux (Bash):**
```bash
bash scripts/generate-with-belt.sh
```

---

## 🎨 Modelos Disponibles

| Modelo | App ID | Mejor para | Velocidad | Precio |
|--------|--------|-----------|-----------|--------|
| **Seedream 4.5** ⭐ | `bytedance/seedream-4-5` | Cinematografía 2K-4K | Media | Económico |
| FLUX.2 Klein | `falai/flux-2-klein-lora` | Rápido + LoRA | Muy rápido | Muy barato |
| P-Image | `pruna/p-image` | Rápido + económico | Muy rápido | Muy barato |
| GPT-Image-2 | `openai/gpt-image-2` | OpenAI quality | Media | Medio |
| Grok Imagine | `xai/grok-imagine-image` | xAI model | Media | Económico |
| FLUX Dev LoRA | `falai/flux-dev-lora` | Alta calidad | Lento | Medio |

**Recommended:** Seedream 4.5 (el script usa este por defecto)

---

## 📸 Qué genera el script

```
public/images/
├── hero/              olivares-amanecer.jpg (2K, 16:9)
├── terroir/           rama-aceitunas.png (1K, 4:5)
├── proceso/           
│                      ├── cosecha-manual.jpg (1.5K, 16:9)
│                      ├── prensa.jpg (1.5K, 16:9)
│                      └── embotellado.jpg (1.5K, 16:9)
├── productos/         
│                      ├── caja-3x5l.png (1K, 4:5)
│                      └── caja-6x2l.png (1K, 4:5)
├── cierre/            olivares-atardecer.jpg (2K, 16:9)
└── decorativo/        gota-aceite.png (1K, 1:1)
```

**Nota:** Mapa topográfico (terroir/mapa-topografico.svg) se genera después manualmente con Recraft.

---

## 🔧 Personalizar el Script

### Cambiar modelo

Edita el script (línea 10) y cambia:

```powershell
# Antes
$MODEL = "bytedance/seedream-4-5"

# Después (ej: FLUX Klein más rápido)
$MODEL = "falai/flux-2-klein-lora"
```

### Cambiar aspecto de ratio

En el input JSON, modifica:
```powershell
aspect_ratio = "9:16"  # Vertical
aspect_ratio = "4:3"   # Square-ish
```

### Agregar imágenes nuevas

Agrega al array `$IMAGES`:
```powershell
@{
    idx = "10"
    id = "tu-imagen"
    folder = "tu-carpeta"
    ext = "jpg"
    prompt = "Tu prompt aquí"
}
```

---

## ⚙️ Alternativa: Generar Manualmente

Si prefieres generar imagen por imagen:

```bash
# Ejemplo: Una imagen de Olivares al Amanecer
belt app run bytedance/seedream-4-5 --input '{
  "prompt": "Aerial drone shot of olive groves in Sierra de Segura at golden sunrise, soft morning mist, warm golden light, lush green Picual olives, mountain landscape at 840m altitude, breathtaking panoramic view, cinematic quality, 8K, film grain subtle, color grading warm-cool balance",
  "aspect_ratio": "16:9"
}'
```

---

## 💰 Costos Estimados

**inference.sh Pricing (aproximado):**
- Seedream 4.5: ~$0.05-0.10 / imagen
- FLUX Klein: ~$0.01-0.02 / imagen
- P-Image: ~$0.01 / imagen

**Total para 10 imágenes:**
- Con Seedream: ~$0.50-1.00
- Con FLUX Klein: ~$0.10-0.20

**Crédito gratuito:** Nuevo usuario tiene créditos iniciales (generalmente $5-10)

---

## 🐛 Solucionar Problemas

### "Command not found: belt"

```bash
# Reinstala globalmente
npm install -g @inference-sh/belt

# Verifica que funciona
belt --version
```

### "Error: Unauthorized"

```bash
# Vuelve a autenticar
belt login
```

### "API Rate Limit"

El script espera 3 segundos entre imágenes. Si falla por rate limit:
- Aumenta `Start-Sleep -Seconds 3` a `5` en el script
- O regenera después de 5 minutos

### "Output file not found"

Asegúrate de que:
1. La carpeta `public/images/` existe
2. Tienes permisos de escritura
3. El comando `belt` generó output (no error silencioso)

---

## 📝 Pasos Completos (de inicio a fin)

```bash
# 1. Instala belt (solo 1 vez)
npm install -g @inference-sh/belt

# 2. Autentica
belt login

# 3. Genera 9 imágenes
.\scripts\generate-with-belt.ps1

# 4. Espera a que terminen (5-10 min)
# Verifica en public/images/

# 5. Genera manualmente el mapa topográfico con Recraft
#    (usa python scripts/generate-images.py)

# 6. Sigue INTEGRATION_GUIDE.md para conectar imágenes

# 7. Test local
npm run dev
# Abre http://localhost:3000

# 8. Commit + Deploy
git add public/images/
git commit -m "chore: add cinematographic images"
vercel deploy --prod
```

---

## 🎬 Ejemplo: Generar con Diferentes Modelos

### Opción 1: Seedream 4.5 (Recomendado)
```bash
$MODEL = "bytedance/seedream-4-5"
# Mejor para: Cinematografía, 2K-4K, warm tones
```

### Opción 2: FLUX Klein (Más Rápido)
```bash
$MODEL = "falai/flux-2-klein-lora"
# Mejor para: Rápido, económico, buena calidad
```

### Opción 3: Grok Imagine (xAI)
```bash
$MODEL = "xai/grok-imagine-image"
# Mejor para: Variedad de aspectos, buen detail
```

---

## 🚀 Próximos Pasos

1. ✅ Instala belt
2. ✅ Autentica
3. ✅ Ejecuta el script PowerShell
4. ✅ Verifica las imágenes en `/public/images/`
5. ✅ Genera mapa topográfico manualmente con Recraft
6. ✅ Sigue `INTEGRATION_GUIDE.md`
7. ✅ Deploy a Vercel

---

**Hecho con 🎨 para SCA San Juan Bautista Peñolite**
