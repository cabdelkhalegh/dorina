# Dorina — production handover

**Date:** 29 August 2026 · **Status:** live and shippable to the client today.

---

## 1 · The one link to send her

```
https://cabdelkhalegh.github.io/dorina/start/?k=1ed769ed9cd5c2374f9a32015c018152325799e2c08e6b27
```

That single link does everything: it opens her guide, and it carries her private
Studio token through, so she never has to handle a token or sign in to anything.

**Treat it like a key.** Send it directly to her, not into a group. If it ever leaks:

```sql
update public.dorina_access_tokens set revoked_at = now() where id = 1;
```

then issue a fresh one (see `studio/RUNBOOK.md §6a`).

---

## 2 · What is in production today

| Piece | URL | State |
|---|---|---|
| Website — 7 pages, EN/AR | `/dorina/` | ✅ live |
| Start here — her guide | `/dorina/start/` | ✅ live |
| Her Hub — links, goals, decisions | `/dorina/hub/` | ✅ live |
| The Studio — approve posts | `/dorina/studio/` | ✅ live, backed by Supabase |
| Brainstorm Studio | `/dorina/brainstorm/` | ✅ live |
| Workshop kit — 5 A4 PDFs, EN/AR | `/dorina/assets/materials/` | ✅ live |
| Brand kit + one-pager | `/dorina/assets/brand/` | ✅ live |
| Social graphics — 20, EN/AR | `/dorina/assets/social/` | ✅ rendered |
| Six LinkedIn posts, EN/AR | in the Studio | ✅ awaiting **her** approval |
| Internal authority platform | `/dorina/authority-system/` | ✅ live (noindex) |

**The approval loop is closed and works today**, without any further setup:
she approves in the Studio → her answers save to Supabase → she taps *Send to
Abdel* → you get the summary on WhatsApp → you publish.

---

## 3 · What is NOT in production, and why

| Not live | Reason | Who unblocks it |
|---|---|---|
| Automatic publishing to LinkedIn | Needs 3 secret values set as GitHub secrets. I am barred from handling credentials in plaintext, so this cannot be done for you. | **AK** — `studio/RUNBOOK.md §1, §6b` |
| Instagram | Her account is personal; Instagram forbids API publishing from personal accounts. | **Dorina** — `studio/INSTAGRAM_SWITCH.md` |
| Referral card in print | Numbers not phone-verified yet. A card sending a woman to a dead line is worse than no card. | **Dorina** |
| Pilot launch posts | Date, venue, price and cap not decided. | **Dorina** |
| Her portrait on the site | No photo supplied. | **Dorina** |
| LinkedIn Featured + About | Needs her login. Copy is staged and ready to paste. | **Dorina** |

Automatic publishing is an **upgrade, not a prerequisite**. Everything above ships
without it.

---

## 4 · AK's remaining steps

```bash
# 1. Prove the LinkedIn token works and get the person URN.
#    Prints neither the token nor anything secret.
gh workflow run "Verify LinkedIn connection" --repo cabdelkhalegh/dorina

# 2. Set the three secrets (each prompts — the value never enters a chat or the repo)
gh secret set LINKEDIN_ACCESS_TOKEN --repo cabdelkhalegh/dorina
gh secret set LINKEDIN_PERSON_URN   --repo cabdelkhalegh/dorina
gh secret set SUPABASE_SERVICE_KEY  --repo cabdelkhalegh/dorina
# SUPABASE_URL is already set.

# 3. Dry-run before trusting it
gh workflow run "Publish approved posts" --repo cabdelkhalegh/dorina -f dry_run=true
```

Then it runs itself: Tue/Wed/Thu 09:30 GST, publishing only what she approved.

---

## 5 · Security items outstanding

1. **One Gemini API key is hardcoded in 10 files** — 8 in `.openclaw/workspace`,
   2 in `mission-control/scripts`, including `HEARTBEAT.md`. Neither location has
   a git remote, so it has never been pushed; it is local-only. Your environment
   variable `GEMINI_API_KEY` is a **different** key, so revoking the hardcoded one
   breaks nothing that was built here.
2. **Her CV and 3 certificate scans were publicly downloadable** and have been
   unpublished (commit `95822db`). Copies preserved at
   `C:/Users/DELL/Documents/Dorina-private/credentials/`. They remain in git
   history — removing that needs a rewrite and force push on a public repo, which
   is your call.

---

## 6 · The message to send her

**English**

> Dorina — everything is ready. This one link is your starting point; it has your
> website, your private dashboard, and the six posts waiting for your approval.
> It takes about fifteen minutes and there is nothing to install.
>
> <link>
>
> Nothing gets published anywhere until you approve the exact words.

**العربية**

> دورينا — كل شيء جاهز. هذا الرابط الواحد هو نقطة البداية: يضم موقعكِ، ولوحتكِ
> الخاصة، والمنشورات الستة التي تنتظر موافقتكِ. يستغرق الأمر نحو خمس عشرة دقيقة،
> ولا شيء بحاجة إلى تثبيت.
>
> <الرابط>
>
> لا يُنشَر أي شيء في أي مكان قبل أن توافقي على الكلمات بالضبط.
