# -*- coding: utf-8 -*-
"""
Dorina Studio — branded graphics builder.

Renders every card in content/cards.json to PNG using the locked Ivory & Forest
identity. No AI image generation: the graphics are typographic, deterministic,
free to produce, and identical every run.

Usage:
    python build_graphics.py                 # everything
    python build_graphics.py --deck p1       # one deck
    python build_graphics.py --lang en       # one language
    python build_graphics.py --format ig-portrait

Output: assets/social/<deck>/<format>/<lang>-<nn>.png
"""

import argparse
import io
import json
import os
import shutil
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
TEMPLATE = os.path.join(HERE, "templates", "card.html")
CONTENT = os.path.join(HERE, "content", "cards.json")
OUT_ROOT = os.path.join(REPO, "assets", "social")

CHROME_CANDIDATES = [
    r"C:/Program Files/Google/Chrome/Application/chrome.exe",
    r"C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "/usr/bin/google-chrome",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
]

# Canvas sizes that matter per platform.
#   ig-portrait  4:5  — highest-reach IG feed format, also fine as a LinkedIn document page
#   ig-square    1:1  — safe fallback / grid consistency
#   story        9:16 — Stories and Reel covers
#   li-square    1:1  — LinkedIn single image (renders large in-feed)
FORMATS = {
    "ig-portrait": (1080, 1350),
    "ig-square": (1080, 1080),
    "story": (1080, 1920),
    "li-square": (1200, 1200),
}


def find_chrome():
    for p in CHROME_CANDIDATES:
        if os.path.exists(p):
            return p
    found = shutil.which("chrome") or shutil.which("google-chrome") or shutil.which("chromium")
    if found:
        return found
    sys.exit("Chrome not found — install Chrome or edit CHROME_CANDIDATES.")


def build_card_data(card, deck, lang, defaults, ladder, w, h):
    """Turn one authored card into the flat payload the template expects."""
    data = {
        "w": w,
        "h": h,
        "lang": lang,
        "ground": card.get("ground", "forest"),
        "eyebrow": card.get("eyebrow"),
        "lead": card.get("lead"),
        "sub": card.get("sub"),
        "handle": defaults["handle_ar"] if lang == "ar" else defaults["handle_en"],
        "swipe": card.get("swipe"),
        "pill": card.get("pill"),
        "dots": card.get("dots"),
        "dotOn": card.get("dotOn", 0),
        # Seeds the colour mesh. Deterministic per card so rebuilds are identical,
        # but every card in a deck gets a different wash.
        "seed": card.get("seed", "%s-%s-%s" % (deck["id"], lang, card.get("type", ""))),
        # Chrome renders the card from a temp directory, so a repo-relative
        # texture path has to become an absolute file URL or it silently 404s.
        "bg": (("file:///" + os.path.join(REPO, card["bg"]).replace("\\", "/"))
               if card.get("bg") else None),
        "frame": card.get("frame", True),
    }
    if card.get("disclaimer"):
        data["disclaimer"] = defaults["disclaimer_ar"] if lang == "ar" else defaults["disclaimer_en"]
    if card.get("type") == "ladder":
        steps = []
        on = card.get("on", -1)
        for i, s in enumerate(ladder[lang]):
            steps.append({"n": s["n"], "t": s["t"], "on": (i == on)})
        data["steps"] = steps
    return data


def render(chrome, template_html, data, out_path):
    payload = json.dumps(data, ensure_ascii=False)
    html = template_html.replace("{{DATA}}", payload)

    tmp_dir = tempfile.mkdtemp(prefix="dorina-card-")
    tmp_html = os.path.join(tmp_dir, "card.html")
    tmp_png = os.path.join(tmp_dir, "card.png")
    with io.open(tmp_html, "w", encoding="utf-8", newline="\n") as f:
        f.write(html)

    url = "file:///" + tmp_html.replace("\\", "/")
    cmd = [
        chrome, "--headless=new", "--disable-gpu", "--hide-scrollbars",
        "--force-device-scale-factor=1",
        "--window-size=%d,%d" % (data["w"], data["h"]),
        "--virtual-time-budget=6000",
        "--screenshot=" + tmp_png,
        url,
    ]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=120)

    if not os.path.exists(tmp_png):
        shutil.rmtree(tmp_dir, ignore_errors=True)
        raise RuntimeError("render produced no file: " + out_path)

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    shutil.move(tmp_png, out_path)
    shutil.rmtree(tmp_dir, ignore_errors=True)
    return out_path


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--deck")
    ap.add_argument("--lang", choices=["en", "ar"])
    ap.add_argument("--format", dest="fmt", choices=list(FORMATS))
    args = ap.parse_args()

    chrome = find_chrome()
    with io.open(TEMPLATE, encoding="utf-8") as f:
        template_html = f.read()
    with io.open(CONTENT, encoding="utf-8") as f:
        content = json.load(f)

    defaults = content["defaults"]
    ladder = content["ladder"]
    made = []

    for deck in content["decks"]:
        if args.deck and deck["id"] != args.deck:
            continue
        formats = [args.fmt] if args.fmt else deck.get("formats", ["ig-portrait"])
        for fmt in formats:
            if fmt not in FORMATS:
                continue
            w, h = FORMATS[fmt]
            for lang in (["en", "ar"] if not args.lang else [args.lang]):
                cards = deck.get(lang) or []
                # A single-image format uses only the cover — a carousel would be lost on it,
                # and swipe/dot cues would be lying about a swipe that does not exist.
                single = fmt in ("li-square", "ig-square", "story")
                if single:
                    cards = [dict(cards[0])] if cards else []
                    if cards:
                        cards[0].pop("swipe", None)
                        cards[0].pop("dots", None)
                for i, card in enumerate(cards):
                    data = build_card_data(card, deck, lang, defaults, ladder, w, h)
                    out = os.path.join(OUT_ROOT, deck["id"], fmt, "%s-%02d.png" % (lang, i + 1))
                    render(chrome, template_html, data, out)
                    made.append(os.path.relpath(out, REPO).replace("\\", "/"))
                    print("  " + made[-1])

    print("\n%d graphic(s) written to assets/social/" % len(made))


if __name__ == "__main__":
    main()
