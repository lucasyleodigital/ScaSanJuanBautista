#!/bin/bash
#
# Generador de 10 imágenes cinematográficas usando inference.sh belt CLI
# Modelo: Seedream 4.5 (2K-4K cinematic quality)
#
# SETUP:
#   1. npm install -g @inference-sh/belt
#   2. belt login
#   3. bash scripts/generate-with-belt.sh
#

set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PUBLIC_IMAGES="$PROJECT_ROOT/public/images"
MODEL="bytedance/seedream-4-5"

# Crear carpetas
mkdir -p "$PUBLIC_IMAGES"/{hero,terroir,proceso,productos,cierre,decorativo}

echo "🎬 GENERADOR DE IMÁGENES — Seedream 4.5 (inference.sh)"
echo "====================================================="
echo "Modelo: $MODEL"
echo "Destino: $PUBLIC_IMAGES"
echo ""

# Array de imágenes
declare -a IMAGES=(
  "1|olivares-amanecer|hero|jpg|Aerial drone shot of olive groves in Sierra de Segura at golden sunrise, soft morning mist, warm golden light, lush green Picual olives, mountain landscape at 840m altitude, breathtaking panoramic view, cinematic quality, 8K, film grain subtle, color grading warm-cool balance"
  "2|rama-aceitunas|terroir|png|Close-up macro shot of ripe dark green olives on wooden branch, fresh leaves with water droplets, shallow depth of field, professional food photography, natural soft golden hour lighting, hyperrealistic detail, 85mm macro lens effect, studio lighting"
  "3|cosecha-manual|proceso|jpg|Hands of farmer manually harvesting ripe olives from branches during harvest season, traditional method, warm golden afternoon sunlight, authentic rural moment, hyperrealistic photography, documentary style, emotional authentic capture, worn hands, detail of leaves and branches"
  "4|prensa|proceso|jpg|Professional olive oil production: traditional stone press alongside modern hydraulic press, detailed machinery with visible gears and pressure mechanisms, clean production facility, golden olive oil visible in transparent containers, professional industrial photography, high contrast dramatic lighting"
  "5|embotellado|proceso|jpg|Olive oil bottling line: modern automated production facility, golden extra virgin olive oil flowing into glass bottles, quality control checkpoints with technicians, professional industrial photography, clean bright facility with warm professional lighting, hyperrealistic detail, stainless steel equipment"
  "6|caja-3x5l|productos|png|Premium product shot: olive oil glass bottle 5L with minimalist brand label, wooden box containing 3 glass bottles, golden extra virgin oil visible through glass, professional product photography with studio lighting, clean white background, premium luxury packaging presentation, soft shadows, reflections"
  "7|caja-6x2l|productos|png|Premium product shot: olive oil glass bottles 2L with minimalist label, sturdy cardboard box containing 6 bottles arranged neatly, professional packaging design visible, studio lighting with warm tones, clean presentation, shadow details showing depth, professional product photography, luxury feel"
  "8|olivares-atardecer|cierre|jpg|Aerial panoramic view of Sierra de Segura olive groves at sunset, golden hour light with warm amber-orange tones, beautiful landscape photography, mountain silhouettes in distance, peaceful evening atmosphere, cinematic beauty, soft haze over valleys, 8K quality, film grain, color grading warm-golden"
  "9|gota-aceite|decorativo|png|Macro photography: single perfect spherical drop of golden extra virgin olive oil suspended in air with motion blur, macro detail with shallow depth of field, beautiful liquid drop shape with light refractions, professional food photography, studio lighting with accent lights, hyperrealistic"
)

# Mapa topográfico (usar modelo diferente porque Seedream no es ideal para SVG)
echo "⚠️  Nota: Mapa topográfico se genera manualmente con Recraft"
echo ""

# Generar imágenes
for img_data in "${IMAGES[@]}"; do
  IFS='|' read -r idx id folder ext prompt <<< "$img_data"

  output_dir="$PUBLIC_IMAGES/$folder"
  output_file="$output_dir/$id.$ext"

  echo "📸 [$idx/9] $id ($folder)"

  # Ejecutar belt (ajusta según output format que soporte)
  belt app run "$MODEL" --input "{
    \"prompt\": \"$prompt\",
    \"aspect_ratio\": \"16:9\",
    \"output_format\": \"$ext\"
  }" > "$output_file"

  echo "    ✅ Guardado: $output_file"

  # Rate limit (evita saturar API)
  sleep 3
done

echo ""
echo "====================================================="
echo "✅ Generadas 9/10 imágenes"
echo "⚠️  Falta: mapa-topografico.svg (genera manualmente con Recraft)"
echo ""
echo "📁 Output: $PUBLIC_IMAGES"
echo "🎨 Siguientes pasos:"
echo "   1. Verifica las imágenes en /public/images/"
echo "   2. Genera mapa topográfico con Recraft V4.1"
echo "   3. Ejecuta: npm run dev"
echo "   4. Deploy: vercel deploy --prod"
