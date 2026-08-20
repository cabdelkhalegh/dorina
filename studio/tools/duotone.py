# -*- coding: utf-8 -*-
"""
Brand-lock any image to Dorina's palette.

The problem this solves: AI image generators make beautiful textures but ignore
exact brand colours — the test generation came back orange and red against a
brief that specified forest, ivory and gold. Rather than fight the prompt, we
take the image for its *form* (light, depth, grain, movement) and re-map its
tone onto her ramp. The result cannot be off-brand, because the palette is
applied after the fact.

    python tools/duotone.py in.jpg out.jpg            # forest ramp (default)
    python tools/duotone.py in.jpg out.jpg --ramp ivory
    python tools/duotone.py in.jpg out.jpg --blur 2 --contrast 1.15

Input can be any generated or photographed image. Output is a texture meant to
sit *behind* type under a scrim, so it is deliberately low-contrast.
"""

import argparse
import os

from PIL import Image, ImageEnhance, ImageFilter, ImageOps

# Shadow → midtone → highlight, sampled from the locked identity.
RAMPS = {
    # deep forest shadows, gold midtones, ivory highlights
    "forest": [(11, 44, 37), (15, 56, 47), (28, 74, 62), (140, 116, 70), (197, 154, 84), (245, 241, 232)],
    # for light grounds: ivory field with faint gold and mint movement
    "ivory": [(214, 205, 186), (231, 224, 210), (245, 241, 232), (255, 253, 247), (232, 221, 197), (255, 255, 255)],
    # mint-led variant for variety across a deck
    "mint": [(11, 44, 37), (24, 70, 58), (60, 120, 98), (143, 200, 175), (214, 231, 221), (245, 241, 232)],
}


def build_lut(stops):
    """Expand N colour stops into a 256-entry per-channel lookup table."""
    lut_r, lut_g, lut_b = [], [], []
    n = len(stops) - 1
    for i in range(256):
        pos = i / 255.0 * n
        lo = min(int(pos), n - 1)
        t = pos - lo
        a, b = stops[lo], stops[lo + 1]
        lut_r.append(int(round(a[0] + (b[0] - a[0]) * t)))
        lut_g.append(int(round(a[1] + (b[1] - a[1]) * t)))
        lut_b.append(int(round(a[2] + (b[2] - a[2]) * t)))
    return lut_r + lut_g + lut_b


def duotone(src, dst, ramp="forest", blur=1.2, contrast=1.06, brightness=1.0):
    im = Image.open(src).convert("RGB")
    if blur:
        im = im.filter(ImageFilter.GaussianBlur(blur))
    grey = ImageOps.grayscale(im)
    grey = ImageOps.autocontrast(grey, cutoff=2)
    if contrast != 1.0:
        grey = ImageEnhance.Contrast(grey).enhance(contrast)
    if brightness != 1.0:
        grey = ImageEnhance.Brightness(grey).enhance(brightness)
    out = ImageOps.colorize(
        grey,
        black=RAMPS[ramp][0],
        white=RAMPS[ramp][-1],
        mid=RAMPS[ramp][len(RAMPS[ramp]) // 2],
    )
    # Re-apply the full ramp so the gold midtone actually lands.
    out = out.convert("RGB").point(build_lut(RAMPS[ramp]))
    os.makedirs(os.path.dirname(os.path.abspath(dst)), exist_ok=True)
    out.save(dst, quality=88, optimize=True)
    return dst, out.size


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("dst")
    ap.add_argument("--ramp", choices=list(RAMPS), default="forest")
    ap.add_argument("--blur", type=float, default=1.2)
    ap.add_argument("--contrast", type=float, default=1.06)
    ap.add_argument("--brightness", type=float, default=1.0)
    a = ap.parse_args()
    path, size = duotone(a.src, a.dst, a.ramp, a.blur, a.contrast, a.brightness)
    print("wrote %s %s (ramp: %s)" % (path, size, a.ramp))
