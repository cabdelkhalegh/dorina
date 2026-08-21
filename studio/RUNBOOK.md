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

## 6 · Supabase — ✅ DONE, backend is live

**Decided:** LinkedIn only for now, fully automatic.

Applied to the existing shared project `trxifnxyrncsoxgklwcq` (migration
`dorina_studio_init`) rather than creating an eighth project — that costs nothing and the
`dorina_` prefix keeps her tables isolated. To move it to a dedicated project later: run
`studio/supabase/schema.sql` there, then change `config.js` and the two `SUPABASE_*` secrets.
Nothing else changes.

`studio/supabase/config.js` is already filled in and pushed, so the Studio is talking to it.

**Verified live:**

| Check | Result |
|---|---|
| Anonymous INSERT with the public key | ❌ rejected (RLS `42501`) — a stranger cannot approve a post |
| Anonymous SELECT | returns `[]` — nothing leaks |
| Magic link for a non-allow-listed email | `422` — no account is created |
| Studio account strip | shows sign-in, no longer local mode |

### 6a. How Dorina gets in — ✅ no dashboard step, no sign-in

Magic-link sign-in needs a redirect URL allow-listed in the Supabase dashboard, which
cannot be set from code — and it is friction for a non-technical user on a phone. So the
Studio is reached by a **private link** instead:

```
https://cabdelkhalegh.github.io/dorina/studio/?k=<token>
```

Send her that link once. She opens it, and from then on it just works — no email, no code,
no password. How it is kept safe:

- the token is 192 bits of randomness, and only its **SHA-256 hash** is stored, so a
  database dump does not grant access
- it is **stripped from the URL** on first load and kept in local storage, so it does not
  linger in history, referrers or screenshots
- the public key alone grants nothing: RLS blocks direct table access, and every RPC
  refuses a call without a valid token
- **status values are validated server-side**, so a crafted call cannot write an arbitrary
  state
- links are revocable one at a time:
  ```sql
  update public.dorina_access_tokens set revoked_at = now() where id = 1;
  ```

Verified live: valid token writes and reads; a wrong token returns 401; an invalid status
returns 400; direct table writes still return 401.

Her email `ds848969@icloud.com` is already on the allow-list for the email path too —
though the vault records that address as **unconfirmed**, so verify it with her before
relying on it for anything that matters.

### 6b. Add the GitHub secrets

**Settings → Secrets and variables → Actions** on `cabdelkhalegh/dorina`:

| Secret | Value / where it comes from |
|---|---|
| `SUPABASE_URL` | `https://trxifnxyrncsoxgklwcq.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Project settings → API → **service_role** (never commit this) |
| `LINKEDIN_ACCESS_TOKEN` | §1 above — paste it, never type it into chat |
| `LINKEDIN_PERSON_URN` | printed by the **Verify LinkedIn connection** workflow |

```bash
gh secret set SUPABASE_URL --repo cabdelkhalegh/dorina --body "https://trxifnxyrncsoxgklwcq.supabase.co"
gh secret set SUPABASE_SERVICE_KEY --repo cabdelkhalegh/dorina
gh secret set LINKEDIN_ACCESS_TOKEN --repo cabdelkhalegh/dorina
gh secret set LINKEDIN_PERSON_URN --repo cabdelkhalegh/dorina
```

Run **Verify LinkedIn connection** first — it proves the token works, confirms
`w_member_social` was actually granted (the scope people most often miss), and prints the
person URN. It never prints the token and never publishes anything.

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
