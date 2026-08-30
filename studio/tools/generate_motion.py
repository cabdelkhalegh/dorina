# -*- coding: utf-8 -*-
"""
Motion generator — Veo 3.1 + the same brand-lock as the stills.

Why this exists: the playbook's strongest unused lever is video. Reels carry
roughly 4x the reach of a single image and DM sends are the top ranking signal,
but Reels normally need her on camera — a much bigger ask than her open gates.
Silent, abstract motion in her own palette gets the format without the face.

The palette lock is the same idea as duotone.py, applied to every frame: the
ramps in duotone.py are baked into a Hald CLUT and applied with ffmpeg, so a
clip and a card physically cannot drift apart — they read from one definition.

    python tools/generate_motion.py --name arc --ramp forest
    python tools/generate_motion.py --list-prompts
    python tools/generate_motion.py --name arc --dry-run
    python tools/generate_motion.py --name ripple --tier pro --keep-raw

Output: assets/social/motion/<name>-<ramp>.mp4  (9:16, silent, brand-locked)
"""

import argparse
import io
import json
import os
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.request

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

HERE = os.path.dirname(os.path.abspath(__file__))
STUDIO = os.path.dirname(HERE)
REPO = os.path.dirname(STUDIO)
OUT_DIR = os.path.join(REPO, "assets", "social", "motion")

sys.path.insert(0, HERE)
from duotone import RAMPS, build_lut  # noqa: E402

BASE = "https://generativelanguage.googleapis.com/v1beta"

# Measured on this key: the fast tier returned an 8s 720x1280 clip in ~30s.
MODELS = {
    "fast": "veo-3.1-fast-generate-preview",
    "pro":  "veo-3.1-generate-preview",
    "lite": "veo-3.1-lite-generate-preview",
}

# Abstract, silent, no people. Same discipline as the stills: the model is asked
# for a mood, never for text, never for anything that reads as clinical.
PROMPTS = {
    "arc":
        "Extreme slow motion macro: a single ring of soft light slowly drawing itself across a "
        "deep dark textured surface, stopping just before it closes, leaving a small gap. Almost "
        "still, meditative, fine grain, shallow depth of field, cinematic.",
    "ripple":
        "Extreme slow motion macro of one small ripple spreading outward across an otherwise "
        "perfectly still dark water surface. A single quiet disturbance, soft reflected light, "
        "most of the frame calm and undisturbed. Meditative, understated.",
    "linen":
        "Very slow drift of raking light travelling across natural woven linen, fibres catching "
        "the light one by one. Soft shadow, shallow depth of field, calm and even, almost still.",
    "breath":
        "Abstract slow expansion and contraction of a soft pool of light on a dark textured "
        "field, like a slow breath. Gentle, rhythmic, no hard edges, fine photographic grain.",
}

NEGATIVE = (" No people, no faces, no hands, no bodies, no text, no letters, no words, no logos, "
            "no watermarks, no medical or clinical imagery, no fast cuts, no camera shake.")


def key():
    k = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not k:
        sys.exit("GEMINI_API_KEY is not set. Export it — it must never be written into this repo.")
    return k


def ffmpeg_bin(name):
    found = shutil.which(name)
    if found:
        return found
    guess = os.path.join(
        os.environ.get("LOCALAPPDATA", ""), "Microsoft", "WinGet", "Packages",
        "Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe",
        "ffmpeg-8.0.1-full_build", "bin", name + ".exe")
    if os.path.exists(guess):
        return guess
    sys.exit("%s not found. Install ffmpeg, or the clip cannot be brand-locked." % name)


