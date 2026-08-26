# Crear imágenes PLACEHOLDER con paleta Peñolite (dorado, verde, crema, negro)
# Mientras se obtienen imágenes reales

$PROJECT_ROOT = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$PUBLIC_IMAGES = Join-Path $PROJECT_ROOT "public\images"

Write-Host "🎨 CREAR PLACEHOLDERS CON PALETA PEÑOLITE" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Paleta Peñolite
$dorado = "C8961E"
$verde = "2D4A2B"
$crema = "F5F1E8"
$negro = "060D03"
$verdeOscuro = "243D0F"

# Función para crear SVG placeholder
function Create-PlaceholderSVG {
    param(
        [string]$filePath,
        [string]$width,
        [string]$height,
        [string]$label,
        [string]$bgColor,
        [string]$accentColor
    )

    $svg = @"
<svg viewBox="0 0 $width $height" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#$bgColor;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#$verdeOscuro;stop-opacity:0.8" />
    </linearGradient>
    <linearGradient id="grad-accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#$accentColor;stop-opacity:0.6" />
      <stop offset="100%" style="stop-color:#$dorado;stop-opacity:0.3" />
    </linearGradient>
  </defs>

  <!-- Fondo -->
  <rect width="$width" height="$height" fill="url(#grad-bg)"/>

  <!-- Formas decorativas -->
  <circle cx="$($width*0.3)" cy="$($height*0.3)" r="$($width*0.2)" fill="url(#grad-accent)" opacity="0.5"/>
  <circle cx="$($width*0.7)" cy="$($height*0.7)" r="$($width*0.15)" fill="#$accentColor" opacity="0.3"/>
  <rect x="$($width*0.1)" y="$($height*0.5)" width="$($width*0.8)" height="$($height*0.1)" fill="#$dorado" opacity="0.2"/>

  <!-- Texto -->
  <text x="$($width/2)" y="$($height/2)" font-family="Georgia, serif" font-size="$($height*0.08)" fill="#$crema" text-anchor="middle" opacity="0.7">
    $label
  </text>

  <!-- Texto pequeño -->
  <text x="$($width/2)" y="$($height*0.6)" font-family="Arial, sans-serif" font-size="$($height*0.04)" fill="#$dorado" text-anchor="middle" opacity="0.5">
    Peñolite
  </text>
</svg>
"@

    $svg | Out-File -FilePath $filePath -Encoding UTF8
}

# Crear placeholders
$placeholders = @(
    @{ path = "$PUBLIC_IMAGES\hero\olivares-amanecer.jpg"; w = 1920; h = 1080; label = "OLIVARES"; bg = $verde; accent = $dorado },
    @{ path = "$PUBLIC_IMAGES\terroir\rama-aceitunas.png"; w = 800; h = 1000; label = "RAMA"; bg = $negro; accent = $verde },
    @{ path = "$PUBLIC_IMAGES\proceso\cosecha-manual.jpg"; w = 1920; h = 1080; label = "COSECHA"; bg = $verdeOscuro; accent = $dorado },
    @{ path = "$PUBLIC_IMAGES\proceso\prensa.jpg"; w = 1920; h = 1080; label = "PRENSA"; bg = $negro; accent = $dorado },
    @{ path = "$PUBLIC_IMAGES\proceso\embotellado.jpg"; w = 1920; h = 1080; label = "EMBOTELLADO"; bg = $verde; accent = $crema },
    @{ path = "$PUBLIC_IMAGES\productos\caja-3x5l.png"; w = 800; h = 1000; label = "CAJA 3×5L"; bg = $negro; accent = $dorado },
    @{ path = "$PUBLIC_IMAGES\productos\caja-6x2l.png"; w = 800; h = 1000; label = "CAJA 6×2L"; bg = $negro; accent = $dorado },
    @{ path = "$PUBLIC_IMAGES\cierre\olivares-atardecer.jpg"; w = 1920; h = 1080; label = "ATARDECER"; bg = $verdeOscuro; accent = $dorado },
    @{ path = "$PUBLIC_IMAGES\decorativo\gota-aceite.png"; w = 400; h = 400; label = "GOTA"; bg = $dorado; accent = $crema }
)

foreach ($ph in $placeholders) {
    $folder = Split-Path $ph.path
    if (-not (Test-Path $folder)) {
        New-Item -ItemType Directory -Force -Path $folder | Out-Null
    }

    Create-PlaceholderSVG -filePath $ph.path -width $ph.w -height $ph.h -label $ph.label -bgColor $ph.bg -accentColor $ph.accent

    $relPath = $ph.path -replace [regex]::Escape($PROJECT_ROOT), "."
    Write-Host "✅ $relPath" -ForegroundColor Green
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "✅ Placeholders creados con paleta Peñolite" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  PRÓXIMOS PASOS:" -ForegroundColor Yellow
Write-Host "   1. Estos son PLACEHOLDERS de desarrollo"
Write-Host "   2. Para PRODUCCIÓN, necesitas imágenes REALES:"
Write-Host ""
Write-Host "   OPCIÓN A: Generar con IA (recomendado)" -ForegroundColor Cyan
Write-Host "   - Usar Recraft V4.1 o DALL-E 3"
Write-Host "   - python scripts/generate-images.py"
Write-Host ""
Write-Host "   OPCIÓN B: Descargar de stock real" -ForegroundColor Cyan
Write-Host "   - Pexels.com: buscar 'olive groves', 'olive harvest', 'olive oil'"
Write-Host "   - Unsplash.com: buscar 'olive', 'vineyard', 'agriculture'"
Write-Host "   - Copiar URLs directas al script"
Write-Host ""
Write-Host "   OPCIÓN C: Fotógrafía propia" -ForegroundColor Cyan
Write-Host "   - Tomar fotos de Peñolite"
Write-Host "   - Guardar en public/images/{carpeta}/"
Write-Host ""
Write-Host "🎬 Por ahora: npm run dev (con placeholders)"
