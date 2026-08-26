# Descargar imágenes VERIFICADAS de Pexels — IDs reales confirmados navegando pexels.com
# Cada imagen fue verificada visualmente en el buscador de Pexels antes de incluirla aquí

$PROJECT_ROOT = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$PUBLIC_IMAGES = Join-Path $PROJECT_ROOT "public\images"

@("hero", "terroir", "proceso", "productos", "cierre", "decorativo") | ForEach-Object {
    $folder = Join-Path $PUBLIC_IMAGES $_
    if (-not (Test-Path $folder)) {
        New-Item -ItemType Directory -Force -Path $folder | Out-Null
    }
}

Write-Host "🎨 DESCARGAR IMÁGENES VERIFICADAS — Pexels (IDs reales confirmados)" -ForegroundColor Cyan
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host ""

# IDs reales verificados navegando Pexels.com el 2026-08-26
$FREE_IMAGES = @(
    @{
        file = "public\images\hero\olivares-amanecer.jpg"
        id = "34803738"
        desc = "Olivar bajo cielo azul (Hani Salama) - HERO"
    },
    @{
        file = "public\images\terroir\rama-aceitunas.png"
        id = "34169529"
        desc = "Aceitunas verdes y negras en rama, Zakynthos (Raymond Petrik) - TERROIR"
    },
    @{
        file = "public\images\proceso\cosecha-manual.jpg"
        id = "15112921"
        desc = "Mano recogiendo aceitunas maduras de una rama (Laura Moctezuma) - COSECHA"
    },
    @{
        file = "public\images\proceso\prensa.jpg"
        id = "34144306"
        desc = "Molino de piedra tradicional en olivar soleado (Carel Voorhorst) - PRENSA"
    },
    @{
        file = "public\images\proceso\embotellado.jpg"
        id = "38490959"
        desc = "Botellas elegantes de aceite de oliva con aceitunas (Serkan Dinc) - EMBOTELLADO"
    },
    @{
        file = "public\images\productos\caja-3x5l.png"
        id = "31275834"
        desc = "Aceites dorados en botellas de vidrio (Kaderdygnn) - PRODUCTO 1"
    },
    @{
        file = "public\images\productos\caja-6x2l.png"
        id = "16486887"
        desc = "Botella de aceite de oliva artística con aceitunas y madera - PRODUCTO 2"
    },
    @{
        file = "public\images\cierre\olivares-atardecer.jpg"
        id = "35764814"
        desc = "Olivar otoñal en Toscana, Italia (Alisa Skripina) - CIERRE"
    },
    @{
        file = "public\images\decorativo\gota-aceite.png"
        id = "33783"
        desc = "Aceite de oliva vertiéndose en bol de cristal (Pixabay) - DECORATIVO"
    }
)

$downloaded = 0
$failed = 0

foreach ($img in $FREE_IMAGES) {
    $fullPath = Join-Path $PROJECT_ROOT $img.file
    $url = "https://images.pexels.com/photos/$($img.id)/pexels-photo-$($img.id).jpeg?auto=compress&cs=tinysrgb&w=1920&h=1200&dpr=1"

    Write-Host "📸 $($img.desc)" -ForegroundColor Magenta
    Write-Host "    URL: $url" -ForegroundColor DarkGray

    try {
        $headers = @{ 'User-Agent' = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        Invoke-WebRequest -Uri $url -OutFile $fullPath -UseBasicParsing -Headers $headers

        $fileSize = [Math]::Round((Get-Item $fullPath).Length / 1KB, 0)
        Write-Host "    ✅ Guardado: $(Split-Path $fullPath -Leaf) ($fileSize KB)" -ForegroundColor Green
        $downloaded++
    }
    catch {
        Write-Host "    ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        $failed++
    }

    Start-Sleep -Milliseconds 700
}

Write-Host ""
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "✅ Descargadas: $downloaded/9  |  ❌ Fallidas: $failed/9" -ForegroundColor Green
Write-Host ""
Write-Host "📸 Verificación visual - abre estos links para confirmar:"
foreach ($img in $FREE_IMAGES) {
    Write-Host "   https://www.pexels.com/photo/$($img.id)/ -> $($img.file)"
}
Write-Host ""
Write-Host "🎬 Siguiente: npm run dev y revisa visualmente cada imagen"
