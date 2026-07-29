# Premium Prompt Library
## Engineered AI Prompts for Every Asset in the Dorina Salman Authority System

**Prepared for:** Dorina Salman (Lebanon)
**Package:** Mental Health Management Authority Strategy
**Date:** July 2026
**Companion documents:** `CONTENT_APPROVAL_AND_AUTOMATION_WORKFLOW.md` (how these prompts fit the approval workflow) and `RISK_ETHICS_AND_REFERRAL_PROTOCOL.md` (the boundaries every output must respect)

---

## How to use this library

1. **Every prompt is copy-paste ready.** Open your AI assistant of choice, paste the **Master Context Block** (Section 0.1) once at the start of the conversation, then paste the specific prompt you need. Replace anything in `[SQUARE BRACKETS]` with real information.
2. **Never skip the Master Context Block.** It carries the positioning, the safety boundary, and the voice. Without it, outputs will drift toward clinical language you must not use.
3. **Nothing generated here is final.** Every output goes through the approval workflow in `CONTENT_APPROVAL_AND_AUTOMATION_WORKFLOW.md` and the QA prompt in Section G1 before Dorina approves it. **No content publishes without Dorina's explicit approval.**
4. **Placeholder conventions:**
   - `[LIKE THIS]` — you must fill it in before sending the prompt.
   - `{Optional: like this}` — include only if relevant, otherwise delete the line.
   - Where a prompt asks for "the four sources," it means the evidence base listed in Section 0.4.
5. **Language:** prompts default to English output. Add the line `Write the output in Arabic (Lebanese professional register).` or `Write the output bilingually, English first, Arabic below.` to any prompt when needed.

---

# SECTION 0 — FOUNDATION BLOCKS (paste these first)

## 0.1 Master Context Block

Paste this at the top of every new AI conversation before any other prompt in this library.

```
CONTEXT — READ CAREFULLY AND APPLY TO EVERYTHING IN THIS CONVERSATION.

You are the content and strategy assistant for Dorina Salman, a workplace
wellbeing educator and mental health literacy advocate based in Lebanon.

WHO DORINA IS:
- 12+ years of administrative and executive-support experience in Lebanese
  workplaces. She knows how offices actually run: workloads, deadlines,
  interruptions, hierarchies, email overload, unclear priorities.
- Her positioning: "mental health management" = practical, non-clinical
  self-management for working professionals — stress literacy, burnout
  prevention, boundaries, routines, emotional organization, and knowing
  when and how to seek qualified help.
- Her unique lens: she translates workplace wellbeing guidance from
  authorities like the WHO into desk-level systems, habits, and routines.
- Audience: working professionals, administrators, team leads, and HR
  communities in Lebanon and the wider region. Bilingual context
  (English and Arabic).

WHO DORINA IS NOT — ABSOLUTE, NON-NEGOTIABLE BOUNDARY:
- She is NOT a therapist, psychologist, psychiatrist, counselor,
  clinician, coach for mental disorders, or trauma expert.
- She does NOT diagnose, treat, assess, cure, or provide therapy,
  crisis intervention, medical, legal, or HR/legal advice.
- All content is EDUCATIONAL ONLY. Any mention of serious distress,
  disorders, or crisis must point to qualified professionals and, for
  Lebanon, to national/emergency services.
- Never invent credentials, client results, statistics, or testimonials.
- Never promise outcomes ("this will cure/fix/heal your anxiety").
  Say instead: "may help," "many people find," "a practical habit
  worth trying."

EVIDENCE RULES:
- Factual claims may ONLY come from these four sources:
  1. WHO — Mental health at work (fact sheet)
  2. WHO — Mental health: strengthening our response
  3. Lebanon Ministry of Public Health — National Mental Health Programme
  4. WHO — World Mental Health Day (October 10)
- Safe, reusable facts from these sources: ~60% of the world's
  population is in work; 15% of working-age adults were estimated to
  have a mental disorder in 2019; an estimated 12 billion working days
  are lost yearly to depression and anxiety (~US$1 trillion in lost
  productivity); workplace risks include excessive workload, long or
  inflexible hours, lack of control, and poor organizational culture;
  WHO-recommended actions include manager training, worker mental
  health literacy, and stress-management skills training; mental
  health is a basic human right and exists on a continuum; Lebanon has
  a National Mental Health Programme under the Ministry of Public
  Health, including a workplace mental health campaign.
- If you need a fact outside these sources, write [NEEDS SOURCE — DO
  NOT PUBLISH WITHOUT VERIFICATION] instead of inventing one.

MANDATORY DISCLAIMER LOGIC:
- Every public-facing asset (post, carousel, handout, landing page,
  email) must end with or include the educational disclaimer
  appropriate to its length (short for social, full for handouts and
  landing pages). If unsure, include the short version:
  "Educational content only — not therapy, diagnosis, or crisis
  support. If you are struggling, please reach out to a qualified
  professional."

Confirm you understand these rules in one sentence, then wait for my
next instruction.
```

## 0.2 Voice & Style Block

Paste this after the Master Context Block when generating any public-facing content.

```
VOICE & STYLE RULES FOR ALL CONTENT:

TONE: Warm, grounded, practical, quietly confident. A trusted colleague
who has been in the office trenches — not a guru, not a preacher, not
an influencer. Zero toxic positivity. Zero fear-mongering.

STYLE:
- Short sentences. Concrete workplace scenes (inboxes, meetings,
  deadlines, Sunday-night dread) rather than abstractions.
- One idea per piece of content. One clear takeaway the reader can
  apply today at their desk.
- Speak to "you" (the working professional). Use "we" for shared
  workplace culture problems.
- Lebanon-aware: acknowledge real pressures (economic stress, power
  cuts, multiple jobs, commuting, family obligations) with respect and
  without politics, without pity, and without naming political events.
- Bilingual sensitivity: when writing in English, keep phrasing simple
  enough to resonate with Arabic-first readers; avoid idioms that do
  not translate.

BANNED WORDS/FRAMES (never use about Dorina or her content):
therapy, therapist, psychologist, counselor, counseling, clinical,
diagnosis, diagnose, treat, treatment, cure, heal your trauma, trauma
expert, patient, session (in a clinical sense), intervention (clinical
sense), "science-backed method I created", any promise of curing or
fixing a mental health condition.

PREFERRED WORDS/FRAMES:
workplace wellbeing, mental health literacy, stress literacy, burnout
prevention, emotional organization, boundaries, routines, habits,
psychological safety (as a workplace culture concept), workshop,
participant, facilitator, educator, advocate, "the WHO notes that…",
"a practical way to…", "worth discussing with a qualified
professional if…".

FORMAT DEFAULTS:
- LinkedIn posts: hook line first (no "I'm excited to announce"),
  white space between lines, 150–300 words unless told otherwise,
  end with one question or one small action, then the short
  disclaimer line, then 3–5 relevant hashtags.
- No emojis walls; maximum 2–3 purposeful emojis per post, or none.
- Never use engagement-bait ("comment YES if you agree!").
```

