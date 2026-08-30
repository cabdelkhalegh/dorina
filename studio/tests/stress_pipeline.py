# -*- coding: utf-8 -*-
"""
Stress tests for the pipeline and loop engines.

These are deliberately adversarial. The engines will eventually run unattended
against a client's live LinkedIn, so the interesting question is not "does the
happy path work" but "what does it do when something is wrong".

    python tests/stress_pipeline.py

Every test restores whatever it touched. Exit 0 = all passed.
"""

import io
import json
import os
import shutil
import subprocess
import sys
import time

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

HERE = os.path.dirname(os.path.abspath(__file__))
STUDIO = os.path.dirname(HERE)
REPO = os.path.dirname(STUDIO)
PY = sys.executable
STATE = os.path.join(STUDIO, ".pipeline-state.json")

RESULTS = []


def run(args, timeout=900, cwd=STUDIO):
    p = subprocess.run([PY] + args, cwd=cwd, capture_output=True, text=True,
                       encoding="utf-8", errors="replace", timeout=timeout)
    return p.returncode, (p.stdout or "") + (p.stderr or "")


def check(name, condition, detail=""):
    RESULTS.append((name, bool(condition), detail))
    print("  %s  %s%s" % ("PASS" if condition else "FAIL", name,
                          ("  — " + detail) if detail and not condition else ""))
    return bool(condition)


def backup(path):
    b = path + ".stressbak"
    shutil.copy(path, b)
    return b


def restore(path):
    b = path + ".stressbak"
    if os.path.exists(b):
        shutil.move(b, path)


# ---------------------------------------------------------------- 1. cycles
def test_cycle_detection():
    print("\n[1] cycle detection")
    src = os.path.join(STUDIO, "pipeline.py")
    backup(src)
    try:
        s = io.open(src, encoding="utf-8").read()
        # make compliance depend on publish, which already depends on compliance
        s2 = s.replace('"desc": "Refuse anything implying clinical licensure",\n        "needs": [],',
                       '"desc": "Refuse anything implying clinical licensure",\n        "needs": ["publish"],')
        assert s2 != s, "could not inject a cycle"
        io.open(src, "w", encoding="utf-8", newline="\n").write(s2)
        rc, out = run(["pipeline.py", "--plan"])
        check("a cycle is detected and named", "cycle in the graph" in out, out[-200:])
        check("does not hang or crash silently", rc != 0)
    finally:
        restore(src)


# ------------------------------------------------------- 2. failure handling
def test_failure_stops_downstream():
    print("\n[2] a failing node stops everything downstream")
    q = os.path.join(STUDIO, "content", "queue.json")
    backup(q)
    try:
        d = json.load(io.open(q, encoding="utf-8"))
        d["posts"][0]["caption"] = "As a therapist I cure anxiety with hypnotherapy."
        io.open(q, "w", encoding="utf-8", newline="\n").write(
            json.dumps(d, ensure_ascii=False, indent=2) + "\n")

        rc, out = run(["pipeline.py", "--run", "publish"])
        check("compliance fails the run", "FAILED" in out or rc != 0)
        check("publish is not reached", "Stopped: compliance failed" in out
              or "publish" not in out.split("Stopped:")[-1], out[-250:])
    finally:
        restore(q)


# ------------------------------------------------- 3. state is not advanced
def test_failure_does_not_cache():
    print("\n[3] a failed node is not marked done")
    src = os.path.join(STUDIO, "build_graphics.py")
    backup(src)
    if os.path.exists(STATE):
        backup(STATE)
    try:
        s = io.open(src, encoding="utf-8").read()
        io.open(src, "w", encoding="utf-8", newline="\n").write(
            "import sys\nsys.exit('deliberate stress failure')\n" + s)
        run(["pipeline.py", "--force", "cards"])
        st = json.load(io.open(STATE, encoding="utf-8")) if os.path.exists(STATE) else {}
        check("cards not recorded as built", "cards" not in st,
              "state kept: %s" % list(st))
    finally:
        restore(src)
        restore(STATE)


# ----------------------------------------------------- 4. missing outputs
def test_missing_output_rebuilds():
    print("\n[4] deleting an output marks the node stale")
    target = os.path.join(REPO, "assets", "social", "p1", "ig-portrait", "en-01.png")
    tmp = target + ".stressbak"
    run(["pipeline.py", "--run", "cards"])          # ensure built
    shutil.move(target, tmp)
    try:
        rc, out = run(["pipeline.py", "--plan"])
        line = [l for l in out.splitlines() if l.startswith("cards")]
        check("cards goes stale when an output vanishes",
              line and "RUN" in line[0] and "outputs missing" in line[0],
              line[0] if line else "no cards line")
    finally:
        shutil.move(tmp, target)


