# Descargar imágenes GRATUITAS de Pexels/Pixabay para los placeholders
# Sin costo, sin API key, URLs públicas directas

$PROJECT_ROOT = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$PUBLIC_IMAGES = Join-Path $PROJECT_ROOT "public\images"

# Crear carpetas
@("hero", "terroir", "proceso", "productos", "cierre", "decorativo") | ForEach-Object {
    $folder = Join-Path $PUBLIC_IMAGES $_
    if (-not (Test-Path $folder)) {
        New-Item -ItemType Directory -Force -Path $folder | Out-Null
    }
}

Write-Host "🎨 DESCARGAR IMÁGENES GRATUITAS — Pexels/Pixabay" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

# URLs de imágenes gratuitas (Pexels direct links - muy estables)
# Formato: @{ file, url }
$FREE_IMAGES = @(
    @{
        file = "public\images\hero\olivares-amanecer.jpg"
        url = "https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=1920"
        desc = "Olivares Amanecer (Paisaje oro/verde)"
    },
    @{
        file = "public\images\terroir\rama-aceitunas.png"
        url = "https://images.pexels.com/photos/5632618/pexels-photo-5632618.jpeg?auto=compress&cs=tinysrgb&w=800"
        desc = "Rama Aceitunas (Macro detalle)"
    },
    @{
        file = "public\images\proceso\cosecha-manual.jpg"
        url = "https://images.pexels.com/photos/4551832/pexels-photo-4551832.jpeg?auto=compress&cs=tinysrgb&w=1600"
        desc = "Cosecha Manual (Manos en acción)"
    },
    @{
        file = "public\images\proceso\prensa.jpg"
        url = "https://images.pexels.com/photos/2351828/pexels-photo-2351828.jpeg?auto=compress&cs=tinysrgb&w=1600"
        desc = "Proceso de Prensa (Maquinaria industrial)"
    },
    @{
        file = "public\images\proceso\embotellado.jpg"
        url = "https://images.pexels.com/photos/3962289/pexels-photo-3962289.jpeg?auto=compress&cs=tinysrgb&w=1600"
        desc = "Embotellado (Botellas premium)"
    },
    @{
        file = "public\images\productos\caja-3x5l.png"
        url = "https://images.pexels.com/photos/3407817/pexels-photo-3407817.jpeg?auto=compress&cs=tinysrgb&w=800"
        desc = "Caja 3×5L (Producto premium)"
    },
    @{
        file = "public\images\productos\caja-6x2l.png"
        url = "https://images.pexels.com/photos/3407817/pexels-photo-3407817.jpeg?auto=compress&cs=tinysrgb&w=800"
        desc = "Caja 6×2L (Producto premium)"
    },
    @{
        file = "public\images\cierre\olivares-atardecer.jpg"
        url = "https://images.pexels.com/photos/8430975/pexels-photo-8430975.jpeg?auto=compress&cs=tinysrgb&w=1920"
        desc = "Olivares Atardecer (Paisaje épico)"
    },
    @{
        file = "public\images\decorativo\gota-aceite.png"
        url = "https://images.pexels.com/photos/3407817/pexels-photo-3407817.jpeg?auto=compress&cs=tinysrgb&w=400"
        desc = "Gota Aceite (Detalle decorativo)"
    }
)

$downloaded = 0
$failed = 0

foreach ($img in $FREE_IMAGES) {
    $relativePath = $img.file -replace [regex]::Escape($PROJECT_ROOT), "."
    $fullPath = Join-Path $PROJECT_ROOT $img.file

    Write-Host "📸 Descargando: $($img.desc)" -ForegroundColor Magenta

    try {
        # Descargar imagen con User-Agent
        $headers = @{
            'User-Agent' = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        Invoke-WebRequest -Uri $img.url -OutFile $fullPath -UseBasicParsing -Headers $headers

        $fileSize = (Get-Item $fullPath).Length / 1KB
        Write-Host "    ✅ Guardado: $($img.id).$($img.ext) ($([Math]::Round($fileSize, 0)) KB)" -ForegroundColor Green
        $downloaded++
    }
    catch {
        Write-Host "    ⚠️  Error: $($_.Exception.Message)" -ForegroundColor Yellow
        $failed++
    }

    Start-Sleep -Milliseconds 500  # Rate limit amigable
}

Write-Host ""
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "✅ Descargadas: $downloaded/9" -ForegroundColor Green

if ($failed -gt 0) {
    Write-Host "❌ Fallidas: $failed/9" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "💡 Solución: Descarga imágenes manualmente:"
    Write-Host "   1. Ve a https://pexels.com"
    Write-Host "   2. Busca: 'olive harvest sunset landscape'"
    Write-Host "   3. Descarga 1920x1080 JPG"
    Write-Host "   4. Guarda en public/images/{carpeta}/"
}

Write-Host ""
Write-Host "📁 Output: $PUBLIC_IMAGES"
Write-Host ""
Write-Host "📸 Imágenes descargadas:"
Get-ChildItem -Path $PUBLIC_IMAGES -Recurse -File | ForEach-Object {
    $size = $_.Length / 1KB
    Write-Host "   ✅ $($_.FullName -replace [regex]::Escape($PROJECT_ROOT), '.')"
}
Write-Host ""
Write-Host "🎬 Siguientes pasos:"
Write-Host "   1. ✅ Imágenes descargadas"
Write-Host "   2. Sigue INTEGRATION_GUIDE.md para conectar en componentes"
Write-Host "   3. npm run dev para preview"
Write-Host "   4. vercel deploy --prod para deploy"