## 0.3 Master Safety Block (for workshop and sensitive-topic assets)

Paste this in addition to 0.1 whenever generating workshop material, exercises, or content touching heavier topics.

```
ADDITIONAL SAFETY RULES FOR WORKSHOP / SENSITIVE CONTENT:

- Every workshop asset must include: (a) the educational-scope
  statement, (b) the "you may pass on any exercise" participation
  rule, and (c) the referral/crisis pointer from the Risk, Ethics &
  Referral Protocol.
- Exercises must never ask participants to disclose trauma, diagnoses,
  medication, family mental health history, or details of their
  darkest moments. Reflection stays at the level of workload, habits,
  energy, boundaries, and routines.
- Group agreements must include confidentiality ("what is shared here
  stays here") and no-advice-giving between participants on clinical
  matters.
- If generated content drifts into assessment, screening, symptom
  checklists that resemble diagnostic tools, or therapeutic
  techniques (e.g., exposure work, trauma processing, clinical CBT
  protocols), STOP and replace with an educational alternative.
- Self-reflection checklists must be framed as "awareness prompts,"
  never as tests, screenings, or assessments, and must carry the
  line: "This is a reflection tool, not a diagnostic or screening
  instrument."
```

## 0.4 Evidence base (reference list for any prompt that asks for sources)

```
1. WHO — Mental health at work (fact sheet):
   https://www.who.int/news-room/fact-sheets/detail/mental-health-at-work
2. WHO — Mental health: strengthening our response:
   https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response
3. Lebanon Ministry of Public Health — National Mental Health Programme:
   https://www.moph.gov.lb/en/Pages/6/553/the-national-mental-health-program
4. WHO — World Mental Health Day (October 10):
   https://www.who.int/campaigns/world-mental-health-day
```

---

# PART A — STRATEGY & DOCUMENTATION PROMPTS

## A1 — Strategy Document Generator / Updater

Use to draft or refresh any strategic document (proposal sections, positioning updates, annual plans).

```
TASK: Draft (or update) a strategic document for Dorina's authority-
building system.

DOCUMENT NEEDED: [e.g., "an updated 6-month plan", "a one-page
strategy summary for a potential partner", "a revision of the
workshop pricing strategy section"]

CURRENT SITUATION:
- Stage of the journey: [e.g., "month 3; 850 LinkedIn followers;
  1 pilot workshop delivered"]
- What has worked so far: [FILL IN]
- What has not worked: [FILL IN]
- Constraints: [time per week available, budget, language preference]

REQUIREMENTS:
1. Premium consultant-grade writing: clear headings, short
   paragraphs, tables where they genuinely help.
2. Every recommendation must be actionable within Dorina's real
   constraints — no "hire a team of five" fantasies.
3. Ground any factual claim only in the four sources from the
   evidence base; mark anything else [NEEDS SOURCE].
4. Respect the non-clinical boundary in every line.
5. End with: (a) a 30-day action list of max 7 items, (b) a "risks
   and mitigations" table, (c) a "What we still need from Dorina"
   list for any missing information — never invent it.

OUTPUT FORMAT: Markdown document, max [WORD COUNT, e.g., 1,200] words.
```

## A2 — Positioning Statement & Bio Refresher

```
TASK: Write [NUMBER] variations of Dorina's positioning statement and
professional bio.

USE CASE: [e.g., "LinkedIn About section", "workshop proposal cover",
"event speaker introduction", "email signature", "IG bio (150 chars)"]

LENGTHS NEEDED: [e.g., "one 50-word, one 120-word, one 300-word"]

MUST INCLUDE:
- The bridge: 12+ years inside real workplaces + workplace wellbeing
  education.
- The promise: practical mental health management — systems, habits,
  and routines for working professionals.
- The boundary, phrased positively (educator/advocate, not clinician).
- Lebanon and regional relevance.

MUST NOT INCLUDE: any clinical title, invented credentials, invented
numbers of clients or workshops.

For each variation, add one line explaining when to use it.
```

## A3 — Quarterly Strategy Review

```
TASK: Act as a rigorous, honest strategy reviewer. Analyze the
quarter below and produce a strategic review.

QUARTER DATA (real numbers only — leave blank rather than guess):
- LinkedIn: followers start/end [X/Y], average impressions per post
  [X], top 3 posts by engagement [paste text or topics], comments
  quality notes [FILL IN]
- Workshops: delivered [N], participants [N], feedback highlights
  [paste], revenue [amount or "none yet"]
- Partnerships/conversations in progress: [LIST]
- Time actually spent per week: [HOURS]
- What felt heavy or unsustainable: [FILL IN]

PRODUCE:
1. "What the data actually says" — max 5 bullet points, no flattery.
2. "Keep / Stop / Start" table (max 4 rows each).
3. One strategic risk I might be ignoring.
4. Next-quarter focus: ONE primary goal, TWO supporting goals, with
   weekly-level implications.
5. Three questions Dorina should answer before the next quarter.

Be direct. If the data suggests the current approach is not working,
say so plainly and propose the smallest meaningful pivot.
```

## A4 — Service / Offer One-Pager

```
TASK: Write a one-page description of the following offer, suitable
to send to a company contact as a PDF page.

OFFER: [e.g., "90-minute team workshop: Beating Burnout Before It
Starts", "monthly wellbeing-literacy email for employees",
"lunch-and-learn talk"]
AUDIENCE FOR THIS PAGE: [e.g., "HR manager at a 50-person company in
Beirut", "operations director", "school administration"]
PRICE / FORMAT: [FILL IN or write "leave a placeholder"]

STRUCTURE:
1. Problem framing (2–3 sentences, workplace-real, WHO-grounded —
   e.g., the cost of lost working days to depression and anxiety).
2. What the offer is (format, duration, language options AR/EN,
   in-person/online).
3. What participants leave with (3–5 concrete takeaways — skills and
   tools, never outcomes like "reduced anxiety").
4. What this is NOT (the educational boundary, phrased as
   professionalism, plus referral commitment).
5. About Dorina (60 words, from A2).
6. Next step (one clear call to action).
Include the full educational disclaimer at the bottom.
```

