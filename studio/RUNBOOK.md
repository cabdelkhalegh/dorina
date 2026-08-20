# Studio — connection runbook

Everything in this folder runs today except the last step: actually pushing a post to a
platform. That needs accounts and access tokens, and **you have to create those yourself** —
I can't create accounts, complete OAuth, or handle credentials on your behalf.

This runbook is the exact list, in order, with what each step costs.

---

## Before anything: rotate the leaked key

`~/.openclaw/workspace/gen-x-images-mar11.js` contains a **live Google/Gemini API key in
plaintext**. Rotate it in Google AI Studio, then delete the line. Do not back up that folder
until it's gone — a backup would copy the secret somewhere new.

---

## 1 · LinkedIn — free, self-serve, ~20 minutes

Posting to Dorina's **own profile** does not need partner approval. The Marketing Developer
Platform queue only applies to company pages and posting on behalf of others.

1. Go to https://www.linkedin.com/developers/apps → **Create app**
   (an app must be attached to a LinkedIn Page — any page you control works; it is not the
   page you post to).
2. In the app's **Products** tab, add **"Share on LinkedIn"** and **"Sign In with LinkedIn
   using OpenID Connect"**. Both are self-serve — they enable immediately.
3. **Auth** tab → add a redirect URL (`http://localhost:8000/callback` is fine).
4. Run the OAuth flow **as Dorina** (she logs in, she consents) with scopes
   `openid profile w_member_social`. Keep the access token.
5. Get her person URN from `GET https://api.linkedin.com/v2/userinfo` → the `sub` field.
   The URN is `urn:li:person:<sub>`.

```bash
export LINKEDIN_ACCESS_TOKEN="..."
export LINKEDIN_PERSON_URN="urn:li:person:xxxxxxxx"
```

**Limits:** ~100 calls/day/member. **Access tokens expire in 60 days**; refresh tokens last
365 days — so this needs re-authorising roughly every two months. Put a reminder in her hub.

---

## 2 · Instagram — free, but the account must change first

**Instagram cannot be automated from a personal account.** Before any code runs:

1. Dorina's Instagram must be a **Business or Creator** account
   (Settings → Account type → Switch).
2. It must be **linked to a Facebook Page** (a page you create for the Circle is fine).

Then:

3. https://developers.facebook.com/apps → **Create app** → type **Business**.
4. Add the **Instagram Graph API** product.
5. Because you're only posting to **your own** account, you do **not** need App Review:
   keep the app in **Development mode** and add Dorina's IG account under
   **Roles → Instagram Testers** (she accepts the invite in her IG settings).
6. Generate a long-lived token with `instagram_business_content_publish`,
   `instagram_basic`, `pages_show_list`.
7. Get the IG user id: `GET /me/accounts` → page id → `GET /<page-id>?fields=instagram_business_account`.

```bash
export IG_ACCESS_TOKEN="..."
export IG_USER_ID="1784..."
```

**Limits:** 100 API-published posts per rolling 24h (a carousel counts as one).
**Important:** Instagram fetches images **by public URL** — it never receives an upload.
That's why the graphics live in the repo and get pushed to GitHub Pages before publishing.

---

## 3 · X — only if you decide to use it

Since **6 February 2026** X is pay-per-use: about **$0.015 per post**, and **$0.20 if the post
contains a URL**. There is no free write tier for new developers. At 3 posts/week that's a
few dollars a month — the reason to skip X is fit, not price (see `PLAYBOOK.md §3`).

If you want it: https://developer.x.com → app → OAuth 2.0 with `tweet.write users.read
offline.access`, add a card, then I'll wire the module.

---

## 4 · The weekly loop, once connected

```bash
# 1. write / adjust the week's content
#    studio/content/cards.json   (graphics)   +   studio/content/queue.json  (captions)

# 2. render the graphics
python studio/build_graphics.py

# 3. commit + push  — Instagram needs the images publicly reachable
git add assets/social studio && git commit -m "studio: week N graphics" && git push

# 4. Dorina reviews at  /dorina/studio/  and taps Approve / Ask for a change
#    then "Send my answers to Abdel" → you get her decisions on WhatsApp

# 5. save her approvals as JSON, then dry-run first
python studio/publish.py --approvals approvals.json --dry-run
python studio/publish.py --approvals approvals.json
```

**The gate is real:** `publish.py` refuses to run without an approvals file, and skips any
post whose status is not exactly `approved`. There is no override flag.

---

## 5 · What is still manual, and why

| Step | Why it isn't automated |
|---|---|
| Approvals reaching the publisher | The site is static (GitHub Pages) — there's no server to store her taps. Her approvals live in her browser and come to you over WhatsApp. Fixing this properly means a small backend (Supabase/Vercel), which is a decision, not an oversight — see the note below. |
| Publishing at an exact time | Nothing is scheduled yet. Either you run the command, or we add a cron/GitHub Action once tokens exist. |
| LinkedIn carousels | Posted as a single lead card today. True LinkedIn carousels are *document* posts (a PDF), which is a second build step. |
| Replying in the first hour | Deliberately human. It's the highest-leverage thing she does and it cannot be faked — see `PLAYBOOK.md §1`. |

**If you want approvals to flow automatically**, the smallest honest version is: Supabase
table + a GitHub Action on a schedule. You already have a Supabase connector. That turns
steps 4–5 into "she taps approve, it posts at 09:30". Say the word and I'll build it.
