#!/usr/bin/env python3
"""
Alternativa: Generador usando OpenAI DALL-E 3
Más económico que Recraft si tienes créditos OpenAI.

SETUP:
1. pip install openai pillow python-dotenv
2. Obtén key en https://platform.openai.com/api-keys
3. Crea .env con: OPENAI_API_KEY=sk_...
4. python scripts/generate-images-openai.py

Cost: ~$0.08 por imagen = ~$0.80 para 10 imágenes
"""

import os
import sys
import json
import time
from pathlib import Path
from typing import Optional
from dotenv import load_dotenv
from PIL import Image
from io import BytesIO
import requests

load_dotenv()

try:
    from openai import OpenAI
except ImportError:
    print("❌ openai no instalado. Ejecuta: pip install openai")
    sys.exit(1)

# ═══════════════════════════════════════════════════════════════════════════
# CONFIG
# ═══════════════════════════════════════════════════════════════════════════

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

PROJECT_ROOT = Path(__file__).parent.parent
PUBLIC_IMAGES = PROJECT_ROOT / "public" / "images"

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
# PROMPTS — Optimizados para DALL-E 3
# ═══════════════════════════════════════════════════════════════════════════

IMAGES = [
    {
        "id": "olivares-amanecer",
        "folder": "hero",
        "format": "jpg",
        "size": "1792x1024",
        "quality": "hd",
        "prompt": """
            Aerial view of olive groves in Sierra de Segura at golden sunrise.
            Soft morning mist, warm golden light bathing green Picual olives.
            Mountain landscape at 840m altitude, panoramic cinematic view.
            Film grain, color graded with warm tones and cool blues.
            Professional 8K quality photography, peaceful and majestic.
        """,
    },
    {
        "id": "rama-aceitunas",
        "folder": "terroir",
        "format": "png",
        "size": "1024x1280",
        "quality": "hd",
        "prompt": """
            Close-up macro of ripe dark green olives on wooden branch.
            Fresh leaves with water droplets, shallow depth of field.
            Golden hour soft lighting, premium food photography.
            Hyperrealistic detail, studio lighting, elegant presentation.
            White background, professional product photography.
        """,
    },
    {
        "id": "cosecha-manual",
        "folder": "proceso",
        "format": "jpg",
        "size": "1792x1024",
        "quality": "hd",
        "prompt": """
            Hands harvesting olives from branches during harvest season.
            Traditional artisanal method, warm golden afternoon light.
            Authentic documentary photography, emotional authentic moment.
            Worn hands showing experience, detail of leaves and branches.
            Cinematic lighting with film grain, professional photography.
        """,
    },
    {
        "id": "prensa",
        "folder": "proceso",
        "format": "jpg",
        "size": "1792x1024",
        "quality": "hd",
        "prompt": """
            Olive oil production facility with traditional stone press
            and modern hydraulic press machinery side by side.
            Detailed gears and mechanisms, golden oil in transparent containers.
            Professional industrial photography, high contrast dramatic lighting.
            Cinematic composition, clean production environment, 4K quality.
        """,
    },
    {
        "id": "embotellado",
        "folder": "proceso",
        "format": "jpg",
        "size": "1792x1024",
        "quality": "hd",
        "prompt": """
            Modern olive oil bottling line with automated machinery.
            Golden oil flowing into glass bottles, quality control technicians.
            Professional industrial photography, clean bright facility.
            Warm professional studio lighting, stainless steel equipment.
            Safety uniforms, cinematic atmosphere, high quality photography.
        """,
    },
    {
        "id": "caja-3x5l",
        "folder": "productos",
        "format": "png",
        "size": "1024x1280",
        "quality": "hd",
        "prompt": """
            Premium product shot: 5L olive oil glass bottle with minimalist label.
            Wooden box containing 3 glass bottles, golden oil visible.
            Professional studio lighting, white background.
            Premium luxury packaging, soft shadows and elegant reflections.
            Product catalog quality photography, high resolution.
        """,
    },
    {
        "id": "caja-6x2l",
        "folder": "productos",
        "format": "png",
        "size": "1024x1280",
        "quality": "hd",
        "prompt": """
            Premium product shot: 2L olive oil glass bottles with minimalist labels.
            Sturdy cardboard box containing 6 bottles arranged neatly.
            Professional packaging design visible, warm studio lighting.
            Clean presentation with shadow details showing depth.
            Professional product photography, high quality, luxury feel.
        """,
    },
    {
        "id": "olivares-atardecer",
        "folder": "cierre",
        "format": "jpg",
        "size": "1792x1024",
        "quality": "hd",
        "prompt": """
            Aerial view of olive groves at sunset in Sierra de Segura.
            Golden hour with warm amber-orange tones, mountain silhouettes.
            Peaceful evening atmosphere, cinematic beauty and grandeur.
            Soft haze over valleys, ethereal quality, film grain.
            Professional 8K photography, warm-golden color grading.
        """,
    },
    {
        "id": "gota-aceite",
        "folder": "decorativo",
        "format": "png",
        "size": "1024x1024",
        "quality": "hd",
        "prompt": """
            Macro photography of a perfect spherical drop of golden olive oil.
            Suspended in air with subtle motion blur, macro detail.
            Shallow depth of field, light refractions and caustics.
            Studio lighting with accent lights, hyperrealistic quality.
            White background, professional food photography.
        """,
    },
]