---

# PART B — WORKSHOP PROMPTS

## B1 — Workshop Concept Designer

```
TASK: Design a complete concept for a new non-clinical workplace
wellbeing workshop.

TOPIC AREA: [e.g., "email and workload overwhelm", "boundaries with
managers", "energy management for people working two jobs",
"team communication under stress"]
AUDIENCE: [e.g., "administrative staff", "mixed company teams",
"team leads", "university staff"]
DURATION: [e.g., 90 minutes / half day]
DELIVERY: [in-person Beirut / online / hybrid] — LANGUAGE: [AR / EN / mixed]

PRODUCE:
1. Working title (3 options: one plain, one curiosity-driven, one
   bilingual EN/AR).
2. One-sentence promise (a skill gained, never a condition treated).
3. Learning objectives (3–4, each starting with "Participants will be
   able to…", all observable and non-clinical).
4. Session arc: opening (incl. scope statement + group agreements),
   2–3 teaching blocks each paired with an exercise, energizer
   placement, closing + commitment ritual, referral-pointer moment.
5. The ONE core framework or memorable model of the workshop (simple,
   original, desk-level — e.g., a 3-step routine or a 4-quadrant
   sorting tool for tasks/energy).
6. Materials list and room/tech needs.
7. Safety notes: which moments carry emotional risk and how the
   facilitator keeps the room educational (see Master Safety Block).
8. Follow-up: what participants receive after (handout, 1 email).

Everything must be deliverable by a solo facilitator with printed
handouts and a flipchart or slides — no special software.
```

## B2 — Facilitator Guide / Run-of-Show Generator

```
TASK: Expand the workshop concept below into a minute-by-minute
facilitator guide Dorina can run from.

WORKSHOP CONCEPT: [PASTE OUTPUT OF B1 OR DESCRIBE]
TOTAL DURATION: [MINUTES]

FORMAT — a table with columns:
| Time | Segment | What the facilitator says (key lines verbatim) |
What participants do | Materials | Watch-outs |

REQUIREMENTS:
1. Write the opening script VERBATIM, including: welcome, who Dorina
   is (educator framing), the educational-scope statement, the "pass
   on any exercise" rule, confidentiality agreement, and phone/break
   logistics.
2. Write transition sentences between every segment verbatim — these
   are where facilitators stumble.
3. For every exercise: setup instructions, timing, debrief questions
   (2–3, kept at the level of habits/workload/energy — never "share
   your hardest moment").
4. Write the closing script VERBATIM: recap of the core model, one
   personal commitment ritual, the referral pointer ("if today
   touched something heavier for you, here is where qualified support
   lives"), thank-you, and feedback form instruction.
5. "Watch-outs" column must include: what to do if someone becomes
   visibly distressed (follow the Risk, Ethics & Referral Protocol:
   acknowledge, normalize privately, refer — never process the
   distress in the group), what to do if someone asks a clinical
   question, and timing rescue options if running late.
6. Include a "cut plan": which segments to shorten, in order, if the
   session loses 15/30 minutes.
```

## B3 — Participant Handout Generator

```
TASK: Create a participant handout for the workshop below.

WORKSHOP: [TITLE + one-line description, or paste B1 output]
HANDOUT LENGTH: [1 page / 2 pages / 4-page mini-workbook]
LANGUAGE: [EN / AR / bilingual]

STRUCTURE:
1. Title + one-line workshop promise.
2. The core model/framework of the workshop as a visual-ready
   description (write it so a designer can lay it out; include the
   exact labels/text for the diagram).
3. Key takeaways (max 5, one sentence each).
4. "Try this week" — 3 micro-actions, each doable in under 10
   minutes at a desk.
5. One reflection box (2–3 lines to write in) with prompts kept to
   workload/habits/energy level.
6. "Where to find qualified support" box — insert the referral block
   from the Risk, Ethics & Referral Protocol verbatim; leave the
   placeholder [REFERRAL BLOCK] for me to paste it.
7. Footer: Dorina's name, positioning line, contact, and the FULL
   educational disclaimer.

STYLE: Warm, plain language, no jargon, readable at a glance.
Everything must survive black-and-white printing.
```

## B4 — Exercise Designer

```
TASK: Design [NUMBER] original workshop exercises on the theme of
[THEME, e.g., "noticing early signs of burnout in your week",
"saying no professionally", "designing a shutdown routine for the
end of the workday"].

CONSTRAINTS:
- Audience: [FILL IN]. Group size: [FILL IN]. Time available per
  exercise: [MINUTES].
- Non-clinical, non-triggering: reflection stays at
  workload/habits/energy/boundaries level. No trauma recall, no
  symptom checklists, no disclosure pressure. Always include the
  "you may pass" rule in the instructions.
- Materials: paper, pens, printed cards, flipchart only.

FOR EACH EXERCISE PRODUCE:
1. Name (memorable, translatable to Arabic).
2. Purpose in one sentence (linked to a learning objective).
3. Setup — exactly what the facilitator says to launch it (verbatim).
4. Steps with timing.
5. Debrief — 2–3 questions moving from "what did you notice?" to
   "what will you try?".
6. Adaptations: for a quiet group / a large group / online delivery.
7. Safety note: the one way this exercise could go wrong emotionally
   and how the facilitator steers it back to educational ground.
```

## B5 — Opening & Closing Scripts (standalone)

```
TASK: Write polished verbatim opening and closing scripts for
[WORKSHOP TITLE], [DURATION], audience [AUDIENCE], language
[EN / AR / mixed with Arabic warmth phrases].

OPENING SCRIPT (3–4 minutes spoken) must include, in natural flowing
language, not a checklist: a workplace-real hook; who Dorina is
(educator with 12+ years inside workplaces — no clinical framing);
what today is and is NOT (education, not therapy or counseling; no
one will be asked to share anything personal); the "pass" rule;
confidentiality; logistics; an opening question that lands softly
(about workload/energy, not feelings trauma).

CLOSING SCRIPT (3 minutes spoken) must include: recap of the ONE core
model; a commitment moment ("one small thing you will try this
week"); the referral pointer, delivered warmly and without drama;
appreciation; feedback form; how to stay in touch (LinkedIn).

Then produce a second, 60-second "micro" version of each for short
talks.
```

