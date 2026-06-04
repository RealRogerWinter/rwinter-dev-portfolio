#!/usr/bin/env python3
"""Convert the two multi-megabyte PNG screenshots to WebP, kept beside the PNG
as a <picture>/image-set() fallback.

These two dominate page weight (onestreamer-stream.png ~4.5 MB,
pricey-stream.png ~1.5 MB). WebP at high quality is visually identical at the
sizes they are displayed (verified by the visual-regression harness) while
cutting ~90% of the bytes.

AVIF and responsive sizes are intentionally deferred to the Astro <Image>
pipeline in the migration, which generates them properly. Re-runnable; output
is committed. Needs Pillow with WebP (built in).
"""
import os
from PIL import Image

ASSETS = os.path.normpath(os.path.join(os.path.dirname(__file__), "..", "site", "portfolio", "assets"))
TARGETS = ["onestreamer-stream.png", "pricey-stream.png"]
QUALITY = 85


def main():
    for name in TARGETS:
        src = os.path.join(ASSETS, name)
        dst = os.path.splitext(src)[0] + ".webp"
        # These are opaque screenshots; RGB (no alpha) keeps WebP small.
        Image.open(src).convert("RGB").save(dst, "WEBP", quality=QUALITY, method=6)
        ps, ds = os.path.getsize(src), os.path.getsize(dst)
        print("%-26s %6.0f KB -> %6.0f KB  (%.0f%% smaller)"
              % (name, ps / 1024, ds / 1024, 100 * (1 - ds / ps)))


if __name__ == "__main__":
    main()
