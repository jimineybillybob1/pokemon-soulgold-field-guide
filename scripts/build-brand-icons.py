#!/usr/bin/env python3
"""Build deterministic favicon and PWA icon sizes from the SoulGold icon master."""

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parent.parent
ART = ROOT / "assets" / "art"
MASTER = ART / "soulgold-icon-master.png"
BACKGROUND = (5, 25, 77, 255)


def save_square(source: Image.Image, size: int, filename: str) -> None:
    image = source.resize((size, size), Image.Resampling.LANCZOS)
    image.save(ART / filename, optimize=True)


def save_maskable(source: Image.Image, size: int, filename: str) -> None:
    canvas = Image.new("RGBA", (size, size), BACKGROUND)
    safe_size = round(size * 0.78)
    emblem = source.resize((safe_size, safe_size), Image.Resampling.LANCZOS)
    offset = (size - safe_size) // 2
    canvas.alpha_composite(emblem, (offset, offset))
    canvas.save(ART / filename, optimize=True)


def main() -> None:
    source = Image.open(MASTER).convert("RGBA")
    if source.width != source.height:
        raise SystemExit(f"Icon master must be square, got {source.size}")

    for size, filename in (
        (32, "favicon-32.png"),
        (48, "favicon-48.png"),
        (180, "apple-touch-icon.png"),
        (192, "pwa-icon-192.png"),
        (512, "pwa-icon-512.png"),
    ):
        save_square(source, size, filename)

    save_maskable(source, 512, "pwa-icon-maskable-512.png")


if __name__ == "__main__":
    main()
