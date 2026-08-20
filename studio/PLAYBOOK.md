# Dorina — Platform Playbook

**Written:** 20 August 2026 · **Supersedes:** the Feb-2026 OpenClaw strategy docs (written for AK's personal brand, and now out of date on every platform).

This is the "how each platform actually works" half of the studio. The other half is
`content/cards.json` (what we say) and `build_graphics.py` (how it looks).

Every rule below is written for **one specific person**: a Lebanese wellbeing facilitator
based in Dubai, launching a Lebanon-first women's circle, with a corporate lane in the Gulf.
Not a generic creator.

---

## 0 · The rules that outrank every algorithm

These are compliance limits, not preferences. A post that breaks one of these does not go
out no matter how well it would perform.

| Never | Instead |
|---|---|
| therapist · psychologist · counsellor · clinician · "treatment" · "patient" | facilitator · practitioner · educator · "participant" |
| advertising hypnotherapy (illegal to imply licensure in the UAE) | say nothing about it publicly at all |
| "CBT Specialist" | not publishable in any form |
| diagnosing, promising outcomes, "cure", "fix your anxiety" | describe the practice, not a result |
| implying current certification for lapsed credentials | "training completed December 2024" |

**Standing footer** on any post touching stress, emotion, or the body:

> Educational content only — not therapy, diagnosis, or medical advice. In crisis, contact emergency services or a qualified professional.
> محتوى تثقيفي فقط — ليس علاجاً أو تشخيصاً أو نصيحة طبية. في الحالات الطارئة تواصلي مع خدمات الطوارئ أو مختصّ مؤهّل.

It is baked into the graphics templates (`disclaimer: true`) so it cannot be forgotten.

---

## 1 · LinkedIn — the corporate lane

**What the algorithm rewards now (2026):**

- **Dwell time is the primary signal.** Posts holding attention 61+ seconds see roughly
  13× the engagement rate of posts skimmed in 0–3 seconds. Long, well-broken text and
  document carousels both buy dwell time; a link-out destroys it.
- **Comments ≈ 15× the weight of a like.** Replies extend the window further.
- **The first 60–90 minutes decide ~70% of total reach.** Comments landing in the first
  hour carry 4–10× the weight of later ones.
- **External links cost ~60% of reach** — and since early 2026 the old "link in the first
  comment" workaround is penalised too.
- **The March 2026 Authenticity Update** actively demotes engagement bait ("Agree? Comment 👇"),
  engagement pods, polls, and third-party automation tools.

**Therefore, for Dorina:**

1. **No link in the post body.** The CTA is "tell me where pressure visits you first" —
   the Circle link goes in her **Featured section and profile**, which is exactly why
   "Add the Circle link + paragraph to LinkedIn" is goal #1 in her hub.
2. **Native text + document carousel.** Use the `ig-portrait` (1080×1350) cards uploaded as
   a multi-page PDF document post — it reads as a carousel and holds people on the post.
3. **Write for a full read.** Open with the recognisable moment, one idea per line, white
   space between. Her six posts already do this.
4. **Ask a real question, never bait.** "Where does pressure visit you first?" is a question
   only she can't answer for you. That is the kind of comment the update rewards.
5. **She must be present for the first hour.** Publishing when she cannot reply for 3 hours
   wastes the post. This is the single biggest lever and it is human, not technical.
6. **Cadence:** 3 posts/week (Tue/Wed/Thu). More than one/day suppresses both.

**Best windows (Gulf audience):** Tue–Thu, 09:30–10:30 GST. For a Lebanon-weighted audience
add a second consideration: 09:30 GST = 08:30 Beirut, which still lands in the morning there.

---

## 2 · Instagram — the Lebanon lane

**What the algorithm rewards now (2026):**

- The three signals that dominate every surface: **watch time**, **sends per reach**
  (DM shares), and likes per reach — with **likes now the weakest** of the group.
- **Sends/DM shares are the strongest single lever for Reels reach.** Content that one
  woman forwards to another privately is what travels. This is precisely the shape of
  Dorina's material.
- **Carousels still lead engagement** (~0.52% ER, highest of any format) and pull **2–3×
  the reach of a single image**, because the swipe itself is the signal. Slide-1
  cliffhangers drive swipe-through, which acts as carousel "watch time".
- **Reels carry ~4× the reach of a single image**; 30–90s performs best for substance,
  7–15s for trend-led. Hook must land in the first 3 seconds.
- **The two-way conversation signal (March 2026):** replying to comments and DMs makes her
  *next* post rank higher for those people. Engagement compounds.

**Therefore, for Dorina:**

1. **Carousel is the default format**, not the single image. Every deck in
   `content/cards.json` is built cover → body → ladder → practice/CTA for exactly this.
2. **Design slide 1 to be forwarded, not admired.** The cover carries the recognisable
   moment ("The first sign of pressure is rarely a thought") — that is a *send*, not a like.
3. **Explicit save/send prompts** ("Save this for the day you need it", "Send this to the
   woman who says yes too fast") — these are not bait; they name the actual use.
4. **Arabic and English as separate posts**, not one bilingual caption. The AR deck is
   rendered as its own carousel — mixed-script captions read as noise and halve dwell.
5. **Reels later, not now.** Reels are the reach engine, but they need her on camera and
   that is a bigger ask than her current gates. Carousels first; the Reel-cover format
   (`story`, 1080×1920) is already in the builder for when she is ready.
6. **Cadence:** 3–4 posts/week + Stories on posting days. Stories hold the warm list;
   the feed post recruits.

**Requirement:** Instagram must be a **Business or Creator** account linked to a Facebook
Page before anything can be published through the API. A personal account cannot be
automated at all.

---

## 3 · X — recommended: skip, for now

X is the weakest fit of the three for this audience: her people are on Instagram and
LinkedIn, in Arabic and English, in Beirut and the Gulf. X's Arabic wellbeing conversation
is thin and adversarial, and the format rewards opinion-taking, which is the opposite of
her voice.

It is also now the only one of the three that **costs money per post**: since 6 February 2026
X is pay-per-use — about **$0.015 per post, and $0.20 if the post contains a URL**. At her
volume that is trivial in absolute terms (a few dollars a month), so the argument against
X is strategic, not financial.

**Recommendation:** launch on LinkedIn + Instagram. Revisit X only if the corporate lane
pulls a Gulf B2B audience that lives there. The publisher is built with an X module anyway,
so turning it on later is a config change, not a rebuild.

---

## 4 · What gets posted where

| Asset | Format | LinkedIn | Instagram |
|---|---|---|---|
| Carousel deck (4 cards) | `ig-portrait` 1080×1350 | ✅ as PDF document post | ✅ as carousel |
| Single quote card | `li-square` 1200×1200 | ✅ when text carries it | — |
| Story / Reel cover | `story` 1080×1920 | — | ✅ Stories |
| Grid-consistency single | `ig-square` 1080×1080 | — | ✅ fallback |

Arabic and English are always **separate posts** with separate decks.

---

## 5 · The weekly rhythm

| Day | Action | Who |
|---|---|---|
| Sun | Studio generates next week's decks + graphics | system |
| Mon | Dorina reviews in the Studio → Approve / Edit / Hold | **Dorina** |
| Tue · Wed · Thu | Approved posts publish at 09:30 GST | system |
| Tue · Wed · Thu | **First 60 minutes: she replies to every comment** | **Dorina** |
| Fri | Numbers land in the hub — what got saved, sent, commented | system |

Nothing publishes that she has not approved. That is a hard gate in the pipeline, not a
courtesy — see `studio/index.html`.

---

## 6 · What we deliberately do not do

- **No engagement pods, no comment rings, no follow/unfollow.** LinkedIn's March 2026 update
  demotes them and Instagram's spam classifiers catch them. They also do not fit her.
- **No AI-generated stock imagery.** The old OpenClaw system generated Imagen photos per post;
  for a typographic identity like hers that reads as generic and off-brand. Her graphics are
  rendered from her own type, colour and mark — deterministic, free, and unmistakably hers.
- **No posting into a window she cannot attend.** A post she cannot reply to for three hours
  is worth a fraction of the same post published when she is free.
- **No claim we cannot evidence.** Every framework name, statistic, and credential in her
  content traces to `women-circle/SOURCE_BRIEF.md`.

---

**Sources for the 2026 algorithm behaviour above:**
[LinkedIn algorithm 2026 — dataslayer](https://www.dataslayer.ai/blog/linkedin-algorithm-february-2026-whats-working-now) ·
[LinkedIn first-60-minutes](https://growleads.io/blog/linkedin-algorithm-2026-text-vs-video-reach/) ·
[LinkedIn dwell time & comment weight](https://meet-lea.com/en/blog/linkedin-algorithm-explained) ·
[Instagram ranking signals 2026](https://www.dataslayer.ai/blog/instagram-algorithm-2025-complete-guide-for-marketers) ·
[Instagram reach: reels, carousels, caption SEO](https://www.truefuturemedia.com/articles/instagram-reach-2026-algorithm-reels-carousels-caption-seo) ·
[Instagram algorithm — Buffer](https://buffer.com/resources/instagram-algorithms/) ·
[X API pricing 2026](https://postproxy.dev/blog/x-api-pricing-2026/) ·
[LinkedIn posting API requirements](https://www.blotato.com/blog/linkedin-posting-api) ·
[Instagram publishing API requirements](https://www.blotato.com/blog/instagram-posting-api)