## B6 — Pre-Workshop Email Sequence

```
TASK: Write the pre-workshop email sequence for [WORKSHOP TITLE] on
[DATE] at [LOCATION/PLATFORM], organized with [COMPANY/PARTNER NAME
or "open registration"].

EMAILS NEEDED:
1. CONFIRMATION (sent on registration): warm welcome; date/time/
   place/duration; what to bring (nothing but themselves + pen);
   what the workshop is and is not (one gentle boundary sentence);
   one question to prime thinking ("Before we meet, notice which
   part of your workday drains you most").
2. REMINDER (48h before): logistics recap; a 3-line teaser of the
   core model; accessibility line ("participation in every exercise
   is always optional").
3. DAY-OF (morning): short, energizing, purely logistic + one warm
   line.

RULES: Subject lines under 55 characters, no clickbait. Each email
under 150 words. Signature: Dorina Salman, [POSITIONING LINE],
LinkedIn link. Footer disclaimer: educational program, not therapy
or medical advice. Language: [EN / AR / bilingual].

{Optional: also write the corporate version addressed to the HR
contact who is forwarding these to staff.}
```

## B7 — Post-Workshop Follow-Up (email + feedback survey)

```
TASK: Write the post-workshop follow-up package for [WORKSHOP TITLE]
delivered on [DATE].

1. THANK-YOU EMAIL (sent within 24h, under 200 words):
   - Genuine thanks + one specific moment from the session
     [DESCRIBE MOMENT or leave placeholder].
   - Recap of the core model in 3 lines.
   - The "try this week" nudge (one micro-action).
   - Attached/linked handout mention.
   - Referral line (warm, one sentence, pointing to qualified
     support and the emergency/lifeline numbers block placeholder
     [REFERRAL BLOCK]).
   - Invitation to connect on LinkedIn.
2. FEEDBACK SURVEY (max 7 questions):
   - 3 rating questions (clarity, usefulness, facilitation).
   - "Which tool will you actually use?" (choice list from the
     workshop).
   - "What should the next workshop cover?" (open).
   - Permission question: "May we quote your feedback anonymously
     in Dorina's materials? Yes/No" — consent-first testimonials.
   - NO questions about personal mental health status.
3. 2-WEEK FOLLOW-UP EMAIL (under 120 words): "did you try it?"
   check-in, one extra tip, soft pointer to the next workshop or
   Dorina's LinkedIn content.
4. ORGANIZER REPORT EMAIL (to the HR/company contact): attendance,
   themes raised (anonymized, aggregate only — never individual
   disclosures), feedback summary placeholder, suggested next step.
```

## B8 — Corporate Workshop Proposal Generator

```
TASK: Write a workshop proposal for a specific company.

COMPANY: [NAME, sector, approx. size, what we know about them]
CONTACT: [ROLE of the person receiving it]
CONTEXT: [how the conversation started / what they asked for]
PROPOSED OFFER: [which workshop(s), duration, EN/AR, on-site/online]
PRICE: [amount / range / "placeholder"]

STRUCTURE (max 2 pages):
1. Their situation (mirror their world; use WHO workplace facts —
   e.g., 12 billion working days lost yearly to depression and
   anxiety — to frame cost of inaction WITHOUT fear-mongering).
2. Proposed program (what, when, how long, in what language).
3. What their team gains (skills/tools; explicitly educational).
4. Professional boundaries (why the non-clinical scope protects the
   company too, and the referral protocol commitment).
5. Logistics + investment.
6. About Dorina (short bio from A2).
7. Next step + validity period of the proposal.
Tone: peer-to-peer professional, zero desperation, zero jargon.
```

---

# PART C — MARKETING FUNNEL PROMPTS

## C1 — Landing Page Copy Generator

```
TASK: Write full landing page copy for [OFFER: e.g., "the Beating
Burnout Before It Starts workshop for companies" / "Dorina's
speaking + workshops page" / "newsletter signup"].

AUDIENCE ARRIVING AT THIS PAGE: [e.g., "HR managers who saw a
LinkedIn post", "professionals clicking from Instagram"]
GOAL OF THE PAGE: [book a call / register / subscribe]
LANGUAGE: [EN / AR / EN with AR section]

SECTIONS (write complete copy for each, with 2 headline options for
the hero):
1. HERO: headline + subheadline + primary call-to-action button text.
   Headline speaks to the workplace pain, not the service.
2. THE PROBLEM: 3–4 lines, desk-level and real; one WHO-grounded
   fact woven in naturally with source name ("the WHO estimates…").
3. THE SHIFT: what "mental health management" means in this work —
   practical, non-clinical, systems-based. This section carries the
   positive boundary framing.
4. THE OFFER: what it includes, format, languages, delivery.
5. WHAT YOU LEAVE WITH: 4–5 concrete takeaways (tools/skills).
6. ABOUT DORINA: 100 words, bridge story (admin systems → wellbeing
   education).
7. WHAT THIS IS NOT: honest boundary section + referral commitment
   (this builds trust; write it as a strength).
8. FAQ: 5 questions, including "Is this therapy?" (answer: no —
   with warmth and the referral line), language options, group
   sizes, online availability, how booking works.
9. FINAL CALL-TO-ACTION + footer with FULL educational disclaimer
   placeholder [FULL DISCLAIMER] and contact.
Rules: no invented testimonials, no invented client logos, no
invented statistics. Leave [TESTIMONIAL SLOT — real quotes only,
with consent] markers.
```

## C2 — Lead Magnet Generator

```
TASK: Create a downloadable lead magnet.

FORMAT: [1-page checklist / 5-page mini-guide / email mini-course
of 3 emails]
TOPIC: [e.g., "The End-of-Workday Shutdown Routine", "10 signs your
week is overloaded (and what to adjust)", "The manager's guide to
wellbeing-aware one-on-ones — educational edition"]
AUDIENCE: [FILL IN]

REQUIREMENTS:
- Immediately useful: reader applies something within 10 minutes.
- Any awareness checklist framed as reflection, never screening;
  include: "This is a reflection tool, not a diagnostic or
  screening instrument."
- One WHO-grounded fact maximum, cited by source name.
- Ends with: about-Dorina block (60 words), LinkedIn link, referral
  box placeholder [REFERRAL BLOCK], full educational disclaimer.
- Write the landing-blurb (50 words) and the delivery email that
  sends it (80 words) as well.
```

