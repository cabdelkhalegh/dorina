/* Dorina Launch Pack config. Edit values only between the markers. Data is strict JSON.
   - One place for the WhatsApp number, the site address, the offers, the sessions and the data mode.
   - Square brackets [DORINA: ...] are facts only Dorina can give; [STUDIO: ...] are technical values set at go-live.
   - bookingMode "whatsapp" (the go-live state) opens a prefilled WhatsApp message from every Reserve button; nothing is stored.
     "system" sends every Reserve button to book/. Switch to "system" only after the 30-minute acceptance session on
     Dorina's phone passes with dataMode "supabase" (runbook). "system" with "demo" never reaches a public visitor:
     on any host other than localhost, 127.0.0.1 or a file, the pages fall back to WhatsApp mode (LAUNCH.bookingMode()).
   - dataMode "demo" keeps example data in this browser only; "supabase" needs supabase.url and supabase.anonKey.
   - payment.approved and policy.approved stay false until Dorina confirms the routes and the lines; until then the
     booking pages show a [DORINA: ...] marker beside them.
   - Local preview of the full booking flow while bookingMode is "whatsapp": open book/?preview=system on localhost.
   - pictures.dorinaAiApproved stays false until Dorina approves, in writing, the illustrative pictures made from her
     portrait. While it is false the pages show her real portrait and the room pictures only, and the public copy is
     built without those picture files. pictures.dorinaAiShow starts empty and the gate fails closed: when she says
     yes, set dorinaAiApproved to true and add to dorinaAiShow only the names of the pictures she approved in writing
     (her letter A is "host", B "door", C "kit", D "portrait", E "hosted"). A picture not named there is never shown and never
     copied. Local preview of both states: add ?preview=pictures to any page on localhost, and ?preview=off to go back.
   - payment.approved false: every line that names the payment routes or the 48-hour hold is replaced on the public
     pages by a [DORINA: ...] marker (launch-pack.js, data-cfg="pay-line" and "pay-todo").
   2026-11-11: on AK's go ("B. Show proposals") the proposals are shown as they stand on the live site: area Beirut,
     timeConfirmed, payment.approved, policy.approved and priceConfirmed are true. Dorina has not approved them yet.
   Launch Pack · Al Kentawi */