# ═══════════════════════════════════════════════════════════════════════════
# OPENAI DALL-E 3 CLIENT
# ═══════════════════════════════════════════════════════════════════════════


class DalleClient:
    def __init__(self, api_key: str):
        self.client = OpenAI(api_key=api_key)

    def generate(
        self,
        prompt: str,
        size: str = "1792x1024",
        quality: str = "hd",
    ) -> Optional[str]:
        """
        Generar imagen usando DALL-E 3.
        Retorna URL de la imagen o None si falla.
        """
        try:
            print(f"  ⏳ Generando ({size}, {quality})...")
            response = self.client.images.generate(
                model="dall-e-3",
                prompt=prompt.strip(),
                size=size,
                quality=quality,
                n=1,
            )

            url = response.data[0].url
            print(f"    ✅ Generado: {url[:60]}...")
            return url

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
# ENHANCEMENT
# ═══════════════════════════════════════════════════════════════════════════


def enhance_image(input_path: Path, output_path: Path):
    """Mejorar saturación y contraste."""
    try:
        img = Image.open(input_path)
        if img.mode != "RGB":
            img = img.convert("RGB")

        from PIL import ImageEnhance

        enhancer = ImageEnhance.Color(img)
        img = enhancer.enhance(1.15)

        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(1.1)

        img.save(output_path, quality=95, optimize=True)
        print(f"    ✨ Mejorado: {output_path.name}")
        return True

    except Exception as e:
        print(f"    ⚠️  Enhancement falló: {e}")
        return False


# ═══════════════════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════════════════


def main():
    if not OPENAI_API_KEY:
        print("❌ OPENAI_API_KEY no configurada en .env")
        print("   1. Obtén tu key en https://platform.openai.com/api-keys")
        print("   2. Crea .env en el raíz del proyecto")
        print("   3. Agrega: OPENAI_API_KEY=sk_...")
        sys.exit(1)

    client = DalleClient(OPENAI_API_KEY)

    print("\n🎬 GENERADOR DALL-E 3 — Peñolite")
    print("=" * 70)
    print("Costo estimado: $0.08 × 9 imágenes = ~$0.72")
    print("(Se omite mapa topográfico que es mejor con Recraft)")
    print("=" * 70)

    generated = 0
    failed = 0

    # Omitir imagen 3 (mapa topografico) porque DALL-E no es ideal para cartografía
    for idx, img_config in enumerate([img for img in IMAGES if img["id"] != "mapa-topografico"], 1):
        img_id = img_config["id"]
        folder = FOLDERS[img_config["folder"]]
        output_path = folder / f"{img_id}.{img_config['format']}"

        print(f"\n📸 [{idx}/9] {img_id}")
        print(f"   Folder: {img_config['folder']}")
        print(f"   Size: {img_config['size']}")

        # Generar
        image_url = client.generate(
            prompt=img_config["prompt"],
            size=img_config["size"],
            quality=img_config["quality"],
        )

        if image_url:
            # Descargar
            temp_path = folder / f"{img_id}_temp.{img_config['format']}"
            if client.download_image(image_url, temp_path):
                # Optimizar
                if img_config["format"] == "jpg":
                    enhance_image(temp_path, output_path)
                    temp_path.unlink()
                else:
                    temp_path.rename(output_path)
                generated += 1
            else:
                failed += 1
        else:
            failed += 1

        # Rate limit (DALL-E es más lento)
        time.sleep(3)

    print("\n" + "=" * 70)
    print(f"✅ Generadas: {generated}/9")
    print(f"❌ Fallidas: {failed}/9")
    print(f"\n📁 Output: {PUBLIC_IMAGES}")
    print("\n⚠️  Nota: Falta generar mapa topográfico manualmente con Recraft")
    print("    (DALL-E no es óptimo para cartografía estilizada)")


if __name__ == "__main__":
    main()
