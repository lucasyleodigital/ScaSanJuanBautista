#!/usr/bin/env python3
"""
Generador de 10 imágenes cinematográficas para SCA San Juan Bautista Peñolite.
Usando Recraft V4.1 API o alternativas.

SETUP:
1. pip install requests pillow python-dotenv
2. Obtén tu API key de https://app.recraft.ai/
3. Crea un .env con: RECRAFT_API_KEY=tu_key_aqui
4. python scripts/generate-images.py

Output: /public/images/{hero,terroir,proceso,productos,cierre,decorativo}/*.{jpg,png}
"""

import os
import sys
import json
import time
import requests
from pathlib import Path
from typing import Optional
from dotenv import load_dotenv
from PIL import Image
from io import BytesIO

load_dotenv()

# ═══════════════════════════════════════════════════════════════════════════
# CONFIG
# ═══════════════════════════════════════════════════════════════════════════

RECRAFT_API_KEY = os.getenv("RECRAFT_API_KEY")
RECRAFT_API_URL = "https://api.recraft.ai/v1/images/generations"

# Rutas de output
PROJECT_ROOT = Path(__file__).parent.parent
PUBLIC_IMAGES = PROJECT_ROOT / "public" / "images"

# Crear carpetas si no existen
FOLDERS = {
    "hero": PUBLIC_IMAGES / "hero",
    "terroir": PUBLIC_IMAGES / "terroir",
    "proceso": PUBLIC_IMAGES / "proceso",
    "productos": PUBLIC_IMAGES / "productos",
    "cierre": PUBLIC_IMAGES / "cierre",
    "decorativo": PUBLIC_IMAGES / "decorativo",
}

for folder in FOLDERS.values():
    folder.mkdir(parents=True, exist_ok=True)

# ═══════════════════════════════════════════════════════════════════════════
# PROMPTS CINEMATOGRÁFICOS — Recraft V4.1 optimizado
# ═══════════════════════════════════════════════════════════════════════════

