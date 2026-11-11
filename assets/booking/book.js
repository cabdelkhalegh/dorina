/* Dorina Launch Pack · book/: reserve a seat in three steps, under a minute, on a phone.
   Talks only to window.LaunchBooking. Every Arabic string here is for native review (G11).
   Launch Pack · Al Kentawi */
(function () {
  'use strict';
  var L = window.LAUNCH, C = window.BookingCore, B = window.LaunchBooking;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var vp = $('#bk-viewport'), live = $('#bk-live');
  if (!vp) return;
  if (!L || !C || !B) { return; } // the static fallback in the markup stays visible
  var CFG = L.config;
  /* The mode this page runs in. Live data: the full flow (also while the Reserve buttons still open WhatsApp, for the
     acceptance session). No live data: the full flow only on a local preview that asks for it; a public visitor always
     gets the WhatsApp card, so no real booking is ever kept only in her own browser. */
  var MODE = L.liveData && L.liveData() ? 'system' : (L.bookingMode ? L.bookingMode() : (CFG.bookingMode === 'system' ? 'system' : 'whatsapp'));
  var LOCAL = !!(L.isLocalHost && L.isLocalHost());
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lang = L.applyLang(L.lang(), true);
  if (!CFG.showTodoMarkers) document.body.classList.add('bk-no-todo');

  /* ---------- words ---------- */
  var T = {
    step: { en: 'Step {n} of 3', ar: 'الخطوة {n} من 3' }, // AR: for native review
    s1h: { en: 'Choose your circle', ar: 'اختاري دائرتك' },
    s1sub: { en: 'Only dates Dorina has opened are shown.', ar: 'بيظهر بس التواريخ يلّي فتحتها دورينا.' },
    who: { en: 'Who is coming?', ar: 'مين جايي؟' },
    justMe: { en: 'Just me', ar: 'أنا بس' },
    twoFriends: { en: 'Two friends', ar: 'صديقتين' },
    guest: { en: "Your friend's first name", ar: 'الاسم الأول لصديقتك' },
    guestHint: { en: 'So Dorina can greet her by name. Nothing else is asked about her.', ar: 'لتسلّم عليها دورينا باسمها. ما بنطلب شي تاني عنها.' },
    cont: { en: 'Continue', ar: 'كمّلي' },
    back: { en: 'Back', ar: 'رجوع' },
    s2h: { en: 'Your details', ar: 'معلوماتك' },
    s2sub: { en: 'Dorina confirms your seat on WhatsApp.', ar: 'دورينا بتأكّدلك المقعد على واتساب.' },
    name: { en: 'Your name', ar: 'اسمك' },
    phone: { en: 'WhatsApp number', ar: 'رقم الواتساب' },
    phoneHint: { en: 'Lebanese numbers can be typed as 03 xxx xxx or 70 xxx xxx. Other countries: start with + and the code.', ar: 'الأرقام اللبنانية فيكِ تكتبيها 03 xxx xxx أو 70 xxx xxx. البلدان التانية: ابدئي بـ + والرمز.' },
    reach: { en: "We'll reach you on", ar: 'منتواصل معك على' },
    verify: { en: 'This looks unusual for a Lebanese number. Check it; you can still continue.', ar: 'الرقم شكله غريب لرقم لبناني. تأكّدي منه، وفيكِ تكمّلي.' },
    email: { en: 'Email', ar: 'الإيميل' },
    optional: { en: '(optional)', ar: '(اختياري)' },
    whoTold: { en: 'Who told you about this?', ar: 'مين خبّرك عن الدائرة؟' },
    choose: { en: 'Choose (optional)', ar: 'اختاري (اختياري)' },
    wt: { friend: { en: 'A friend', ar: 'صديقة' }, instagram: { en: 'Instagram', ar: 'إنستغرام' }, whatsapp: { en: 'WhatsApp', ar: 'واتساب' },
      linkedin: { en: 'LinkedIn', ar: 'لينكدإن' }, poster: { en: 'A poster', ar: 'ملصق' }, other: { en: 'Other', ar: 'غير ذلك' } },
    privacy: { en: CFG.privacyLineEn, ar: 'منجمع اسمك ورقمك و(إذا حبّيتي) إيميلك، بس لنحجزلك المقعد ونتواصل معك بخصوصه.' },
    privacyLink: { en: 'Privacy notice', ar: 'إشعار الخصوصية' },
    s3h: { en: 'Check and reserve', ar: 'راجعي واحجزي' },
    s3sub: { en: 'Nothing to pay now. Your seat is held for {h} hours.', ar: 'ما في شي تدفعيه هلّق. مقعدك محجوز {h} ساعة.' },
    s3subWait: { en: 'This circle is full right now. You can join the waitlist: nothing to pay.', ar: 'الدائرة مليانة حالياً. فيكِ تنضمّي للائحة الانتظار، وما في شي تدفعيه.' },
    circle: { en: 'Circle', ar: 'الدائرة' }, when: { en: 'When', ar: 'الموعد' }, where: { en: 'Where', ar: 'المكان' },
    seats: { en: 'Seats', ar: 'المقاعد' }, you: { en: 'You', ar: 'إنتِ' }, amount: { en: 'Amount', ar: 'المبلغ' },
    oneSeat: { en: '1 seat', ar: 'مقعد واحد' }, twoSeats: { en: '2 seats, with {g}', ar: 'مقعدين، مع {g}' }, twoSeatsNoName: { en: '2 seats', ar: 'مقعدين' },
    howPay: { en: 'How to pay', ar: 'طريقة الدفع' },
    payLine: { en: CFG.payment.lineEn, ar: 'الدفع عبر Whish أو OMT أو نقداً بالاتفاق قبل اليوم. بيتأكّد مقعدك أول ما توصل الدفعة، ومحجوز 48 ساعة.' },
    noNumbers: { en: 'Dorina sends the payment details herself on WhatsApp. No account number is ever on this site.', ar: 'دورينا بتبعتلك تفاصيل الدفع بنفسها على واتساب. ما في أي رقم حساب على هالموقع.' },
    policyT: { en: 'If you cannot make it', ar: 'إذا ما قدرتي تجي' },
    reserve: { en: 'Reserve my seat', ar: 'احجزي مقعدي' },
    joinWait: { en: 'Join the waitlist', ar: 'انضمّي للائحة الانتظار' },
    doneH: { en: 'Your seat is held', ar: 'مقعدك محجوز' },
    doneSub: { en: 'One last tap: send Dorina the message below so she can confirm and share how to pay.', ar: 'كبسة أخيرة: ابعتي لدورينا الرسالة لتأكّدلك وتبعتلك طريقة الدفع.' },
    ref: { en: 'Reference', ar: 'رقم الحجز' },
    heldUntil: { en: 'Held until', ar: 'محجوز لغاية' },
    sendWa: { en: 'Send on WhatsApp', ar: 'ابعتي على واتساب' },
    addCal: { en: 'Add to Google Calendar', ar: 'ضيفي عالروزنامة' },
    toCircle: { en: 'Back to the circle page', ar: 'رجوع لصفحة الدائرة' },
    waitH: { en: "You're on the waitlist", ar: 'إنتِ على لائحة الانتظار' },
    // mirrors launch-pack/02-guides/scripts.json S10 (wording owner: guides)
    s10: { en: "Thank you, {name}. The circle on {date} is full right now, so you're on the waitlist (reference {ref}). If a seat opens, I'll message you first and hold it for you for 24 hours. Nothing to pay until then.",
      ar: 'شكراً {name}. دائرة {date} مليانة حالياً، فإنتِ على لائحة الانتظار (رقم الحجز {ref}). إذا فضي مقعد، بخبّرك إنتِ أوّل وحدة وبحجزلك ياه 24 ساعة. ما في شي تدفعيه لهلّق.' },
    position: { en: 'Your place on the waitlist', ar: 'دورك على اللائحة' },
    already: { en: 'You already have a place on this circle', ar: 'عندك مكان بهالدائرة من قبل' },
    alreadySub: { en: 'This number is already booked for this date (reference {ref}). Message Dorina if anything changed.', ar: 'هالرقم محجوز لهالموعد من قبل (رقم الحجز {ref}). راسلي دورينا إذا تغيّر شي.' },
    listH: { en: 'Join the Next Circle list', ar: 'انضمّي لقائمة الدائرة الجاية' },
    listSub: { en: 'One short message every Friday (The Keep 15) and the next dates before anyone else. Reply "stop" any time to leave.', ar: 'رسالة قصيرة كل جمعة (The Keep 15) والتواريخ الجاية قبل الكل. ردّي «توقّف» بأي وقت لتطلعي.' },
    listBtn: { en: 'Join the list', ar: 'انضمّي للقائمة' },
    listDoneH: { en: "You're on the list", ar: 'صرتي عالقائمة' },
    listDoneSub: { en: 'Save Dorina\'s number so the Friday messages reach you. The next dates come to you first.', ar: 'احفظي رقم دورينا لتوصلك رسائل الجمعة. التواريخ الجاية بتوصلك أوّل.' },
    listAlready: { en: 'You were already on the list. Nothing else to do.', ar: 'كنتي عالقائمة من قبل. ما في شي تاني.' },
    sayHello: { en: 'Say hello on WhatsApp', ar: 'سلّمي على واتساب' },
    soonH: { en: 'Seats open soon', ar: 'المقاعد بتفتح قريباً' },
    soonSub: { en: 'Seats for {date} open {opens}.', ar: 'مقاعد {date} بتفتح {opens}.' },
    prioritySub: { en: 'Alumni and the waitlist book first for 48 hours.', ar: 'المشاركات السابقات ولائحة الانتظار بيحجزوا أوّل لمدة 48 ساعة.' },
    soonList: { en: 'Leave your name and number: you will get a message the moment they open.', ar: 'اتركي اسمك ورقمك: بتوصلك رسالة أوّل ما يفتحوا.' },
    gatedH: { en: 'Not open yet', ar: 'مش مفتوح بعد' },
    gatedSub: { en: "Not open yet. Join the list and you'll hear first.", ar: 'مش مفتوح بعد. انضمّي للقائمة وبتعرفي أوّل وحدة.' },
    enquiryH: { en: 'This one starts with a conversation', ar: 'هيدا بيبلّش بحديث' },
    enquirySub: { en: 'Hosted circles are arranged with the host. Send a short enquiry and Dorina replies on WhatsApp.', ar: 'الدوائر المستضافة بتتنظّم مع الجهة المضيفة. ابعتي استفسار قصير وبتردّ دورينا على واتساب.' },
    enquiryBtn: { en: 'Send an enquiry', ar: 'ابعتي استفسار' },
    noneH: { en: 'No dates open right now', ar: 'ما في مواعيد مفتوحة هلّق' },
    noneSub: { en: 'The next circle is being planned. Join the list and the date reaches you first.', ar: 'الدائرة الجاية عم تتحضّر. انضمّي للقائمة وبيوصلك الموعد أوّل.' },
    waH: { en: 'Reserve on WhatsApp', ar: 'احجزي على واتساب' },
    waSub: { en: 'Tap below: a message to Dorina opens with the date filled in. Add your name and send. She replies with how to pay and holds your seat for 48 hours.', ar: 'كبسي تحت: بتفتح رسالة لدورينا فيها الموعد. زيدي اسمك وابعتي. بتردّ عليكِ بطريقة الدفع وبتحجزلك المقعد 48 ساعة.' },
    waBtn: { en: 'Open WhatsApp', ar: 'افتحي واتساب' },
    waNothing: { en: 'Nothing is saved on this site: your message goes straight to Dorina.', ar: 'ما في شي بينحفظ عهالموقع: رسالتك بتروح مباشرة لدورينا.' },
    previewFlow: { en: 'Local preview only: see the booking-system flow', ar: 'معاينة محلية فقط: شوفي مسار نظام الحجز' },
    full: { en: 'Full: join the waitlist', ar: 'مليانة: لائحة الانتظار' },
    open: { en: 'Open', ar: 'مفتوحة' }, soon: { en: 'Soon', ar: 'قريباً' }, example: { en: 'Example', ar: 'مثال' }, online: { en: 'Online', ar: 'أونلاين' },
    left: { en: '{n} seats left', ar: 'باقي {n} مقاعد' },
    a_seat: { en: 'a seat', ar: 'للمقعد' }, for_two: { en: 'for two friends', ar: 'لصديقتين' },
    timeTbc: { en: 'time to confirm', ar: 'الوقت للتأكيد' },
    beirut: { en: 'Beirut time', ar: 'بتوقيت بيروت' },
    e: {
      bad_name: { en: 'Please write your name (at least two letters).', ar: 'اكتبي اسمك (حرفين عالأقل).' },
      bad_phone: { en: 'This number does not look complete. Check the digits and the country code.', ar: 'الرقم مش كامل. تأكّدي من الأرقام ومن رمز البلد.' },
      bad_guest: { en: "Please add your friend's first name.", ar: 'زيدي الاسم الأول لصديقتك.' },
      session_closed: { en: 'Bookings for this date have just closed. Join the list for the next one.', ar: 'الحجز لهالموعد سكّر هلّق. انضمّي للقائمة للموعد الجاي.' },
      not_open_yet: { en: 'Seats for this date are not open yet.', ar: 'مقاعد هالموعد مش مفتوحة بعد.' },
      priority_window: { en: 'Alumni and the waitlist book first until {until}. Join the list and you get a message the moment it opens to everyone.', ar: 'المشاركات السابقات ولائحة الانتظار بيحجزوا أوّل لغاية {until}. انضمّي للقائمة وبتوصلك رسالة أوّل ما يفتح للكل.' },
      rate_limited: { en: 'Too many tries from this number. Wait a few minutes, or message Dorina on WhatsApp.', ar: 'محاولات كتير من هالرقم. استنّي كم دقيقة، أو راسلي دورينا على واتساب.' },
      network: { en: 'The connection dropped and nothing was saved. Try again, or reserve on WhatsApp.', ar: 'انقطع الاتصال وما انحفظ شي. جرّبي مرّة تانية، أو احجزي على واتساب.' }
    },
    joinInstead: { en: 'Join the list instead', ar: 'انضمّي للقائمة بدالها' },
    tryWa: { en: 'Reserve on WhatsApp', ar: 'احجزي على واتساب' }
  };
  function t(k, vars) {
    var o = typeof k === 'string' ? k.split('.').reduce(function (a, p) { return a && a[p]; }, T) : k;
    var s = o ? (o[lang] || o.en) : k;
    if (vars) s = s.replace(/\{(\w+)\}/g, function (m, v) { return vars[v] != null ? vars[v] : m; });
    return s;
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function bdi(s) { return '<bdi dir="ltr">' + esc(s) + '</bdi>'; }
  /* Payment routes and the hold line are Dorina's to confirm (payment.approved); until then they carry a marker. */
  function payTodo() { return CFG.payment && CFG.payment.approved ? '' : ' <mark class="bk-todo" data-todo="payment">[DORINA: confirm the payment routes and this line]</mark>'; }
  function todo(s) { return L.isTodo(s) ? '<mark class="bk-todo" data-todo="area">[DORINA: area]</mark>' : esc(s); }

  /* ---------- state from the URL ---------- */
  var qs = new URLSearchParams(location.search);
  var S = {
    offerId: qs.get('offer'), sessionId: qs.get('session'), seats: qs.get('seats') === '2' ? 2 : 1, interest: qs.get('interest'),
    via: /^[A-Z]{2,4}-[23456789A-Z]{4}$/.test(qs.get('via') || '') ? qs.get('via') : null,
    src: L.src(), step: 0, sessions: [], session: null, name: '', phone: '', email: '', guestName: '', whoTold: '', view: null, result: null, error: null
  };
  if (S.offerId && !L.offer(S.offerId)) S.offerId = null;

  /* ---------- formatting ---------- */
  function sessionOffer(s) { return L.offer(s.offerId) || {}; }
  function dateLine(s) { return L.formatDate(s.startsAt, lang); }
  function tbdi(s) { return lang === 'ar' ? '<bdi>' + esc(s) + '</bdi>' : bdi(s); } // Arabic times carry ص/م: isolate, do not force LTR
  function timeLine(s) {
    var tm = s.online
      ? tbdi(L.formatTime(s.startsAt, lang, CFG.tzPrimary)) + (lang === 'ar' ? ' بيروت · ' : ' Beirut · ') + tbdi(L.formatTime(s.startsAt, lang, CFG.tzSecondary)) + (lang === 'ar' ? ' دبي' : ' Dubai')
      : tbdi(L.formatTime(s.startsAt, lang)) + ' – ' + tbdi(L.formatTime(s.endsAt, lang)) + ' · ' + t('beirut');
    return s.timeConfirmed === false ? '<mark class="bk-todo" data-todo="time">' + tm + ' (' + t('timeTbc') + ')</mark>' : tm;
  }
  function areaLine(s) { return s.online ? t('online') : todo(lang === 'ar' && s.areaAr && !L.isTodo(s.areaAr) ? s.areaAr : s.areaEn); }
  function priceLine(s) {
    var one = C.priceFor(s, sessionOffer(s), 1), two = C.priceFor(s, sessionOffer(s), 2);
    var out = bdi(L.money(one.amount, one.currency, lang)) + ' ' + t('a_seat');
    if (hasPair(s)) out += ' · ' + bdi(L.money(two.amount, two.currency, lang)) + ' ' + t('for_two');
    return out;
  }
  function hasPair(s) { var o = sessionOffer(s); return (s.pairPriceUsd != null || s.pairPriceLocal != null || o.pairPriceUsd != null) && !s.online; }
  function amountNow() { var p = C.priceFor(S.session, sessionOffer(S.session), S.seats); return L.money(p.amount, p.currency, lang); }
  function nameOf(s) { return L.offerName(sessionOffer(s), lang); }
  function waIcon() { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5 0a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3a.5.5 0 0 0 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.7a2.7 2.7 0 0 0 1.7-1.2 2.2 2.2 0 0 0 .2-1.2c-.1-.1-.3-.2-.5-.3Z"/></svg>'; }
  function spin() { return '<i class="bk-spin" aria-hidden="true"></i>'; }

  /* ---------- the view engine: direction-aware slides, height that follows ---------- */
  var current = null;
  function show(html, opts) {
    opts = opts || {};
    var dir = opts.dir || 'fwd';
    var from = vp.offsetHeight;
    var el = document.createElement('div');
    el.className = 'bk-step' + (opts.cls ? ' ' + opts.cls : '');
    el.innerHTML = html;
    Array.prototype.forEach.call(el.children, function (c, i) { c.style.setProperty('--i', Math.min(i, 6)); });
    vp.innerHTML = '';
    vp.appendChild(el);
    current = el;
    if (opts.animate !== false) {
      el.classList.add(dir === 'back' ? 'is-in-back' : 'is-in-fwd');
      if (!reduce && from) {
        var to = el.offsetHeight;
        vp.style.height = from + 'px';
        void vp.offsetHeight;
        vp.style.height = to + 'px';
        setTimeout(function () { vp.style.height = ''; }, 380);
      }
    }
    var h = el.querySelector('.bk-step__h');
    if (h && opts.focus !== false) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    if (opts.say) live.textContent = opts.say;
    if (opts.scroll !== false && opts.dir) {
      var top = $('#bk-card').getBoundingClientRect().top;
      if (top < 0 || top > innerHeight * .6) window.scrollTo({ top: scrollY + top - 80, behavior: reduce ? 'auto' : 'smooth' });
    }
    return el;
  }
  function progress(n, hide) {
    var w = $('#bk-progress-wrap'); if (w) w.hidden = !!hide;
    for (var i = 1; i <= 3; i++) {
      var d = $('[data-dot="' + i + '"]');
      if (d) { d.classList.toggle('is-on', i <= n); d.classList.toggle('is-done', i < n || n === 4); }
      var b = $('[data-bar="' + i + '"]'); if (b) b.classList.toggle('is-on', i < n);
    }
  }
  /* Full hero on the first screen of a flow; a compact one (kicker, stepper, smaller heading) once she is inside it. */
  var heroEl0 = $('.bk-hero');
  function compact(on) {
    if (!heroEl0 || heroEl0.classList.contains('is-compact') === !!on) return;
    heroEl0.classList.toggle('is-compact', !!on);
    if (reduce) return;
    heroEl0.classList.remove('is-shifting'); void heroEl0.offsetWidth; heroEl0.classList.add('is-shifting');
  }
  function hero(a, b, lead, eyebrow) {
    function set(id, en, ar) { var el = $(id); if (el && en) el.innerHTML = '<span data-en>' + esc(en) + '</span><span data-ar data-ar-new>' + esc(ar || en) + '</span>'; }
    set('#bk-h1a', a && a.en, a && a.ar); set('#bk-h1b', b && b.en, b && b.ar);
    if (lead) set('#bk-lead', lead.en, lead.ar);
    if (eyebrow) set('#bk-eyebrow', eyebrow.en, eyebrow.ar);
  }

  /* ---------- step 1: the session and who is coming ---------- */
  function step1(dir) {
    S.step = 1; S.view = 'book'; progress(1); compact(false);
    var list = S.sessions.filter(function (s) { return s.state === 'open' || s.state === 'full'; });
    var html = '<p class="bk-kicker">' + t('step', { n: 1 }) + '</p><h2 class="bk-step__h">' + t('s1h') + '</h2>' +
      '<p class="bk-step__sub">' + t('s1sub') + '</p><fieldset class="bk-tickets"><legend class="bk-sr">' + t('s1h') + '</legend>';
    list.forEach(function (s) {
      var chips = '';
      if (s.state === 'full') chips += '<span class="bk-chip bk-chip--full">' + t('full') + '</span>';
      else if (CFG.showSeatsLeft && s.seatsLeft != null) chips += '<span class="bk-chip">' + t('left', { n: bdi(s.seatsLeft) }) + '</span>';
      if (s.online) chips += '<span class="bk-chip bk-chip--online">' + t('online') + '</span>';
      if (s.example) chips += '<span class="bk-chip bk-chip--example">' + t('example') + '</span>';
      html += '<label class="bk-ticket"><input type="radio" name="session" value="' + esc(s.id) + '"' + (S.session && S.session.id === s.id ? ' checked' : '') + '>' +
        '<span class="bk-ticket__tick" aria-hidden="true"></span>' +
        '<span class="bk-ticket__date">' + esc(dateLine(s)) + '</span>' +
        '<span class="bk-ticket__meta">' + esc(nameOf(s)) + '</span>' +
        '<span class="bk-ticket__meta">' + timeLine(s) + ' · ' + areaLine(s) + '</span>' +
        '<span class="bk-ticket__price">' + priceLine(s) + '</span>' +
        (chips ? '<span class="bk-ticket__chips">' + chips + '</span>' : '') + '</label>';
    });
    html += '</fieldset><div id="bk-who"></div><p class="bk-err" id="bk-e1" aria-live="polite"></p>' +
      '<div class="bk-actions bk-actions--single bk-actions--dock"><button class="bk-btn bk-btn--primary bk-btn--block" type="button" id="bk-next1">' + t('cont') + '</button></div>';
    var el = show(html, { dir: dir, say: t('step', { n: 1 }) + ': ' + t('s1h'), focus: !!dir, scroll: !!dir });
    function who() {
      var box = $('#bk-who', el);
      if (!S.session || !hasPair(S.session)) { box.innerHTML = ''; S.seats = 1; return; }
      var one = C.priceFor(S.session, sessionOffer(S.session), 1), two = C.priceFor(S.session, sessionOffer(S.session), 2);
      box.innerHTML = '<fieldset class="bk-seg"><legend>' + t('who') + '</legend>' +
        '<label><input type="radio" name="seats" value="1"' + (S.seats === 1 ? ' checked' : '') + '><b>' + t('justMe') + '</b><small>' + bdi(L.money(one.amount, one.currency, lang)) + '</small></label>' +
        '<label><input type="radio" name="seats" value="2"' + (S.seats === 2 ? ' checked' : '') + '><b>' + t('twoFriends') + '</b><small>' + bdi(L.money(two.amount, two.currency, lang)) + '</small></label></fieldset>' +
        '<div class="bk-reveal-guest' + (S.seats === 2 ? ' is-open' : '') + '"><div><label class="bk-field"><span>' + t('guest') + '</span>' +
        '<input class="bk-input" id="bk-guest" autocomplete="off" maxlength="40" value="' + esc(S.guestName) + '"><span class="bk-small">' + t('guestHint') + '</span></label></div></div>';
      box.querySelectorAll('input[name=seats]').forEach(function (r) {
        r.addEventListener('change', function () {
          S.seats = Number(r.value);
          box.querySelector('.bk-reveal-guest').classList.toggle('is-open', S.seats === 2);
          if (S.seats === 2) setTimeout(function () { var g = $('#bk-guest'); if (g) g.focus({ preventScroll: true }); }, 200);
        });
      });
      var g = $('#bk-guest', box); if (g) g.addEventListener('input', function () { S.guestName = g.value; });
    }
    el.querySelectorAll('input[name=session]').forEach(function (r) {
      r.addEventListener('change', function () { S.session = byId(r.value); who(); });
    });
    if (!S.session && list.length) { // preselect the soonest real open date (or the only one) so the choice and Continue share the first screen
      var pre = list.filter(function (x) { return x.state === 'open' && !x.example; })[0] || (list.length === 1 ? list[0] : null);
      if (pre) { S.session = pre; var inp = el.querySelector('input[name=session][value="' + pre.id + '"]'); if (inp) inp.checked = true; }
    }
    who();
    $('#bk-next1', el).addEventListener('click', function () {
      var e = $('#bk-e1', el);
      if (!S.session) { e.textContent = lang === 'ar' ? 'اختاري موعد.' : 'Choose a date first.'; return; } // AR: for native review
      if (S.seats === 2 && !C.cleanName(S.guestName)) { e.textContent = t('e.bad_guest'); var g = $('#bk-guest'); if (g) { g.setAttribute('aria-invalid', 'true'); g.focus(); } return; }
      step2('fwd');
    });
  }
  function byId(id) { return S.sessions.filter(function (s) { return s.id === id; })[0] || null; }

  /* ---------- step 2: name, phone (shown back normalised), optional email and who told ---------- */
  function step2(dir) {
    S.step = 2; progress(2); compact(true);
    var opts = '<option value="">' + t('choose') + '</option>';
    ['friend', 'instagram', 'whatsapp', 'linkedin', 'poster', 'other'].forEach(function (k) {
      opts += '<option value="' + k + '"' + (S.whoTold === k ? ' selected' : '') + '>' + t('wt.' + k) + '</option>';
    });
    var html = '<p class="bk-kicker">' + t('step', { n: 2 }) + '</p><h2 class="bk-step__h">' + t('s2h') + '</h2><p class="bk-step__sub">' + t('s2sub') + '</p>' +
      '<form id="bk-f2" novalidate>' +
      '<label class="bk-field"><span>' + t('name') + '</span><input class="bk-input" id="bk-name" name="name" autocomplete="name" maxlength="80" required value="' + esc(S.name) + '"><span class="bk-err" id="bk-ename"></span></label>' +
      '<label class="bk-field"><span>' + t('phone') + '</span><input class="bk-input" id="bk-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="24" required value="' + esc(S.phone) + '" aria-describedby="bk-echo bk-phint">' +
      '<span class="bk-echo" id="bk-echo" aria-live="polite"></span><span class="bk-small" id="bk-phint">' + t('phoneHint') + '</span><span class="bk-err" id="bk-ephone"></span></label>' +
      '<label class="bk-field"><span>' + t('email') + ' <span class="bk-opt">' + t('optional') + '</span></span><input class="bk-input" id="bk-email" type="email" inputmode="email" autocomplete="email" maxlength="160" value="' + esc(S.email) + '"></label>' +
      '<label class="bk-field"><span>' + t('whoTold') + ' <span class="bk-opt">' + t('optional') + '</span></span><select class="bk-input" id="bk-who">' + opts + '</select></label>' +
      '<p class="bk-privacy">' + esc(t('privacy')) + ' <a href="privacy/">' + t('privacyLink') + '</a></p>' +
      '<div class="bk-actions bk-actions--dock"><button class="bk-btn bk-btn--ghost" type="button" id="bk-back2">' + t('back') + '</button><button class="bk-btn bk-btn--primary" type="submit">' + t('cont') + '</button></div></form>';
    var el = show(html, { dir: dir, say: t('step', { n: 2 }) + ': ' + t('s2h') });
    var name = $('#bk-name', el), phone = $('#bk-phone', el), echo = $('#bk-echo', el);
    function echoPhone() {
      S.phone = phone.value;
      var p = C.normalisePhone(phone.value);
      if (!phone.value.trim()) { echo.innerHTML = ''; echo.className = 'bk-echo'; return p; }
      if (p.ok) {
        echo.className = 'bk-echo' + (p.warn ? ' bk-echo--warn' : '');
        echo.innerHTML = p.warn ? t('verify') + ' ' + bdi(p.display) : t('reach') + ' <b>' + bdi(p.display) + '</b>';
      } else { echo.className = 'bk-echo'; echo.innerHTML = ''; }
      return p;
    }
    phone.addEventListener('input', echoPhone); echoPhone();
    name.addEventListener('input', function () { S.name = name.value; });
    $('#bk-email', el).addEventListener('input', function (e) { S.email = e.target.value.trim(); });
    $('#bk-who', el).addEventListener('change', function (e) { S.whoTold = e.target.value; });
    $('#bk-back2', el).addEventListener('click', function () { step1('back'); });
    $('#bk-f2', el).addEventListener('submit', function (ev) {
      ev.preventDefault();
      var ok = true;
      $('#bk-ename').textContent = ''; $('#bk-ephone').textContent = '';
      name.removeAttribute('aria-invalid'); phone.removeAttribute('aria-invalid');
      if (!C.cleanName(name.value)) { $('#bk-ename').textContent = t('e.bad_name'); name.setAttribute('aria-invalid', 'true'); ok = false; }
      if (!echoPhone().ok) { $('#bk-ephone').textContent = t('e.bad_phone'); phone.setAttribute('aria-invalid', 'true'); if (ok) phone.focus(); ok = false; }
      else if (!ok) name.focus();
      if (ok) step3('fwd');
    });
    if (!S.name) setTimeout(function () { name.focus({ preventScroll: true }); }, reduce ? 0 : 380);
  }

  /* ---------- step 3: summary and submit ---------- */
  function step3(dir) {
    S.step = 3; progress(3); compact(true);
    var s = S.session, full = s.state === 'full';
    var p = C.normalisePhone(S.phone);
    var seats = S.seats === 2 ? (S.guestName ? t('twoSeats', { g: esc(C.cleanName(S.guestName)) }) : t('twoSeatsNoName')) : t('oneSeat');
    var policy = CFG.policy || {};
    var html = '<p class="bk-kicker">' + t('step', { n: 3 }) + '</p><h2 class="bk-step__h">' + t('s3h') + '</h2>' +
      '<p class="bk-step__sub">' + (full ? t('s3subWait') : t('s3sub', { h: bdi(CFG.holds.holdHours) })) + '</p>' +
      '<dl class="bk-sum">' +
      '<div><dt>' + t('circle') + '</dt><dd>' + esc(nameOf(s)) + (s.example ? ' <span class="bk-chip bk-chip--example">' + t('example') + '</span>' : '') + '</dd></div>' +
      '<div><dt>' + t('when') + '</dt><dd>' + esc(dateLine(s)) + '<br>' + timeLine(s) + '</dd></div>' +
      '<div><dt>' + t('where') + '</dt><dd>' + areaLine(s) + '</dd></div>' +
      '<div><dt>' + t('seats') + '</dt><dd>' + seats + '</dd></div>' +
      '<div><dt>' + t('you') + '</dt><dd>' + esc(C.cleanName(S.name)) + '<br>' + bdi(p.display) + (S.email ? '<br>' + esc(S.email) : '') + '</dd></div>' +
      (full ? '' : '<div><dt>' + t('amount') + '</dt><dd>' + bdi(amountNow()) + '</dd></div>') + '</dl>' +
      (full ? '' : '<div class="bk-note"><b>' + t('howPay') + '.</b> ' + esc(lang === 'ar' && !L.isTodo(CFG.payment.lineAr) ? CFG.payment.lineAr : t('payLine')) + ' ' + t('noNumbers') + payTodo() + '</div>') +
      '<details class="bk-more"><summary>' + t('policyT') + '</summary><p>' + esc(policy.cancelEn) + '</p><p>' + esc(policy.moveEn) + '</p>' +
      (policy.approved ? '' : '<p><mark class="bk-todo" data-todo="policy">[DORINA: approve or rewrite these two lines]</mark></p>') + '</details>' +
      '<p class="bk-err" id="bk-e3" aria-live="polite"></p><div id="bk-e3x"></div>' +
      '<div class="bk-actions bk-actions--dock"><button class="bk-btn bk-btn--ghost" type="button" id="bk-back3">' + t('back') + '</button>' +
      '<button class="bk-btn bk-btn--primary" type="button" id="bk-go">' + spin() + '<span>' + (full ? t('joinWait') : t('reserve')) + '</span></button></div>';
    var el = show(html, { dir: dir, say: t('step', { n: 3 }) + ': ' + t('s3h') });
    $('#bk-back3', el).addEventListener('click', function () { step2('back'); });
    $('#bk-go', el).addEventListener('click', submit);
  }
  var busy = false;
  function submit() {
    if (busy) return;
    busy = true;
    var btn = $('#bk-go'); btn.setAttribute('aria-busy', 'true'); btn.disabled = true;
    $('#bk-e3').textContent = ''; $('#bk-e3x').innerHTML = '';
    B.createBooking({ sessionId: S.session.id, name: S.name, phone: S.phone, email: S.email || null, seats: S.seats, guestName: S.seats === 2 ? S.guestName : null,
      whoTold: S.whoTold || null, via: S.via, source: S.src, lang: lang })
      .then(function (r) { S.result = r; done(); })
      .catch(function (e) {
        var code = (e && e.code) || 'network';
        if (code === 'already_booked') { S.result = { ref: e.ref, status: e.status }; return already(); }
        var msg = t('e.' + code, { until: e.until ? L.formatDate(e.until, lang, { withTime: true }) : '' });
        $('#bk-e3').innerHTML = esc(msg);
        var x = '';
        if (code === 'priority_window' || code === 'session_closed' || code === 'not_open_yet') x = '<button class="bk-btn bk-btn--ghost bk-btn--block" type="button" id="bk-tolist">' + t('joinInstead') + '</button>';
        if (code === 'network' || code === 'rate_limited') x = '<a class="bk-btn bk-btn--wa bk-btn--block" target="_blank" rel="noopener" href="' + esc(L.waLink(L.reserveText(sessionOffer(S.session), S.session, lang) + C.cleanName(S.name || '') )) + '">' + waIcon() + t('tryWa') + '</a>';
        $('#bk-e3x').innerHTML = x;
        var tl = $('#bk-tolist'); if (tl) tl.addEventListener('click', function () { listView('fwd', { interest: 'next' }); });
      })
      .then(function () { busy = false; var b = $('#bk-go'); if (b) { b.removeAttribute('aria-busy'); b.disabled = false; } });
  }

  /* ---------- done ---------- */
  function mark() {
    return '<div class="bk-mark" aria-hidden="true"><svg viewBox="0 0 100 100"><path class="bk-mark__ring" pathLength="100" d="M 79.14 32.49 A 34 34 0 1 1 62.18 18.25"/>' +
      '<circle class="bk-mark__rip" cx="71.86" cy="23.96" r="6"/><circle class="bk-mark__rip" cx="71.86" cy="23.96" r="6"/><circle class="bk-mark__dot" cx="71.86" cy="23.96" r="6"/></svg></div>';
  }
  function play(el) { if (el) requestAnimationFrame(function () { el.classList.add('is-playing'); }); }
  function customerMessage(r) {
    var s = S.session, n = C.cleanName(S.name), d = dateLine(s), o = nameOf(s);
    if (lang === 'ar') { // AR: for native review
      return r.status === 'waitlist'
        ? 'مرحباً دورينا، انضمّيت للائحة الانتظار لـ' + o + ' يوم ' + d + '. اسمي ' + n + '، ورقم الحجز ' + r.ref + '.'
        : 'مرحباً دورينا، حجزت ' + (S.seats === 2 ? 'مقعدين' : 'مقعد') + ' بـ' + o + ' يوم ' + d + '. اسمي ' + n + '، ورقم الحجز ' + r.ref + '. كيف بتحبّي إدفع؟';
    }
    return r.status === 'waitlist'
      ? 'Hello Dorina, I joined the waitlist for the ' + o + ' on ' + d + '. My name is ' + n + ' and my reference is ' + r.ref + '.'
      : 'Hello Dorina, I just reserved ' + (S.seats === 2 ? '2 seats' + (S.guestName ? ' (with ' + C.cleanName(S.guestName) + ')' : '') : 'a seat') + ' at the ' + o + ' on ' + d + '. My name is ' + n + ' and my reference is ' + r.ref + '. How would you like me to pay?';
  }
  function done() {
    var r = S.result, s = S.session, wait = r.status === 'waitlist';
    progress(4, true); compact(true);
    hero(wait ? { en: "You're on", ar: 'إنتِ على' } : { en: 'Your seat', ar: 'مقعدك' }, wait ? { en: 'the waitlist.', ar: 'لائحة الانتظار.' } : { en: 'is held.', ar: 'محجوز.' },
      wait ? { en: 'If a seat opens, Dorina messages you first.', ar: 'إذا فضي مقعد، دورينا بتراسلك أوّل.' } : { en: 'Nothing to pay yet. Send the message below and Dorina takes it from there.', ar: 'ما في شي تدفعيه هلّق. ابعتي الرسالة تحت ودورينا بتكمّل معك.' });
    var cal = C.gcalLink({ title: nameOf(s) + ' · Dorina Salman', startsAt: s.startsAt, endsAt: s.endsAt,
      details: (lang === 'ar' ? 'رقم الحجز ' : 'Reference ') + r.ref, location: s.online ? 'Online' : (L.isTodo(s.areaEn) ? '' : s.areaEn) });
    var html = mark() + '<h2 class="bk-step__h">' + (wait ? t('waitH') : t('doneH')) + '</h2>' +
      '<p class="bk-ref"><small>' + t('ref') + '</small>' + bdi(r.ref) + '</p>' +
      (wait ? '<p class="bk-step__sub">' + esc(t('s10', { name: C.cleanName(S.name), date: dateLine(s), ref: r.ref })) + '</p>' +
        (r.position ? '<p class="bk-small">' + t('position') + ': ' + bdi('#' + r.position) + '</p>' : '')
        : '<p class="bk-step__sub">' + t('doneSub') + '</p>') +
      '<div class="bk-done__cta"><a class="bk-btn bk-btn--wa bk-btn--block" id="bk-wa" target="_blank" rel="noopener" href="' + esc(L.waLink(customerMessage(r))) + '">' + waIcon() + t('sendWa') + '</a>' +
      (wait ? '' : '<a class="bk-link" target="_blank" rel="noopener" href="' + esc(cal) + '">' + t('addCal') + '</a>') +
      '<a class="bk-link" href="../women-circle/">' + t('toCircle') + '</a></div>' +
      '<dl class="bk-sum">' +
      '<div><dt>' + t('when') + '</dt><dd>' + esc(dateLine(s)) + '<br>' + timeLine(s) + '</dd></div>' +
      (wait ? '' : '<div><dt>' + t('amount') + '</dt><dd>' + bdi(L.money(r.amount, r.currency, lang)) + '</dd></div>' +
        '<div><dt>' + t('heldUntil') + '</dt><dd>' + tbdi(L.formatDate(r.heldUntil, lang, { withTime: true })) + '</dd></div>') +
      '</dl>' + (wait ? '' : '<div class="bk-note bk-note--gold">' + esc(lang === 'ar' && !L.isTodo(CFG.payment.lineAr) ? CFG.payment.lineAr : t('payLine')) + ' ' + t('noNumbers') + payTodo() + '</div>');
    var el = show(html, { dir: 'fwd', cls: 'bk-done', say: (wait ? t('waitH') : t('doneH')) + '. ' + t('ref') + ' ' + r.ref });
    play(el);
  }
  function already() {
    progress(4, true); compact(true);
    var r = S.result;
    var html = mark() + '<h2 class="bk-step__h">' + t('already') + '</h2><p class="bk-ref"><small>' + t('ref') + '</small>' + bdi(r.ref || '') + '</p>' +
      '<p class="bk-step__sub">' + t('alreadySub', { ref: bdi(r.ref || '') }) + '</p>' +
      '<div class="bk-done__cta"><a class="bk-btn bk-btn--wa bk-btn--block" target="_blank" rel="noopener" href="' + esc(L.waLink(lang === 'ar' ? 'مرحباً دورينا، عندي حجز رقم ' + r.ref + '.' : 'Hello Dorina, I have booking ' + r.ref + '.')) + '">' + waIcon() + t('sendWa') + '</a></div>';
    play(show(html, { dir: 'fwd', cls: 'bk-done' }));
  }

  /* ---------- the list (Next Circle list, soon, gated, none) ---------- */
  function listView(dir, o) {
    o = o || {};
    S.view = 'list'; progress(0, true); compact(false);
    hero({ en: o.h1a || 'Join the', ar: o.h1aAr || 'انضمّي' }, { en: o.h1b || 'next circle list.', ar: o.h1bAr || 'لقائمة الدائرة الجاية.' },
      { en: 'Name and number only. One short message on Fridays, the next dates first.', ar: 'الاسم والرقم بس. رسالة قصيرة يوم الجمعة، والتواريخ الجاية أوّل.' }, o.eyebrow);
    var html = (o.kicker ? '<p class="bk-kicker">' + o.kicker + '</p>' : '') + '<h2 class="bk-step__h">' + (o.h || t('listH')) + '</h2>' +
      (o.sub ? '<p class="bk-step__sub">' + o.sub + '</p>' : '') + '<p class="bk-step__sub">' + (o.sub2 || t('listSub')) + '</p>' +
      '<form id="bk-fl" novalidate><label class="bk-field"><span>' + t('name') + '</span><input class="bk-input" id="bk-lname" autocomplete="name" maxlength="80" value="' + esc(S.name) + '"><span class="bk-err" id="bk-elname"></span></label>' +
      '<label class="bk-field"><span>' + t('phone') + '</span><input class="bk-input" id="bk-lphone" type="tel" inputmode="tel" autocomplete="tel" maxlength="24" value="' + esc(S.phone) + '">' +
      '<span class="bk-echo" id="bk-lecho" aria-live="polite"></span><span class="bk-err" id="bk-elphone"></span></label>' +
      '<p class="bk-privacy">' + esc(lang === 'ar' ? 'منجمع اسمك ورقمك بس، لنبعتلك رسالة الجمعة والتواريخ الجاية.' : 'We collect your name and phone only, to send the Friday message and the next dates.') + ' <a href="privacy/">' + t('privacyLink') + '</a></p>' +
      '<p class="bk-err" id="bk-el" aria-live="polite"></p>' +
      '<div class="bk-actions bk-actions--single"><button class="bk-btn bk-btn--primary bk-btn--block" type="submit" id="bk-lgo">' + spin() + '<span>' + t('listBtn') + '</span></button>' +
      (o.extra || '') + '</div></form>';
    var el = show(html, { dir: dir, say: o.h || t('listH'), focus: !!dir });
    var ph = $('#bk-lphone', el), echo = $('#bk-lecho', el);
    ph.addEventListener('input', function () {
      S.phone = ph.value; var p = C.normalisePhone(ph.value);
      echo.innerHTML = p.ok && ph.value.trim() ? (p.warn ? t('verify') + ' ' : t('reach') + ' ') + '<b>' + bdi(p.display) + '</b>' : '';
    });
    $('#bk-lname', el).addEventListener('input', function (e) { S.name = e.target.value; });
    $('#bk-fl', el).addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (busy) return;
      var nm = $('#bk-lname').value, okN = !!C.cleanName(nm), okP = C.normalisePhone(ph.value).ok;
      $('#bk-elname').textContent = okN ? '' : t('e.bad_name'); $('#bk-elphone').textContent = okP ? '' : t('e.bad_phone');
      if (!okN || !okP) return;
      busy = true; var b = $('#bk-lgo'); b.setAttribute('aria-busy', 'true');
      B.joinList({ name: nm, phone: ph.value, lang: lang, source: S.src, interest: o.interest || S.interest || null })
        .then(function (r) { listDone(r); }, function (e) { $('#bk-el').textContent = t('e.' + ((e && e.code) || 'network')); })
        .then(function () { busy = false; var bb = $('#bk-lgo'); if (bb) bb.removeAttribute('aria-busy'); });
    });
  }
  function listDone(r) {
    S.listResult = r; compact(true);
    hero({ en: "You're on", ar: 'صرتي' }, { en: 'the list.', ar: 'عالقائمة.' });
    var html = mark() + '<h2 class="bk-step__h">' + t('listDoneH') + '</h2><p class="bk-step__sub">' + (r.already ? t('listAlready') : t('listDoneSub')) + '</p>' +
      '<div class="bk-done__cta"><a class="bk-btn bk-btn--wa bk-btn--block" target="_blank" rel="noopener" href="' + esc(L.waLink(lang === 'ar' ? 'مرحباً دورينا، انضمّيت لقائمة الدائرة الجاية. اسمي ' + C.cleanName(S.name) + '.' : "Hello Dorina, I just joined the Next Circle list. My name is " + C.cleanName(S.name) + '.')) + '">' + waIcon() + t('sayHello') + '</a>' +
      '<a class="bk-link" href="../women-circle/">' + t('toCircle') + '</a></div>';
    play(show(html, { dir: 'fwd', cls: 'bk-done', say: t('listDoneH') }));
  }

  /* ---------- WhatsApp mode: one card, no data stored ---------- */
  function waMode() {
    progress(0, true); compact(false);
    var s = S.session || (S.offerId ? L.nextSession(S.offerId) : L.nextSession('wpc-founding'));
    var o = L.offer(S.offerId || (s && s.offerId) || 'wpc-founding');
    var isList = o && o.kind === 'list';
    hero(isList ? { en: 'Join the', ar: 'انضمّي' } : { en: 'Reserve', ar: 'احجزي' }, isList ? { en: 'next circle list.', ar: 'لقائمة الدائرة الجاية.' } : { en: 'your seat.', ar: 'مقعدك.' },
      { en: 'One message on WhatsApp. No account, no card, nothing to pay today.', ar: 'رسالة وحدة على واتساب. بلا حساب، بلا بطاقة، وما في شي تدفعيه اليوم.' });
    var html = '<div class="bk-center"><div class="bk-wa-ico">' + waIcon() + '</div><h2 class="bk-step__h">' + (isList ? t('listH') : t('waH')) + '</h2>' +
      (s && !isList ? '<div class="bk-ticket bk-ticket--static is-checked"><span class="bk-ticket__tick" aria-hidden="true"></span><span class="bk-ticket__date">' + esc(dateLine(s)) + '</span>' +
        '<span class="bk-ticket__meta">' + esc(L.offerName(o, lang)) + '</span><span class="bk-ticket__meta">' + timeLine(s) + ' · ' + areaLine(s) + '</span>' +
        '<span class="bk-ticket__price">' + priceLine(s) + '</span></div>' : '') +
      '<p class="bk-step__sub">' + (isList ? t('listSub') : t('waSub')) + '</p>' +
      '<a class="bk-btn bk-btn--wa bk-btn--block" target="_blank" rel="noopener" href="' + esc(L.waLink(L.reserveText(o, s, lang))) + '">' + waIcon() + t('waBtn') + '</a>' +
      '<p class="bk-small">' + t('waNothing') + '</p>' +
      (LOCAL ? '<p class="bk-small"><a class="bk-link" href="?preview=system' + (S.offerId ? '&offer=' + encodeURIComponent(S.offerId) : '') + '">' + t('previewFlow') + '</a></p>' : '') + '</div>';
    show(html, { animate: true, focus: false });
  }

  /* ---------- route ---------- */
  function soonView(s) {
    var o = sessionOffer(s);
    listView(null, { kicker: esc(L.offerName(o, lang)), h: t('soonH'),
      sub: t('soonSub', { date: esc(dateLine(s)), opens: tbdi(L.formatDate(s.opensAt || s.startsAt, lang, { withTime: true })) }) + (s.priorityUntil ? ' ' + t('prioritySub') : ''),
      sub2: t('soonList'), interest: o.format === 'online' ? 'online' : 'next', h1a: 'Seats open', h1aAr: 'المقاعد بتفتح', h1b: 'soon.', h1bAr: 'قريباً.' });
  }
  function route(dir) {
    if (MODE === 'whatsapp') return waMode();
    var offer = S.offerId ? L.offer(S.offerId) : null;
    if (offer && offer.kind === 'list') return listView(dir, { interest: S.interest });
    if (offer && offer.kind === 'enquiry' && offer.status === 'enquiry') {
      return listView(dir, { h: t('enquiryH'), sub: t('enquirySub'), sub2: t('listSub'),
        extra: '<a class="bk-btn bk-btn--ghost bk-btn--block" href="../' + esc(offer.page) + '?src=' + encodeURIComponent(S.src) + '#enquire">' + t('enquiryBtn') + '</a>' });
    }
    if (offer && (offer.status === 'gated' || offer.status === 'later' || !offer.bookable)) {
      var interest = offer.id === 'private-consultation' ? 'consultation' : offer.format === 'team' ? 'team' : 'next';
      return listView(dir, { eyebrow: { en: offer.nameEn, ar: offer.nameAr }, h: t('gatedH'), sub: t('gatedSub'), interest: interest,
        h1a: 'Not open', h1aAr: 'مش مفتوح', h1b: 'yet.', h1bAr: 'بعد.' });
    }
    var pool = S.sessions.filter(function (s) { return !offer || s.offerId === offer.id; });
    if (S.sessionId) {
      var want = byId(S.sessionId);
      if (want) {
        if (want.state === 'soon') return soonView(want);
        if (want.state === 'open' || want.state === 'full') { S.session = want; if (!offer) offer = L.offer(want.offerId); }
      }
    }
    var bookable = pool.filter(function (s) { return s.state === 'open' || s.state === 'full'; });
    if (!S.session && bookable.length && offer) S.session = bookable[0].state === 'open' ? bookable[0] : (bookable.filter(function (s) { return s.state === 'open'; })[0] || bookable[0]);
    if (!bookable.length) {
      var soon = pool.filter(function (s) { return s.state === 'soon'; })[0];
      if (soon) return soonView(soon);
      return listView(dir, { h: t('noneH'), sub: t('noneSub'), interest: 'next' });
    }
    if (offer) { S.sessions = S.sessions.filter(function (s) { return s.offerId === offer.id || s.state === 'soon'; }); }
    step1(dir);
  }

  /* ---------- boot ---------- */
  function rerender() {
    if (S.view === 'list') return S.listResult ? listDone(S.listResult) : route();
    if (S.result) return S.result.heldUntil !== undefined ? done() : already();
    if (S.step === 2) return step2();
    if (S.step === 3) return step3();
    if (S.step === 1) return step1();
    route();
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-lang]');
    if (!b) return;
    lang = L.applyLang(lang === 'ar' ? 'en' : 'ar');
  });
  document.addEventListener('dorina:lang', function (e) { lang = e.detail.lang; rerender(); });
  var fwa = $('#bk-footer-wa'); if (fwa) fwa.href = L.waLink(lang === 'ar' ? 'مرحباً دورينا' : 'Hello Dorina');
  // pause the two ambient loops when off screen or when the tab is hidden
  var heroEl = $('.bk-hero');
  if ('IntersectionObserver' in window && heroEl) {
    new IntersectionObserver(function (en) { heroEl.classList.toggle('bk-paused', !en[0].isIntersecting); }).observe(heroEl);
  }
  var footEl = $('.bk-footer'); // the footer ring turns only while the footer is on screen (at most two loops at once)
  if ('IntersectionObserver' in window && footEl) {
    new IntersectionObserver(function (en) { footEl.classList.toggle('is-on', en[0].isIntersecting); }).observe(footEl);
  }
  document.addEventListener('visibilitychange', function () { document.documentElement.classList.toggle('bk-paused', document.hidden); });

  if (MODE === 'whatsapp') { // nothing is read or stored: no example sessions, no ribbon
    S.sessions = []; waMode();
  } else B.ready.then(function (mode) {
    if (mode === 'demo') { var rb = $('#bk-ribbon'); if (rb) rb.hidden = false; }
    return B.listSessions({});
  }).then(function (list) {
    S.sessions = list.filter(function (s) { var o = L.offer(s.offerId); return o && o.kind !== 'list' && s.state !== 'done' && s.state !== 'moved' && s.state !== 'closed'; });
    S.sessions.sort(function (a, b) { return (a.example ? 1 : 0) - (b.example ? 1 : 0) || Date.parse(a.startsAt) - Date.parse(b.startsAt); });
    route(null);
  }).catch(function () {
    S.sessions = [];
    if (MODE === 'whatsapp') return waMode();
    show('<h2 class="bk-step__h">' + t('waH') + '</h2><p class="bk-step__sub">' + t('e.network') + '</p><a class="bk-btn bk-btn--wa bk-btn--block" target="_blank" rel="noopener" href="' +
      esc(L.reserveHref ? L.waLink(L.reserveText(L.offer('wpc-founding'), L.nextSession('wpc-founding'), lang)) : '../contact/') + '">' + waIcon() + t('waBtn') + '</a>');
  });
})();
