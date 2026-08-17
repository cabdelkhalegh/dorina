# Content Approval & Automation Workflow — Dorina Salman

**Purpose:** This document is the operating system for Dorina's content engine: a pipeline that lets drafting, design, and scheduling scale — with human help or AI assistance — while Dorina retains 100% control over everything that reaches the public. It defines the statuses, gates, checklists, rhythms, tools, logs, and emergency procedures that make three LinkedIn posts a week sustainable for a busy professional without ever compromising the non-clinical boundary or her voice. The absolute law of this workflow: **nothing is published, scheduled-to-publish, or sent externally without Dorina's explicit approval of BOTH the final text AND the final graphic.**

---

## 1. Operating Principles

Five principles govern every decision in this workflow. When in doubt, resolve any conflict in the order listed — safety and approval always beat speed.

1. **Approval-first, always.** Automation and assistants accelerate *drafting, formatting, and scheduling of approved items only*. No tool, assistant, or "time-saving shortcut" ever publishes, schedules-to-publish, or sends anything externally that Dorina has not explicitly approved in both its final text and its final graphic. There is no exception for "small edits", "urgent posts", or "it's basically the same as last week's".
2. **Draft fast, approve deliberately.** Speed lives upstream. Ideas can be generated in bulk, drafts can be produced in minutes with AI assistance (see `PREMIUM_PROMPT_LIBRARY.md`), and visuals can be templated. The two approval gates are the only deliberately slow points in the pipeline — and that is by design. A post that misses its slot is a minor inconvenience; a post that misrepresents Dorina's non-clinical positioning is a reputational and ethical problem.
3. **One calendar is the single source of truth.** `12_MONTH_LINKEDIN_CONTENT_CALENDAR.md` (and its live working copy in the shared spreadsheet or board) is the only authoritative record of what is planned, for when, and in what status. If a post is not on the calendar, it does not exist. If two records disagree, the calendar wins and the discrepancy is fixed the same day.
4. **Everything is auditable.** Every item carries an ID from idea to archive. Every approval is dated and attributable. Every published post can be traced back to who drafted it, when the safety check ran, when Dorina approved text and visual, and when it went live. The approval log (Section 7) is not bureaucracy — it is Dorina's protection and her learning record.
5. **Safety gates are non-negotiable and cannot be skipped — even when late.** The automated boundary/fact check (P26 in `PREMIUM_PROMPT_LIBRARY.md`) plus a human read happen on every item, every time. If the pipeline is running behind, the correct response is to publish later or skip a slot — never to bypass a gate. A missed Tuesday post has zero long-term cost. A boundary breach can undo months of authority-building.

**How to use this document:**

- Read Sections 1–4 in full before the first post moves through the pipeline; they are the constitution.
- Sections 5–7 are the day-to-day manual — print or pin the weekly rhythm table and the two gate checklists.
- Sections 8–9 are the "break glass" pages: skim them now, know where they are, and rehearse the STOP protocol once (Section 9.1) before any scheduling tool is adopted.
- Section 10 is for the monthly and quarterly sessions only.
- Wherever this document and a sibling document overlap, the more restrictive rule wins; where safety is concerned, `RISK_ETHICS_AND_REFERRAL_PROTOCOL.md` always wins.

---

## 2. Roles & Permissions

The workflow defines four roles. At launch, Dorina plus one assistant (human, or Dorina working with her AI assistant) can hold all of them; the roles still matter because they define *which hat is being worn* at each step, and which combinations are never acceptable.

| Role | Held by | May do | May NEVER do |
|---|---|---|---|
| **Approver & Voice Owner** | Dorina, and only Dorina | Approve/reject text (Gate 1); approve/reject visuals (Gate 2); own the publish/schedule decision; edit anything at any stage; veto anything at any stage | Delegate approval; pre-approve unseen future content ("approve the whole month sight unseen" is not approval) |
| **Content Assistant** | A human assistant, or Dorina/assistant working with an AI assistant | Capture ideas; write briefs; draft posts using `PREMIUM_PROMPT_LIBRARY.md`; run the automated safety check; format approved text; load approved items into the scheduling tool; maintain the calendar and approval log | Approve anything; edit text *after* Gate 1 approval without sending it back through Gate 1; touch the publish button on unapproved content; reply to sensitive/urgent inbound messages (Section 8) |
| **Designer** | A human designer, or an AI-assisted design step operated by the Content Assistant | Produce visuals from approved text only; apply the brand look; write alt-text drafts | Start design before Gate 1 text approval (wasted work and version-drift risk); alter approved wording to "fit the layout" without triggering a Gate 1 re-check |
| **Safety Gate** | Automated check (P26 boundary/fact compliance checker in `PREMIUM_PROMPT_LIBRARY.md`) **plus** one human eye | Flag boundary violations, clinical drift, unsourced statistics, missing disclaimers; block progression to Gate 1 until issues are resolved | Approve. A pass from the safety gate is a *precondition* for Dorina's review, never a substitute for it |

**Acceptable role combinations:**