IMAGES = [
    {
        "id": "olivares-amanecer",
        "folder": "hero",
        "format": "jpg",
        "aspect_ratio": "16:9",
        "quality": "high",
        "prompt": """
            Aerial drone shot of olive groves in Sierra de Segura at golden sunrise.
            Soft morning mist rising from the valleys, warm golden light bathing the landscape.
            Lush green Picual olives covering the mountainside at 840m altitude.
            Breathtaking panoramic view, cinematic quality, 8K professional photography.
            Film grain subtle, color grading emphasizing warm tones against cool blues.
            Volumetric light rays through the mist, peaceful and majestic atmosphere.
        """,
    },
    {
        "id": "rama-aceitunas",
        "folder": "terroir",
        "format": "png",
        "aspect_ratio": "4:5",
        "quality": "high",
        "prompt": """
            Close-up macro shot of ripe dark green olives on a rustic wooden branch.
            Fresh green leaves with delicate water droplets glistening in the light.
            Shallow depth of field, professional food photography technique.
            Natural soft golden hour lighting creating warmth and luxury.
            Hyperrealistic detail, 85mm macro lens effect with studio lighting.
            Transparent background (PNG), elegant and premium presentation.
        """,
    },
    {
        "id": "mapa-topografico",
        "folder": "terroir",
        "format": "svg",
        "aspect_ratio": "1:1",
        "quality": "high",
        "prompt": """
            3D stylized topographic map of Sierra de Segura region highlighting Peñolite location.
            Terrain elevation visualization with detailed contour lines.
            Color palette: earthy tones with olive green accents, dorado highlights.
            Professional cartography style, high detail, isometric perspective.
            Minimalist and clean design, modern geographic illustration.
        """,
    },
    {
        "id": "cosecha-manual",
        "folder": "proceso",
        "format": "jpg",
        "aspect_ratio": "16:9",
        "quality": "high",
        "prompt": """
            Documentary-style photo of hands manually harvesting ripe olives from branches.
            Harvest season moment, traditional artisanal method.
            Warm golden afternoon sunlight illuminating the scene naturally.
            Authentic rural moment captured with emotional depth.
            Hyperrealistic photography, worn hands showing experience and care.
            Detail of leaves, branches, and olives, cinematic lighting with film grain.
        """,
    },
    {
        "id": "prensa",
        "folder": "proceso",
        "format": "jpg",
        "aspect_ratio": "16:9",
        "quality": "high",
        "prompt": """
            Professional olive oil production facility showing traditional stone press
            alongside modern hydraulic press machinery.
            Detailed visible gears and pressure mechanisms, clean production environment.
            Golden extra virgin olive oil visible flowing in transparent containers.
            Professional industrial photography, high contrast dramatic lighting.
            Cinematic composition, 8K quality, film-grade color grading.
        """,
    },
    {
        "id": "embotellado",
        "folder": "proceso",
        "format": "jpg",
        "aspect_ratio": "16:9",
        "quality": "high",
        "prompt": """
            Olive oil bottling line in a modern automated production facility.
            Golden extra virgin olive oil flowing into pristine glass bottles.
            Quality control checkpoints with technicians inspecting bottles.
            Professional industrial photography, clean bright facility.
            Warm professional studio lighting, hyperrealistic detail.
            Stainless steel equipment, safety uniforms, cinematic atmosphere.
        """,
    },
    {
        "id": "caja-3x5l",
        "folder": "productos",
        "format": "png",
        "aspect_ratio": "4:5",
        "quality": "high",
        "prompt": """
            Premium product shot of a 5L olive oil glass bottle with minimalist brand label.
            Wooden box containing 3 identical glass bottles arranged perfectly.
            Golden extra virgin oil visible through clear glass.
            Professional product photography with studio lighting, white background.
            Premium luxury packaging presentation, soft shadows, elegant reflections.
            High quality, product catalog ready, transparent background (PNG).
        """,
    },
    {
        "id": "caja-6x2l",
        "folder": "productos",
        "format": "png",
        "aspect_ratio": "4:5",
        "quality": "high",
        "prompt": """
            Premium product shot of 2L olive oil glass bottles with minimalist labels.
            Sturdy cardboard box containing 6 bottles arranged neatly in rows.
            Professional packaging design visible on the box.
            Studio lighting with warm tones creating luxury ambiance.
            Clean presentation, shadow details showing depth and dimension.
            Professional product photography, high quality, transparent background (PNG).
        """,
    },
    {
        "id": "olivares-atardecer",
        "folder": "cierre",
        "format": "jpg",
        "aspect_ratio": "16:9",
        "quality": "high",
        "prompt": """
            Aerial panoramic view of Sierra de Segura olive groves at sunset.
            Golden hour light with warm amber-orange tones across the landscape.
            Beautiful landscape photography, mountain silhouettes in the distance.
            Peaceful evening atmosphere, cinematic beauty and grandeur.
            Soft haze over valleys creating depth and ethereal quality.
            8K professional quality, film grain, warm-golden color grading.
        """,
    },
    {
        "id": "gota-aceite",
        "folder": "decorativo",
        "format": "png",
        "aspect_ratio": "1:1",
        "quality": "high",
        "prompt": """
            Macro photography of a single perfect spherical drop of golden extra virgin olive oil.
            Suspended in air with subtle motion blur showing the liquid's movement.
            Macro detail with shallow depth of field, professional food photography.
            Beautiful liquid drop shape with light refractions and caustics.
            Studio lighting with accent lights creating depth and shimmer.
            Hyperrealistic quality, nearby water drops for context, transparent background (PNG).
        """,
    },
]

# ═══════════════════════════════════════════════════════════════════════════
# RECRAFT V4.1 API CLIENT
# ═══════════════════════════════════════════════════════════════════════════


class RecraftClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }

    def generate(
        self,
        prompt: str,
        aspect_ratio: str = "16:9",
        format: str = "jpeg",
    ) -> Optional[str]:
        """
        Generar imagen usando Recraft V4.1.
        Retorna URL de la imagen o None si falla.
        """
        payload = {
            "prompt": prompt.strip(),
            "aspect_ratio": aspect_ratio,
            "format": format,
            "model": "recraftv4",
        }

        try:
            print(f"  ⏳ Generando ({aspect_ratio})...")
            response = requests.post(
                RECRAFT_API_URL,
                json=payload,
                headers=self.headers,
                timeout=60,
            )

            if response.status_code == 200:
                data = response.json()
                return data.get("data", [{}])[0].get("url")
            else:
                print(f"    ❌ Error {response.status_code}: {response.text}")
                return None

        except Exception as e:
            print(f"    ❌ Error: {e}")
            return None

    def download_image(self, url: str, output_path: Path) -> bool:
        """Descargar imagen desde URL."""
        try:
            response = requests.get(url, timeout=30)
            if response.status_code == 200:
                with open(output_path, "wb") as f:
                    f.write(response.content)
                print(f"    ✅ Guardado: {output_path.name}")
                return True
        except Exception as e:
            print(f"    ❌ Descarga falló: {e}")
        return False


# ═══════════════════════════════════════════════════════════════════════════
# ENHANCEMENT — Optimizar imágenes descargadas
# ═══════════════════════════════════════════════════════════════════════════


def enhance_image(input_path: Path, output_path: Path, boost_saturation: float = 1.2):
    """
    Incrementar saturación, contraste y añadir film grain para look cinematográfico.
    """
    try:
        img = Image.open(input_path)

        # Convertir a RGB si es necesario
        if img.mode != "RGB":
            img = img.convert("RGB")

        # Boost de saturación
        from PIL import ImageEnhance

        enhancer = ImageEnhance.Color(img)
        img = enhancer.enhance(boost_saturation)

        # Boost de contraste
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(1.15)

        # Guardar optimizado
        img.save(output_path, quality=95, optimize=True)
        print(f"    ✨ Mejorado: {output_path.name}")
        return True

    except Exception as e:
        print(f"    ⚠️  Enhancement falló, usando original: {e}")
        return False


# ═══════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════


def main():
    if not RECRAFT_API_KEY:
        print("❌ RECRAFT_API_KEY no configurada en .env")
        print("   1. Obtén tu key en https://app.recraft.ai/")
        print("   2. Crea .env en el raíz del proyecto")
        print("   3. Agrega: RECRAFT_API_KEY=tu_key_aqui")
        sys.exit(1)

    client = RecraftClient(RECRAFT_API_KEY)

    print("\n🎬 GENERADOR DE IMÁGENES CINEMATOGRÁFICAS — Peñolite")
    print("=" * 70)

    generated = 0
    failed = 0

    for idx, img_config in enumerate(IMAGES, 1):
        img_id = img_config["id"]
        folder = FOLDERS[img_config["folder"]]
        output_path = folder / f"{img_id}.{img_config['format']}"

        print(f"\n📸 [{idx}/10] {img_id}")
        print(f"   Folder: {img_config['folder']}")
        print(f"   Aspect: {img_config['aspect_ratio']}")

        # Generar
        image_url = client.generate(
            prompt=img_config["prompt"],
            aspect_ratio=img_config["aspect_ratio"],
            format=img_config["format"],
        )

        if image_url:
            # Descargar
            temp_path = folder / f"{img_id}_temp.{img_config['format']}"
            if client.download_image(image_url, temp_path):
                # Optimizar (si es JPG)
                if img_config["format"] == "jpg":
                    enhance_image(temp_path, output_path, boost_saturation=1.25)
                    temp_path.unlink()
                else:
                    temp_path.rename(output_path)
                generated += 1
            else:
                failed += 1
        else:
            failed += 1

        # Rate limit
        time.sleep(2)

    print("\n" + "=" * 70)
    print(f"✅ Generadas: {generated}/10")
    print(f"❌ Fallidas: {failed}/10")
    print(f"\n📁 Output: {PUBLIC_IMAGES}")
    print("\n🎨 Siguientes pasos:")
    print("  1. Verifica las imágenes en /public/images/")
    print("  2. Reemplaza placeholders verdes en los componentes")
    print("  3. npm run dev para ver los cambios")


if __name__ == "__main__":
    main()
