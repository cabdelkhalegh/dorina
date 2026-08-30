# -*- coding: utf-8 -*-
"""
Compliance gate for anything published in Dorina's name.

Why this exists: her whole positioning depends on never implying clinical
licensure. In the UAE that is not a style preference — Federal Law 6/2023 makes
advertising that implies licensure an offence, and hypnotherapy is not a DHA
TCAM category at all. Until now the only thing enforcing that was human memory,
on captions written weeks earlier and published by a scheduled job at 09:30 while
everyone is asleep. This makes it mechanical.

    python tools/compliance_check.py                 # check the whole queue
    python tools/compliance_check.py --text "..."    # check one string
    python tools/compliance_check.py --strict        # warnings count as failures

Exit code 0 = clean, 1 = at least one BLOCK. publish.py calls this before it
sends anything, and refuses on a block.
"""

import argparse
import io
import json
import os
import re
import sys

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

HERE = os.path.dirname(os.path.abspath(__file__))
STUDIO = os.path.dirname(HERE)
QUEUE = os.path.join(STUDIO, "content", "queue.json")

# ---------------------------------------------------------------- rule sets
#
# BLOCK  — implies clinical licensure or a medical claim. Never publishable.
# WARN   — usually fine, but wrong in the wrong sentence; a human should look.
#
# Each rule may carry `unless`: contexts where the term is legitimate. The
# standing disclaimer literally contains the words "not therapy, diagnosis, or
# medical advice", so a naive substring match would flag every compliant post
# and train everyone to ignore the checker.

BLOCK = [
    (r"\b(therapist|therapists)\b", "implies clinical licensure", []),
    (r"\b(psychologist|psychiatrist|psychotherapist)\b", "regulated clinical title", []),
    (r"\b(counsellor|counselor)\b", "regulated clinical title", []),
    (r"\bclinician\b", "regulated clinical title", []),
    (r"\bmy (patient|patients)\b", "clinical relationship", []),
    (r"\b(diagnose|diagnosing|diagnoses)\b", "medical act", []),
    (r"\bprescrib(e|ing|ed)\b", "medical act", []),
    (r"\bcure(s|d)?\b", "outcome/medical claim", []),
    (r"\b(hypnotherapy|hypnotherapist|hypnosis)\b",
     "not advertisable in the UAE (not a DHA TCAM category)", []),
    (r"\bCBT\s+(specialist|practitioner|therapist)\b", "not publishable in any form", []),
    (r"\b(licensed|registered|certified)\s+(therapist|counsellor|counselor|psychologist|clinician)\b",
     "claims regulated registration", []),
    (r"\bregistered\s+(framework|method|trademark)\b",
     "her frameworks are signature, never registered", []),
    (r"\bmedical (advice|treatment)\b", "medical claim",
     [r"not therapy, diagnosis, or medical advice", r"ليس علاجاً أو تشخيصاً أو نصيحة طبية"]),
    (r"\btreat(s|ing|ment|ments)?\b", "implies clinical treatment",
     [r"not therapy, diagnosis, or medical advice", r"\btreat yourself\b", r"\btreat it as\b"]),
    (r"\btherapy\b", "implies clinical service",
     [r"not therapy, diagnosis, or medical advice", r"ليس علاجاً"]),
    (r"\bclinical\b", "implies clinical service",
     [r"non-clinical", r"no clinical", r"not clinical"]),
    # Arabic equivalents
    (r"معالِ?جة نفسية", "clinical title (AR)", []),
    (r"طبيبة نفسية", "clinical title (AR)", []),
    (r"أخصائية نفسية", "clinical title (AR)", []),
    (r"تشخيص", "diagnosis (AR)", [r"ليس علاجاً أو تشخيصاً أو نصيحة طبية"]),
]

WARN = [
    (r"\bheal(s|ing|ed)?\b", "reads as a medical outcome; prefer 'practice' or 'support'", []),
    (r"\bfix(es|ing|ed)?\b", "promises an outcome", []),
    (r"\bguarantee(s|d)?\b", "promises an outcome", []),
    (r"\banxiety disorder|depression\b", "names a diagnosis; keep to 'pressure' or 'stress'", []),
    (r"\bexpert\b", "authority claim — check it is defensible", []),
    (r"\bproven\b", "evidence claim — must trace to SOURCE_BRIEF", []),
    (r"\bTime Line Therapy\b", "trademark; adjective-only and historical while lapsed", []),
]

# Posts touching stress, emotion or the body must carry the standing footer.
FOOTER_EN = "not therapy, diagnosis, or medical advice"
FOOTER_AR = "ليس علاجاً أو تشخيصاً أو نصيحة طبية"
SENSITIVE = re.compile(
    r"\b(stress|pressure|emotion|anxious|anxiety|overwhelm|burnout|body|jaw|shoulders)\b"
    r"|ضغط|توتر|شعور|قلق|إرهاق|الجسد", re.I)


def _excused(text, unless):
    return any(re.search(u, text, re.I) for u in unless)


def check(text, label="text"):
    """Return (blocks, warns) as lists of (term, reason)."""
    blocks, warns = [], []
    for pat, reason, unless in BLOCK:
        for m in re.finditer(pat, text, re.I):
            if unless and _excused(text, unless):
                continue
            blocks.append((m.group(0), reason))
            break
    for pat, reason, unless in WARN:
        for m in re.finditer(pat, text, re.I):
            if unless and _excused(text, unless):
                continue
            warns.append((m.group(0), reason))
            break
    return blocks, warns


def check_post(post, queue):
    """Full check for one queue entry, including the footer requirement."""
    body = post.get("caption", "")
    full = body + "\n" + (post.get("hashtags") or "")
    if post.get("footer"):
        full += "\n" + (queue["footer_ar"] if post["lang"] == "ar" else queue["footer_en"])

    blocks, warns = check(full, post["id"])

    if SENSITIVE.search(body):
        needed = FOOTER_AR if post["lang"] == "ar" else FOOTER_EN
        if needed not in full:
            blocks.append(("(missing footer)",
                           "touches stress/emotion/the body but carries no disclaimer"))
    return blocks, warns


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--text", help="check a single string instead of the queue")
    ap.add_argument("--strict", action="store_true", help="treat warnings as failures")
    a = ap.parse_args()

    total_blocks = total_warns = 0

    if a.text:
        blocks, warns = check(a.text)
        for t, r in blocks:
            print("BLOCK  %-28s %s" % ('"%s"' % t, r))
        for t, r in warns:
            print("warn   %-28s %s" % ('"%s"' % t, r))
        if not blocks and not warns:
            print("clean")
        total_blocks, total_warns = len(blocks), len(warns)
    else:
        with io.open(QUEUE, encoding="utf-8") as f:
            queue = json.load(f)
        for post in queue["posts"]:
            blocks, warns = check_post(post, queue)
            total_blocks += len(blocks)
            total_warns += len(warns)
            state = "BLOCKED" if blocks else ("check" if warns else "clean")
            print("\n%-12s %-8s %s" % (post["id"], state, post["title"]))
            for t, r in blocks:
                print("   BLOCK  %-24s %s" % ('"%s"' % t, r))
            for t, r in warns:
                print("   warn   %-24s %s" % ('"%s"' % t, r))

    print("\n%d block(s), %d warning(s)." % (total_blocks, total_warns))
    if total_blocks or (a.strict and total_warns):
        print("FAILED — nothing should publish in this state.")
        return 1
    print("PASSED.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
