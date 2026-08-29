# -*- coding: utf-8 -*-
"""
Texture generator — Gemini image models + brand-lock duotone.

This is the Mission Control image system, pointed at Dorina and made safe for a
brand-locked account. Two deliberate differences from the original:

1. **No text is ever requested in the image.** The Mission Control library shows
   why: Imagen rendered "THE $4 TRILLION AI INRSTRUCTURE BET" — a misspelling
   baked into a finished asset. All type on Dorina's cards is rendered by
   build_graphics.py, where it is spell-correct, brand-correct and bilingual.

2. **Every output is duotoned onto her ramp** before use, so an off-palette
   generation cannot reach a post. Generators ignore hex codes; this makes that
   irrelevant rather than fighting it with prompt wording.

The API key is read from the environment and never written to disk:

    setx GEMINI_API_KEY "..."        (Windows, new shell afterwards)
    export GEMINI_API_KEY="..."      (bash)

    python tools/generate_texture.py --name still-dawn --ramp forest
    python tools/generate_texture.py --name still-dawn --ramp mint --dry-run
    python tools/generate_texture.py --list-prompts
"""

import argparse
import base64
import io
import json
import os
import sys
import urllib.error
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
STUDIO = os.path.dirname(HERE)
REPO = os.path.dirname(STUDIO)
OUT_DIR = os.path.join(REPO, "assets", "social", "textures")

sys.path.insert(0, HERE)
from duotone import duotone, RAMPS  # noqa: E402

# The Mission Control scripts call imagen-4.0-*:predict, which this key can no
# longer reach — that endpoint has been retired, which is why the old image
# system stopped producing. The current equivalents are the Gemini image models,
# called through generateContent with an IMAGE response modality.
MODELS = {
    "fast": "gemini-3.1-flash-image",   # cheap, good enough for texture
    "pro":  "gemini-3-pro-image",       # slower, better light and gradation
}
API = "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent"

# Abstract, textural, no subject matter that could read as clinical or medical,
# no people, and explicitly no text. Composition leaves the upper field quiet so
# the headline has somewhere to sit.
PROMPTS = {
    "still-dawn":
        "Abstract soft-focus composition of morning light moving across a calm "
        "textured surface. Long gentle gradients, organic flowing forms, fine "
        "photographic grain. Quiet and restrained, generous empty space in the "
        "upper two thirds. Editorial, contemplative, Mediterranean stillness.",
    "still-linen":
        "Extreme close-up of natural woven linen in raking side light. Soft "
        "shadow, visible fibre texture, shallow depth of field, muted and calm. "
        "Large areas of near-even tone.",
    "still-water":
        "Abstract still water surface at first light, very slow ripples, soft "
        "reflected light, wide areas of smooth tone with delicate movement at "
        "one edge. Meditative and quiet.",
    "still-arc":
        "Minimal abstract composition: a single wide circular arc of soft light "
        "that does not quite close, falling across a deep textured field. "
        "Generous negative space, cinematic, restrained.",
    "still-stone":
        "Soft abstract macro of weathered plaster and stone, gentle tonal "
        "variation, fine grain, warm raking light from one side, calm and even.",
}

NEGATIVE = (" No people, no faces, no hands, no text, no letters, no words, no "
            "numbers, no logos, no watermarks, no charts, no medical or clinical "
            "imagery, no clutter, no busy detail.")


def generate(prompt, aspect="3:4", tier="fast"):
    key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not key:
        sys.exit("GEMINI_API_KEY is not set. Export it first — it must never be "
                 "written into this repo.")
    model = MODELS[tier]
    body = json.dumps({
        "contents": [{"parts": [{"text": prompt + NEGATIVE}]}],
        "generationConfig": {
            "responseModalities": ["IMAGE"],
            "imageConfig": {"aspectRatio": aspect},
        },
    }).encode("utf-8")
    req = urllib.request.Request(
        (API % model) + "?key=" + key, data=body,
        headers={"Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=240) as r:
            data = json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", "replace")[:400]
        # Never echo the key back, even inside an error body.
        sys.exit("%s HTTP %s: %s" % (model, e.code, detail.replace(key, "<key>")))

    cands = data.get("candidates") or []
    if not cands:
        sys.exit("No image returned: %s" % json.dumps(data)[:300].replace(key, "<key>"))
    for part in cands[0].get("content", {}).get("parts", []):
        if "inlineData" in part:
            return base64.b64decode(part["inlineData"]["data"])
    reason = cands[0].get("finishReason", "unknown")
    sys.exit("The model returned no image (finishReason: %s)." % reason)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--name", choices=list(PROMPTS), help="which texture to make")
    ap.add_argument("--ramp", choices=list(RAMPS), default="forest")
    ap.add_argument("--aspect", default="3:4",
                    help="aspect ratio: 1:1, 3:4, 4:3, 9:16, 16:9")
    ap.add_argument("--tier", choices=list(MODELS), default="fast",
                    help="fast = cheap texture, pro = better light and gradation")
    ap.add_argument("--keep-raw", action="store_true",
                    help="also keep the untouched generation, for reference")
    ap.add_argument("--dry-run", action="store_true",
                    help="print the prompt and cost note, generate nothing")
    ap.add_argument("--list-prompts", action="store_true")
    a = ap.parse_args()

    if a.list_prompts:
        for k, v in PROMPTS.items():
            print("%-12s %s" % (k, v[:88] + "..."))
        return
    if not a.name:
        ap.error("--name is required (see --list-prompts)")

    prompt = PROMPTS[a.name]
    if a.dry_run:
        print("model : %s" % MODELS[a.tier])
        print("aspect: %s" % a.aspect)
        print("ramp  : %s" % a.ramp)
        print("prompt: %s%s" % (prompt, NEGATIVE))
        print("\nDRY RUN — nothing generated, nothing billed.")
        return

    os.makedirs(OUT_DIR, exist_ok=True)
    raw = generate(prompt, a.aspect, a.tier)

    raw_path = os.path.join(OUT_DIR, "_raw-%s.jpg" % a.name)
    with io.open(raw_path, "wb") as f:
        f.write(raw)

    out = os.path.join(OUT_DIR, "%s-%s.jpg" % (a.name, a.ramp))
    path, size = duotone(raw_path, out, a.ramp)
    if not a.keep_raw:
        os.remove(raw_path)

    rel = os.path.relpath(path, REPO).replace("\\", "/")
    print("wrote %s %s  (ramp: %s, brand-locked)" % (rel, size, a.ramp))
    print("Reference it from studio/content/cards.json as:  \"bg\": \"%s\"" % rel)


if __name__ == "__main__":
    main()
