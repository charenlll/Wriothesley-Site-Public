#!/usr/bin/env python3
"""
Convert all PNG images in assets/ to WebP format.
Keeps original PNGs as fallback.

Usage: python3 scripts/convert-to-webp.py
"""

import os
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Error: Pillow is required. Install with: pip3 install Pillow")
    sys.exit(1)

ASSETS_DIR = Path(__file__).resolve().parent.parent / "assets"

def convert_png_to_webp(png_path: Path, quality: int = 82) -> Path | None:
    """Convert a PNG to WebP. Returns the WebP path or None on failure."""
    webp_path = png_path.with_suffix(".webp")
    if webp_path.exists():
        png_size = png_path.stat().st_size
        webp_size = webp_path.stat().st_size
        if webp_size < png_size:
            print(f"  ⏭  Skipped (already exists, smaller): {webp_path.name}")
            return webp_path
        else:
            print(f"  ⚠  Re-converting (WebP larger than PNG): {webp_path.name}")

    try:
        img = Image.open(png_path)
        img = img.convert("RGBA")  # Preserve transparency

        # Save as WebP with lossy compression for photos, lossless for graphics
        # Use lossless for icon (small, graphic), lossy for photos/screenshots
        is_icon = "icon" in png_path.name
        save_kwargs = {
            "format": "WEBP",
            "quality": quality if not is_icon else 100,
            "lossless": is_icon,
            "method": 6,  # Compression effort (0=fast, 6=slow but best)
        }

        img.save(webp_path, **save_kwargs)

        original_size = png_path.stat().st_size
        new_size = webp_path.stat().st_size
        savings = (1 - new_size / original_size) * 100
        print(f"  ✅ {png_path.name}: {original_size/1024:.0f}KB → {new_size/1024:.0f}KB ({savings:.0f}% reduction)")
        return webp_path
    except Exception as e:
        print(f"  ❌ Error converting {png_path.name}: {e}", file=sys.stderr)
        return None


def main():
    png_files = sorted(ASSETS_DIR.rglob("*.png"))

    if not png_files:
        print(f"No PNG files found in {ASSETS_DIR}")
        sys.exit(0)

    print(f"Found {len(png_files)} PNG images to convert\n")

    total_original = 0
    total_new = 0
    converted = 0

    for png_path in png_files:
        rel_path = png_path.relative_to(ASSETS_DIR.parent)
        print(f"📷 {rel_path}")
        webp = convert_png_to_webp(png_path)
        if webp:
            total_original += png_path.stat().st_size
            total_new += webp.stat().st_size
            converted += 1

    print(f"\n{'='*50}")
    print(f"Converted {converted}/{len(png_files)} images")
    if total_original > 0:
        total_savings = (1 - total_new / total_original) * 100
        print(f"Total: {total_original/1024/1024:.1f}MB → {total_new/1024/1024:.1f}MB ({total_savings:.0f}% reduction)")
    print(f"{'='*50}")
    print(f"\n✅ Done! WebP files generated alongside original PNGs.")
    print(f"   Originals are kept as fallback.")


if __name__ == "__main__":
    main()
