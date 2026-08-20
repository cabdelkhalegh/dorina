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

## 6 · Supabase + the scheduled job — makes it actually automatic

**Decided:** LinkedIn only for now, fully automatic. Her approval in the Studio publishes
the post at 09:30 GST without you in the loop.

### 6a. Pick a project

You have seven Supabase projects and none of them is Dorina's. Two options:

- **New project** (recommended) — clean separation, her system can't be broken by a TiKiT
  change. Check whether an eighth project adds cost on your plan first.
- **A `dorina` schema inside an existing project** — free, and the schema keeps her tables
  isolated. The risk is coupling: pausing or deleting that project silently breaks her
  publishing.

Tell me which and I'll apply the schema.

### 6b. Apply the schema

`studio/supabase/schema.sql` creates the `dorina` schema: `post_approvals`, `publish_log`,
`allowed_editors`, plus row-level security. Then:

1. **Settings → API → Exposed schemas**: add `dorina` (without this, every call 404s).
2. Add the two allow-listed emails (Dorina's and yours) to `dorina.allowed_editors`.
3. **Authentication → Providers → Email**: enable magic links, and turn **off**
   "Allow new users to sign up" — only the two allow-listed people should ever get in.
4. **Authentication → URL Configuration**: add
   `https://cabdelkhalegh.github.io/dorina/studio/` as a redirect URL.

### 6c. Point the Studio at it

Fill in `studio/supabase/config.js` with the project URL and the **publishable/anon** key.
Both are safe to commit — RLS is what protects the data, and the anon key grants nothing
without a signed-in allow-listed email. Commit and push.

Dorina then opens the Studio once, enters her email, clicks the link she receives, and stays
signed in on that device. The strip at the top of the page turns gold and says her approvals
now publish automatically.

### 6d. Add the GitHub secrets

**Settings → Secrets and variables → Actions** on `cabdelkhalegh/dorina`:

| Secret | Where it comes from |
|---|---|
| `SUPABASE_URL` | Project settings → API |
| `SUPABASE_SERVICE_KEY` | Project settings → API → **service_role** (never commit this) |
| `LINKEDIN_ACCESS_TOKEN` | §1 above |
| `LINKEDIN_PERSON_URN` | §1 above |

`.github/workflows/publish.yml` then runs **Tue/Wed/Thu at 05:30 UTC (09:30 GST)**. It
checks the four secrets exist, warns if the LinkedIn token is near its 60-day expiry, and
publishes only what Dorina marked `approved`. A unique index makes double-posting the same
post impossible.

**Test it before trusting it:** Actions → *Publish approved posts* → **Run workflow** with
`dry_run: true`. It will print exactly what it would send.

---

## 5 · What is still manual, and why

| Step | Status |
|---|---|
| Approvals reaching the publisher | **Automated** once §6 is configured. Until then the Studio runs in local mode and her answers reach you on WhatsApp — nothing breaks, it just isn't automatic. |
| Publishing at an exact time | **Automated** — `.github/workflows/publish.yml`, Tue/Wed/Thu 09:30 GST. |
| Instagram | **Blocked on the account.** Hers is personal, and Instagram forbids publishing from personal accounts. Send her `studio/INSTAGRAM_SWITCH.md` — bilingual, 10 minutes. Once she has switched and linked a Page, §2 applies and I turn the module on. |
| LinkedIn carousels | Posted as a single lead card today. True LinkedIn carousels are *document* posts (a PDF), which is a second build step. |
| Writing next week's posts | Still authored deliberately, not generated on a timer. The old OpenClaw nightly cron drafted unattended and left ~1,115 unreviewed drafts behind; for a client with compliance limits that pattern is a liability, not a feature. |
| Replying in the first hour | **Deliberately human.** It's the highest-leverage thing she does and it cannot be faked — see `PLAYBOOK.md §1`. |