## C3 — DM & Outreach Script Generator

```
TASK: Write outreach message scripts for [CHANNEL: LinkedIn DM /
email / WhatsApp-appropriate tone].

SCENARIO: [choose one]
a) Warm follow-up to someone who engaged with several posts.
b) First contact with an HR professional in Lebanon.
c) Reply to "do you do workshops?" inquiry.
d) Follow-up after a workshop to the organizer about a next booking.
e) Reconnecting with a dormant contact without awkwardness.

FOR THE CHOSEN SCENARIO PRODUCE: 3 variants (short/medium/warm-
personal), each under 90 words, plus a follow-up message for
no-reply after [N] days (one only — never pushy).

RULES: Human, specific, zero copy-paste smell. Reference something
real ([THEIR POST / THEIR COMMENT / THE EVENT]). One clear, small
ask (a 15-minute call, not "buy my workshop"). Never promise
outcomes; never give advice about any individual's mental health in
DMs — if someone shares personal struggles, use the redirect
script from the Risk, Ethics & Referral Protocol instead.
```

## C4 — Partnership Pitch Generator

```
TASK: Write a partnership pitch email + one-page concept for
[PARTNER: e.g., "an HR association in Lebanon", "a university career
office", "a coworking space in Beirut", "an organization aligned
with the National Mental Health Programme ecosystem"].

WHAT WE OFFER THEM: [e.g., free literacy talk for members,
co-branded workshop, content collaboration]
WHAT WE WANT: [audience access / venue / credibility / co-promotion]

EMAIL (under 180 words): who Dorina is in one line; why THIS partner
specifically (show we know their work); the concrete idea; the
mutual value; one small next step.
ONE-PAGER: concept name; the shared audience problem (WHO-grounded);
the format; who does what; boundaries statement (educational scope +
referral protocol — this REASSURES institutional partners); about
Dorina; contact.
Tone: institutional-friendly, humble-confident, Lebanon-aware.
```

---

# PART D — LINKEDIN PROMPTS

## D1 — Monthly LinkedIn Calendar Generator

```
TASK: Generate a complete LinkedIn content calendar for [MONTH,
YEAR].

INPUTS:
- Monthly theme from the 12-month calendar: [THEME, e.g., "Boundary
  Season — saying no professionally"]
- Posting cadence: [e.g., 3 posts/week: Mon educational, Wed
  story/observation, Fri practical tool]
- Seasonal/local context this month: [e.g., "Ramadan schedules",
  "summer heat + power cuts", "back-to-school", "end-of-year
  reviews", "World Mental Health Day Oct 10"]
- What performed well recently: [PASTE TOPICS or "unknown"]

OUTPUT — a table with columns:
| Date | Day-slot type | Working title | Hook line (verbatim) |
Core point (2 lines) | Call-to-action | Format (text/carousel/photo)
| Notes (source needed? graphic needed?) |

RULES:
1. Every post = ONE idea. No two posts in the month may overlap in
   takeaway.
2. At least 2 posts/month connect to Dorina's admin/office
   experience lens.
3. Max 1 WHO-fact post per week; facts only from the evidence base.
4. Include 1 engagement post/month (a genuine question about
   workplace habits — never engagement bait).
5. Mark awareness dates relevant this month and design those posts
   around them.
6. Nothing clinical. Every post note must state which disclaimer
   length applies.
After the table, list the graphics needed this month (feeds prompt
F1) so design can be batched.
```

## D2 — Individual LinkedIn Post Generator

The workhorse prompt. Use once per post, feeding a calendar row from D1.

```
TASK: Write a complete LinkedIn post, ready for approval.

CALENDAR ROW: [PASTE THE ROW FROM D1: title, hook, core point, CTA,
format]
POST TYPE: [choose one]
  a) EDUCATIONAL — teach one concept with a desk-level example.
  b) STORY/OBSERVATION — a (real, non-identifying) workplace scene
     from 12+ years of admin life → the lesson. Mark any illustrative
     scene as illustrative; never invent "a client of mine".
  c) MYTH-BUSTER — "X is not weakness/laziness" reframes, grounded
     in WHO framing (mental health on a continuum).
  d) PRACTICAL TOOL — a routine/checklist/3-step method to apply
     today.
  e) AWARENESS DAY — anchored to [DATE/DAY], e.g., World Mental
     Health Day (Oct 10), connecting global theme → Lebanese
     workplace reality.
  f) QUESTION/COMMUNITY — one honest question about workplace
     habits.

STRUCTURE: Hook line (must survive the "see more" fold) → body in
short lines with white space → one takeaway → one small action or
question → short disclaimer line → 3–5 hashtags (mix: #MentalHealthAtWork
#WorkplaceWellbeing #Lebanon + 1–2 topic-specific).

DELIVER: 2 versions (A: as specified; B: a different angle on the
same idea), each under [300] words, plus — if format is carousel or
graphic — a one-line description of the visual for the design brief.
Apply the Voice & Style Block strictly.
```

## D3 — Post Rewrite & Tightening

```
TASK: Improve the draft post below WITHOUT changing its core idea or
adding any new factual claims.

DRAFT: [PASTE DRAFT]

DO: sharpen the hook (3 alternative hook lines first, then pick the
best into the rewrite); cut 20–30% of words; convert abstractions to
desk-level images; strengthen the single takeaway; verify the
disclaimer line and hashtags are present; flag — do not silently fix
— anything that crosses the clinical boundary or states an
unsourced fact, using [FLAG: reason].
DELIVER: the flags list, then the final rewrite.
```

## D4 — Comment & Engagement Reply Assistant

```
TASK: Draft replies to the LinkedIn comments below, in Dorina's
voice.

COMMENTS: [PASTE COMMENTS, numbered]

RULES PER REPLY (max 40 words each):
- Appreciate genuinely and specifically; add one small extra thought
  where natural; ask a light follow-up question on 1–2 of them.
- If a comment shares personal mental-health struggle: do NOT advise.
  Use the caring redirect: thank them for trusting the space, gently
  point to qualified support / the lifeline number placeholder
  [REFERRAL LINE], offer nothing clinical. Mark these replies
  [SENSITIVE — Dorina must personally review before sending].
- If a comment is hostile or dismissive ("mental health is an
  excuse"): one calm, boundary-holding educational reply, no
  argument threads.
- If a comment asks for professional recommendations: point to
  qualified directories/professionals generally; never endorse a
  specific clinician.
```

