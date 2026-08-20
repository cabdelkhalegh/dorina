# -*- coding: utf-8 -*-
"""
Dorina Studio — publisher.

Reads the queue, keeps ONLY the posts Dorina approved, and publishes them to
LinkedIn and/or Instagram through each platform's official API.

    python publish.py --dry-run              # show exactly what would be sent (no creds needed)
    python publish.py --approvals a.json     # publish what that approvals file approves
    python publish.py --only w1-tue-en       # one post

Approvals come out of the Studio (studio/index.html → "Copy"), saved as JSON:
    {"w1-tue-en": "approved", "w1-wed-en": "held"}

Nothing publishes unless its status is exactly "approved". There is no flag to
override that — the approval gate is the point of the system.

Credentials are read from the environment, never stored in this repo:
    LINKEDIN_ACCESS_TOKEN   LINKEDIN_PERSON_URN     (urn:li:person:xxxx)
    IG_ACCESS_TOKEN         IG_USER_ID
See RUNBOOK.md for how to obtain each one.

Images are served from the live site, because Instagram's API fetches media by
public URL rather than accepting an upload:
    https://cabdelkhalegh.github.io/dorina/assets/social/...
So graphics must be committed and pushed BEFORE publishing. --dry-run checks this.
"""

import argparse
import io
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

# Arabic captions must survive a Windows console (cp1252 would raise on print).
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
QUEUE = os.path.join(HERE, "content", "queue.json")
SITE = "https://cabdelkhalegh.github.io/dorina"

LI_API = "https://api.linkedin.com/v2"
IG_API = "https://graph.facebook.com/v21.0"


# ----------------------------------------------------------------- helpers

def http(url, method="GET", headers=None, body=None, timeout=45):
    data = None
    headers = dict(headers or {})
    if body is not None:
        data = json.dumps(body).encode("utf-8")
        headers.setdefault("Content-Type", "application/json")
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            raw = r.read().decode("utf-8") or "{}"
            return json.loads(raw) if raw.strip().startswith(("{", "[")) else {"raw": raw}
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", "replace")[:600]
        raise RuntimeError("%s %s -> HTTP %s: %s" % (method, url, e.code, detail))


SUPA_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPA_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")


def supa(path, method="GET", body=None, extra_headers=None):
    if not SUPA_URL or not SUPA_KEY:
        raise RuntimeError("SUPABASE_URL / SUPABASE_SERVICE_KEY not set")
    h = {"apikey": SUPA_KEY, "Authorization": "Bearer " + SUPA_KEY}
    h.update(extra_headers or {})
    return http(SUPA_URL + "/rest/v1/" + path, method, h, body)


def load_approvals_supabase():
    """{post_id: status} straight from the table the Studio writes to."""
    rows = supa("dorina_post_approvals?select=post_id,status")
    return {r["post_id"]: r.get("status", "waiting") for r in rows}


def already_published(post_id, platform):
    """The unique index makes double-posting impossible, but check first so a
    re-run reports 'already published' instead of throwing a constraint error."""
    try:
        rows = supa("dorina_publish_log?select=id&status=eq.published"
                    "&post_id=eq.%s&platform=eq.%s" % (post_id, platform))
        return len(rows) > 0
    except Exception:
        return False


def log_publish(post_id, platform, status, remote_id=None, detail=None):
    if not (SUPA_URL and SUPA_KEY):
        return
    try:
        supa("dorina_publish_log", "POST", {
            "post_id": post_id, "platform": platform, "status": status,
            "remote_id": remote_id, "detail": (detail or "")[:500],
        }, {"Prefer": "return=minimal"})
    except Exception as e:
        print("warning: could not write publish_log: %s" % e, file=sys.stderr)


def compose(post, queue):
    """Caption exactly as it will appear: body, hashtags, then the standing footer."""
    parts = [post["caption"]]
    if post.get("hashtags"):
        parts.append(post["hashtags"])
    if post.get("footer"):
        parts.append(queue["footer_ar"] if post["lang"] == "ar" else queue["footer_en"])
    return "\n\n".join(parts)


def public_urls(post, fmt="ig-portrait"):
    return [SITE + "/" + p for p in post["graphics"].get(fmt, [])]


def local_paths(post, fmt="ig-portrait"):
    return [os.path.join(REPO, p.replace("/", os.sep)) for p in post["graphics"].get(fmt, [])]


# ----------------------------------------------------------------- linkedin