window.LAUNCH_CONFIG = /*CONFIG-START*/{
  "configVersion": 1,
  "siteUrl": "https://site-address.invalid/",
  "siteUrlIsPlaceholder": true,
  "bookingMode": "whatsapp",
  "dataMode": "demo",
  "supabase": { "url": "[STUDIO: project URL]", "anonKey": "[STUDIO: publishable anon key]" },
  "waNumber": "[DORINA: WhatsApp Business number, digits only with country code, e.g. 961...]",
  "instagramHandle": "[DORINA: Instagram handle]",
  "instagramUrl": "[DORINA: Instagram profile link]",
  "linkedinUrl": "https://www.linkedin.com/in/dorina-salman-5b84a1233/",
  "supportContact": "[STUDIO: site support contact]",
  "tzPrimary": "Asia/Beirut",
  "tzSecondary": "Asia/Dubai",
  "locationBranch": "B",
  "showTodoMarkers": false,
  "showSeatsLeft": false,
  "arabicReviewed": false,
  "pictures": { "dorinaAiApproved": false, "dorinaAiShow": [] },
  "holds": { "holdHours": 48, "reminderAtHours": 40, "waitlistOfferHours": 24 },
  "payment": {
    "methods": [
      { "id": "whish", "en": "Whish", "ar": "Whish" },
      { "id": "omt", "en": "OMT", "ar": "OMT" },
      { "id": "cash", "en": "Cash, handed over before the day", "ar": "نقداً، قبل يوم اللقاء" }
    ],
    "lineEn": "Pay by Whish, OMT, or cash by arrangement before the day. Your seat is confirmed once payment is received and held for 48 hours.",
    "lineAr": "[AR: for native review]",
    "accountDetailsOnSite": false,
    "approved": true
  },
  "policy": {
    "cancelEn": "Can't make it? Tell me at least 72 hours before and your seat moves to the next circle. Inside 72 hours the seat can be passed to a friend but not refunded.",
    "moveEn": "If a circle has to move (for example because of roads, safety or power), every paid seat moves to the new date, or you can ask for a refund.",
    "approved": true
  },
  "privacyLineEn": "We collect your name, phone and (if you choose) email, only to hold your seat and reach you about it.",
  "sources": ["web","poster","flyer","story","post","ig","wa","status","card","closing","referral","connector","linkedin","team","admin"],
  "offers": [
    { "id": "next-circle-list", "nameEn": "Next Circle list + The Keep 15", "nameAr": "قائمة الدائرة القادمة", "kind": "list", "format": "none", "status": "open", "gate": null, "durationMin": null, "capacity": null, "minToRun": null, "priceUsd": 0, "pairPriceUsd": null, "priceFromUsd": null, "depositPct": null, "priceVisible": true, "priceConfirmed": true, "refPrefix": "NCL", "page": "book/?offer=next-circle-list", "bookable": true },
    { "id": "wpc-founding", "nameEn": "Women in Power Circle, founding edition", "nameAr": "دائرة قوّة للنساء، الإصدار التأسيسي", "kind": "seat", "format": "in_person", "status": "open", "gate": null, "durationMin": 180, "capacity": 15, "minToRun": 8, "priceUsd": 40, "pairPriceUsd": 75, "priceFromUsd": null, "depositPct": null, "priceVisible": true, "priceConfirmed": true, "refPrefix": "WPC", "page": "women-circle/", "bookable": true },
    { "id": "wpc-january", "nameEn": "Women in Power Circle, January edition", "nameAr": "دائرة قوّة للنساء، إصدار كانون الثاني", "kind": "seat", "format": "in_person", "status": "soon", "gate": null, "durationMin": 180, "capacity": 15, "minToRun": 8, "priceUsd": 40, "pairPriceUsd": 75, "priceFromUsd": null, "depositPct": null, "priceVisible": true, "priceConfirmed": true, "refPrefix": "WPC", "page": "women-circle/", "bookable": true },
    { "id": "wpc-online", "nameEn": "Women in Power Circle online, Gulf and diaspora evening", "nameAr": "دائرة قوّة للنساء أونلاين", "kind": "seat", "format": "online", "status": "soon", "gate": "G12", "durationMin": 90, "capacity": 16, "minToRun": 6, "priceUsd": 30, "pairPriceUsd": null, "priceFromUsd": null, "depositPct": null, "priceVisible": true, "priceConfirmed": true, "refPrefix": "WPO", "page": "women-circle/", "bookable": true },
    { "id": "hosted-circle", "nameEn": "Hosted circle", "nameAr": "دائرة مستضافة", "kind": "enquiry", "format": "hosted", "status": "enquiry", "gate": null, "durationMin": 180, "capacity": 15, "minToRun": null, "priceUsd": null, "pairPriceUsd": null, "priceFromUsd": 350, "depositPct": 50, "priceVisible": true, "priceConfirmed": true, "refPrefix": "HC", "page": "hosted/", "bookable": false },
    { "id": "private-consultation", "nameEn": "Private wellbeing consultation", "nameAr": "استشارة فردية للرفاه", "kind": "slot", "format": "in_person", "status": "gated", "gate": "G9", "durationMin": 60, "capacity": 1, "minToRun": null, "priceUsd": 60, "pairPriceUsd": null, "priceFromUsd": null, "depositPct": null, "priceVisible": false, "priceConfirmed": true, "refPrefix": "PC", "page": "consultation/", "bookable": false },
    { "id": "desk-team-session", "nameEn": "DESK Online team session", "nameAr": "DESK أونلاين: جلسة للفريق", "kind": "enquiry", "format": "team", "status": "gated", "gate": "G10", "durationMin": 90, "capacity": 25, "minToRun": null, "priceUsd": null, "pairPriceUsd": null, "priceFromUsd": 400, "depositPct": 50, "priceVisible": true, "priceConfirmed": true, "refPrefix": "DSK", "page": "hosted/teams/", "bookable": false },
    { "id": "desk-manager-session", "nameEn": "The Supportive Manager", "nameAr": "The Supportive Manager: جلسة للمديرين", "kind": "enquiry", "format": "team", "status": "gated", "gate": "G10", "durationMin": 120, "capacity": 15, "minToRun": 6, "priceUsd": null, "pairPriceUsd": null, "priceFromUsd": 550, "depositPct": 50, "priceVisible": true, "priceConfirmed": true, "refPrefix": "DSK", "page": "hosted/teams/", "bookable": false },
    { "id": "desk-half-day", "nameEn": "Workplace wellbeing at work: the DESK half day", "nameAr": "الرفاه في مكان العمل: نصف يوم DESK", "kind": "enquiry", "format": "team", "status": "gated", "gate": "G10", "durationMin": 240, "capacity": 20, "minToRun": 10, "priceUsd": null, "pairPriceUsd": null, "priceFromUsd": 900, "depositPct": 50, "priceVisible": true, "priceConfirmed": true, "refPrefix": "DSK", "page": "hosted/teams/", "bookable": false },
    { "id": "desk-team-pair", "nameEn": "DESK pair: team session + manager session", "nameAr": "ثنائي DESK: جلسة الفريق + جلسة المديرين", "kind": "enquiry", "format": "team", "status": "gated", "gate": "G10", "durationMin": null, "capacity": 25, "minToRun": null, "priceUsd": 850, "pairPriceUsd": null, "priceFromUsd": 850, "depositPct": 50, "priceVisible": true, "priceConfirmed": true, "refPrefix": "DSK", "page": "hosted/teams/", "bookable": false },
    { "id": "desk-taster", "nameEn": "DESK Taster", "nameAr": "DESK: جلسة تعريفية", "kind": "enquiry", "format": "team", "status": "gated", "gate": "G10", "durationMin": 45, "capacity": 25, "minToRun": 8, "priceUsd": 0, "pairPriceUsd": null, "priceFromUsd": 0, "depositPct": null, "priceVisible": true, "priceConfirmed": true, "refPrefix": "DSK", "page": "hosted/teams/", "bookable": false },
    { "id": "circle-four-week", "nameEn": "Four-week CIRCLE program", "nameAr": "برنامج CIRCLE لأربعة أسابيع", "kind": "later", "format": "in_person", "status": "later", "gate": null, "durationMin": 480, "capacity": 12, "minToRun": 10, "priceUsd": null, "pairPriceUsd": null, "priceFromUsd": null, "depositPct": null, "priceVisible": false, "priceConfirmed": true, "refPrefix": "CFW", "page": "women-circle/", "bookable": false }
  ],
  "sessions": [
    { "id": "wpc-founding-20261205", "offerId": "wpc-founding", "startsAt": "2026-12-05T08:00:00Z", "endsAt": "2026-12-05T11:00:00Z", "timeConfirmed": true, "areaEn": "Beirut", "areaAr": "بيروت", "online": false, "capacity": 15, "minToRun": 8, "priceUsd": 40, "pairPriceUsd": 75, "currency": "USD", "status": "open", "opensAt": "2026-11-15T07:00:00Z", "priorityUntil": null, "decisionAt": "2026-11-29T16:00:00Z", "closesAt": "2026-12-03T10:00:00Z", "fallbackDate": "2026-12-12" },
    { "id": "wpc-january-20270116", "offerId": "wpc-january", "startsAt": "2027-01-16T08:00:00Z", "endsAt": "2027-01-16T11:00:00Z", "timeConfirmed": true, "areaEn": "Beirut", "areaAr": "بيروت", "online": false, "capacity": 15, "minToRun": 8, "priceUsd": 40, "pairPriceUsd": 75, "currency": "USD", "status": "draft", "opensAt": "2026-12-14T07:00:00Z", "priorityUntil": "2026-12-16T07:00:00Z", "decisionAt": "2027-01-13T10:00:00Z", "closesAt": "2027-01-14T10:00:00Z", "fallbackDate": "2027-01-23" },
    { "id": "wpc-online-20270204", "offerId": "wpc-online", "startsAt": "2027-02-04T16:30:00Z", "endsAt": "2027-02-04T18:00:00Z", "timeConfirmed": true, "areaEn": "Online", "areaAr": "أونلاين", "online": true, "capacity": 16, "minToRun": 6, "priceUsd": 30, "pairPriceUsd": null, "currency": "USD", "status": "draft", "opensAt": "2027-01-18T07:00:00Z", "priorityUntil": null, "decisionAt": "2027-02-02T10:00:00Z", "closesAt": "2027-02-03T10:00:00Z", "fallbackDate": null }
  ]
}/*CONFIG-END*/;