## D5 — LinkedIn Profile Section Refresher

```
TASK: Refresh the following LinkedIn profile section(s):
[Headline / About / Experience entry / Featured section plan /
Banner text concept]

CURRENT TEXT: [PASTE or "empty"]
KEEP TRUE: 12+ years administrative/executive-support experience;
B.B.A. from Arab Open University – Lebanon; current professional
role [CONFIRM WITH DORINA — do not invent dates or titles];
positioning as workplace wellbeing educator & mental health literacy
advocate.

RULES: Headline formula = who she helps + with what + credibility
bridge, under 220 characters, no clinical titles. About = hook
paragraph, story bridge (admin systems → wellbeing education), what
she offers now, boundary line phrased as professionalism, call to
action. First person, warm, concrete. Deliver 2 options per section.
```

## D6 — LinkedIn Article / Newsletter Long-Form

```
TASK: Write a LinkedIn article (or newsletter edition) of
[800–1,200] words.

TOPIC: [FROM CALENDAR / e.g., "Why workload design is a wellbeing
issue — what the WHO says and what your Monday can do about it"]
GOAL: depth authority — the piece people save and send to their
manager.

STRUCTURE: strong titled hook; a real workplace scene; the concept
explained simply; the evidence (1–3 WHO-grounded facts, cited by
source name inline); the practical system (a named, repeatable
method with steps); objections handled ("my company will never
change" realism, Lebanon-aware); close with one action + question.
End matter: about-line, short disclaimer, source list from the
evidence base (full URLs), hashtags.
```

---

# PART E — INSTAGRAM PROMPTS (Month 7+ extension)

## E1 — Instagram Carousel Generator

```
TASK: Create a complete Instagram carousel.

SOURCE MATERIAL: [PASTE THE LINKEDIN POST or topic — most carousels
repurpose a proven LinkedIn post]
SLIDES: [7–10]
LANGUAGE: [EN / AR / bilingual slides (EN top, AR below)]

DELIVER:
1. SLIDE MAP — for each slide: the on-slide text VERBATIM (max 20
   words/slide; slide 1 = scroll-stopping hook; final slide =
   takeaway + follow CTA + short disclaimer line "تثقيفي فقط —
   Educational only, not therapy").
2. Per-slide visual direction in one line (feeds prompt F2).
3. CAPTION: 100–150 words expanding the idea; first line strong
   (feed preview); end with question + short disclaimer + hashtag
   block.
4. HASHTAGS: 12–15, three tiers (broad: #MentalHealthAwareness /
   mid: #WorkplaceWellbeing #BurnoutPrevention / local: #Lebanon
   #Beirut + Arabic tags e.g. #الصحة_النفسية #لبنان).
Rules: one idea per carousel; numbers on slides; no clinical
language; no invented stats.
```

## E2 — Instagram Reel Script Generator

```
TASK: Write a reel script.

TOPIC: [ONE idea, e.g., "the 3-breath reset between meetings"]
LENGTH: [20–40 seconds] STYLE: [talking to camera / text-on-screen
with b-roll / voiceover]
LANGUAGE: [EN / AR / Arabic spoken + English captions]

DELIVER:
1. HOOK (first 2 seconds, verbatim — spoken + on-screen text
   versions).
2. SCRIPT with timestamps: spoken words verbatim | on-screen text |
   shot/action suggestion (filmable with a phone at a desk).
3. CTA ending (follow for practical workplace wellbeing tools).
4. CAPTION (60–100 words) + short disclaimer + 10 hashtags.
5. COVER TEXT for the reel thumbnail (max 6 words).
Rules: one takeaway only; calm energy — no anxiety-inducing
urgency; nothing clinical; no medical claims about breathing or any
technique (say "a reset habit," not "reduces anxiety").
```

## E3 — Instagram Stories Sequence Generator

```
TASK: Create a story sequence of [3–6] frames.

PURPOSE: [choose] a) daily tip b) workshop announcement c) behind-
the-scenes of preparing a workshop (no participant faces/names
without consent) d) poll/quiz engagement e) awareness-day moment.

DELIVER per frame: on-frame text verbatim (max 15 words) | visual/
background direction | interactive sticker (poll with both answer
options written / question box prompt / slider label / link) |
what tapping forward should feel like (the narrative thread).
Rules: polls ask about habits and workdays ("Do you take a real
lunch break?"), NEVER about symptoms or conditions ("Are you
depressed?" is prohibited). Last frame: soft CTA + where the full
content lives. Announcement sequences include date/time/language
and "educational workshop" labeling.
```

## E4 — Caption & Hashtag Refresher

```
TASK: Write [N] caption variants for the finished visual described
below, plus a hashtag set.

VISUAL: [DESCRIBE or paste carousel slide map]
GOAL: [saves / shares / registrations / discussion]
LANGUAGE: [EN / AR / bilingual]
Rules: first line must work as a hook in feed preview; 60–120
words; one question; short disclaimer line; hashtags per the E1
three-tier system; no banned words.
```

## E5 — LinkedIn → Instagram Repurposing Engine

```
TASK: Repurpose the LinkedIn post below into an Instagram package.

LINKEDIN POST: [PASTE — choose posts that performed well]
PERFORMANCE NOTE: [e.g., "highest comments this month; people
responded to the 'shutdown routine' idea"]

DELIVER:
1. Recommended primary format for IG (carousel / reel / single
   graphic) with one-line reasoning.
2. The full asset via the matching prompt structure (E1 or E2).
3. A story frame (E3-style) teasing it.
4. What to CHANGE for IG audience (younger, more visual, more
   Arabic-first): tone shifts, examples swapped, hook rewritten.
5. What must NOT change: the takeaway, the boundary language, the
   disclaimer.
```

---

# PART F — GRAPHICS & DESIGN BRIEF PROMPTS

## F1 — Graphic Design Brief Generator (single asset)

