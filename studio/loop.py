# -*- coding: utf-8 -*-
"""
The Studio loop — runs the pipeline when something actually changes.

The pipeline knows WHAT to rebuild. The loop decides WHEN. Its job is to sit
between Dorina tapping Approve and the post going out, without a person in the
middle and without burning anything while it waits.

Two things can wake it:
  · a content change   — cards.json, queue.json, a template, a tool
  · an approval change — what Dorina has ticked in the Studio (via Supabase)

Everything else is a no-op cycle: it checks, finds nothing, and sleeps. Idle
cycles cost nothing — no API calls, no rendering, no publishing.

    python loop.py --interval 300 --until-idle 6
    python loop.py --interval 60 --max-cycles 5        # a short supervised run
    python loop.py --interval 300 --live               # actually publish
    python loop.py --once                              # one cycle and exit

Stop it cleanly at any time:
    create studio/.loop-stop   (the file is consumed on exit)

Design rules, learned the hard way:
  · billable nodes never run unless --allow-cost is passed, so a loop left
    running overnight cannot generate images on a timer
  · --live is opt-in; the default publishes nothing, it only dry-runs
  · consecutive failures back off, so a broken credential does not hammer an API
  · every cycle appends one line to .loop-log.jsonl — what changed, what ran
"""

import argparse
import hashlib
import io
import json
import os
import subprocess
import sys
import time
from glob import glob

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
PY = sys.executable
STOP = os.path.join(HERE, ".loop-stop")
LOG = os.path.join(HERE, ".loop-log.jsonl")

WATCH = [
    "studio/content/cards.json",
    "studio/content/queue.json",
    "studio/templates/card.html",
    "studio/build_graphics.py",
    "studio/publish.py",
    "studio/tools/*.py",
]


def content_hash():
    h = hashlib.sha256()
    for pat in WATCH:
        for f in sorted(glob(os.path.join(REPO, pat.replace("/", os.sep)))):
            h.update(f.encode())
            try:
                with io.open(f, "rb") as fh:
                    h.update(fh.read())
            except OSError:
                pass
    return h.hexdigest()[:16]


def approval_hash():
    """What Dorina has approved, as a hash. None when the backend is unreachable.

    Deliberately tolerant: no service key, no network, or a Supabase blip must
    degrade to 'no approval signal', never crash the loop. A loop that dies on a
    transient error is worse than one that waits.
    """
    if not (os.environ.get("SUPABASE_URL") and os.environ.get("SUPABASE_SERVICE_KEY")):
        return None
    try:
        sys.path.insert(0, HERE)
        import publish  # noqa: E402
        rows = publish.load_approvals_supabase()
        return hashlib.sha256(
            json.dumps(rows, sort_keys=True).encode()).hexdigest()[:16]
    except Exception:
        return None


def run_pipeline(allow_cost, live):
    cmd = [PY, "pipeline.py", "--run", "all"]
    if allow_cost:
        cmd.append("--allow-cost")
    if live:
        cmd.append("--live")
    p = subprocess.run(cmd, cwd=HERE, capture_output=True, text=True,
                       encoding="utf-8", errors="replace")
    summary = ""
    for line in (p.stdout or "").splitlines():
        if "ran," in line and "skipped" in line:
            summary = line.strip()
    return p.returncode == 0, summary, (p.stdout or "")


def log(entry):
    entry["at"] = time.strftime("%Y-%m-%dT%H:%M:%S")
    with io.open(LOG, "a", encoding="utf-8", newline="\n") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--interval", type=int, default=300, help="seconds between checks")
    ap.add_argument("--max-cycles", type=int, default=0, help="0 = unlimited")
    ap.add_argument("--until-idle", type=int, default=0,
                    help="stop after N consecutive cycles with nothing to do")
    ap.add_argument("--allow-cost", action="store_true", help="permit billable nodes")
    ap.add_argument("--live", action="store_true", help="publish for real")
    ap.add_argument("--once", action="store_true", help="a single cycle, then exit")
    a = ap.parse_args()

    if os.path.exists(STOP):
        os.remove(STOP)

    print("Studio loop — every %ds%s%s" % (
        a.interval,
        ", billable nodes ALLOWED" if a.allow_cost else "",
        ", LIVE publishing" if a.live else ", dry-run only"))
    print("stop cleanly:  create %s\n" % os.path.relpath(STOP, REPO).replace("\\", "/"))

    last_content = last_approval = None
    idle = fails = cycle = 0

    while True:
        cycle += 1
        if os.path.exists(STOP):
            os.remove(STOP)
            print("· stop file found — exiting cleanly")
            log({"cycle": cycle, "event": "stopped"})
            break

        ch, ah = content_hash(), approval_hash()
        first = last_content is None
        changed = []
        if ch != last_content:
            changed.append("content" if not first else "first run")
        if ah is not None and ah != last_approval:
            changed.append("approvals")

        stamp = time.strftime("%H:%M:%S")
        if not changed:
            idle += 1
            print("· %s cycle %-3d nothing changed (idle %d)" % (stamp, cycle, idle))
            log({"cycle": cycle, "event": "idle"})
        else:
            idle = 0
            print("· %s cycle %-3d %s changed — running" % (stamp, cycle, " + ".join(changed)))
            ok, summary, _out = run_pipeline(a.allow_cost, a.live)
            print("    %s" % (summary or ("ok" if ok else "FAILED")))
            log({"cycle": cycle, "event": "ran", "trigger": changed,
                 "ok": ok, "summary": summary})
            if ok:
                last_content, last_approval, fails = ch, ah, 0
            else:
                fails += 1
                # Do not advance the hashes on failure: the same change should be
                # retried, not silently treated as done.
                print("    (failure %d — will retry)" % fails)

        if a.once:
            break
        if a.max_cycles and cycle >= a.max_cycles:
            print("· reached --max-cycles %d" % a.max_cycles)
            break
        if a.until_idle and idle >= a.until_idle:
            print("· idle for %d cycles — nothing left to do" % idle)
            break

        wait = a.interval * min(2 ** fails, 8) if fails else a.interval
        if fails:
            print("    backing off to %ds" % wait)
        try:
            time.sleep(wait)
        except KeyboardInterrupt:
            print("\n· interrupted — exiting cleanly")
            log({"cycle": cycle, "event": "interrupted"})
            break

    print("\n%d cycle(s). Log: %s" % (cycle, os.path.relpath(LOG, REPO).replace("\\", "/")))
    return 0


if __name__ == "__main__":
    sys.exit(main())