- Dorina may draft AND approve her own content. Approving her own words is the normal case, not a conflict — the safety gate still runs on everything, including Dorina's own drafts, because everyone (including the expert) occasionally drifts.
- One assistant may hold Content Assistant + Designer + safety-gate *operator* (running P26 and doing the human read) simultaneously.
- **An assistant may never approve.** Not "approve small ones", not "approve reposts", not "approve while Dorina is travelling". If Dorina is unavailable, content waits. The calendar is built with enough lead time (Section 5) that a week of unavailability never creates pressure to break this rule.
- An AI assistant may hold no role beyond producing drafts, formats, checks, and summaries *for a human to act on*. AI output is always input to a human step, never a step of its own.

---

## 3. The Pipeline

Every content item moves through eleven statuses. The two bold statuses are **Dorina's gates** — the only two points where an item acquires the right to move toward the public.

**Happy path:** IDEA → BRIEFED → DRAFTED → SAFETY-CHECKED → **TEXT-APPROVED (Gate 1)** → DESIGNED → **VISUAL-APPROVED (Gate 2)** → SCHEDULED → PUBLISHED → MEASURED → ARCHIVED

**Rework loops:** From Gate 1 or Gate 2, Dorina may return an item to **REVISION-REQUESTED**, with a note saying what to fix and which status it returns to.