def publish_linkedin(post, caption, dry):
    """
    Single image post to a personal profile (w_member_social).
    Carousels on LinkedIn are document posts; that path needs a built PDF and is
    handled by --build-pdf in a later pass. Today we post the single lead card,
    which is the format the playbook recommends when the text carries the post.
    """
    token = os.environ.get("LINKEDIN_ACCESS_TOKEN")
    urn = os.environ.get("LINKEDIN_PERSON_URN")
    img = local_paths(post, "li-square")
    if not img:
        return {"skipped": "no li-square graphic"}

    if dry:
        return {
            "would_post_to": "LinkedIn personal profile",
            "author": urn or "<LINKEDIN_PERSON_URN not set>",
            "chars": len(caption),
            "image": os.path.relpath(img[0], REPO).replace("\\", "/"),
            "contains_link": ("http" in caption),
        }

    if not token or not urn:
        raise RuntimeError("LINKEDIN_ACCESS_TOKEN / LINKEDIN_PERSON_URN not set")
    H = {"Authorization": "Bearer " + token, "X-Restli-Protocol-Version": "2.0.0"}

    reg = http(LI_API + "/assets?action=registerUpload", "POST", H, {
        "registerUploadRequest": {
            "recipes": ["urn:li:digitalmediaRecipe:feedshare-image"],
            "owner": urn,
            "serviceRelationships": [{"relationshipType": "OWNER", "identifier": "urn:li:userGeneratedContent"}],
        }
    })
    upload_url = reg["value"]["uploadMechanism"][
        "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"]["uploadUrl"]
    asset = reg["value"]["asset"]

    with open(img[0], "rb") as f:
        blob = f.read()
    req = urllib.request.Request(upload_url, data=blob, method="PUT",
                                 headers={"Authorization": "Bearer " + token})
    urllib.request.urlopen(req, timeout=120).read()

    res = http(LI_API + "/ugcPosts", "POST", H, {
        "author": urn,
        "lifecycleState": "PUBLISHED",
        "specificContent": {
            "com.linkedin.ugc.ShareContent": {
                "shareCommentary": {"text": caption},
                "shareMediaCategory": "IMAGE",
                "media": [{"status": "READY", "media": asset}],
            }
        },
        "visibility": {"com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"},
    })
    return {"posted": "linkedin", "id": res.get("id")}


# ---------------------------------------------------------------- instagram

def publish_instagram(post, caption, dry):
    """Carousel publish: one container per slide, then a carousel container, then publish."""
    token = os.environ.get("IG_ACCESS_TOKEN")
    ig_id = os.environ.get("IG_USER_ID")
    urls = public_urls(post, "ig-portrait")
    if not urls:
        return {"skipped": "no ig-portrait graphics"}

    if dry:
        missing = [p for p in local_paths(post, "ig-portrait") if not os.path.exists(p)]
        return {
            "would_post_to": "Instagram",
            "ig_user": ig_id or "<IG_USER_ID not set>",
            "slides": len(urls),
            "first_url": urls[0],
            "all_graphics_exist_locally": not missing,
            "missing": [os.path.relpath(m, REPO).replace("\\", "/") for m in missing],
        }

    if not token or not ig_id:
        raise RuntimeError("IG_ACCESS_TOKEN / IG_USER_ID not set")

    children = []
    for u in urls:
        c = http("%s/%s/media?image_url=%s&is_carousel_item=true&access_token=%s"
                 % (IG_API, ig_id, urllib.parse.quote(u, safe=""), token), "POST")
        children.append(c["id"])
        time.sleep(1)

    parent = http("%s/%s/media?media_type=CAROUSEL&children=%s&caption=%s&access_token=%s"
                  % (IG_API, ig_id, ",".join(children),
                     urllib.parse.quote(caption, safe=""), token), "POST")

    time.sleep(3)
    res = http("%s/%s/media_publish?creation_id=%s&access_token=%s"
               % (IG_API, ig_id, parent["id"], token), "POST")
    return {"posted": "instagram", "id": res.get("id")}


# --------------------------------------------------------------------- main

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--approvals", help="JSON file of {post_id: status}")
    ap.add_argument("--source", choices=["file", "supabase"], default="file",
                    help="where approvals come from (supabase = what Dorina tapped)")
    ap.add_argument("--only")
    args = ap.parse_args()

    with io.open(QUEUE, encoding="utf-8") as f:
        queue = json.load(f)

    approvals = {}
    if args.source == "supabase":
        approvals = load_approvals_supabase()
        print("approvals from Supabase: %d row(s), %d approved"
              % (len(approvals), sum(1 for v in approvals.values() if v == "approved")),
              file=sys.stderr)
    elif args.approvals:
        with io.open(args.approvals, encoding="utf-8") as f:
            approvals = json.load(f)
    elif not args.dry_run:
        sys.exit("Refusing to publish without approvals (--approvals FILE or --source supabase). "
                 "Nothing goes out unapproved.")

    results = []
    for post in queue["posts"]:
        if args.only and post["id"] != args.only:
            continue
        status = approvals.get(post["id"], "waiting")
        approved = (status == "approved")

        if not approved and not args.dry_run:
            results.append({"id": post["id"], "skipped": "not approved (%s)" % status})
            continue

        caption = compose(post, queue)
        entry = {"id": post["id"], "title": post["title"], "lang": post["lang"],
                 "when": post["day"] + " " + post["time"], "approval": status}

        for platform in post["platforms"]:
            if not args.dry_run and already_published(post["id"], platform):
                entry[platform] = {"skipped": "already published"}
                continue
            try:
                if platform == "linkedin":
                    out = publish_linkedin(post, caption, args.dry_run)
                elif platform == "instagram":
                    out = publish_instagram(post, caption, args.dry_run)
                else:
                    out = {"skipped": "unknown platform"}
                entry[platform] = out
                if not args.dry_run and out.get("posted"):
                    log_publish(post["id"], platform, "published", out.get("id"))
            except Exception as e:
                entry[platform] = {"error": str(e)}
                if not args.dry_run:
                    log_publish(post["id"], platform, "failed", None, str(e))
        results.append(entry)

    print(json.dumps(results, indent=2, ensure_ascii=False))

    if args.dry_run:
        print("\nDRY RUN — nothing was sent. "
              "Graphics must be pushed live before a real run: Instagram fetches them by URL.")


if __name__ == "__main__":
    main()