/* helpers below (window.LAUNCH). Signatures are fixed: every builder relies on them. */
(function () {
  'use strict';
  var C = window.LAUNCH_CONFIG || {};
  var me = document.currentScript || (function () {
    var s = document.querySelectorAll('script[src*="launch-config.js"]');
    return s[s.length - 1] || null;
  })();
  var root;
  try { root = new URL('../', me && me.src ? me.src : location.href).href; } catch (e) { root = './'; }

  function isTodo(v) { return typeof v === 'string' && v.charAt(0) === '['; }
  function offer(id) {
    var o = C.offers || [];
    for (var i = 0; i < o.length; i++) if (o[i].id === id) return o[i];
    return null;
  }
  function session(id) {
    var s = C.sessions || [];
    for (var i = 0; i < s.length; i++) if (s[i].id === id) return s[i];
    return null;
  }
  function nextSession(offerId) {
    var now = Date.now();
    var list = (C.sessions || []).filter(function (s) {
      return (!offerId || s.offerId === offerId) && Date.parse(s.endsAt) > now;
    }).sort(function (a, b) { return Date.parse(a.startsAt) - Date.parse(b.startsAt); });
    for (var i = 0; i < list.length; i++) if (list[i].status === 'open') return list[i];
    for (var j = 0; j < list.length; j++) {
      if (list[j].status === 'draft' && list[j].opensAt && Date.parse(list[j].opensAt) > now) return list[j];
    }
    return null;
  }
  function lang() {
    try {
      var q = new URLSearchParams(location.search).get('lang');
      if (q === 'ar' || q === 'en') return q;
    } catch (e) {}
    try {
      var v = localStorage.getItem('dorinaLang');
      if (v === 'ar' || v === 'en') return v;
    } catch (e) {}
    return document.body && document.body.classList.contains('ar') ? 'ar' : 'en';
  }
  /* Applies a language to the page: body.ar, html lang/dir, saves dorinaLang, fires 'dorina:lang'. */
  function applyLang(l, silent) {
    l = l === 'ar' ? 'ar' : 'en';
    var h = document.documentElement;
    h.lang = l; h.dir = l === 'ar' ? 'rtl' : 'ltr';
    if (document.body) document.body.classList.toggle('ar', l === 'ar');
    try { localStorage.setItem('dorinaLang', l); } catch (e) {}
    var b = document.querySelectorAll('[data-placeholder-en]');
    for (var i = 0; i < b.length; i++) b[i].placeholder = b[i].getAttribute('data-placeholder-' + l) || b[i].getAttribute('data-placeholder-en');
    var opt = document.querySelectorAll('option[data-en]');
    for (var k = 0; k < opt.length; k++) opt[k].textContent = opt[k].getAttribute('data-' + l) || opt[k].getAttribute('data-en');
    if (!silent) document.dispatchEvent(new CustomEvent('dorina:lang', { detail: { lang: l } }));
    return l;
  }
  function src() {
    var v = null;
    try { v = new URLSearchParams(location.search).get('src'); } catch (e) {}
    if (v && /^[a-z0-9_-]{1,24}$/i.test(v)) {
      try { sessionStorage.setItem('dorinaSrc', v); } catch (e) {}
      return v;
    }
    try { v = sessionStorage.getItem('dorinaSrc'); } catch (e) { v = null; }
    return v || 'web';
  }
  function bookUrl(o) {
    o = o || {};
    var u = new URL('book/', root);
    var keys = ['offer', 'session', 'seats', 'src', 'lang', 'interest', 'via'];
    keys.forEach(function (k) { if (o[k] != null && o[k] !== '') u.searchParams.set(k, String(o[k])); });
    return u.href;
  }
  function waDigits() {
    var n = C.waNumber;
    if (!n || isTodo(n)) return '';
    return String(n).replace(/\D/g, '');
  }
  function waLink(text, phoneDigits) {
    var d = phoneDigits ? String(phoneDigits).replace(/\D/g, '') : waDigits();
    return 'https://wa.me/' + (d || '') + '?text=' + encodeURIComponent(text || '');
  }
  function formatDate(iso, l, opts) {
    opts = opts || {};
    var tz = opts.tz || C.tzPrimary || 'Asia/Beirut';
    var loc = (l || lang()) === 'ar' ? 'ar-LB-u-nu-latn' : 'en-GB';
    var f = { timeZone: tz, weekday: opts.short ? 'short' : 'long', day: 'numeric', month: opts.short ? 'short' : 'long' };
    if (opts.year) f.year = 'numeric';
    if (opts.withTime) { f.hour = 'numeric'; f.minute = '2-digit'; f.hour12 = true; }
    try { return new Intl.DateTimeFormat(loc, f).format(new Date(iso)); } catch (e) { return String(iso).slice(0, 10); }
  }
  function formatTime(iso, l, tz) {
    var loc = (l || lang()) === 'ar' ? 'ar-LB-u-nu-latn' : 'en-GB';
    try {
      return new Intl.DateTimeFormat(loc, { timeZone: tz || C.tzPrimary, hour: 'numeric', minute: '2-digit', hour12: true })
        .format(new Date(iso)).replace(/\s?([ap])\.?m\.?$/i, function (m, p) { return ' ' + p.toLowerCase() + 'm'; });
    } catch (e) { return ''; }
  }
  function formatDual(iso, l) {
    l = l || lang();
    var a = formatTime(iso, l, C.tzPrimary), b = formatTime(iso, l, C.tzSecondary);
    return l === 'ar' ? a + ' بيروت · ' + b + ' دبي' : a + ' Beirut · ' + b + ' Dubai';
  }
  function money(amount, currency, l) {
    if (amount == null || amount === '') return '';
    var n = Number(amount);
    var s = (Math.round(n * 100) % 100 === 0) ? String(Math.round(n)) : n.toFixed(2);
    s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (currency || 'USD') === 'USD' ? '$' + s : (currency + ' ' + s);
  }
  function offerName(o, l) {
    if (typeof o === 'string') o = offer(o);
    if (!o) return '';
    return (l || lang()) === 'ar' && o.nameAr && !isTodo(o.nameAr) ? o.nameAr : o.nameEn;
  }
  function reserveText(o, s, l) {
    l = l || lang();
    if (o && o.kind === 'list') {
      return l === 'ar'
        ? 'مرحباً دورينا، أحبّ أن أكون على قائمة الدائرة القادمة. اسمي ' // AR: for native review
        : "Hello Dorina, I'd like to join the list for the next circle. My name is ";
    }
    var d = s ? formatDate(s.startsAt, l) : '';
    var name = o ? offerName(o, l) : (l === 'ar' ? 'دائرة قوّة للنساء' : 'Women in Power Circle');
    return l === 'ar'
      ? 'مرحباً دورينا، أحبّ أن أحجز مقعداً في ' + name + (d ? ' يوم ' + d : '') + '. اسمي ' // AR: for native review
      : "Hello Dorina, I'd like a seat at the " + name + (d ? ' on ' + d : '') + '. My name is ';
  }
  /* Where the page runs: only these count as a private preview. */
  function isLocalHost() {
    try {
      if (location.protocol === 'file:') return true;
      var h = location.hostname;
      return h === 'localhost' || h === '127.0.0.1' || h === '[::1]' || h === '::1' || /\.localhost$/.test(h);
    } catch (e) { return false; }
  }
  /* True when bookings would be written to a real, shared database (not this browser). */
  function liveData() {
    var sb = C.supabase || {};
    return C.dataMode === 'supabase' && !!sb.url && !!sb.anonKey && !isTodo(sb.url) && !isTodo(sb.anonKey);
  }
  /* The booking mode the Reserve buttons actually use. A public visitor never books into demo data: "system" without
     live data falls back to "whatsapp" on any public host. On a local host, ?preview=system (or ?preview=whatsapp)
     overrides the config for this tab, for review. book/ itself also runs the full flow whenever liveData() is true,
     so the acceptance session can be run while the Reserve buttons still open WhatsApp (runbook D). */
  function bookingMode() {
    var local = isLocalHost();
    if (local) {
      try {
        var q = new URLSearchParams(location.search).get('preview');
        if (q === 'system' || q === 'whatsapp') sessionStorage.setItem('dorinaPreviewMode', q);
        var p = sessionStorage.getItem('dorinaPreviewMode');
        if (p === 'system' || p === 'whatsapp') return p;
      } catch (e) {}
    }
    if (C.bookingMode !== 'system') return 'whatsapp';
    return liveData() || local ? 'system' : 'whatsapp';
  }
  function reserveHref(o) {
    o = o || {};
    var s = o.session ? session(o.session) : null;
    var offerId = o.offer || (s && s.offerId) || 'wpc-founding';
    if (!s && offerId !== 'next-circle-list') s = nextSession(offerId);
    if (bookingMode() === 'whatsapp') return waLink(reserveText(offer(offerId), s, lang()));
    return bookUrl({ offer: offerId, session: s ? s.id : null, src: o.src || src(), seats: o.seats, interest: o.interest });
  }

  window.LAUNCH = {
    config: C, root: root,
    isTodo: isTodo, offer: offer, session: session, nextSession: nextSession,
    lang: lang, applyLang: applyLang, bookUrl: bookUrl, waLink: waLink, reserveHref: reserveHref,
    reserveText: reserveText, formatDate: formatDate, formatTime: formatTime, formatDual: formatDual,
    money: money, offerName: offerName, src: src,
    isLocalHost: isLocalHost, liveData: liveData, bookingMode: bookingMode
  };
})();
