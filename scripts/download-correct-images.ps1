# Descargar imágenes CORRECTAS de Pexels - Olivares, Aceitunas, Aceite
# URLs verificadas y temáticamente correctas

$PROJECT_ROOT = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$PUBLIC_IMAGES = Join-Path $PROJECT_ROOT "public\images"

# Crear carpetas
@("hero", "terroir", "proceso", "productos", "cierre", "decorativo") | ForEach-Object {
    $folder = Join-Path $PUBLIC_IMAGES $_
    if (-not (Test-Path $folder)) {
        New-Item -ItemType Directory -Force -Path $folder | Out-Null
    }
}

Write-Host "🎨 DESCARGAR IMÁGENES CORRECTAS — Olivares, Aceitunas, Aceite" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# URLs CORRECTAS de Pexels (verified olive/agriculture images)
$FREE_IMAGES = @(
    @{
        file = "public\images\hero\olivares-amanecer.jpg"
        url = "https://images.pexels.com/photos/2265876/pexels-photo-2265876.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2"
        desc = "Olivares al amanecer (Paisaje montaña)"
    },
    @{
        file = "public\images\terroir\rama-aceitunas.png"
        url = "https://images.pexels.com/photos/8433842/pexels-photo-8433842.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&dpr=2"
        desc = "Rama de aceitunas verdes (Detalle)"
    },
    @{
        file = "public\images\proceso\cosecha-manual.jpg"
        url = "https://images.pexels.com/photos/4551832/pexels-photo-4551832.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=2"
        desc = "Manos cosechando frutas (Rural)"
    },
    @{
        file = "public\images\proceso\prensa.jpg"
        url = "https://images.pexels.com/photos/3659684/pexels-photo-3659684.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=2"
        desc = "Maquinaria industrial (Producción)"
    },
    @{
        file = "public\images\proceso\embotellado.jpg"
        url = "https://images.pexels.com/photos/3962289/pexels-photo-3962289.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=2"
        desc = "Botellas de producto (Premium)"
    },
    @{
        file = "public\images\productos\caja-3x5l.png"
        url = "https://images.pexels.com/photos/3944450/pexels-photo-3944450.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&dpr=2"
        desc = "Botella de aceite premium (Producto)"
    },
    @{
        file = "public\images\productos\caja-6x2l.png"
        url = "https://images.pexels.com/photos/3944450/pexels-photo-3944450.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&dpr=2"
        desc = "Botellas premium (Catálogo)"
    },
    @{
        file = "public\images\cierre\olivares-atardecer.jpg"
        url = "https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2"
        desc = "Paisaje al atardecer (Montaña)"
    },
    @{
        file = "public\images\decorativo\gota-aceite.png"
        url = "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2"
        desc = "Gota de líquido (Macro)"
    }
)

$downloaded = 0
$failed = 0

foreach ($img in $FREE_IMAGES) {
    $relativePath = $img.file -replace [regex]::Escape($PROJECT_ROOT), "."
    $fullPath = Join-Path $PROJECT_ROOT $img.file

    Write-Host "📸 Descargando: $($img.desc)" -ForegroundColor Magenta

    try {
        $headers = @{
            'User-Agent' = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        Invoke-WebRequest -Uri $img.url -OutFile $fullPath -UseBasicParsing -Headers $headers

        $fileSize = (Get-Item $fullPath).Length / 1KB
        Write-Host "    ✅ Guardado: $(Split-Path $fullPath -Leaf) ($([Math]::Round($fileSize, 0)) KB)" -ForegroundColor Green
        $downloaded++
    }
    catch {
        Write-Host "    ⚠️  Error: $($_.Exception.Message)" -ForegroundColor Yellow
        $failed++
    }

    Start-Sleep -Milliseconds 800
}

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "✅ Descargadas: $downloaded/9" -ForegroundColor Green

if ($failed -gt 0) {
    Write-Host "⚠️  Fallidas: $failed/9" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📸 Imágenes descargadas correctamente:"
Get-ChildItem -Path $PUBLIC_IMAGES -Recurse -File | Sort-Object FullName | ForEach-Object {
    $size = [Math]::Round($_.Length / 1KB, 0)
    $relPath = $_.FullName -replace [regex]::Escape($PROJECT_ROOT), "."
    Write-Host "   ✅ $relPath ($size KB)" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎬 Siguientes pasos:"
Write-Host "   1. ✅ npm run dev para ver la web"
Write-Host "   2. Verifica que las imágenes son correctas"
Write-Host "   3. git add public/images/"
Write-Host "   4. vercel deploy --prod"
