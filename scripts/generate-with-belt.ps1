# Generador de 10 imágenes cinematográficas usando inference.sh belt CLI
# Modelo: Seedream 4.5 (2K-4K cinematic quality)
#
# SETUP:
#   1. npm install -g @inference-sh/belt
#   2. belt login
#   3. .\scripts\generate-with-belt.ps1

$PROJECT_ROOT = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$PUBLIC_IMAGES = Join-Path $PROJECT_ROOT "public\images"
$MODEL = "bytedance/seedream-4-5"

# Crear carpetas
@("hero", "terroir", "proceso", "productos", "cierre", "decorativo") | ForEach-Object {
    $folder = Join-Path $PUBLIC_IMAGES $_
    if (-not (Test-Path $folder)) {
        New-Item -ItemType Directory -Force -Path $folder | Out-Null
    }
}

Write-Host "🎬 GENERADOR DE IMÁGENES — Seedream 4.5 (inference.sh)" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "Modelo: $MODEL"
Write-Host "Destino: $PUBLIC_IMAGES"
Write-Host ""

# Array de imágenes
$IMAGES = @(
    @{
        idx = "1"
        id = "olivares-amanecer"
        folder = "hero"
        ext = "jpg"
        prompt = "Aerial drone shot of olive groves in Sierra de Segura at golden sunrise, soft morning mist, warm golden light, lush green Picual olives, mountain landscape at 840m altitude, breathtaking panoramic view, cinematic quality, 8K, film grain subtle, color grading warm-cool balance"
    },
    @{
        idx = "2"
        id = "rama-aceitunas"
        folder = "terroir"
        ext = "png"
        prompt = "Close-up macro shot of ripe dark green olives on wooden branch, fresh leaves with water droplets, shallow depth of field, professional food photography, natural soft golden hour lighting, hyperrealistic detail, 85mm macro lens effect, studio lighting"
    },
    @{
        idx = "3"
        id = "cosecha-manual"
        folder = "proceso"
        ext = "jpg"
        prompt = "Hands of farmer manually harvesting ripe olives from branches during harvest season, traditional method, warm golden afternoon sunlight, authentic rural moment, hyperrealistic photography, documentary style, emotional authentic capture, worn hands, detail of leaves and branches"
    },
    @{
        idx = "4"
        id = "prensa"
        folder = "proceso"
        ext = "jpg"
        prompt = "Professional olive oil production: traditional stone press alongside modern hydraulic press, detailed machinery with visible gears and pressure mechanisms, clean production facility, golden olive oil visible in transparent containers, professional industrial photography, high contrast dramatic lighting"
    },
    @{
        idx = "5"
        id = "embotellado"
        folder = "proceso"
        ext = "jpg"
        prompt = "Olive oil bottling line: modern automated production facility, golden extra virgin olive oil flowing into glass bottles, quality control checkpoints with technicians, professional industrial photography, clean bright facility with warm professional lighting, hyperrealistic detail, stainless steel equipment"
    },
    @{
        idx = "6"
        id = "caja-3x5l"
        folder = "productos"
        ext = "png"
        prompt = "Premium product shot: olive oil glass bottle 5L with minimalist brand label, wooden box containing 3 glass bottles, golden extra virgin oil visible through glass, professional product photography with studio lighting, clean white background, premium luxury packaging presentation, soft shadows, reflections"
    },
    @{
        idx = "7"
        id = "caja-6x2l"
        folder = "productos"
        ext = "png"
        prompt = "Premium product shot: olive oil glass bottles 2L with minimalist label, sturdy cardboard box containing 6 bottles arranged neatly, professional packaging design visible, studio lighting with warm tones, clean presentation, shadow details showing depth, professional product photography, luxury feel"
    },
    @{
        idx = "8"
        id = "olivares-atardecer"
        folder = "cierre"
        ext = "jpg"
        prompt = "Aerial panoramic view of Sierra de Segura olive groves at sunset, golden hour light with warm amber-orange tones, beautiful landscape photography, mountain silhouettes in distance, peaceful evening atmosphere, cinematic beauty, soft haze over valleys, 8K quality, film grain, color grading warm-golden"
    },
    @{
        idx = "9"
        id = "gota-aceite"
        folder = "decorativo"
        ext = "png"
        prompt = "Macro photography: single perfect spherical drop of golden extra virgin olive oil suspended in air with motion blur, macro detail with shallow depth of field, beautiful liquid drop shape with light refractions, professional food photography, studio lighting with accent lights, hyperrealistic"
    }
)

Write-Host "⚠️  Nota: Mapa topográfico se genera manualmente con Recraft" -ForegroundColor Yellow
Write-Host ""

# Generar imágenes
foreach ($img in $IMAGES) {
    $output_dir = Join-Path $PUBLIC_IMAGES $img.folder
    $output_file = Join-Path $output_dir "$($img.id).$($img.ext)"

    Write-Host "📸 [$($img.idx)/9] $($img.id) ($($img.folder))" -ForegroundColor Magenta

    # Crear JSON input
    $input_json = @{
        prompt = $img.prompt
        aspect_ratio = "16:9"
        output_format = $img.ext
    } | ConvertTo-Json -Compress

    # Ejecutar belt
    try {
        & belt app run $MODEL --input $input_json | Out-File -FilePath $output_file -Encoding UTF8
        Write-Host "    ✅ Guardado: $($img.id).$($img.ext)" -ForegroundColor Green
    }
    catch {
        Write-Host "    ❌ Error: $_" -ForegroundColor Red
    }

    # Rate limit
    Start-Sleep -Seconds 3
}

Write-Host ""
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "✅ Generadas 9/10 imágenes" -ForegroundColor Green
Write-Host "⚠️  Falta: mapa-topografico.svg (genera manualmente con Recraft)" -ForegroundColor Yellow
Write-Host ""
Write-Host "📁 Output: $PUBLIC_IMAGES"
Write-Host "🎨 Siguientes pasos:"
Write-Host "   1. Verifica las imágenes en /public/images/"
Write-Host "   2. Genera mapa topográfico con Recraft V4.1"
Write-Host "   3. Ejecuta: npm run dev"
Write-Host "   4. Deploy: vercel deploy --prod"