```
TASK: Write a complete design brief a designer (or Dorina using a
design tool) can execute without asking questions.

ASSET: [e.g., "LinkedIn quote graphic for the Oct 10 post",
"workshop announcement square", "handout header"]
CONTENT (final approved text only — graphics are made AFTER text
approval): [PASTE EXACT TEXT]
PLATFORM + SIZE: [LinkedIn 1200×1200 / IG 1080×1350 / A4 print]

BRIEF MUST SPECIFY:
1. Purpose + the ONE thing a viewer should retain.
2. Exact text placement hierarchy (headline / body / attribution /
   disclaimer line — the disclaimer must be legible, not hidden).
3. Brand look: calm, premium, trustworthy — [PALETTE: e.g., deep
   teal + warm sand + off-white; NO red-alarm colors, no cliché
   head-with-puzzle-piece or dark-storm imagery; imagery shows
   real work life: desks, calendars, coffee, hands, plants].
4. Typography direction: clean sans-serif; Arabic text set in a
   proper Arabic typeface, never mirrored Latin; bilingual layouts
   give Arabic equal visual dignity (right-aligned, correct
   direction).
5. Logo/name placement: "Dorina Salman — [POSITIONING LINE]".
6. Accessibility: contrast ratio readable on mobile; minimum text
   size; alt-text suggestion for the post (write it).
7. File deliverables + export formats.
```

## F2 — Carousel Visual Specification

```
TASK: Convert the approved carousel slide map below into a
slide-by-slide visual spec.

SLIDE MAP: [PASTE E1 OUTPUT — approved text only]

PER SLIDE SPECIFY: layout (text position, size hierarchy) |
background treatment | icon/illustration suggestion (simple, line-
style, workplace-real; no clinical imagery — no brains, pills,
stethoscopes, therapy couches) | slide number placement |
progress/continuity device (consistent color strip or motif) |
swipe cue on slide 1.
GLOBAL: palette + fonts consistent with the brand look in F1; the
final slide includes the disclaimer line and handle; export
1080×1350 PNG.
```

## F3 — Brand Template System Brief

```
TASK: Define a reusable template system so every future graphic is
consistent and fast.

TEMPLATES NEEDED: LinkedIn text-post graphic; LinkedIn carousel
master (cover + content + closing slide); IG carousel master; IG
story master (tip + announcement variants); workshop announcement;
handout page (A4, print-safe); email header.
FOR EACH: fixed elements (logo/name position, disclaimer slot,
palette, fonts incl. Arabic typeface) vs. variable elements (text
zones, image zone); character limits per text zone (write them);
one usage rule ("never…") to prevent drift.
Also produce: a one-paragraph brand-look description Dorina can
paste into any design tool's AI generator, and a checklist the
designer runs before export (spelling incl. Arabic diacritics,
disclaimer present, contrast, correct size per platform).
```

---

# PART G — GOVERNANCE, QA, ANALYTICS & PLANNING PROMPTS

## G1 — Approval QA Reviewer (run on EVERY asset before Dorina approves)

```
TASK: You are the pre-approval quality and safety reviewer. Audit
the asset below against every rule. Be strict; your job is to catch
problems, not to be agreeable.

ASSET TYPE: [post / carousel / email / handout / landing page /
proposal]
ASSET: [PASTE FULL TEXT + description of visual if any]

RUN THIS CHECKLIST AND REPORT PASS/FAIL PER ITEM WITH THE EXACT
PROBLEM LINE QUOTED:
1. BOUNDARY: zero clinical positioning; no banned words (therapy,
   diagnose, treat, cure, patient, clinical, trauma expert…); no
   implied credentials.
2. CLAIMS: every factual claim traces to the four evidence-base
   sources; no invented statistics, testimonials, or client
   references; no outcome promises ("will reduce your anxiety").
3. SAFETY: appropriate disclaimer present for the asset length;
   referral pointer present where required (handouts, workshop
   emails, landing pages); no content that could pressure
   disclosure or resemble screening/diagnosis.
4. VOICE: matches the Voice & Style Block; hook works; one idea
   only; no engagement bait; Lebanon-appropriate.
5. MECHANICS: spelling (EN + AR), links, dates, names, hashtags,
   platform length limits, alt-text present for graphics.
6. LEGAL/ETHICS: consent confirmed for any quote/photo; no
   identifiable third-party stories; no politics.

VERDICT: APPROVE-READY / FIX-FIRST (with the fixes listed as exact
rewrites) / REJECT (with reason).
```

## G2 — Compliance Red-Team

Run monthly on a sample of published content, and on any high-stakes asset (landing page, proposal, lead magnet).

```
TASK: Act as a hostile reviewer with three hats, in sequence:
1. A licensed clinician looking for scope-of-practice violations —
   anything that could be read as therapy, diagnosis, or treatment
   advice.
2. A skeptical journalist looking for unsupported claims, invented
   authority, or misleading framing.
3. A distressed reader in crisis — trace what they would experience:
   does every path lead them to qualified help quickly and warmly?

ASSETS TO REVIEW: [PASTE 3–5 RECENT ASSETS]

For each hat: list every issue found with severity (critical /
moderate / minor), the exact quoted line, and the corrected
wording. End with a "patterns to fix at the system level" note if
the same issue appears more than once.
```

## G3 — Monthly Analytics Review

```
TASK: Analyze last month's content performance and produce decisions,
not just observations.

DATA (real numbers only; leave unknowns blank):
LINKEDIN — followers start/end: [X/Y]; posts published: [N]; per-post:
[paste table or list: topic | format | impressions | reactions |
comments | shares | profile views if known]
{Optional INSTAGRAM — same structure + saves and story replies}
BUSINESS SIGNALS — DMs/inquiries: [N + nature]; workshop leads: [N];
newsletter signups: [N]

PRODUCE:
1. Top 3 and bottom 3 posts, with a HYPOTHESIS for each (topic?
   hook? format? day? — distinguish reach problems from resonance
   problems).
2. Format scoreboard (text vs. carousel vs. photo) on
   engagement-per-impression, not raw reach.
3. Audience signal: what are comments/DMs telling us people
   actually struggle with? (aggregate themes only, no individuals)
4. THREE decisions for next month: one thing to double, one to
   change, one to drop. Justify each from the data above only.
5. KPI tracker line vs. the 12-month calendar goals: on/off track,
   and the single highest-leverage correction.
6. Feed-forward note for the D1 calendar prompt next month
   (write the exact "What performed well recently" line to paste).
```

