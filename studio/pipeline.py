# -*- coding: utf-8 -*-
"""
The Studio pipeline — a dependency graph over the production steps.

Until now the studio was five scripts run by hand in the right order, from
memory. That works while one person holds the whole thing in their head and
fails the moment it runs unattended: rebuild the cards but forget the textures
and you publish yesterday's art; skip compliance and you publish a liability.

This declares the steps as a graph. Each node names what it reads, what it
writes, and what must run before it. The engine hashes the inputs, compares
against the last successful run, and executes only what is genuinely stale, in
topological order.

    python pipeline.py --plan                # what would run, and why
    python pipeline.py --graph               # the DAG
    python pipeline.py --run publish         # that node and everything it needs
    python pipeline.py --run all
    python pipeline.py --force cards
    python pipeline.py --run all --allow-cost   # permit billable nodes

COST GATE — the reason this is not just make:
Two nodes call paid generation APIs. A graph that re-runs them whenever a file's
timestamp moves would quietly spend money every cycle, and inside a loop it would
do so forever. Billable nodes are therefore SKIPPED unless --allow-cost is given,
even when stale. Nothing bills by accident.
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
STATE = os.path.join(HERE, ".pipeline-state.json")
PY = sys.executable


# --------------------------------------------------------------- the graph
#
# inputs  : files whose CONTENT decides whether this node is stale
# outputs : files that must exist for the node to count as built
# needs   : nodes that must be up to date first
# costly  : calls a paid API — never runs without --allow-cost
# always  : a gate, not a build; runs every time and caches nothing

NODES = {
    "textures": {
        "desc": "Generate one brand-locked image per deck (Gemini image models)",
        "needs": [],
        "inputs": ["studio/content/cards.json", "studio/tools/generate_texture.py",
                   "studio/tools/duotone.py"],
        "outputs": ["assets/social/textures/deck-*.jpg"],
        "cmd": [PY, "tools/generate_texture.py", "--batch", "--tier", "pro"],
        "costly": True,
    },
    "motion": {
        "desc": "Generate brand-locked motion clips (Veo 3.1)",
        "needs": [],
        "inputs": ["studio/tools/generate_motion.py", "studio/tools/duotone.py"],
        "outputs": ["assets/social/motion/*.mp4"],
        "cmd": [PY, "tools/generate_motion.py", "--name", "arc", "--ramp", "forest"],
        "costly": True,
    },
    "cards": {
        "desc": "Render every card to PNG, both languages, all formats",
        "needs": ["textures"],
        "inputs": ["studio/content/cards.json", "studio/templates/card.html",
                   "studio/build_graphics.py", "assets/social/textures/deck-*.jpg"],
        "outputs": ["assets/social/p1/ig-portrait/en-01.png",
                    "assets/social/p2/ig-portrait/en-01.png"],
        "cmd": [PY, "build_graphics.py"],
    },
    "compliance": {
        "desc": "Refuse anything implying clinical licensure",
        "needs": [],
        "inputs": ["studio/content/queue.json", "studio/tools/compliance_check.py"],
        "outputs": [],
        "cmd": [PY, "tools/compliance_check.py"],
        "always": True,
    },
    "publish": {
        "desc": "Publish only what Dorina approved (dry-run unless --live)",
        "needs": ["cards", "compliance"],
        "inputs": ["studio/content/queue.json", "studio/publish.py"],
        "outputs": [],
        "cmd": [PY, "publish.py", "--dry-run"],
        "always": True,
    },
}


# ------------------------------------------------------------------ helpers

def resolve(patterns):
    out = []
    for p in patterns:
        full = os.path.join(REPO, p.replace("/", os.sep))
        hits = sorted(glob(full))
        out.extend(hits if hits else ([] if "*" in p else [full]))
    return out


def fingerprint(node):
    """Content hash of everything that should invalidate this node."""
    h = hashlib.sha256()
    h.update(json.dumps({k: v for k, v in node.items() if k != "desc"},
                        sort_keys=True, default=str).encode())
    for f in resolve(node.get("inputs", [])):
        h.update(f.encode())
        try:
            with io.open(f, "rb") as fh:
                while True:
                    chunk = fh.read(1 << 20)
                    if not chunk:
                        break
                    h.update(chunk)
        except OSError:
            h.update(b"<missing>")
    return h.hexdigest()[:16]


def outputs_present(node):
    for p in node.get("outputs", []):
        full = os.path.join(REPO, p.replace("/", os.sep))
        if "*" in p:
            if not glob(full):
                return False
        elif not os.path.exists(full):
            return False
    return True


def load_state():
    try:
        with io.open(STATE, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}


def save_state(s):
    with io.open(STATE, "w", encoding="utf-8", newline="\n") as f:
        f.write(json.dumps(s, indent=2, sort_keys=True) + "\n")


def toposort(names):
    """Depth-first topological order, with cycle detection."""
    order, seen, stack = [], set(), set()

    def visit(n, path):
        if n in stack:
            raise SystemExit("cycle in the graph: %s" % " -> ".join(path + [n]))
        if n in seen:
            return
        if n not in NODES:
            raise SystemExit("unknown node: %s" % n)
        stack.add(n)
        for dep in NODES[n].get("needs", []):
            visit(dep, path + [n])
        stack.discard(n)
        seen.add(n)
        order.append(n)

    for n in names:
        visit(n, [])
    return order


def status(name, state):
    """Return (stale, reason)."""
    node = NODES[name]
    if node.get("always"):
        return True, "gate — runs every time"
    if not outputs_present(node):
        return True, "outputs missing"
    prev = state.get(name, {})
    fp = fingerprint(node)
    if prev.get("fingerprint") != fp:
        return True, "inputs changed"
    return False, "up to date"


# -------------------------------------------------------------------- views

def show_graph():
    print("Studio pipeline\n")
    for name in toposort(list(NODES)):
        node = NODES[name]
        needs = ", ".join(node.get("needs", [])) or "—"
        tags = []
        if node.get("costly"):
            tags.append("BILLABLE")
        if node.get("always"):
            tags.append("gate")
        tag = ("  [%s]" % ", ".join(tags)) if tags else ""
        print("  %-11s needs: %-22s %s%s" % (name, needs, node["desc"], tag))
    print("\n  textures ─┐")
    print("            ├─> cards ─┐")
    print("  motion    │          ├─> publish")
    print("            compliance ┘")


def show_plan(targets, allow_cost):
    state = load_state()
    order = toposort(targets)
    print("%-11s %-10s %s" % ("NODE", "STATE", "REASON"))
    print("-" * 62)
    for name in order:
        stale, reason = status(name, state)
        node = NODES[name]
        if stale and node.get("costly") and not allow_cost:
            print("%-11s %-10s %s (needs --allow-cost)" % (name, "SKIP", reason))
        else:
            print("%-11s %-10s %s" % (name, "RUN" if stale else "skip", reason))


# ------------------------------------------------------------------ execute

def run_node(name, allow_cost, live=False):
    node = NODES[name]
    cmd = list(node["cmd"])
    if name == "publish" and live:
        cmd = [c for c in cmd if c != "--dry-run"] + ["--source", "supabase"]
    t0 = time.time()
    proc = subprocess.run(cmd, cwd=HERE, capture_output=True, text=True,
                          encoding="utf-8", errors="replace")
    dt = time.time() - t0
    ok = proc.returncode == 0
    tail = (proc.stdout or "").strip().splitlines()[-3:]
    for line in tail:
        print("      %s" % line[:150])
    if not ok:
        err = (proc.stderr or proc.stdout or "").strip().splitlines()[-4:]
        for line in err:
            print("      ! %s" % line[:150])
    print("      %s in %.1fs" % ("ok" if ok else "FAILED", dt))
    return ok, dt


def execute(targets, allow_cost, live=False):
    state = load_state()
    order = toposort(targets)
    ran = skipped = failed = 0

    for name in order:
        node = NODES[name]
        stale, reason = status(name, state)

        if not stale:
            print("·  %-11s up to date" % name)
            skipped += 1
            continue

        if node.get("costly") and not allow_cost:
            print("$  %-11s stale (%s) — skipped, billable. Use --allow-cost." % (name, reason))
            skipped += 1
            continue

        print(">  %-11s %s" % (name, reason))
        ok, dt = run_node(name, allow_cost, live)
        if ok:
            ran += 1
            if not node.get("always"):
                state[name] = {"fingerprint": fingerprint(node),
                               "at": time.strftime("%Y-%m-%dT%H:%M:%S"),
                               "seconds": round(dt, 1)}
                save_state(state)
        else:
            failed += 1
            print("\nStopped: %s failed. Downstream nodes not run." % name)
            break

    print("\n%d ran, %d skipped, %d failed." % (ran, skipped, failed))
    return failed == 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--graph", action="store_true", help="show the dependency graph")
    ap.add_argument("--plan", action="store_true", help="show what would run, and why")
    ap.add_argument("--run", metavar="NODE", help="node name, or 'all'")
    ap.add_argument("--force", metavar="NODE", help="run a node even if up to date")
    ap.add_argument("--allow-cost", action="store_true", help="permit billable nodes")
    ap.add_argument("--live", action="store_true",
                    help="publish for real instead of dry-run (still approval-gated)")
    a = ap.parse_args()

    if a.graph:
        return show_graph()

    if a.force:
        state = load_state()
        state.pop(a.force, None)
        save_state(state)
        print("forced: %s will rebuild\n" % a.force)
        targets = [a.force]
        return 0 if execute(targets, a.allow_cost, a.live) else 1

    targets = list(NODES) if (a.run == "all" or not a.run) else [a.run]

    if a.plan or not a.run:
        return show_plan(targets, a.allow_cost)

    return 0 if execute(targets, a.allow_cost, a.live) else 1


if __name__ == "__main__":
    sys.exit(main() or 0)