# ------------------------------------------------------- 5. corrupt state
def test_corrupt_state():
    print("\n[5] a corrupt state file does not brick the engine")
    if os.path.exists(STATE):
        backup(STATE)
    try:
        io.open(STATE, "w", encoding="utf-8").write("{ this is not json ][")
        rc, out = run(["pipeline.py", "--plan"])
        check("recovers and still plans", "NODE" in out and rc == 0, out[-200:])
    finally:
        restore(STATE)


# ------------------------------------------------------- 6. unknown node
def test_unknown_node():
    print("\n[6] unknown node name")
    rc, out = run(["pipeline.py", "--run", "does-not-exist"])
    check("names the bad node and exits non-zero",
          "unknown node" in out and rc != 0, out[-160:])


# ------------------------------------------------- 7. cost gate under force
def test_cost_gate_holds():
    print("\n[7] the cost gate cannot be bypassed by --force")
    rc, out = run(["pipeline.py", "--force", "textures"])
    billed = ("submitting" in out.lower() or "generating" in out.lower()
              or "deck image(s) generated" in out)
    check("billable node still refuses to run", not billed and "billable" in out.lower(),
          out[-200:])


# ------------------------------------------------ 8. concurrent invocations
def test_concurrent_runs():
    print("\n[8] two pipelines at once do not corrupt state")
    if os.path.exists(STATE):
        backup(STATE)
    try:
        ps = [subprocess.Popen([PY, "pipeline.py", "--run", "compliance"], cwd=STUDIO,
                               stdout=subprocess.PIPE, stderr=subprocess.PIPE)
              for _ in range(4)]
        for p in ps:
            p.wait(timeout=300)
        ok = True
        if os.path.exists(STATE):
            try:
                json.load(io.open(STATE, encoding="utf-8"))
            except Exception as e:
                ok = False
        check("state file still parses after 4 concurrent runs", ok)
        check("all four exited cleanly", all(p.returncode == 0 for p in ps),
              str([p.returncode for p in ps]))
    finally:
        restore(STATE)


# ------------------------------------------------------------ 9. loop tests
def test_loop_once_and_stop():
    print("\n[9] loop: single cycle, and the stop file")
    rc, out = run(["loop.py", "--once"], timeout=900)
    check("--once runs exactly one cycle", "1 cycle(s)" in out, out[-160:])

    stop = os.path.join(STUDIO, ".loop-stop")
    io.open(stop, "w").write("")
    rc, out = run(["loop.py", "--interval", "2", "--max-cycles", "50"], timeout=300)
    check("a pre-existing stop file is cleared at startup, not obeyed blindly",
          "cycle 1" in out, out[-200:])
    if os.path.exists(stop):
        os.remove(stop)


def test_loop_survives_bad_node():
    print("\n[10] loop: a failing pipeline does not kill the loop")
    src = os.path.join(STUDIO, "build_graphics.py")
    backup(src)
    if os.path.exists(STATE):
        backup(STATE)
    try:
        s = io.open(src, encoding="utf-8").read()
        io.open(src, "w", encoding="utf-8", newline="\n").write(
            "import sys\nsys.exit('deliberate stress failure')\n" + s)
        run(["pipeline.py", "--force", "cards"])   # make cards stale + failing
        rc, out = run(["loop.py", "--interval", "2", "--max-cycles", "3"], timeout=600)
        check("loop keeps cycling after a failure", "cycle 3" in out or "3 cycle" in out,
              out[-200:])
        check("failure is reported, not swallowed", "failure" in out.lower()
              or "FAILED" in out, out[-200:])
    finally:
        restore(src)
        restore(STATE)


def main():
    print("Stress testing the studio engines")
    print("=" * 60)
    t0 = time.time()
    for fn in (test_cycle_detection, test_failure_stops_downstream,
               test_failure_does_not_cache, test_missing_output_rebuilds,
               test_corrupt_state, test_unknown_node, test_cost_gate_holds,
               test_concurrent_runs, test_loop_once_and_stop,
               test_loop_survives_bad_node):
        try:
            fn()
        except Exception as e:
            check(fn.__name__ + " (crashed)", False, "%s: %s" % (type(e).__name__, e))

    passed = sum(1 for _, ok, _ in RESULTS if ok)
    print("\n" + "=" * 60)
    print("%d/%d passed in %.0fs" % (passed, len(RESULTS), time.time() - t0))
    for name, ok, detail in RESULTS:
        if not ok:
            print("  FAILED: %s — %s" % (name, detail[:200]))
    return 0 if passed == len(RESULTS) else 1


if __name__ == "__main__":
    sys.exit(main())