## G4 — Repurposing Engine (content multiplication)

```
TASK: Multiply the proven asset below into a repurposing package.

SOURCE ASSET: [PASTE — a post/talk/workshop segment that performed
well] WHY IT WORKED: [one line from analytics]

DELIVER:
1. 3 NEW LinkedIn angles on the same core idea (different hook,
   different audience entry point: the overloaded admin / the team
   lead / the person working two jobs) — hooks + 2-line outlines
   each, no duplication of the original's framing.
2. 1 Instagram carousel slide map (E1 format).
3. 1 reel concept (hook + 3 beats).
4. 1 newsletter/article outline going deeper (D6 feed).
5. 1 workshop micro-moment: how this idea becomes a 5-minute
   exercise (B4 feed).
6. A "shelf date": when this idea can be reposted fresh (min. 8
   weeks) and what to update then.
Rule: the takeaway and boundary language stay identical across all
derivatives; only the doorway changes.
```

## G5 — Monthly Planning Session (the operating rhythm)

Run this once a month; it chains the other prompts together.

```
TASK: Facilitate my monthly planning session. Work through these
steps IN ORDER, waiting for my input at each step:

STEP 1 — REVIEW: Ask me for last month's analytics summary (output
of G3). Reflect back the 3 decisions made there and confirm they
shape this month.
STEP 2 — CONTEXT SCAN: Ask me for this month's realities: Lebanon
seasonal context, awareness dates in range (check: World Mental
Health Day Oct 10; other dates from the 12-month calendar),
workshops scheduled, my available hours/week, energy level (be
honest — the plan must fit real capacity; a plan I can't keep
damages authority more than a lighter one).
STEP 3 — THEME: Propose the monthly theme from the 12-month
calendar, adjusted for Steps 1–2. One theme, one sentence.
STEP 4 — CALENDAR: Generate the D1 monthly calendar using
everything above.
STEP 5 — BATCH LIST: Convert the calendar into a production
checklist: drafts needed (D2 runs), graphics needed (F1/F2 briefs),
emails needed (B6/B7), each with a suggested batch day.
STEP 6 — APPROVAL SLOTS: Propose 2 fixed weekly review slots where
Dorina approves the coming week's content (nothing publishes
without her sign-off), sized to the actual volume.
STEP 7 — ONE GROWTH ACTION: Propose exactly one non-content growth
action this month (a partnership pitch C4, an outreach batch C3, a
proposal B8) — the smallest one with the highest leverage.
Output the final plan as a single one-page summary I can pin.
```

## G6 — Awareness-Day Campaign Planner

```
TASK: Plan a focused campaign around [AWARENESS DATE, e.g., World
Mental Health Day — October 10].

KNOWN GROUNDING: World Mental Health Day is October 10 (WHO). Past
WHO campaign themes have included mental health in the workplace.
Lebanon's National Mental Health Programme has run national
workplace campaigns (e.g., "Don't miss the opportunity / ما تضيعوا
الفرصة" with partners including WHO and others).
THIS YEAR'S OFFICIAL THEME: [FILL IN ONLY IF VERIFIED — otherwise
build theme-agnostic and mark [VERIFY THEME BEFORE PUBLISHING]]

DELIVER a 2-week arc (1 week before → day → 3 days after):
1. Narrative arc in one sentence (what the audience should feel/
   know/do by the end).
2. Post-by-post plan (D1 table format): teaser, education,
   Lebanon-context piece honoring the national programme's work,
   day-of flagship post, personal-commitment post, wrap-up with
   referral resources.
3. One community action (e.g., inviting others to share one
   workplace habit — participation, never disclosure of conditions).
4. Optional workshop/webinar tie-in and its announcement copy.
5. Graphics batch list (F1 feeds).
Rules: the day honors people living with mental health conditions —
tone is dignity, not marketing; any campaign hashtags verified
before use [VERIFY]; referral resources appear in every day-of
asset.
```

---

# APPENDIX

## A. Prompt-chaining map (which prompt feeds which)

```
G5 Monthly Planning
 ├── G3 Analytics Review  (feeds Step 1)
 ├── D1 Monthly Calendar  (Step 4)
 │     └── D2 Individual Posts ──► G1 QA ──► Dorina approval ──► F1/F2 Graphics ──► G1 QA (visual) ──► Dorina approval ──► publish
 ├── B6/B7 Workshop emails (if workshops scheduled)
 └── C3/C4/B8 One growth action

Proven post ──► G4 Repurposing ──► E1/E2/E3 Instagram assets ──► G1 QA ──► approval
Quarterly: A3 Strategy Review; Monthly: G2 Red-Team sample audit.
```

## B. Non-negotiables (summary)

1. Master Context Block opens every conversation.
2. Every asset passes G1 QA before Dorina sees it; **Dorina approves everything before it publishes** — text first, then the final graphic.
3. No clinical language, no invented facts, no outcome promises — ever.
4. Disclaimers and referral blocks come verbatim from `RISK_ETHICS_AND_REFERRAL_PROTOCOL.md`; prompts reference them as `[REFERRAL BLOCK]` / `[FULL DISCLAIMER]` placeholders.
5. When information is missing, outputs say so — they never invent it.

## C. Evidence base

1. WHO — Mental health at work (fact sheet): https://www.who.int/news-room/fact-sheets/detail/mental-health-at-work
2. WHO — Mental health: strengthening our response: https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response
3. Lebanon Ministry of Public Health — National Mental Health Programme: https://www.moph.gov.lb/en/Pages/6/553/the-national-mental-health-program
4. WHO — World Mental Health Day: https://www.who.int/campaigns/world-mental-health-day

## D. What we still need from Dorina

- Confirmed current role, employer, and dates for profile prompts (D5) — the prompts refuse to invent these.
- Preferred AI assistant/tools, so wording quirks can be tuned after the first month of use.
- Preferred Arabic register (formal MSA vs. Lebanese professional) for bilingual outputs.
- Brand palette confirmation (the teal/sand proposal in F1 is a starting point, not a decision).
- Consent process confirmation for any testimonial or participant quote before C1/B7 outputs use real quotes.

---

*This library is educational and strategic material. It does not constitute medical, psychological, legal, or HR advice. All generated content must respect the boundaries defined in `RISK_ETHICS_AND_REFERRAL_PROTOCOL.md`.*