def make_hald_clut(ramp, path, level=8):
    """Bake a duotone ramp into a Hald CLUT.

    ffmpeg can apply an arbitrary colour mapping as a 3D lookup table. Building
    that table from duotone.RAMPS means video and stills share one palette
    definition — change the ramp once and both follow.
    """
    from PIL import Image
    size = level * level          # 64
    side = size * level           # 512
    img = Image.new("RGB", (side, side))
    px = img.load()
    lut = build_lut(RAMPS[ramp])  # 768 entries: R then G then B
    for b in range(size):
        for g in range(size):
            for r in range(size):
                # identity colour for this cell
                R = r * 255 // (size - 1)
                G = g * 255 // (size - 1)
                B = b * 255 // (size - 1)
                # luminance -> ramp, exactly as the still duotone does
                y = int(0.299 * R + 0.587 * G + 0.114 * B)
                x = (b % level) * size + r
                yy = (b // level) * size + g
                px[x, yy] = (lut[y], lut[256 + y], lut[512 + y])
    img.save(path)
    return path


def submit(prompt, model, aspect):
    url = "%s/models/%s:predictLongRunning?key=%s" % (BASE, model, key())
    body = json.dumps({
        "instances": [{"prompt": prompt + NEGATIVE}],
        "parameters": {"aspectRatio": aspect},
    }).encode("utf-8")
    req = urllib.request.Request(url, data=body,
                                 headers={"Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=180) as r:
            return json.loads(r.read().decode("utf-8"))["name"]
    except urllib.error.HTTPError as e:
        sys.exit("Veo HTTP %s: %s" % (e.code, e.read().decode("utf-8", "replace")[:400]
                                      .replace(key(), "<key>")))


def wait(op, every=15, limit=40):
    url = "%s/%s?key=%s" % (BASE, op, key())
    for i in range(limit):
        with urllib.request.urlopen(url, timeout=120) as r:
            d = json.loads(r.read().decode("utf-8"))
        if d.get("done"):
            if "error" in d:
                sys.exit("Veo failed: %s" % json.dumps(d["error"])[:300])
            samples = (d["response"]["generateVideoResponse"]["generatedSamples"])
            return samples[0]["video"]["uri"]
        print("   ...still rendering (%ds)" % (i * every))
        time.sleep(every)
    sys.exit("Veo did not finish in time; the operation may still complete: %s" % op)


def download(uri, path):
    req = urllib.request.Request(uri + ("&" if "?" in uri else "?") + "key=" + key())
    with urllib.request.urlopen(req, timeout=600) as r:
        data = r.read()
    with io.open(path, "wb") as f:
        f.write(data)
    return len(data)


def brand_lock(src, dst, ramp, keep_audio=False):
    """Apply the ramp to every frame and strip the generated audio.

    Audio is removed by default: Veo returns a synthetic track, and a wellbeing
    practitioner posting invented ambient sound under her own name is a small
    authenticity problem for no gain. Add a real track later if wanted.
    """
    ff = ffmpeg_bin("ffmpeg")
    clut = os.path.join(os.path.dirname(dst), "_clut-%s.png" % ramp)
    make_hald_clut(ramp, clut)
    # Desaturate BEFORE the CLUT. The table maps luminance, so on a colour
    # source the interpolation runs between off-diagonal nodes and posterises
    # into visible blocks; on a grey source it samples along the diagonal, where
    # the node values are exact. gradfun then smooths the banding that h264
    # compression leaves in the original gradients.
    cmd = [ff, "-y", "-v", "error", "-i", src, "-i", clut,
           "-filter_complex",
           "[0:v]hue=s=0,gradfun=1.5:16[g];[g][1:v]haldclut=interp=tetrahedral[v]",
           "-map", "[v]"]
    cmd += ["-map", "0:a?", "-c:a", "copy"] if keep_audio else ["-an"]
    cmd += ["-c:v", "libx264", "-preset", "slow", "-crf", "20",
            "-pix_fmt", "yuv420p", "-movflags", "+faststart", dst]
    subprocess.run(cmd, check=True, timeout=900)
    os.remove(clut)
    return dst


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--name", choices=list(PROMPTS))
    ap.add_argument("--ramp", choices=list(RAMPS), default="forest")
    ap.add_argument("--tier", choices=list(MODELS), default="fast",
                    help="fast (~30s, default) | pro (best) | lite (cheapest)")
    ap.add_argument("--aspect", default="9:16", help="9:16 for Reels/Stories, 16:9 for LinkedIn")
    ap.add_argument("--keep-raw", action="store_true", help="keep the untouched Veo output")
    ap.add_argument("--keep-audio", action="store_true", help="keep Veo's synthetic audio track")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--list-prompts", action="store_true")
    a = ap.parse_args()

    if a.list_prompts:
        for k, v in PROMPTS.items():
            print("%-8s %s" % (k, v[:90] + "..."))
        return
    if not a.name:
        ap.error("--name is required (see --list-prompts)")

    prompt = PROMPTS[a.name]
    if a.dry_run:
        print("model : %s" % MODELS[a.tier])
        print("aspect: %s   ramp: %s   audio: %s"
              % (a.aspect, a.ramp, "kept" if a.keep_audio else "stripped"))
        print("prompt: %s%s" % (prompt, NEGATIVE))
        print("\nDRY RUN — nothing submitted, nothing billed.")
        return

    os.makedirs(OUT_DIR, exist_ok=True)
    print("· submitting to %s (%s)" % (MODELS[a.tier], a.aspect))
    op = submit(prompt, MODELS[a.tier], a.aspect)
    uri = wait(op)

    raw = os.path.join(OUT_DIR, "_raw-%s.mp4" % a.name)
    n = download(uri, raw)
    print("· downloaded %s bytes" % format(n, ","))

    out = os.path.join(OUT_DIR, "%s-%s.mp4" % (a.name, a.ramp))
    brand_lock(raw, out, a.ramp, a.keep_audio)
    if not a.keep_raw:
        os.remove(raw)

    rel = os.path.relpath(out, REPO).replace("\\", "/")
    print("\nwrote %s  (ramp: %s, %s)" % (rel, a.ramp,
                                          "with audio" if a.keep_audio else "silent"))


if __name__ == "__main__":
    main()
