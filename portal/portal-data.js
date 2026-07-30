/* Dorina Authority Portal — structured operating data.
   Every string here traces to the package documents in /markdown. Nothing invented. */
window.DORINA_DATA = (function () {

const phases = [
  { id: 'p0', code: 'Phase 0', name: 'Foundation', nameAr: 'التأسيس', window: 'August 2026', windowAr: 'آب ٢٠٢٦',
    objective: 'Get the facts, the boundary and the profile right before a single word is public.',
    objectiveAr: 'ضبط المعلومات والحدود المهنية والملف الشخصي قبل نشر أي محتوى.',
    exit: 'Profile live · 12 posts pre-approved · referral protocol memorised',
    exitAr: 'الملف منشور · ١٢ منشوراً معتمداً مسبقاً · بروتوكول الإحالة محفوظ',
    tasks: [
      { id: 'p0t1', kind: 'read', t: 'Read the Executive Summary end to end', doc: 'sendable-summary-for-dorina' },
      { id: 'p0t2', kind: 'read', t: 'Read the Strategic Proposal', doc: 'strategic-proposal-mental-health-authority' },
      { id: 'p0t3', kind: 'read', t: 'Read the Risk, Ethics & Referral Protocol', doc: 'risk-ethics-and-referral-protocol', gate: true },
      { id: 'p0t4', kind: 'decide', t: 'Answer the ten core brief questions', doc: 'sendable-summary-for-dorina', go: 'brief' },
      { id: 'p0t5', kind: 'decide', t: 'Choose the primary positioning title', doc: 'positioning-and-brand-architecture', sec: '2.' },
      { id: 'p0t6', kind: 'decide', t: 'Approve the DESK Method name — or choose an alternative', doc: 'positioning-and-brand-architecture', sec: '5.' },
      { id: 'p0t7', kind: 'do', t: 'Correct the profile facts: role, dates, third language', doc: 'positioning-and-brand-architecture', sec: '11.', gate: true },
      { id: 'p0t8', kind: 'do', t: 'Rewrite the LinkedIn profile from the copy-paste block', doc: 'linkedin-authority-engine', sec: '1.' },
      { id: 'p0t9', kind: 'do', t: 'Commission the headshot and profile banner' },
      { id: 'p0t10', kind: 'do', t: 'Agree the approval channel of record', doc: 'content-approval-and-automation-workflow', sec: '2.' },
      { id: 'p0t11', kind: 'do', t: 'Draft and pre-approve the first twelve posts', doc: '12-month-linkedin-content-calendar' },
      { id: 'p0t12', kind: 'do', t: 'Verify the current national helpline number before any printed material', doc: 'risk-ethics-and-referral-protocol', sec: '7.', gate: true },
      { id: 'p0t13', kind: 'do', t: 'Memorise the crisis referral wording', doc: 'risk-ethics-and-referral-protocol', sec: '7.', gate: true },
      { id: 'p0t14', kind: 'do', t: 'Confirm employer position on outside professional activity', doc: 'risk-ethics-and-referral-protocol', sec: '12.', gate: true },
      { id: 'p0t15', kind: 'do', t: 'Optional — enrol in a recognised non-clinical literacy or PFA course' }
    ] },

  { id: 'p1', code: 'Phase 1', name: 'Presence', nameAr: 'الحضور', window: 'September – November 2026', windowAr: 'أيلول – تشرين الثاني ٢٠٢٦',
    objective: 'Start publishing, start connecting, and prove the workshop works in a real room.',
    objectiveAr: 'بدء النشر وبناء الشبكة وإثبات فعالية ورشة العمل في غرفة حقيقية.',
    exit: '400+ connections · 3 testimonials · one workshop fully rehearsed and timed',
    exitAr: '٤٠٠+ اتصال · ٣ شهادات · ورشة واحدة مُتمرَّن عليها بالكامل',
    tasks: [
      { id: 'p1t1', kind: 'do', t: 'Begin the three-posts-a-week cadence', doc: 'linkedin-authority-engine', sec: '3.' },
      { id: 'p1t2', kind: 'do', t: 'Send 15–25 targeted invitations a week, each with a personal note', doc: 'linkedin-authority-engine', sec: '2.' },
      { id: 'p1t3', kind: 'decide', t: 'Build the Warm 20 reconnection list', doc: 'marketing-funnel-and-campaigns' },
      { id: 'p1t4', kind: 'decide', t: 'Build the ten-company World Mental Health Day target list', doc: 'marketing-funnel-and-campaigns' },
      { id: 'p1t5', kind: 'deliver', t: 'Run the October 10 World Mental Health Day mini-campaign', doc: '12-month-linkedin-content-calendar', sec: 'Month 2' },
      { id: 'p1t6', kind: 'do', t: 'Offer a free lunch-and-learn to three companies' },
      { id: 'p1t7', kind: 'do', t: 'Rehearse the opening and closing scripts aloud, timed', doc: 'workshop-exercises-and-handouts', sec: '2.', go: 'workshop' },
      { id: 'p1t8', kind: 'deliver', t: 'Deliver pilot workshop 1 (W0)', doc: 'workshop-system-blueprint', go: 'workshop' },
      { id: 'p1t9', kind: 'deliver', t: 'Deliver pilot workshop 2 (W0)', doc: 'workshop-system-blueprint', go: 'workshop' },
      { id: 'p1t10', kind: 'deliver', t: 'Deliver pilot workshop 3 (W0)', doc: 'workshop-system-blueprint', go: 'workshop' },
      { id: 'p1t11', kind: 'do', t: 'Collect three written testimonials and photos, with consent', doc: 'workshop-system-blueprint', sec: '8.' }
    ] },

  { id: 'p2', code: 'Phase 2', name: 'Proof', nameAr: 'البرهان', window: 'December 2026 – February 2027', windowAr: 'كانون الأول ٢٠٢٦ – شباط ٢٠٢٧',
    objective: 'Turn goodwill into invoices, and turn one good room into a repeatable product.',
    objectiveAr: 'تحويل الثقة إلى دخل، وتحويل ورشة ناجحة إلى منتج قابل للتكرار.',
    exit: '2+ paid workshops delivered · 800+ connections · 1 partnership in writing',
    exitAr: 'ورشتان مدفوعتان · ٨٠٠+ اتصال · شراكة واحدة موثّقة',
    tasks: [
      { id: 'p2t1', kind: 'do', t: 'Run the December end-of-year fatigue and rest theme', doc: '12-month-linkedin-content-calendar', sec: 'Month 4' },
      { id: 'p2t2', kind: 'do', t: 'Publish the long-form article on twelve years behind the desk', doc: '12-month-linkedin-content-calendar', sec: 'Month 4' },
      { id: 'p2t3', kind: 'deliver', t: 'Convert a pilot into the first paid booking', doc: 'marketing-funnel-and-campaigns', sec: '3.' },
      { id: 'p2t4', kind: 'decide', t: 'Lock the rate card after five sales conversations', doc: 'marketing-funnel-and-campaigns', sec: '3.' },
      { id: 'p2t5', kind: 'do', t: 'Run the January new-work-year reset campaign', doc: '12-month-linkedin-content-calendar', sec: 'Month 5' },
      { id: 'p2t6', kind: 'do', t: 'Open the first partnership conversations', doc: 'opportunity-map-lebanon', sec: '4.' },
      { id: 'p2t7', kind: 'do', t: 'Stand up the approval log and audit trail', doc: 'content-approval-and-automation-workflow', sec: '7.', go: 'pipeline' },
      { id: 'p2t8', kind: 'deliver', t: 'Deliver paid workshop 2', doc: 'workshop-system-blueprint' }
    ] },

  { id: 'p3', code: 'Phase 3', name: 'Expansion', nameAr: 'التوسّع', window: 'March – May 2027', windowAr: 'آذار – أيار ٢٠٢٧',
    objective: 'Raise the price, widen the portfolio, and add the second channel — only now.',
    objectiveAr: 'رفع السعر وتوسيع المحفظة وإضافة القناة الثانية — في هذه المرحلة فقط.',
    exit: '1,200+ connections · 6+ workshops delivered · Instagram live at two posts a week',
    exitAr: '١٢٠٠+ اتصال · ٦+ ورشات · إنستغرام بمنشورين أسبوعياً',
    tasks: [
      { id: 'p3t1', kind: 'decide', t: 'Raise workshop rates on the evidence of testimonials and demand', doc: 'marketing-funnel-and-campaigns', sec: '3.' },
      { id: 'p3t2', kind: 'deliver', t: 'Introduce the manager-focused session (W2)', doc: 'workshop-system-blueprint', sec: '2.', go: 'workshop' },
      { id: 'p3t3', kind: 'do', t: 'Confirm Ramadan dates and place the Ramadan-aware content module', doc: '12-month-linkedin-content-calendar', sec: 'Month 7' },
      { id: 'p3t4', kind: 'deliver', t: 'Speak at or co-host one partner event', doc: 'opportunity-map-lebanon', sec: '4.' },
      { id: 'p3t5', kind: 'do', t: 'Begin the consented email list from workshop attendees', doc: 'marketing-funnel-and-campaigns', sec: '9.' },
      { id: 'p3t6', kind: 'do', t: 'Launch the Instagram extension', doc: 'instagram-extension-engine', sec: '5.' }
    ] },

  { id: 'p4', code: 'Phase 4', name: 'Authority', nameAr: 'المرجعية', window: 'June – August 2027', windowAr: 'حزيران – آب ٢٠٢٧',
    objective: 'Bank the year, package the premium offer, and set the anchor for year two.',
    objectiveAr: 'تثبيت نتائج السنة، وتغليف العرض المتقدّم، وتحديد مرتكز السنة الثانية.',
    exit: '1,500+ connections · 8–12 workshops total · 3 partnerships · year-two plan approved',
    exitAr: '١٥٠٠+ اتصال · ٨–١٢ ورشة · ٣ شراكات · خطة السنة الثانية معتمدة',
    tasks: [
      { id: 'p4t1', kind: 'do', t: 'Run the summer series on rest, recovery and sustainable pace', doc: '12-month-linkedin-content-calendar', sec: 'Month 11' },
      { id: 'p4t2', kind: 'deliver', t: 'Package the half-day corporate program at premium pricing', doc: 'marketing-funnel-and-campaigns', sec: '3.' },
      { id: 'p4t3', kind: 'do', t: 'Secure the third partnership in writing', doc: 'opportunity-map-lebanon', sec: '4.' },
      { id: 'p4t4', kind: 'do', t: 'Begin planning the October 2027 World Mental Health Day campaign' },
      { id: 'p4t5', kind: 'decide', t: 'Review year-one metrics against the KPI table', doc: 'strategic-proposal-mental-health-authority', sec: '8.', go: 'progress' },
      { id: 'p4t6', kind: 'decide', t: 'Approve the year-two plan', doc: 'strategic-proposal-mental-health-authority' }
    ] }
];

const months = [
  { n: 1, m: 'September', y: '2026', short: 'Sep', title: 'The Introduction', theme: 'Who I am, why workplace wellbeing, and the quiet cost of “fine.”', goal: 'Introduce the positioning; 150+ new connections; establish voice. No selling.', pillars: ['story', 'systems', 'literacy'] },
  { n: 2, m: 'October', y: '2026', short: 'Oct', title: 'The Flagship: World Mental Health Day', theme: 'Workplace mental health literacy, anchored on October 10.', goal: 'First mini-campaign; one post shared by an HR community; open pilot-workshop offer.', pillars: ['literacy', 'story', 'culture'], flag: true },
  { n: 3, m: 'November', y: '2026', short: 'Nov', title: 'Burnout, Properly Understood', theme: 'Deep literacy month on burnout and chronic workplace stress.', goal: 'Deliver 2–3 free pilots booked in October; collect testimonials; 400+ connections.', pillars: ['literacy', 'systems'] },
  { n: 4, m: 'December', y: '2026', short: 'Dec', title: 'Ending the Year Like a Human', theme: 'End-of-year fatigue, realistic closure, rest as a system.', goal: 'Seasonal resonance; first paid bookings for January; first long-form article.', pillars: ['systems', 'story'] },
  { n: 5, m: 'January', y: '2027', short: 'Jan', title: 'The Reset, Done Right', theme: 'New work-year systems — anti-resolution, pro-structure.', goal: 'Paid workshop 1–2 delivered; 800+ connections; partnership conversations begin.', pillars: ['systems', 'literacy'] },
  { n: 6, m: 'February', y: '2027', short: 'Feb', title: 'Support Is a Skill', theme: 'The DESK “S” month — help-seeking, peer support, knowing the pathways.', goal: 'Cement the referral-responsible brand; deepen HR audience trust.', pillars: ['literacy', 'story'] },
  { n: 7, m: 'March', y: '2027', short: 'Mar', title: 'Energy, Routine, and Compassion', theme: 'Working well through changed rhythms — Ramadan-aware, confirm dates annually.', goal: 'Culturally fluent authority; highest Arabic-content month; Instagram launches.', pillars: ['story', 'systems', 'culture'], flag: true },
  { n: 8, m: 'April', y: '2027', short: 'Apr', title: 'The Manager Month', theme: 'Managers and culture, grounded in the WHO manager-training recommendation.', goal: 'Sell the manager-focused workshop; corporate inquiries 3+/month.', pillars: ['culture', 'systems'] },
  { n: 9, m: 'May', y: '2027', short: 'May', title: 'Systems in Public', theme: 'The DESK “E/K” showcase — the most practical month of the year.', goal: 'Demonstrate depth; 1,200+ connections; 6+ workshops cumulative.', pillars: ['systems', 'literacy'] },
  { n: 10, m: 'June', y: '2027', short: 'Jun', title: 'Proof and Partnerships', theme: 'Social proof season — recaps, testimonials, partner content.', goal: '3 partnerships in writing; half-day corporate package announced.', pillars: ['story', 'culture'] },
  { n: 11, m: 'July', y: '2027', short: 'Jul', title: 'Summer: Rest as Strategy', theme: 'Sustainable pace, holidays, recovery — matched to the Lebanese summer rhythm.', goal: 'Maintain consistency through the slow season; bank evergreen content.', pillars: ['systems', 'story'] },
  { n: 12, m: 'August', y: '2027', short: 'Aug', title: 'Year One, Honestly', theme: 'Reflection, results, and the road to October.', goal: 'Position the October 2027 campaign; year-two runway; 1,500+ connections closed.', pillars: ['story', 'literacy'] }
];

const pillars = {
  literacy: { label: 'Stress & burnout literacy', ar: 'الوعي بالضغط والاحتراق' },
  systems: { label: 'Systems & boundaries', ar: 'الأنظمة والحدود' },
  story: { label: 'Story & advocacy', ar: 'القصة والمناصرة' },
  culture: { label: 'Workplace culture & managers', ar: 'ثقافة العمل والمدراء' }
};

const pipeline = [
  { id: 'IDEA', label: 'Idea', who: 'Anyone', done: 'Captured with one line, a pillar tag, and a DESK stage if relevant.' },
  { id: 'BRIEFED', label: 'Briefed', who: 'Content assistant', done: 'Target date, pillar, format, key message, CTA rung, language, prompt chosen.' },
  { id: 'DRAFTED', label: 'Drafted', who: 'Content assistant', done: 'Full text in final languages, disclaimer, hashtags and CTA written.' },
  { id: 'SAFETY', label: 'Safety-checked', who: 'Safety gate', done: 'Automated check run and logged; human eye confirms no clinical language or unapproved statistics.' },
  { id: 'GATE1', label: 'Text approved', who: 'Dorina', done: 'Full final text read against the Gate 1 checklist and approved in writing.', gate: 1 },
  { id: 'DESIGNED', label: 'Designed', who: 'Designer', done: 'Visual produced from the approved text, correct dimensions, alt-text drafted.' },
  { id: 'GATE2', label: 'Visual approved', who: 'Dorina', done: 'Final graphic seen at actual size, phone-checked, approved in writing.', gate: 2 },
  { id: 'SCHEDULED', label: 'Scheduled', who: 'Content assistant', done: 'Doubly-approved item queued exactly as approved.' },
  { id: 'PUBLISHED', label: 'Published', who: 'System', done: 'Live on the platform.' },
  { id: 'MEASURED', label: 'Measured', who: 'Content assistant', done: 'Performance recorded against the KPI set.' },
  { id: 'ARCHIVED', label: 'Archived', who: 'Content assistant', done: 'Filed for the repurposing engine.' }
];

const workshops = [
  { code: 'W0', name: 'The DESK Taster', sub: 'Lunch & learn', dur: '45–60 min', fmt: 'In-person or online', size: '8–30', price: 'Free — pilot / door-opener', note: 'D in depth; E, S and K introduced as a map.' },
  { code: 'W1', name: 'Mental Health Management at Work', sub: 'The flagship', dur: 'Half day, 3.5–4 h', fmt: 'In-person preferred', size: '10–20', price: '$500–$1,200 per session', note: 'Full DESK arc. The revenue product.' },
  { code: 'W2', name: 'The Supportive Manager', sub: 'For the budget-holder', dur: '2 h', fmt: 'In-person or online', size: '6–15 managers', price: '$300–$700 per session', note: 'Awareness-level, non-clinical, matches the WHO manager-training recommendation.' },
  { code: 'W3', name: 'The Organized Calm', sub: 'For admin professionals & EAs', dur: '2.5–3 h', fmt: 'In-person or online', size: '8–20', price: '$250–$600 per session', note: 'Dorina’s own tribe — the most loyal advocates.' },
  { code: 'W4', name: 'DESK Online', sub: 'Remote teams & diaspora', dur: '90 min', fmt: 'Online live', size: '8–25', price: '$200–$500 per session', note: 'Removes geography. Needs a connectivity fallback plan.' },
  { code: 'W5', name: 'The DESK Quarterly', sub: 'Refresher retainer', dur: '60–90 min ×4/year', fmt: 'Hybrid', size: 'Existing clients', price: '$600–$1,500 per year', note: 'Converts one-off bookings into recurring revenue.' }
];

const exercises = [
  { n: '4.1', name: 'Stress Signal Map', stage: 'D — Detect' },
  { n: '4.2', name: 'Workload X-Ray', stage: 'E — Establish' },
  { n: '4.3', name: 'Boundary Scripts Lab', stage: 'E — Establish' },
  { n: '4.4', name: 'White-Space Audit', stage: 'E / K' },
  { n: '4.5', name: 'Help-Seeking Compass', stage: 'S — Support' },
  { n: '4.6', name: 'The Friday 15 Weekly Review', stage: 'K — Keep' },
  { n: '4.7', name: 'Energy Ledger', stage: 'K — Keep' },
  { n: '5.1', name: 'M1 — The Supportive Conversation', stage: 'S — Support', mgr: true },
  { n: '5.2', name: 'M2 — Team Workload Weather Report', stage: 'D / E', mgr: true }
];

const desk = [
  { k: 'D', name: 'Detect', text: 'Stress literacy: noticing early personal and team signals of overload.' },
  { k: 'E', name: 'Establish', text: 'Boundaries, routines and workload structures that protect time, energy and attention.' },
  { k: 'S', name: 'Support', text: 'Help-seeking, peer support, and the referral pathways to qualified professionals.' },
  { k: 'K', name: 'Keep', text: 'Sustaining the habits: review rhythms, relapse prevention, leisure and movement.' }
];

const governance = [
  'Educational content only; never therapy, diagnosis, treatment, crisis support, or medical, legal or HR advice.',
  'A standing disclaimer on workshops and the profile; session-level safety language in every facilitation script.',
  'Crisis situations referred immediately to emergency services and qualified professionals.',
  'No invented statistics — all data cited from the four approved sources; anything else is framed as experience or opinion.',
  'No content is published without explicit approval of both copy and graphic.',
  'Participant privacy: no photos, stories or quotes used without consent.'
];

const kpis = [
  { m: 'LinkedIn connections', d90: '400+', m6: '800+', m12: '1,500+' },
  { m: 'Followers', d90: '500+', m6: '1,200+', m12: '2,500+' },
  { m: 'Posting consistency', d90: '≥ 90%', m6: '≥ 90%', m12: '≥ 90%' },
  { m: 'Avg. engagements per post', d90: '15+', m6: '40+', m12: '80+' },
  { m: 'Workshops delivered', d90: '2–3 pilots', m6: '5–6', m12: '8–12' },
  { m: 'Written testimonials', d90: '3', m6: '6', m12: '10+' },
  { m: 'Partnerships in writing', d90: '0–1', m6: '1–2', m12: '3+' },
  { m: 'Inbound inquiries per month', d90: '1', m6: '3', m12: '6+' },
  { m: 'Email list, consented', d90: '—', m6: '50+', m12: '150+' }
];

const brief = [
  { id: 'b1', q: 'Current role', h: 'Which is current — Executive Assistant at the law firm, or Administrator at TiKiT? Exact titles and dates.' },
  { id: 'b2', q: 'Third language', h: 'Which language beyond Arabic and English, and at what level?' },
  { id: 'b3', q: 'Your “why”', h: 'A comfortable-to-share reason workplace wellbeing matters to you. Your truth beats any draft.' },
  { id: 'b4', q: 'Training appetite', h: 'Would you complete a recognised non-clinical certificate — psychological first aid or mental health awareness?' },
  { id: 'b5', q: 'Delivery language', h: 'Workshops in Arabic, English, or bilingual?' },
  { id: 'b6', q: 'Availability & format', h: 'Hours per week; in-person vs online comfort; venue access.' },
  { id: 'b7', q: 'Photography & visuals', h: 'Headshot, 2–3 workplace photos, brand colour preferences.' },
  { id: 'b8', q: 'Approval channel', h: 'WhatsApp, email, or a shared document for approving weekly drafts?' },
  { id: 'b9', q: 'Employer alignment', h: 'Does your employer know and support this? Any conflict-of-interest constraints?' },
  { id: 'b10', q: 'Budget', h: 'Roughly what can you invest monthly — design tools, scheduling, a possible certificate?' }
];

const D = (doc, items) => items.map((t, i) => ({ id: doc + '-' + i, doc: doc, t: typeof t === 'string' ? t : t.t, blocking: t.blocking }));

const decisions = [].concat(
  D('positioning-and-brand-architecture', [
    { t: 'Primary title choice (A–D) and Arabic rendering approval.', blocking: true },
    'DESK Method name approval, or an alternative choice.',
    'Her personal story beat — only what she is comfortable sharing publicly.',
    'Role and dates confirmation, third language, and preferred delivery-language mix.',
    'Brand colour and photography preferences.'
  ]),
  D('linkedin-authority-engine', [
    { t: 'Role and dates confirmation for the Experience section.', blocking: true },
    'Headline choice (A or B) and About-section approval, including the personal story beat.',
    'Headshot and banner colour approval.',
    'Preferred approval channel and day for the Friday gate.',
    'Confirmation of the third language before listing it.'
  ]),
  D('12-month-linkedin-content-calendar', [
    { t: 'Approval of Month 1 drafts before launch.', blocking: true },
    'Ramadan 2027 exact dates, confirmed when published, to place the Ramadan module.',
    'Comfort level for transparency and recap posts — numbers public, or qualitative only.',
    'Any personal dates to avoid, so the calendar plans around them.'
  ]),
  D('workshop-system-blueprint', [
    { t: 'Availability envelope, and employer policy on outside professional activity confirmed in writing.', blocking: true },
    'Facilitation baseline — prior experience, and whether rehearsal runs of W0 are wanted first.',
    'Referral shortlist — 2–3 licensed professionals or organisations comfortable to approach.',
    'First-pilot targets — 3–5 organisations in the existing network that could host a free W0.',
    'Pricing comfort — reaction to the suggested ranges, plus any real market quotes.',
    'Delivery kit status — laptop, printing, transport, and whether to budget a starter kit.',
    'Online platform preference for W4, plus home connectivity and power reliability.',
    'Arabic naming check for the workshop titles.'
  ]),
  D('workshop-exercises-and-handouts', [
    'Arabic register check — read all Arabic aloud and adjust to her natural voice.',
    { t: 'Helpline verification — replace every placeholder with the current verified number before printing.', blocking: true },
    'Her own examples — one real, non-confidential anecdote per exercise.',
    'Scenario slips for M1 — 6–8 workload-only scenarios from realistic Lebanese office life.',
    'Print preferences — paper sizes, bilingual vs separate sheets, logo and visual identity.',
    'Timing rehearsal — run the opening and closing aloud twice and report actual timings.'
  ]),
  D('marketing-funnel-and-campaigns', [
    'Business email address for the landing page, proposals and newsletter identity.',
    'The Warm 20 list — twenty real names to reconnect with in September.',
    'The ten-company World Mental Health Day target list, with the connecting thread for each.',
    { t: 'Employer conversation outcome — consent to public practice, and to approaching its client network.', blocking: true },
    'Price validation input after the first five sales conversations.',
    'Approval of all copy — landing page, both Arabic DM variants, and the newsletter name.',
    'Delivery constraints — the days and times workshops are realistically possible.',
    'Photography and design assets for the one-pager and newsletter template.'
  ]),
  D('opportunity-map-lebanon', [
    { t: 'Employer situation precisely — company, role scope, contract clauses on outside work.', blocking: true },
    'Law-firm network inventory — which firms, which people, current warmth, who is now in HR or management.',
    'AOU specifics — graduation year, campus, alumni-office contact, chapters abroad.',
    'Delivery constraints — available evenings, language comfort, reliable power and internet for W4.',
    'Geographic range within Lebanon, and any GCC contacts for the diaspora beachhead.',
    'Existing assets — references, letters, prior speaking, professional photos.',
    'Risk appetite and honest hours-per-week available for the 90-day shortlist.'
  ]),
  D('content-approval-and-automation-workflow', [
    { t: 'Approval channel of record — where a dated “Approved” lives so that it counts.', blocking: true },
    'Assistant situation — a human assistant from month one, or solo with AI assistance and hire later.',
    'Sunday slot confirmation — or a different fixed weekly window.',
    'Reachability rule for urgent inbound, and whether the assistant may send the verbatim urgent template.',
    'Brand kit for Gate 2 — final colours, fonts, logo lockup in English and Arabic, reference visuals.',
    { t: 'Helpline verification before the first sensitive or urgent template is used, with a quarterly re-check.', blocking: true },
    'Evergreen reserve seed — 3–5 non-time-sensitive topics approved early.',
    'Delegation comfort line — which routine replies the assistant may send without review.'
  ]),
  D('instagram-extension-engine', [
    'Handle preference, and confirmation that Instagram is wanted in year one at all.',
    'Comfort on camera for reels — talking-head versus text-on-screen only.',
    'Arabic register preference for captions — dialect versus Modern Standard.',
    'Consent workflow sign-off for workshop footage.'
  ]),
  D('risk-ethics-and-referral-protocol', [
    { t: 'Certificates and training — exact names, issuers and dates of anything verifiable.', blocking: true },
    { t: 'Employment status — current confirmed role and employer, so public profiles are accurate.', blocking: true },
    'Comfort line for facilitation — which topics she feels ready to facilitate now.',
    'Referral network — licensed professionals or organisations willing to receive referrals, and their consent.',
    'Language of delivery, and comfort writing formal Arabic versus Lebanese dialect.',
    'A designated support person for her own debrief after difficult sessions.',
    'Regional scope, and openness to online delivery.',
    'Insurance and legal form — individual or registered activity; professional liability review.'
  ]),
  D('premium-prompt-library', [
    'Confirmed current role, employer and dates for the profile prompts.',
    'Preferred AI assistant and tools, so wording can be tuned after the first month.',
    'Preferred Arabic register for bilingual outputs.',
    'Brand palette confirmation — the current proposal is a starting point, not a decision.',
    'Consent process confirmation before any testimonial or participant quote is used.'
  ])
);

const sources = [
  { t: 'WHO — Mental health at work', u: 'https://www.who.int/news-room/fact-sheets/detail/mental-health-at-work' },
  { t: 'WHO — Mental health: strengthening our response', u: 'https://www.who.int/news-room/fact-sheets/detail/mental-health-strengthening-our-response' },
  { t: 'Lebanon MoPH — National Mental Health Programme', u: 'https://www.moph.gov.lb/en/Pages/6/553/the-national-mental-health-program' },
  { t: 'WHO — World Mental Health Day', u: 'https://www.who.int/campaigns/world-mental-health-day' }
];

const weekly = [
  { day: 'Sunday', dayAr: 'الأحد', len: '60–90 min', t: 'The batch session', d: 'Read the week’s drafts, run Gate 1 on text and Gate 2 on visuals, log a dated approval for each.' },
  { day: 'Monday', dayAr: 'الاثنين', len: '20 min', t: 'Post + engage', d: 'Publish the Monday post. Reply to every comment within the day.' },
  { day: 'Wednesday', dayAr: 'الأربعاء', len: '20 min', t: 'Post + connect', d: 'Publish the Wednesday post. Send this week’s targeted invitations with personal notes.' },
  { day: 'Friday', dayAr: 'الجمعة', len: '30 min', t: 'Post + review', d: 'Publish the Friday post. Record the week’s numbers. Note what to repeat.' }
];

const i18n = {
  en: {
    brand: 'Dorina Salman', kicker: 'Mental Health Management Authority System · Lebanon',
    nav_map: 'The Map', nav_library: 'Library', nav_decisions: 'Decisions', nav_pipeline: 'Approvals',
    nav_calendar: 'Calendar', nav_workshop: 'Workshop mode', nav_guardrails: 'Guardrails', nav_progress: 'Progress',
    search: 'Search the package', journey: 'Journey', timeline: 'Timeline', thisweek: 'This week',
    complete: 'complete', tasks: 'tasks', exit: 'Exit criteria', open: 'Open', read: 'Read', mins: 'min read',
    next: 'Your next three actions', started: 'Start here', done: 'Done', notdone: 'Not yet',
    answered: 'answered', blocking: 'Blocking', export: 'Export progress', import: 'Import progress',
    resume: 'Resume where you left off', lang: 'العربية'
  },
  ar: {
    brand: 'دورينا سلمان', kicker: 'نظام المرجعية في إدارة الصحة النفسية · لبنان',
    nav_map: 'الخريطة', nav_library: 'المكتبة', nav_decisions: 'القرارات', nav_pipeline: 'الموافقات',
    nav_calendar: 'الروزنامة', nav_workshop: 'وضع الورشة', nav_guardrails: 'الضوابط', nav_progress: 'التقدّم',
    search: 'ابحث في الحزمة', journey: 'المسار', timeline: 'الجدول الزمني', thisweek: 'هذا الأسبوع',
    complete: 'مكتمل', tasks: 'مهمة', exit: 'معايير الانتقال', open: 'افتح', read: 'اقرأ', mins: 'دقيقة قراءة',
    next: 'خطواتك الثلاث التالية', started: 'ابدأ هنا', done: 'منجز', notdone: 'قيد الإنجاز',
    answered: 'مُجاب', blocking: 'حاجب', export: 'تصدير التقدّم', import: 'استيراد التقدّم',
    resume: 'تابع من حيث توقّفت', lang: 'English'
  }
};

return { phases, months, pillars, pipeline, workshops, exercises, desk, governance, kpis, brief, decisions, sources, weekly, i18n };
})();
try { window.dispatchEvent(new Event('dorina-data-ready')); } catch (e) {}