| # | Status | Who acts | "Done" means | Max dwell time |
|---|---|---|---|---|
| 1 | **IDEA** | Anyone (Dorina, assistant, AI-suggested from the calendar's monthly themes) | Idea captured in the calendar/board with one line, a pillar tag (stress & burnout literacy / systems & boundaries / story & advocacy / workplace culture & managers), and a DESK Method (proposed) stage if relevant | Open-ended; ideas can sit in the backlog indefinitely, but the backlog is pruned monthly |
| 2 | **BRIEFED** | Content Assistant | Brief written: target post date, pillar, format (per `LINKEDIN_AUTHORITY_ENGINE.md`), key message, CTA rung, language(s) (EN / AR / bilingual), which prompt from `PREMIUM_PROMPT_LIBRARY.md` will be used | 2 weeks before target post date |
| 3 | **DRAFTED** | Content Assistant (AI-assisted drafting allowed and encouraged) | Full text drafted in final language(s), disclaimer included where the brief requires it, hashtags and CTA written | 10 days before target post date |
| 4 | **SAFETY-CHECKED** | Safety Gate: P26 automated check + human read by the Content Assistant | P26 run and result logged (pass, or issues fixed and re-run to pass); human eye confirms no clinical language, no statistics outside the four approved sources, no forbidden claims | Within 24 hours of DRAFTED |
| 5 | **TEXT-APPROVED (Gate 1)** | **Dorina** | Dorina has read the full final text (including Arabic text, hashtags, CTA, and disclaimer) against the Gate 1 checklist (Section 4) and explicitly approved it in writing (a dated "Approved" in the calendar/log). Or: REVISION-REQUESTED with a note → back to DRAFTED | Dorina reviews within her Sunday batch (Section 5); items should reach this gate ≥7 days before target date |
| 6 | **DESIGNED** | Designer (human or AI-assisted step) | Visual produced from the *approved* text, in the brand look, correct dimensions for LinkedIn, alt-text drafted | 5 days before target post date |
| 7 | **VISUAL-APPROVED (Gate 2)** | **Dorina** | Dorina has seen the final graphic at actual size (including a phone-screen check) against the Gate 2 checklist (Section 4) and explicitly approved it in writing. Or: REVISION-REQUESTED with a note → back to DESIGNED (or to DRAFTED if the text itself needs changing — which then re-triggers Gate 1) | Same Sunday batch; ≥3 days before target date |
| 8 | **SCHEDULED** | Content Assistant | The doubly-approved item (text + visual, exactly as approved, byte-for-byte) is loaded into the scheduling tool or the manual-posting checklist, with date/time per `LINKEDIN_AUTHORITY_ENGINE.md` posting windows | Loaded within 48 hours of Gate 2 approval |
| 9 | **PUBLISHED** | Scheduling tool fires, or assistant posts manually; assistant verifies the post is live and correct within 2 hours of the slot | Live post matches the approved version exactly; URL captured in the log | — |
| 10 | **MEASURED** | Content Assistant | KPIs per `LINKEDIN_AUTHORITY_ENGINE.md` recorded at day 7 (impressions, engagements, comments, profile actions as available) | Day 7 after publishing |
| 11 | **ARCHIVED** | Content Assistant | Final text, final visual, metrics, and log entry stored in the shared folder archive; strong performers tagged for the reuse/repurposing pool | End of the month |
| — | **REVISION-REQUESTED** | Content Assistant / Designer act on Dorina's note | The specific issues Dorina flagged are fixed; the item re-enters at the status Dorina specified (DRAFTED items re-run the safety check before returning to Gate 1) | 72 hours per rework loop |

**Three rules that keep the pipeline honest:**

1. **No skipping.** An item may never jump a status. In particular: nothing enters DESIGNED without a dated Gate 1 approval, and nothing enters SCHEDULED without a dated Gate 2 approval.
2. **Any change resets the gate.** If text changes after Gate 1 — even one word, even "just the hashtag" — the item goes back through SAFETY-CHECKED and Gate 1. If a visual changes after Gate 2, it goes back through Gate 2. Approval attaches to an exact version, not to an item in general.
3. **Dwell-time breaches degrade gracefully.** If an item misses a dwell target, the fallback is: move it to a later slot, or promote a ready evergreen item from the approved reserve (Section 5). The fallback is never "compress the gates".

### A worked example — one post, end to end

To make the pipeline concrete, here is a typical item's journey (dates illustrative):

1. **IDEA (Sept 1).** The calendar's September theme includes a systems & boundaries post. The assistant logs `DS-2026-09-004`: "The meeting-free hour — one small boundary that survives a busy week", pillar: systems & boundaries, DESK stage: Establish.
2. **BRIEFED (Sept 3).** Brief written: target date Tuesday Sept 15, bilingual (EN body, AR pull-quote on the visual), text-plus-graphic format, CTA rung: soft ("What's the smallest boundary that has actually held for you?"), drafting prompt selected from `PREMIUM_PROMPT_LIBRARY.md`.
3. **DRAFTED (Sept 5).** The assistant produces the draft with AI assistance, including hashtags and the Arabic pull-quote. No statistics are needed for this post, so no source citations arise; the disclaimer is not required per the brief (a pure how-to post, no distress content).
4. **SAFETY-CHECKED (Sept 6).** P26 is run: PASS. The assistant's human read confirms no clinical drift; result and date logged.
5. **TEXT-APPROVED — Gate 1 (Sunday Sept 6).** In the batch session, Dorina reads the full text against the Gate 1 checklist. She tightens one sentence herself (owner-edits at the gate are fine — the approved version is what she signs off). "TEXT-APPROVED — 06 Sep — DS" goes into the log.
6. **DESIGNED (Sept 8).** The designer builds the graphic from the approved text: the Arabic pull-quote, brand colors, alt-text drafted. File saved as `DS-2026-09-004_APPROVED-pending-visual`.
7. **VISUAL-APPROVED — Gate 2 (Sunday Sept 13).** Dorina checks the graphic at phone size, verifies her name in both scripts and the exact match of the pull-quote to the approved text. "VISUAL-APPROVED — 13 Sep — DS" logged.
8. **SCHEDULED (Sept 13).** The assistant loads the doubly-approved item for Tuesday Sept 15, 8:30 a.m. per the posting windows in `LINKEDIN_AUTHORITY_ENGINE.md`.
9. **PUBLISHED (Sept 15).** The post goes live; the assistant verifies it within two hours and pastes the URL into the log.
10. **MEASURED (Sept 22).** Day-7 KPIs recorded. The post over-performs on comments; the assistant tags it "strong — boundary micro-habit angle" for the retro.
11. **ARCHIVED (end of Sept).** Final text, final visual, metrics, and notes stored under the item ID; the angle is flagged for the repurposing pool.

Total Dorina time on this item: roughly ten minutes across two Sunday sessions. That is the whole point of the pipeline — her attention is spent only at the two moments where it is irreplaceable.

---

## 4. Approval Checklists (Use Verbatim at Each Gate)

These are Dorina's working checklists. They should be pasted into the calendar/board as checklist fields so each approval is a matter of ticking through, not remembering.

### 4.1 Gate 1 — Text Approval Checklist (Dorina, before any design work starts)

Approve only when every line is a yes:

- [ ] **Voice match.** This sounds like me — warm, direct, practical, educator-not-lecturer. I would say this sentence out loud to a room of Lebanese professionals.
- [ ] **Pillar fit.** The post clearly belongs to one of my four pillars (stress & burnout literacy, systems & boundaries, story & advocacy, workplace culture & managers) and, where relevant, maps cleanly to a DESK Method (proposed) stage (Detect, Establish, Support, Keep) without forcing it.
- [ ] **Boundary compliance.** Zero clinical positioning. No language from the prohibited list in `RISK_ETHICS_AND_REFERRAL_PROTOCOL.md`: nothing that diagnoses, treats, promises therapeutic outcomes, or frames me as a therapist/psychologist/counselor/clinician. Educator and advocate only.
- [ ] **Facts from the four sources only.** Every statistic and factual claim traces to the WHO mental health at work fact sheet, the WHO "strengthening our response" fact sheet, the Lebanon MoPH National Mental Health Programme page, or the WHO World Mental Health Day page — and is stated accurately. If a number appears and I cannot name its source from those four, the post fails.
- [ ] **P26 safety check logged as PASS**, dated, before this text reached me. (If there is no logged pass, I stop here and send it back — not because the text is necessarily wrong, but because the gate order is the system.)
- [ ] **Arabic accuracy and register** (for Arabic or bilingual posts). The Arabic is correct, natural, and in the right register for Lebanese professional readers — not a stiff literal translation of the English. Names, terms, and the DESK Method (proposed) rendering are consistent with previous approved posts.
- [ ] **Disclaimer present where needed.** Any post touching personal struggle, symptoms, or distress carries the standing short-form disclaimer: *"Educational content on workplace wellbeing — not therapy, diagnosis, or crisis support. If you're struggling, please reach a qualified professional; in an emergency, contact local emergency services."* Pure how-to/culture posts may omit it per the rules in `RISK_ETHICS_AND_REFERRAL_PROTOCOL.md`.
- [ ] **CTA matches the authority-ladder rung.** The ask is appropriate to where my audience currently is on the ladder in `LINKEDIN_AUTHORITY_ENGINE.md` — no premature selling, no mismatch between a soft educational post and a hard commercial ask.
- [ ] **No forbidden claims.** No outcome guarantees ("this will eliminate your burnout"), no cure/fix framing, no implied clinical results, no exaggeration of my credentials, and no unnamed-but-identifiable stories about real workplaces or people without consent.
- [ ] **Practical read-through.** Hook works in the first two lines; length and formatting suit LinkedIn; hashtags are the approved set; the target date and time still make sense.

**Decision:** write "TEXT-APPROVED — [date] — [initials]" in the log, or "REVISION-REQUESTED — [date] — [what to fix]".

### 4.2 Gate 2 — Visual Approval Checklist (Dorina, before anything is scheduled)

Approve only when every line is a yes:

- [ ] **My name is spelled correctly** in English (Dorina Salman) and, where it appears, in Arabic — checked character by character, in every place it appears on the graphic.
- [ ] **Text-on-image matches the approved text exactly.** Any quote, statistic, headline, or phrase on the graphic is identical to the Gate 1–approved wording. No paraphrasing by the design step. (If the designer needed to shorten a line, the shortened line came back through me.)
- [ ] **Readable on mobile.** I have viewed the graphic at phone size. Every word is legible without zooming; Arabic text renders correctly (right-to-left, correct letter joining, no broken glyphs).
- [ ] **Brand look.** Colors, fonts, and layout match my brand kit; the visual would sit comfortably next to my last ten posts in the profile grid.
- [ ] **Alt-text written** and accurate — it describes the image and includes any text shown on it, in the post's language(s).
- [ ] **Dignified imagery — no stocky clichés.** No head-clutching, no dark-storm-cloud-over-silhouette, no dramatic despair imagery. My visual language is calm, respectful, and hopeful: real workplaces, clean typography, light, steady colors. People experiencing stress are portrayed (if at all) with dignity, never as broken.
- [ ] **Disclaimer/attribution placement** (where the format requires it) is present and legible but not dominating.
- [ ] **Technical check.** Correct dimensions for the LinkedIn format, no compression artifacts, file named with the item ID.

**Decision:** write "VISUAL-APPROVED — [date] — [initials]" in the log, or "REVISION-REQUESTED — [date] — [what to fix] — [returns to DESIGNED or DRAFTED]".

### 4.3 Quick reference — the most common rejection reasons (train the upstream steps on these)

These lists exist so the assistant and designer can self-check before an item ever reaches Dorina, keeping her gate time short.

**Most common Gate 1 rejections to pre-empt:**

- Sounds like generic wellbeing content — could have been written by anyone; missing Dorina's specificity, Lebanese workplace context, or DESK Method (proposed) anchoring.
- A statistic slipped in from outside the four approved sources (often via AI drafting — this is exactly what P26 exists to catch, and why the human read backs it up).
- Clinical drift in single words: "symptoms", "treat", "heal", "diagnose", "therapy-adjacent" phrasing used loosely. See the prohibited list in `RISK_ETHICS_AND_REFERRAL_PROTOCOL.md`.
- CTA too heavy for the post's rung — an educational post ending in a hard commercial ask.
- Arabic register off — technically correct but stiff, or a term rendered inconsistently with earlier posts.
- Missing disclaimer on a post that brushes personal struggle.

**Most common Gate 2 rejections to pre-empt:**

- Text on the graphic paraphrases (rather than reproduces) the approved wording.
- Arabic rendering broken by the design tool: disconnected letters, wrong direction, flipped punctuation.
- Type too small for a phone screen, or low contrast against the background.
- A stock image that dramatizes distress — the head-in-hands cliché in any variation.
- Alt-text missing, or written for the wrong language version.

---

## 5. Weekly Operating Rhythm

This rhythm assumes a busy professional with roughly 2.5–3 focused hours per week for content operations. The pipeline's lead times (Section 3) exist precisely so this rhythm never becomes frantic.

| When | Duration | What happens |
|---|---|---|
| **Sunday** | 60–90 min | **Batch approval session.** Dorina reviews next week's three posts: runs Gate 1 on any texts waiting, runs Gate 2 on any visuals waiting, writes revision notes for anything not approved. Target output: all three of next week's posts doubly approved and handed to SCHEDULED. Then a 10-minute look one week further ahead to unblock briefs and drafts early. |
| **Mon–Fri (daily)** | 15 min | **Engagement window** per `LINKEDIN_AUTHORITY_ENGINE.md`: reply to routine comments on recent posts, engage with target-audience content, note any inbound message that needs triage (Section 8). This is the one daily touch; everything else is batched. |
| **Friday** | 15 min | **Metrics glance.** Content Assistant (or Dorina) records day-7 KPIs for posts due for measurement, flags anything unusual (a breakout post, an underperformer, a comment thread that needs Dorina personally). No deep analysis — that is monthly. |
| **Monthly** (first Sunday, extending the batch session) | 90 min | **Calendar planning session** using `12_MONTH_LINKEDIN_CONTENT_CALENDAR.md`: confirm next month's themes and post briefs, prune the idea backlog, review the monthly retro (Section 10), adjust briefs based on what the metrics said. |
| **Quarterly** | Half a day | **Strategy review**: pillars balance vs the 30/30/25/15 target, authority-ladder progress, KPI trends vs `LINKEDIN_AUTHORITY_ENGINE.md` targets, whether to change tooling level (Section 6), and a read-through of this workflow document for updates (Section 10). |

**The evergreen reserve.** The Content Assistant maintains 3–5 fully doubly-approved, non-time-sensitive posts as a reserve. When travel, illness, or a heavy work week breaks the rhythm, the reserve fills slots without any pressure to rush a gate. The reserve is replenished during normal Sunday sessions, never as an emergency scramble. Reserve items are re-glanced by Dorina before use if they are more than a quarter old (context can shift).

**If Dorina cannot do the Sunday session:** the week's unapproved items simply do not publish. Reserve items (already approved) may run instead, or slots go quiet. An empty slot is always acceptable; a bypassed gate never is.

### Suggested Sunday session agenda (75 minutes)

| Minutes | Activity |
|---|---|
| 0–5 | Open the calendar/board; confirm which items are waiting at each gate; scheduling-tool reconciliation check if at Level 3 (queue vs approval log, line by line) |
| 5–35 | **Gate 1 pass:** read each waiting text in full against the checklist; approve, owner-edit-and-approve, or write a revision note. Three posts typically take 8–10 minutes each |
| 35–55 | **Gate 2 pass:** review each waiting visual at desktop and phone size against the checklist; approve or write a revision note |
| 55–65 | Confirm next week's slots are fully covered (doubly-approved or reserve-backed); flag any gaps to the assistant |
| 65–75 | Look one week further ahead: unblock briefs, answer the assistant's open questions, top up the evergreen reserve if a slot in the session remains |

The session works best as a protected, recurring calendar block with notifications off. If it routinely overruns 90 minutes, that is a signal to raise at the next quarterly review — usually it means drafts are arriving at the gate under-cooked, which is a prompt-library or briefing problem, not a Dorina problem.

---

## 6. Tooling Patterns (Tools-Agnostic)

The workflow runs identically at three implementation levels. Start at Level 1; move up only when a migration trigger fires. No tool is ever named here on purpose — any product in each generic category works, and switching products never changes the workflow.

### Level 1 — Minimal: shared spreadsheet + cloud folder + manual posting

The right starting point for Dorina + one assistant. Total tool cost: usually zero.

- **A shared spreadsheet** is the calendar, the pipeline tracker, and the approval log in one. One row per content item, with these columns:

| Column | Content |
|---|---|
| Item ID | Sequential, e.g., `DS-2026-09-001` |
| Target date & slot | Per the calendar |
| Pillar | One of the four pillars |
| DESK stage | Detect / Establish / Support / Keep / n/a |
| Language | EN / AR / bilingual |
| Format & CTA rung | Per `LINKEDIN_AUTHORITY_ENGINE.md` |
| Status | One of the eleven pipeline statuses (data-validated dropdown) |
| Drafter | Who/what produced the draft |
| Safety check (P26) | PASS + date, or issue summary |
| Text approved | Date + Dorina's initials (blank until Gate 1) |
| Visual approved | Date + Dorina's initials (blank until Gate 2) |
| Scheduled for | Confirmed date/time |
| Published URL | Filled after go-live verification |
| Day-7 metrics | Impressions / engagements / comments / profile actions |
| Notes | Revision notes, learnings, incident references |

- **A shared cloud folder** holds one subfolder per item ID containing the brief, draft versions, the approved final text (clearly named `APPROVED-TEXT`), design files, and the approved final graphic (`APPROVED-VISUAL`). Only files with the `APPROVED-` prefix may ever be posted.
- **Manual posting** follows this exact checklist every time (pin it wherever the assistant works):

  1. Open the item's row in the spreadsheet; confirm both approval dates are present. If either is blank, stop — do not post, message Dorina.
  2. Open the item's folder; use only the files prefixed `APPROVED-`.
  3. Copy the approved text exactly — no re-typing, no "quick improvements", no hashtag adjustments.
  4. Attach the approved visual; paste the approved alt-text into the platform's alt-text field.
  5. Post at the scheduled time (±15 minutes is fine).
  6. View the live post; check text, image, and alt-text against the approved files.
  7. Paste the URL and actual publish time into the spreadsheet; move status to PUBLISHED.

### Level 2 — Board: a kanban board mirroring the statuses

Add when volume or collaborators grow. **A kanban board** (any product) with one column per pipeline status, one card per item. Cards carry the checklists from Section 4 as tick-lists, and the two gate columns are configured so that only Dorina moves cards out of them (by convention if the tool cannot enforce it technically). The spreadsheet remains as the approval log and metrics record; the board is the live status view. Board and spreadsheet are reconciled in the Friday 15-minute slot.

### Level 3 — Assisted: AI drafting + scheduling tool for approved items only

Add when the rhythm is stable and both gates have run cleanly for at least a quarter.

- **AI-assisted drafting** at scale using `PREMIUM_PROMPT_LIBRARY.md`: batch-drafting a month of posts from the calendar briefs, batch-running the P26 safety check, drafting alt-text and Arabic/English parallel versions. All AI output enters the pipeline at DRAFTED — never later.
- **A scheduling tool** holds *only* doubly-approved items. The rule: the scheduling tool is a delivery mechanism for approved content, never a content source and never an approval surface.
- **The weekly reconciliation rule (mandatory at Level 3):** every week, in the Sunday session, the scheduling tool's queue is checked line-by-line against the approval log. Anything in the queue without a matching Gate 2 approval date is removed immediately, no discussion. This 5-minute check is the price of using a scheduler, and it is non-negotiable.

### Migration triggers

| Move | Trigger |
|---|---|
| Level 1 → 2 | More than ~6 items in flight at once, or a second collaborator joins, or status confusion causes a missed dwell time twice in a month |
| Level 2 → 3 | Three consecutive months of on-rhythm publishing with zero gate bypass incidents, and Sunday sessions consistently finishing with approved reserve to spare |
| Any level → one level down | Any incident where unapproved content nearly (or actually) reached the public; drop back, run the emergency procedures in Section 9, and re-earn the higher level |

---

## 7. Approval Log & Audit

The approval log is the permanent, append-only record of every item's journey. At Level 1 it lives in the spreadsheet (the columns above already contain it); at Levels 2–3 the spreadsheet remains the canonical log even if the board shows live status.

**Log specification — one row per item, these fields are mandatory:**

| Field | Notes |
|---|---|
| Item ID | Never reused, never renumbered |
| Date drafted | And drafter (person, or "assistant + AI-assisted") |
| Safety-check result | PASS/FAIL + date + one line on any issue fixed |
| Text-approval date | Gate 1 — date + Dorina's initials; a revision loop adds a new dated entry, it never overwrites the old one |
| Visual-approval date | Gate 2 — same convention |
| Publish date & time | Actual, not planned |
| Published URL | Captured at go-live verification |
| Notes | Revision reasons, incidents, standout learnings, take-down/correction references (Section 9) |

**Why the log matters:**

1. **Trust.** It is the operational proof of the promise this whole package makes: Dorina personally approved everything in her name. If a client, partner, or institution ever asks "who writes your content?", the honest answer — "it's drafted with help, and I approve every word and every image" — is backed by dated evidence.
2. **Dispute-proofing.** If a post is ever challenged (a quoted statistic questioned, a phrase criticized, a claimed boundary breach), the log shows exactly which source the fact came from, when the safety check passed, and when Dorina approved it. In a field as sensitive as mental health literacy, being able to reconstruct any decision is not optional.
3. **The learning loop.** The log joined with day-7 metrics is the raw material for the monthly retro (Section 10): which pillars, formats, languages, and CTA rungs actually perform. Without the log, the retro runs on impressions and memory; with it, it runs on data.

**Example log row (illustrative):**

| Item ID | Drafted | Drafter | P26 | Text appr. | Visual appr. | Published | URL | Notes |
|---|---|---|---|---|---|---|---|---|
| DS-2026-09-004 | 05 Sep | Assistant + AI-assisted | PASS 06 Sep | 06 Sep — DS | 13 Sep — DS | 15 Sep 08:32 | [link] | Gate 1 owner-edit to closing line; strong comment performance — boundary micro-habit angle tagged for reuse |

The log is never edited retroactively except to fix a typo in a note — and even then, corrections are added, not overwritten. Archive a copy of the log quarterly to the cloud folder.

---

## 8. Inbound Interaction Workflow (Comments & DMs)

Publishing is only half the surface area. Every comment and direct message is triaged into one of the three categories defined by the P27 inbound crisis-content detector in `PREMIUM_PROMPT_LIBRARY.md`. P27 (or the human applying its criteria manually at Level 1) is a *sorting* aid — it routes messages; it never answers them.

| Category | Definition (per P27) | Who replies | Response-time target | How |
|---|---|---|---|---|
| **Routine** | Professional engagement: agreement, questions about content, sharing experiences at a general level, networking, speaking/workshop inquiries | Content Assistant may draft; Dorina reviews and sends, or sends directly. Simple thank-you/acknowledgment replies on posts may be handled by the assistant in Dorina's established voice | Comments: within 24h (engagement window); DMs: within 48h | Normal warm, professional replies |
| **Sensitive** | Personal disclosure of struggle, distress, or a difficult workplace mental-health situation — without indications of immediate danger | **Dorina only.** Never delegated to the assistant, never to automation | Within 24h | Only the sensitive-disclosure signposting templates from `RISK_ETHICS_AND_REFERRAL_PROTOCOL.md`: acknowledge with warmth, restate the non-clinical boundary, signpost to qualified professional support. No advice, no assessment, no ongoing supportive correspondence |
| **Urgent-signpost** | Any indication of crisis, immediate risk, or acute danger to self or others | **Dorina personally**, same day — and if she is unreachable, the assistant sends the verbatim urgent template with zero modification and flags Dorina immediately | Same day — as fast as humanly possible | Only the verbatim urgent template from `RISK_ETHICS_AND_REFERRAL_PROTOCOL.md`, which signposts to emergency services and to [TO VERIFY before use: current national emotional-support helpline number — check the Ministry of Public Health / National Mental Health Programme site]. Nothing is added, nothing improvised |

**Hard rules for inbound:**

- **Sensitive and urgent replies are never automated and never AI-generated.** No auto-replies, no AI-drafted responses to a person in distress, no "smart" chatbot on any channel. The templates exist so that the human response is fast *and* safe.
- Every sensitive or urgent interaction is logged (date, category, template used, outcome) in a private incidents tab per `RISK_ETHICS_AND_REFERRAL_PROTOCOL.md` — separate from the public content log, minimal in personal detail.
- The assistant's triage instinct is set to caution: when in doubt between routine and sensitive, treat as sensitive; between sensitive and urgent, treat as urgent.
- Public crisis-adjacent comments on posts get the short public signpost reply (from the templates) plus, where appropriate, a move to private only per the protocol — never a public back-and-forth about someone's personal situation.

**Daily triage flow (fits inside the 15-minute engagement window):**

1. Sweep new comments and DMs across channels.
2. Sort each into routine / sensitive / urgent-signpost, applying the P27 criteria (automated pre-sort at Level 3; manual at Levels 1–2 using the same criteria).
3. Handle routine items immediately within the window.
4. Flag sensitive items to Dorina the same day with a link and the recommended template from `RISK_ETHICS_AND_REFERRAL_PROTOCOL.md`.
5. For anything urgent-signpost: interrupt Dorina immediately through the agreed reachability channel; if she is unreachable within the agreed window, send the verbatim urgent template, then log and brief her as soon as she is available.
6. Log every sensitive/urgent interaction in the private incidents tab before closing the window.

---

## 9. Emergency Procedures

Three procedures, written down now so nobody has to invent them under stress.

### 9.1 The STOP protocol — pause everything in one action

Trigger: anything that makes Dorina say "I don't want anything going out right now" — a suspected error in queued content, a personal emergency, a breaking situation, a discovered gate bypass. Anyone on the team may *call* STOP; only Dorina *lifts* it.

| Tooling level | How STOP executes (target: under 5 minutes) |
|---|---|
| Level 1 (manual posting) | Message the assistant: "STOP — nothing posts until I say so." Mark the spreadsheet's status column header with a STOP flag. Since nothing posts without a human hand, the pause is inherently immediate |
| Level 2 (board) | Same message + drag every SCHEDULED card into a frozen "ON HOLD" column so the live view shows the pause |
| Level 3 (scheduler) | **First action: pause or clear the scheduling tool's entire queue** (every scheduling tool has a pause-all or bulk-unschedule; the assistant must know where it is *before* Level 3 goes live — practicing this once is part of Level 3 onboarding). Then flag board and spreadsheet as above |

After STOP: nothing resumes until Dorina reviews the queue item-by-item and explicitly lifts the hold. Resumption is logged with date, reviewer, and a one-line reason for the original stop.

**The STOP drill.** Once, before the first scheduled post ever goes live at Level 3 (and again whenever the scheduling tool changes), the team runs a five-minute drill: call STOP, execute the pause, time it, and confirm the queue is verifiably empty or frozen. A protocol nobody has rehearsed is a document, not a capability.

### 9.2 Take-down / correction protocol — a published mistake

When an error is found in a live post, the assistant screenshots it immediately (evidence for the log), then Dorina chooses the response by severity:

| Severity | Example | Action |
|---|---|---|
| Cosmetic | Typo, formatting glitch, broken hashtag | **Edit** the post quietly; note in the log |
| Substantive but not harmful | A fact stated imprecisely, a wrong date, an attribution slip | **Edit** the post *and* add a brief **correction comment** ("Corrected: …") — transparency builds authority rather than undermining it; note in the log |
| Boundary-relevant or potentially harmful | Clinical-sounding phrasing, a statistic not from the four sources, a missing disclaimer on a sensitive post, an identifiable story without consent | **Delete** the post promptly. If it had meaningful reach, publish a short, calm correction/clarification post (which itself goes through both gates — an expedited same-day pass is allowed, but the gates still run). Log fully as an incident |
| Someone may have been affected | The post caused visible distress in comments, or a person/organization is identifiable and aggrieved | Delete, correct publicly as above, and **notify directly**: Dorina personally reaches the affected person/organization with a straightforward apology. Consult `RISK_ETHICS_AND_REFERRAL_PROTOCOL.md` for tone and boundaries of that outreach |

Every take-down or correction triggers a root-cause note in the next monthly retro: which gate should have caught it, and what checklist line or prompt needs updating (Section 10).

### 9.3 Crisis-adjacent pause rule

If a major tragic public event occurs in Lebanon (or one that directly affects Dorina's audience), the default is: **STOP protocol on all scheduled promotional and light-toned content immediately** — do not let a cheerful pre-scheduled post publish into a national moment of grief. Then, within 24–48 hours, Dorina reviews the queue: some educational items may be appropriate or even valuable (calm, supportive literacy content often is); anything promotional, celebratory, or tonally jarring is postponed. Resumption is a deliberate, dated decision by Dorina, and the first post back is reviewed specifically for tone against the moment. This rule is exactly why a scheduler must never run unattended for long stretches — the weekly reconciliation (Section 6) doubles as the "does this queue still fit the world?" check.

---

## 10. Quality & Learning Loop

The workflow improves itself on a fixed cadence, using its own records.

**Monthly content retro (inside the 90-minute planning session, ~20 minutes):**

- Pull the month's day-7 metrics from the log and compare against the KPI targets in `LINKEDIN_AUTHORITY_ENGINE.md`.
- Identify the top and bottom two posts. For each: which pillar, format, language, hook style, CTA rung? Write one sentence of hypothesis per post in the log's notes.
- Check pillar balance actually published vs the 30/30/25/15 target and correct next month's briefs if drifting.
- Review any incidents (revisions at the gates, take-downs, inbound escalations) for root cause.

**Prompt-library update trigger.** Update `PREMIUM_PROMPT_LIBRARY.md` when any of these occurs: the same revision note appears at Gate 1 three times (the drafting prompt is producing the flaw — fix it at the source); P26 misses something a human catches at a gate (tighten P26's criteria); P27 mis-categorizes an inbound message (tighten its category definitions); or a new post format enters the calendar without a supporting prompt.

**Checklist update trigger.** Update the Section 4 checklists when a published mistake traces to something neither checklist asks about, or when a checklist line has never once caught anything in a quarter *and* is slowing reviews (retire or merge it — checklists must stay short enough to actually be used).

**Versioning of this document.** This workflow document itself carries a version line (below). Changes are made only by Dorina or with her sign-off, at the quarterly strategy review or after any incident that exposes a gap — never silently mid-quarter. Each new version notes the date and a one-line reason; superseded versions are kept in the archive folder. The workflow governs the content; the quarterly review governs the workflow.

> **Version:** 1.0 — July 2026 — initial workflow (this package).

---

## What we still need from Dorina (workflow-specific)

1. **Approval channel of record.** Where does a dated "Approved" live so it counts — the shared spreadsheet cell, a message in an agreed chat thread, or both? We recommend the spreadsheet cell as canonical; please confirm.
2. **Assistant situation.** Will a human assistant hold the Content Assistant/Designer roles from month one, or does Dorina start solo with AI assistance and hire later? This decides how much of the Level 1 spec to build immediately.
3. **Sunday slot confirmation.** Is Sunday genuinely the best 60–90 minute weekly window, or should the batch session move (the pipeline works with any fixed day; it only needs *one*)?
4. **Reachability rule for urgent inbound.** Agreed maximum response window in which Dorina is reachable for urgent-signpost triage, and confirmation that the assistant may send the verbatim urgent template when she is not.
5. **Brand kit for Gate 2.** Final colors, fonts, logo/name lockup in EN and AR, and 2–3 reference visuals that define "my look", so the Gate 2 "brand look" line has a concrete standard.
6. **Helpline verification.** Before the first sensitive/urgent template is ever used: verify and record the current national emotional-support helpline number from the Ministry of Public Health / National Mental Health Programme site, and diarize a quarterly re-check.
7. **Evergreen reserve seed.** 3–5 non-time-sensitive post topics Dorina is happy to approve early to seed the reserve.
8. **Delegation comfort line.** Confirm which routine comment replies (if any) the assistant may send without per-message review, and the exact voice guidelines for them.

---

## Sources

This document, like the whole package, relies exclusively on the four approved sources below. Any draft in this pipeline citing any other statistic fails the safety check by definition.

1. World Health Organization — *Mental health at work* (fact sheet): https://www.who.int/news-room/fact-sheets/detail/mental-health-at-work
2. World Health Organization — *Mental health: strengthening our response* (fact sheet): https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response
3. Lebanon Ministry of Public Health — *National Mental Health Programme*: https://www.moph.gov.lb/en/Pages/6/553/the-national-mental-health-program
4. World Health Organization — *World Mental Health Day* (10 October): https://www.who.int/campaigns/world-mental-health-day

> Educational content on workplace wellbeing — not therapy, diagnosis, or crisis support. If you're struggling, please reach a qualified professional; in an emergency, contact local emergency services.


---

## Final Review Addendum — Preconditions Before Public Delivery

Before Dorina publishes the profile positioning or delivers paid workshops, complete these checks:

- Confirm exact employment history and current employer restrictions; do not publish any dates or titles that Dorina has not verified.
- Complete at least one non-clinical mental-health-literacy or Psychological First Aid training and one basic facilitation practice cycle before paid delivery.
- Confirm local public/professional liability insurance options and obtain local legal review for disclaimers, privacy boundaries, workshop terms, and employer/moonlighting issues.
- Verify current Lebanon crisis/referral contacts and operating hours before every printed handout or live workshop. Embrace Lebanon publicly lists 1564 for its Lifeline, but all details must be re-checked close to use.
- Budget honestly: content drafting may take 2–3 hours/week, but the full engine including engagement, approvals, outreach, workshop preparation, delivery, and review can require 6–10+ hours/week during launch periods.
- Track safeguarding metrics alongside growth: referral signposts made, boundary escalations, stopped exercises, post-workshop debrief notes, and whether the protocol was followed.
